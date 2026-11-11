import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, isLanguage, type Language } from "../../shared/languages";
import { readJson, writeJson } from "../lib/storage";
import { STORAGE_KEYS } from "../lib/storageKeys";
import { I18nContext, type I18nContextValue } from "./I18nContext";
import { it, type Messages } from "./locales/it";
import { interpolate, lookup, splitTokens } from "./translate";
import type { DateStyle, TranslationKey, TranslationParams } from "./types";

const LANGUAGE_STORAGE_KEY = STORAGE_KEYS.language;

// Italian is the base and always bundled; the other languages load when chosen.
const LOADERS: Record<Language, () => Promise<Messages>> = {
  it: () => Promise.resolve(it),
  en: () => import("./locales/en").then((module) => module.en),
  fr: () => import("./locales/fr").then((module) => module.fr),
  es: () => import("./locales/es").then((module) => module.es),
  de: () => import("./locales/de").then((module) => module.de),
};

const DATE_OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  long: { dateStyle: "long", timeZone: "UTC" },
  month: { month: "long", year: "numeric", timeZone: "UTC" },
};

function detectLanguage(): Language {
  const stored = readJson<unknown>(LANGUAGE_STORAGE_KEY, null);
  if (isLanguage(stored)) return stored;
  const preferred = navigator.languages.map((locale) => locale.slice(0, 2).toLowerCase());
  return preferred.find(isLanguage) ?? DEFAULT_LANGUAGE;
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [requested, setRequested] = useState<Language>(detectLanguage);
  // The page keeps the language it has until the chosen one has arrived, so it never flashes.
  const [current, setCurrent] = useState<{ language: Language; messages: Messages } | null>(
    requested === "it" ? { language: "it", messages: it } : null,
  );

  useEffect(() => {
    let isActive = true;
    LOADERS[requested]().then((messages) => {
      if (isActive) setCurrent({ language: requested, messages });
    });
    return () => {
      isActive = false;
    };
  }, [requested]);

  const language = current?.language ?? requested;
  const messages = current?.messages ?? it;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setRequested(next);
    writeJson(LANGUAGE_STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: TranslationKey, params?: TranslationParams) =>
      interpolate(lookup(messages, key), params);

    const rich = (
      key: TranslationKey,
      parts: Record<string, ReactNode>,
      params?: TranslationParams,
    ) =>
      splitTokens(lookup(messages, key)).map((part, index) => (
        <Fragment key={index}>
          {part.token !== undefined
            ? (parts[part.token] ?? params?.[part.token] ?? `{${part.token}}`)
            : part.text}
        </Fragment>
      ));

    const formatDate = (isoDate: string, style: DateStyle = "long") =>
      new Intl.DateTimeFormat(language, DATE_OPTIONS[style]).format(new Date(isoDate));

    return { language, setLanguage, t, rich, formatDate };
  }, [language, messages, setLanguage]);

  // Nothing to show in a language that has not arrived: the splash covers the wait.
  if (!current) return null;
  return <I18nContext value={value}>{children}</I18nContext>;
}
