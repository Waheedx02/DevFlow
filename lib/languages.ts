export interface LanguageMeta {
  /** Display label — shown in dropdowns, tags, badges */
  label: string;
  /** Shiki's language id for syntax highlighting */
  shikiLang: string;
  /** Tailwind classes for the language badge */
  color: string;
  /** File extension shown in the mock editor top bar */
  extension: string;
}

export const LANGUAGE_META: Record<string, LanguageMeta> = {
  JavaScript: { label: "JavaScript", shikiLang: "javascript", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20", extension: "js" },
  TypeScript: { label: "TypeScript", shikiLang: "typescript", color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20", extension: "ts" },
  Python: { label: "Python", shikiLang: "python", color: "bg-blue-500/10 text-blue-300 border-blue-500/20", extension: "py" },
  "HTML/CSS": { label: "HTML/CSS", shikiLang: "html", color: "bg-red-500/10 text-red-300 border-red-500/20", extension: "html" },
  SQL: { label: "SQL", shikiLang: "sql", color: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20", extension: "sql" },
  YAML: { label: "YAML", shikiLang: "yaml", color: "bg-purple-500/10 text-purple-300 border-purple-500/20", extension: "yaml" },
  "Bash/Shell": { label: "Bash/Shell", shikiLang: "bash", color: "bg-slate-500/10 text-slate-300 border-slate-500/20", extension: "sh" },
  JSON: { label: "JSON", shikiLang: "json", color: "bg-lime-500/10 text-lime-300 border-lime-500/20", extension: "json" },
  Markdown: { label: "Markdown", shikiLang: "markdown", color: "bg-pink-500/10 text-pink-300 border-pink-500/20", extension: "md" },
  Other: { label: "Other", shikiLang: "text", color: "bg-slate-500/10 text-slate-300 border-slate-500/20", extension: "txt" },
};

/** Canonical dropdown order — everything derives from this object's keys */
export const LANGUAGES = Object.keys(LANGUAGE_META);

const FALLBACK: LanguageMeta = {
  label: "Other",
  shikiLang: "text",
  color: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  extension: "txt",
};

/** Never throws — a language saved before this list existed still gets sane output */
export function getLanguageMeta(language: string): LanguageMeta {
  return LANGUAGE_META[language] ?? { ...FALLBACK, label: language };
}

/**
 * Dropdown options for a given form: canonical list, plus the current
 * value tacked on front if it's not already in there (so an old/unknown
 * saved language doesn't silently jump to whatever option is first).
 */
export function getLanguageOptions(currentValue?: string): string[] {
  if (currentValue && !LANGUAGE_META[currentValue]) {
    return [currentValue, ...LANGUAGES];
  }
  return LANGUAGES;
}