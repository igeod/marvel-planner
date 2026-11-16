import { describe, expect, it } from "vitest";
import { CATALOG } from "../src/features/planner/data/catalog";
import {
  areDefaultFilters,
  DEFAULT_FILTERS,
  filterCatalog,
  flattenTitles,
  isFilters,
} from "../src/features/planner/utils/filters";
import { computeProgress } from "../src/features/planner/utils/progress";

const all = flattenTitles(CATALOG);

describe("filtri", () => {
  it("con i valori di default mostrano tutto", () => {
    expect(flattenTitles(filterCatalog(CATALOG, DEFAULT_FILTERS))).toHaveLength(all.length);
    expect(areDefaultFilters(DEFAULT_FILTERS)).toBe(true);
  });

  it("permettono di tenere film e serie ma non gli speciali", () => {
    const filters = { ...DEFAULT_FILTERS, types: ["film", "serie"] as const };
    const shown = flattenTitles(filterCatalog(CATALOG, { ...filters, types: [...filters.types] }));
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.some((title) => title.type === "special")).toBe(false);
    expect(areDefaultFilters({ ...filters, types: [...filters.types] })).toBe(false);
  });

  it("nascondono continuità alternativa e titoli non usciti", () => {
    const shown = flattenTitles(
      filterCatalog(CATALOG, { ...DEFAULT_FILTERS, showAlternate: false, showUpcoming: false }),
    );
    expect(shown.some((title) => title.continuity === "alternate")).toBe(false);
    expect(shown.some((title) => title.status === "upcoming")).toBe(false);
  });

  it("senza tipi selezionati non mostrano nulla", () => {
    expect(flattenTitles(filterCatalog(CATALOG, { ...DEFAULT_FILTERS, types: [] }))).toEqual([]);
  });

  it("riconoscono solo il formato valido", () => {
    expect(isFilters(DEFAULT_FILTERS)).toBe(true);
    expect(isFilters({ type: "all", showAlternate: true, showUpcoming: true })).toBe(false);
    expect(isFilters({ ...DEFAULT_FILTERS, types: ["altro"] })).toBe(false);
    expect(isFilters(null)).toBe(false);
  });
});

const released = all.filter((title) => title.status === "released");

describe("progresso", () => {
  it("conta solo i titoli visti presenti nell'elenco", () => {
    const watched = new Set([all[0].id, all[1].id, "inesistente"]);
    expect(computeProgress(all, watched)).toEqual({ done: 2, total: released.length });
  });

  it("non conta i titoli in arrivo, nemmeno se segnati", () => {
    const upcoming = all.find((title) => title.status === "upcoming")!;
    expect(computeProgress(all, new Set([upcoming.id]))).toEqual({
      done: 0,
      total: released.length,
    });
  });
});
