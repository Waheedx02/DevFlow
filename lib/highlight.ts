import { codeToHtml } from "shiki";
import { getLanguageMeta } from "@/lib/languages";

export async function highlightSnippet(code: string, language: string) {
  const { shikiLang } = getLanguageMeta(language);
  return codeToHtml(code, { lang: shikiLang, theme: "github-dark" });
}