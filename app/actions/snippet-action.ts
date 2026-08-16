"use server";

import { auth } from "@clerk/nextjs/server";
import type { Snippet } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { highlightSnippet } from "@/lib/highlight";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Snippet as SnippetCardData } from "@/app/components/SnippetCard";
import { MAX_SNIPPETS_PER_USER } from "@/lib/limits";

export type SnippetActionState = { error: string | null };

export async function getSnippetCount(): Promise<number> {
  const { userId } = await auth();
  if (!userId) return 0;
  return prisma.snippet.count({ where: { authorId: userId } });
}

export async function createSnippet(
  _prevState: SnippetActionState,
  formData: FormData
): Promise<SnippetActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in to add a snippet." };

  const currentCount = await prisma.snippet.count({ where: { authorId: userId } });
  if (currentCount >= MAX_SNIPPETS_PER_USER) {
    return {
      error: `You've reached the ${MAX_SNIPPETS_PER_USER}-snippet limit for now. Delete an existing snippet to add a new one.`,
    };
  }

  const title = (formData.get("title") as string)?.trim();
  const language = (formData.get("language") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const code = (formData.get("code") as string)?.trim();

  if (!title || !language || !code) {
    return { error: "Title, language, and source code are required." };
  }

  await prisma.snippet.create({
    data: { title, language, description: description || null, code, authorId: userId },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: [number, string][] = [[86400, "d"], [3600, "h"], [60, "m"]];
  for (const [secs, label] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value}${label} ago`;
  }
  return "just now";
}

export async function getRecentSnippets(limit = 8): Promise<SnippetCardData[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const snippets = await prisma.snippet.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return Promise.all(
    snippets.map(async (s: Snippet) => ({
      id: s.id,
      title: s.title,
      description: s.description ?? "",
      language: s.language,
      timeAgo: timeAgo(s.createdAt),
      codeHTML: await highlightSnippet(s.code.slice(0, 300), s.language),
    }))
  );
}

export async function deleteSnippet(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in.");

  const result = await prisma.snippet.deleteMany({
    where: { id, authorId: userId },
  });

  if (result.count === 0) throw new Error("Snippet not found.");

  revalidatePath("/dashboard");
}

async function toCardData(s: Snippet): Promise<SnippetCardData> {
  return {
    id: s.id,
    title: s.title,
    description: s.description ?? "",
    language: s.language,
    timeAgo: timeAgo(s.createdAt),
    codeHTML: await highlightSnippet(s.code.slice(0, 300), s.language),
  };
}

export async function getAllSnippets(params: {
  query?: string;
  language?: string;
}): Promise<SnippetCardData[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const { query, language } = params;

  const snippets = await prisma.snippet.findMany({
    where: {
      authorId: userId,
      ...(language ? { language } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Promise.all(snippets.map(toCardData));
}

export async function getSnippetLanguages(): Promise<string[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const rows = await prisma.snippet.findMany({
    where: { authorId: userId },
    select: { language: true },
    distinct: ["language"],
    orderBy: { language: "asc" },
  });

  return rows.map((r) => r.language);
}

export async function hasAnySnippets(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const count = await prisma.snippet.count({ where: { authorId: userId } });
  return count > 0;
}

export async function getSnippetById(id: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const snippet = await prisma.snippet.findFirst({
    where: { id, authorId: userId }, // scoped — someone else's id just returns null
  });

  if (!snippet) return null;

  return {
    id: snippet.id,
    title: snippet.title,
    description: snippet.description ?? "",
    language: snippet.language,
    code: snippet.code, // raw — needed for the copy button
    codeHTML: await highlightSnippet(snippet.code, snippet.language), // full, not truncated
    createdAt: snippet.createdAt,
    updatedAt: snippet.updatedAt,
  };
}

export async function updateSnippet(
  id: string,
  _prevState: SnippetActionState,
  formData: FormData
): Promise<SnippetActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in to edit a snippet." };

  const title = (formData.get("title") as string)?.trim();
  const language = (formData.get("language") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const code = (formData.get("code") as string)?.trim();

  if (!title || !language || !code) {
    return { error: "Title, language, and source code are required." };
  }

  // updateMany scoped to authorId — same reasoning as deleteSnippet:
  // a plain update({ where: { id } }) would let a signed-in user edit
  // ANY snippet if they ever got hold of another user's id.
  const result = await prisma.snippet.updateMany({
    where: { id, authorId: userId },
    data: { title, language, description: description || null, code },
  });

  if (result.count === 0) {
    return { error: "Snippet not found." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/snippet/${id}`);
  redirect(`/dashboard/snippet/${id}`);
}