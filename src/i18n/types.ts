export type Lang = "mm" | "en";

/** A single user-visible string in both supported languages. */
export type L = { mm: string; en: string };

/** Resolve a bilingual value (or a language-neutral plain string) for a language. */
export const pick = (lang: Lang, value: string | L): string =>
  typeof value === "string" ? value : value[lang];
