import { TMDB_REFS, type TmdbRef } from "../../shared/tmdbRefs";
import type { Database } from "../db/client";
import { titleRelease } from "../db/schema";
import { UPSTREAM_TIMEOUT_MS } from "./upstream";

const API_URL = "https://api.themoviedb.org/3";
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const UNRELEASED_RECHECK_MS = 12 * HOUR_MS;
const RELEASED_RECHECK_MS = 7 * DAY_MS;

interface TmdbDates {
  release_date?: string;
  air_date?: string | null;
  first_air_date?: string;
}

interface StoredRelease {
  releaseDate: string | null;
  checkedAt: Date;
}

async function requestDates(token: string, path: string): Promise<TmdbDates | null> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`TMDB ha risposto con stato ${response.status}`);
  return (await response.json()) as TmdbDates;
}

async function fetchReleaseDate(token: string, ref: TmdbRef): Promise<string | null> {
  if (ref.kind === "movie") {
    return (await requestDates(token, `/movie/${ref.id}`))?.release_date || null;
  }
  if (ref.season === undefined) {
    return (await requestDates(token, `/tv/${ref.id}`))?.first_air_date || null;
  }
  return (await requestDates(token, `/tv/${ref.id}/season/${ref.season}`))?.air_date || null;
}

function todayIso(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

function recheckTier(stored: StoredRelease | undefined, now: number): number | null {
  if (!stored) return 0;
  const age = now - stored.checkedAt.getTime();
  const isReleased = stored.releaseDate !== null && stored.releaseDate <= todayIso(now);
  if (!isReleased) return age >= UNRELEASED_RECHECK_MS ? 1 : null;
  return age >= RELEASED_RECHECK_MS ? 2 : null;
}

export async function refreshReleases(db: Database, token: string, limit: number): Promise<number> {
  const now = Date.now();
  const stored = new Map<string, StoredRelease>(
    (await db.select().from(titleRelease)).map((row) => [row.titleId, row]),
  );

  const due = Object.keys(TMDB_REFS)
    .flatMap((titleId) => {
      const tier = recheckTier(stored.get(titleId), now);
      const checkedAt = stored.get(titleId)?.checkedAt.getTime() ?? 0;
      return tier === null ? [] : [{ titleId, tier, checkedAt }];
    })
    .toSorted((a, b) => a.tier - b.tier || a.checkedAt - b.checkedAt)
    .slice(0, limit);

  let refreshed = 0;
  for (const { titleId } of due) {
    try {
      const releaseDate = await fetchReleaseDate(token, TMDB_REFS[titleId]);
      const checkedAt = new Date();
      await db
        .insert(titleRelease)
        .values({ titleId, releaseDate, checkedAt })
        .onConflictDoUpdate({ target: titleRelease.titleId, set: { releaseDate, checkedAt } });
      refreshed++;
    } catch (error) {
      console.error(`Aggiornamento della data non riuscito per ${titleId}`, error);
    }
  }
  return refreshed;
}

export async function getReleases(db: Database): Promise<Record<string, string | null>> {
  const rows = await db.select().from(titleRelease);
  return Object.fromEntries(rows.map((row) => [row.titleId, row.releaseDate]));
}
