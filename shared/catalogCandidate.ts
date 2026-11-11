import { toSlug } from "./slug";

export interface CatalogCandidate {
  key: string;
  kind: "movie" | "tv" | "season";
  tmdbId: number;
  season: number | null;
  title: string;
  releaseDate: string | null;
}

export interface CatalogSnippet {
  id: string;
  catalogEntry: string;
  tmdbRef: string;
}

const SEASON_SUFFIX = /\s—\sSeason\s(\d+)$/;

export function buildCatalogSnippet(candidate: CatalogCandidate, today: string): CatalogSnippet {
  const name = candidate.title.replace(
    SEASON_SUFFIX,
    (_match, number: string, offset: number) =>
      `${candidate.title.slice(0, offset).includes(":") ? "," : ":"} Stagione ${number}`,
  );
  const id = `i-${toSlug(name)}`;
  const isUpcoming = candidate.releaseDate !== null && candidate.releaseDate > today;
  const release = candidate.releaseDate
    ? isUpcoming
      ? candidate.releaseDate
      : candidate.releaseDate.slice(0, 4)
    : "";
  const type = candidate.kind === "movie" ? "film" : "serie";
  const options = isUpcoming ? ", { upcoming: true }" : "";

  const ref =
    candidate.kind === "movie"
      ? `{ kind: "movie", id: ${candidate.tmdbId} }`
      : `{ kind: "tv", id: ${candidate.tmdbId}, season: ${candidate.season ?? 1} }`;

  return {
    id,
    catalogEntry: `[${JSON.stringify(name)}, ${JSON.stringify(release)}, "${type}"${options}],`,
    tmdbRef: `${JSON.stringify(id)}: ${ref},`,
  };
}
