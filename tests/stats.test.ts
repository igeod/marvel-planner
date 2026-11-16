import { describe, expect, it } from "vitest";
import { computeStats } from "../src/features/account/utils/stats";
import { CATALOG } from "../src/features/planner/data/catalog";
import { flattenTitles } from "../src/features/planner/utils/filters";

// Titles not out yet do not count.
const titles = flattenTitles(CATALOG).filter((title) => title.status === "released");

describe("statistiche dei progressi", () => {
  it("senza titoli visti tutto è a zero ma i totali sono corretti", () => {
    const stats = computeStats(CATALOG, new Set());
    expect(stats.overall).toEqual({ done: 0, total: titles.length });
    expect(stats.byPhase.reduce((sum, phase) => sum + phase.total, 0)).toBe(titles.length);
    expect(stats.byType.reduce((sum, type) => sum + type.total, 0)).toBe(titles.length);
    expect(stats.byYear.reduce((sum, year) => sum + year.total, 0)).toBe(titles.length);
  });

  it("conta i titoli visti per fase, tipo e anno", () => {
    const first = titles[0];
    const stats = computeStats(CATALOG, new Set([first.id]));
    expect(stats.overall.done).toBe(1);
    expect(stats.byPhase[0].done).toBe(1);
    expect(stats.byType.find((entry) => entry.type === first.type)?.done).toBe(1);
    expect(stats.byYear.find((entry) => entry.year === first.release.slice(0, 4))?.done).toBe(1);
  });

  it("non conta i titoli in arrivo, nemmeno se segnati", () => {
    const upcoming = flattenTitles(CATALOG).find((title) => title.status === "upcoming")!;
    const stats = computeStats(CATALOG, new Set([upcoming.id]));
    expect(stats.overall).toEqual({ done: 0, total: titles.length });
  });

  it("ignora gli id sconosciuti", () => {
    expect(computeStats(CATALOG, new Set(["i-inventato"])).overall.done).toBe(0);
  });

  it("ordina gli anni in modo crescente", () => {
    const years = computeStats(CATALOG, new Set()).byYear.map((entry) => entry.year);
    expect(years).toEqual([...years].sort());
  });
});
