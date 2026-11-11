import { LANGUAGES, type Language } from "../../shared/languages";
import type { PlotText } from "../../shared/titleDetails";
import { UPSTREAM_TIMEOUT_MS } from "./upstream";

const USER_AGENT = "MarvelPlanner/1.0 (igeod.dev@gmail.com)";
const MIN_PLOT_LENGTH = 600;
const FALLBACK_LANGUAGE: Language = "en";

const PLOT_HEADINGS: Record<Language, string[]> = {
  it: ["trama", "sinossi"],
  fr: ["synopsis", "résumé", "intrigue", "histoire", "scénario"],
  es: ["argumento", "sinopsis", "trama"],
  en: ["plot", "synopsis"],
  de: ["handlung", "inhalt", "inhaltsangabe"],
};

interface Heading {
  level: number;
  name: string;
  start: number;
  end: number;
}

async function getJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  return response.ok ? ((await response.json()) as T) : null;
}

async function sitelinks(wikidataId: string): Promise<Partial<Record<Language, string>>> {
  const sites = LANGUAGES.map((language) => `${language}wiki`).join("|");
  const data = await getJson<{
    entities?: Record<string, { sitelinks?: Record<string, { title: string }> }>;
  }>(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&props=sitelinks&sitefilter=${sites}&format=json`,
  );
  const links = data?.entities?.[wikidataId]?.sitelinks ?? {};
  return Object.fromEntries(
    LANGUAGES.flatMap((language) => {
      const title = links[`${language}wiki`]?.title;
      return title ? [[language, title]] : [];
    }),
  );
}

async function articleText(language: Language, title: string): Promise<string | null> {
  const data = await getJson<{ query?: { pages?: Record<string, { extract?: string }> } }>(
    `https://${language}.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&format=json&titles=${encodeURIComponent(title)}`,
  );
  return Object.values(data?.query?.pages ?? {})[0]?.extract ?? null;
}

function plotSection(text: string, language: Language): string | null {
  const headings: Heading[] = [...text.matchAll(/^(={2,3})\s*(.+?)\s*\1\s*$/gm)].map((match) => ({
    level: match[1].length,
    name: match[2].toLowerCase(),
    start: match.index,
    end: match.index + match[0].length,
  }));
  const index = headings.findIndex(
    (heading) => heading.level === 2 && PLOT_HEADINGS[language].includes(heading.name),
  );
  if (index < 0) return null;

  const next = headings.slice(index + 1).find((heading) => heading.level === 2);
  const section = text.slice(headings[index].end, next?.start);
  const plot = section
    .replace(/^={3,}.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return plot.length >= MIN_PLOT_LENGTH ? plot : null;
}

function articleUrl(language: Language, title: string): string {
  return `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
}

export async function fetchPlot(wikidataId: string, language: Language): Promise<PlotText | null> {
  const links = await sitelinks(wikidataId);
  const candidates = language === FALLBACK_LANGUAGE ? [language] : [language, FALLBACK_LANGUAGE];

  for (const candidate of candidates) {
    const title = links[candidate];
    if (!title) continue;
    const text = await articleText(candidate, title);
    const plot = text && plotSection(text, candidate);
    if (plot) return { text: plot, language: candidate, sourceUrl: articleUrl(candidate, title) };
  }
  return null;
}
