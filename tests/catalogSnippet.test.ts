import { describe, expect, it } from "vitest";
import { buildCatalogSnippet, type CatalogCandidate } from "../shared/catalogCandidate";
import { TMDB_REFS } from "../shared/tmdbRefs";
import { CATALOG } from "../src/features/planner/data/catalog";
import { flattenTitles } from "../src/features/planner/utils/filters";

const today = "2026-10-24";

const movie: CatalogCandidate = {
  key: "movie:1",
  kind: "movie",
  tmdbId: 1,
  season: null,
  title: "Blade",
  releaseDate: "2027-11-05",
};

describe("codice generato per un nuovo titolo", () => {
  it("un film non ancora uscito ha data completa e flag upcoming", () => {
    const snippet = buildCatalogSnippet(movie, today);
    expect(snippet.id).toBe("i-blade");
    expect(snippet.catalogEntry).toBe('["Blade", "2027-11-05", "film", { upcoming: true }],');
    expect(snippet.tmdbRef).toBe('"i-blade": { kind: "movie", id: 1 },');
  });

  it("un titolo già uscito mostra solo l'anno", () => {
    const snippet = buildCatalogSnippet({ ...movie, releaseDate: "2026-02-01" }, today);
    expect(snippet.catalogEntry).toBe('["Blade", "2026", "film"],');
  });

  it("una nuova stagione prende il nome italiano e il numero di stagione", () => {
    const snippet = buildCatalogSnippet(
      {
        key: "tv:84958:s3",
        kind: "season",
        tmdbId: 84958,
        season: 3,
        title: "Loki — Season 3",
        releaseDate: "2027-01-01",
      },
      today,
    );
    expect(snippet.id).toBe("i-loki-stagione-3");
    expect(snippet.catalogEntry).toContain('"Loki: Stagione 3"');
    expect(snippet.tmdbRef).toBe('"i-loki-stagione-3": { kind: "tv", id: 84958, season: 3 },');
  });

  it("genera gli stessi identificatori usati dal catalogo esistente", () => {
    const loki = flattenTitles(CATALOG).find((title) => title.id === "i-loki-stagione-2");
    expect(loki).toBeDefined();
    const snippet = buildCatalogSnippet(
      {
        key: "tv:84958:s2",
        kind: "season",
        tmdbId: 84958,
        season: 2,
        title: "Loki — Season 2",
        releaseDate: "2023-10-05",
      },
      today,
    );
    expect(snippet.id).toBe(loki?.id);
    expect(TMDB_REFS[snippet.id]).toMatchObject({ kind: "tv", id: 84958, season: 2 });
  });
});
