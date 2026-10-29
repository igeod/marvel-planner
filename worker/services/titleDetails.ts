import { and, eq } from "drizzle-orm";
import type { Language } from "../../shared/languages";
import type { TitleDetails } from "../../shared/titleDetails";
import type { TmdbRef } from "../../shared/tmdbRefs";
import type { Database } from "../db/client";
import { titleDetailsCache } from "../db/schema";
import { fetchTmdbDetails } from "./tmdb";
import { fetchPlot } from "./wikipedia";

const DAY_MS = 24 * 60 * 60 * 1000;
const SETTLED_AFTER_RELEASE_MS = 30 * DAY_MS;
const SETTLED_TTL_MS = 90 * DAY_MS;
const UNSETTLED_TTL_MS = DAY_MS;

function isFresh(details: TitleDetails, fetchedAt: Date, now: number): boolean {
  if (!("runtime" in details) || !("trailer" in details) || !("seasons" in details)) return false;
  const release = details.releaseDate ? Date.parse(details.releaseDate) : Number.NaN;
  const isSettled = !Number.isNaN(release) && now - release > SETTLED_AFTER_RELEASE_MS;
  return now - fetchedAt.getTime() < (isSettled ? SETTLED_TTL_MS : UNSETTLED_TTL_MS);
}

async function readCache(db: Database, titleId: string, language: Language) {
  const [row] = await db
    .select()
    .from(titleDetailsCache)
    .where(and(eq(titleDetailsCache.titleId, titleId), eq(titleDetailsCache.language, language)));
  if (!row) return null;
  return { details: JSON.parse(row.data) as TitleDetails, fetchedAt: row.fetchedAt };
}

async function writeCache(db: Database, titleId: string, language: Language, d: TitleDetails) {
  const values = { titleId, language, data: JSON.stringify(d), fetchedAt: new Date() };
  await db
    .insert(titleDetailsCache)
    .values(values)
    .onConflictDoUpdate({
      target: [titleDetailsCache.titleId, titleDetailsCache.language],
      set: { data: values.data, fetchedAt: values.fetchedAt },
    });
}

async function fetchFresh(token: string, ref: TmdbRef, language: Language): Promise<TitleDetails> {
  const { wikidataId, ...tmdb } = await fetchTmdbDetails(token, ref, language);
  const plot = wikidataId ? await fetchPlot(wikidataId, language).catch(() => null) : null;
  return { ...tmdb, plot };
}

export async function getTitleDetails(
  db: Database,
  token: string,
  titleId: string,
  ref: TmdbRef,
  language: Language,
): Promise<TitleDetails> {
  const cached = await readCache(db, titleId, language);
  if (cached && isFresh(cached.details, cached.fetchedAt, Date.now())) return cached.details;

  try {
    const details = await fetchFresh(token, ref, language);
    await writeCache(db, titleId, language, details);
    return details;
  } catch (error) {
    // Entries cached before seasons existed lack the field.
    if (cached) return { ...cached.details, seasons: cached.details.seasons ?? [] };
    throw error;
  }
}
