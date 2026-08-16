import { notFound } from "next/navigation";
import { getSnippetById } from "@/app/actions/snippet-action";
import { EditSnippetForm } from "@/app/components/EditSnippetForm";

export default async function EditSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snippet = await getSnippetById(id);

  if (!snippet) notFound();

  return (
    <EditSnippetForm
      id={snippet.id}
      initialTitle={snippet.title}
      initialDescription={snippet.description}
      initialLanguage={snippet.language}
      initialCode={snippet.code}
    />
  );
}