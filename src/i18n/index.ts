import { useSetup } from "@/state/setupStore";
import { pick, type L, type Lang } from "./types";
import { shared } from "./strings/shared";
import { landing } from "./strings/landing";
import { consult } from "./strings/consult";
import { setup } from "./strings/setup";
import { customer } from "./strings/customer";

export type { L, Lang };
export { pick };

/** The single translation source for the whole app. */
export const STRINGS = {
  ...shared,
  ...landing,
  ...consult,
  ...setup,
  ...customer,
};

export type StringKey = keyof typeof STRINGS;

const interpolate = (text: string, vars?: Record<string, string | number>) =>
  vars
    ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
    : text;

export function translate(
  lang: Lang,
  key: StringKey,
  vars?: Record<string, string | number>,
): string {
  const entry = STRINGS[key] as L | undefined;
  if (!entry) return String(key);
  return interpolate(entry[lang] ?? entry.mm, vars);
}

/**
 * UI language for the current user.
 * Reads the same global preference the header toggle writes — changing it
 * re-renders text only and never touches business state.
 */
export function useT() {
  const { state } = useSetup();
  const lang = state.language as Lang;
  return {
    lang,
    isEn: lang === "en",
    /** Translate a key from the central dictionary. */
    t: (key: StringKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    /** Resolve an inline bilingual value coming from data modules. */
    p: (value: string | L) => pick(lang, value),
  };
}
