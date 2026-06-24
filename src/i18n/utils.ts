import de from "./de.json";
import en from "./en.json";

export const languages = {
  de: "Deutsch",
  en: "English",
} as const;

export const defaultLang = "de";

export type Lang = keyof typeof languages;

const dictionaries = { de, en } as const;

/**
 * Resolve a dot-separated key against a nested dictionary object.
 */
function resolve(dict: Record<string, unknown>, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (
      acc &&
      typeof acc === "object" &&
      part in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

/**
 * Returns a translation helper bound to a language.
 * `t('a.b.c')` returns a string, `tList('a.b')` returns an array,
 * and `tObj('a.b')` returns a nested object — falling back to `de`.
 */
export function useTranslations(lang: Lang) {
  const dict = dictionaries[lang] ?? dictionaries[defaultLang];
  const fallback = dictionaries[defaultLang];

  function t(key: string): string {
    const value = resolve(dict, key) ?? resolve(fallback, key);
    if (typeof value === "string") return value;
    return key;
  }

  function tList(key: string): string[] {
    const value = resolve(dict, key) ?? resolve(fallback, key);
    return Array.isArray(value) ? (value as string[]) : [];
  }

  function tObj<T = unknown>(key: string): T {
    const value = resolve(dict, key) ?? resolve(fallback, key);
    return (value ?? {}) as T;
  }

  return { t, tList, tObj };
}

/**
 * Build a localized URL path. The default locale (de) lives at the root,
 * other locales are prefixed (e.g. /en/pricing).
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = "/" + path.replace(/^\/+|\/+$/g, "");
  const normalized = clean === "/" ? "/" : clean;

  if (lang === defaultLang) {
    return normalized;
  }
  return normalized === "/" ? `/${lang}/` : `/${lang}${normalized}`;
}

/**
 * Given the current URL pathname, return the equivalent path in the target
 * language while preserving the route. Keeps the language switcher on the
 * same page.
 */
export function switchLocalePath(pathname: string, target: Lang): string {
  // Strip a leading locale segment if present.
  let route = pathname.replace(/^\/(en)(?=\/|$)/, "");
  if (route === "") route = "/";
  return localizePath(route, target);
}

/**
 * Detect the active language from a pathname.
 */
export function getLangFromPath(pathname: string): Lang {
  if (/^\/en(\/|$)/.test(pathname)) return "en";
  return "de";
}
