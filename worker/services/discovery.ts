import { inArray } from "drizzle-orm";
import type { CatalogCandidate } from "../../shared/catalogCandidate";
import { TMDB_REFS, type TmdbRef } from "../../shared/tmdbRefs";
import type { Database } from "../db/client";
import { catalogCandidate } from "../db/schema";
import { UPSTREAM_TIMEOUT_MS } from "./upstream";

const API_URL = "https://api.themoviedb.org/3";
const MARVEL_STUDIOS_COMPANY = 420;
const MCU_KEYWORD = 180547;
const MIN_FEATURE_MINUTES = 60;
const NOT_A_TITLE = /assembled|making of|legends|podcast|countdown|newsfront|untitled/i;

interface DiscoverResult {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
}

interface TmdbShow {
  name: string;
  seasons?: { season_number: number; name: string; air_date?: string | null }[];
}

async function request<T>(token: string, path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`TMDB ha risposto con stato ${response.status}`);
  return (await response.json()) as T;
}

function knownKeys(refs: Record<string, TmdbRef>): Set<string> {
  const keys = new Set<string>();
  for (const ref of Object.values(refs)) {
    keys.add(`${ref.kind}:${ref.id}`);
    if (ref.kind === "tv" && ref.season !== undefined) keys.add(`tv:${ref.id}:s${ref.season}`);
  }
  return keys;
}

async function discoverNewTitles(
  token: string,
  refs: Record<string, TmdbRef>,
): Promise<CatalogCandidate[]> {
  const known = knownKeys(refs);
  const filters = `with_companies=${MARVEL_STUDIOS_COMPANY}&with_keywords=${MCU_KEYWORD}&language=en-US`;
  const [movies, shows] = await Promise.all([
    request<{ results: DiscoverResult[] }>(
      token,
      `/discover/movie?${filters}&with_runtime.gte=${MIN_FEATURE_MINUTES}&sort_by=primary_release_date.desc`,
    ),
    request<{ results: DiscoverResult[] }>(
      token,
      `/discover/tv?${filters}&sort_by=first_air_date.desc`,
    ),
  ]);

  const toCandidate =
    (kind: "movie" | "tv") =>
    (result: DiscoverResult): CatalogCandidate[] => {
      const title = result.title ?? result.name ?? "";
      const releaseDate = result.release_date || result.first_air_date || null;
      if (!releaseDate || NOT_A_TITLE.test(title) || known.has(`${kind}:${result.id}`)) return [];
      return [
        { key: `${kind}:${result.id}`, kind, tmdbId: result.id, season: null, title, releaseDate },
      ];
    };

  return [
    ...movies.results.flatMap(toCandidate("movie")),
    ...shows.results.flatMap(toCandidate("tv")),
  ];
}

async function discoverNewSeasons(
  token: string,
  refs: Record<string, TmdbRef>,
): Promise<CatalogCandidate[]> {
  const known = knownKeys(refs);
  const trackedSeasons = new Map<number, number>();
  for (const ref of Object.values(refs)) {
    if (ref.kind === "tv") {
      trackedSeasons.set(ref.id, Math.max(trackedSeasons.get(ref.id) ?? 0, ref.season ?? 1));
    }
  }

  const candidates: CatalogCandidate[] = [];
  for (const [showId, lastTracked] of trackedSeasons) {
    const show = await request<TmdbShow>(token, `/tv/${showId}`);
    for (const season of show.seasons ?? []) {
      const key = `tv:${showId}:s${season.season_number}`;
      if (season.season_number <= lastTracked || known.has(key)) continue;
      candidates.push({
        key,
        kind: "season",
        tmdbId: showId,
        season: season.season_number,
        title: `${show.name} — ${season.name}`,
        releaseDate: season.air_date ?? null,
      });
    }
  }
  return candidates;
}

async function findCatalogCandidates(
  token: string,
  refs: Record<string, TmdbRef> = TMDB_REFS,
): Promise<CatalogCandidate[]> {
  const [titles, seasons] = await Promise.all([
    discoverNewTitles(token, refs),
    discoverNewSeasons(token, refs),
  ]);
  return [...titles, ...seasons];
}

export async function runDiscovery(db: Database, token: string): Promise<number> {
  const candidates = await findCatalogCandidates(token);
  const now = new Date();

  for (const candidate of candidates) {
    await db
      .insert(catalogCandidate)
      .values({ ...candidate, foundAt: now })
      .onConflictDoNothing();
  }

  const stale = (await db.select({ key: catalogCandidate.key }).from(catalogCandidate))
    .map((row) => row.key)
    .filter((key) => !candidates.some((candidate) => candidate.key === key));
  if (stale.length > 0)
    await db.delete(catalogCandidate).where(inArray(catalogCandidate.key, stale));

  return candidates.length;
}
