import { describe, expect, it } from "vitest";
import { initials } from "../src/features/auth/utils/initials";
import { CATALOG } from "../src/features/planner/data/catalog";
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  flattenTitles,
} from "../src/features/planner/utils/filters";
import { findPhaseNumber } from "../src/features/planner/utils/nextTitle";
import { buildPhaseStrip } from "../src/features/planner/utils/strip";
import { nextTheme } from "../src/features/theme/theme";

const titles = flattenTitles(CATALOG);

describe("striscia dei progressi", () => {
  it("ha una colonna per fase e una cella per titolo uscito", () => {
    const strip = buildPhaseStrip(CATALOG, new Set(), null);
    expect(strip).toHaveLength(6);
    const released = titles.filter((title) => title.status === "released");
    expect(strip.reduce((sum, phase) => sum + phase.cells.length, 0)).toBe(released.length);
  });

  it("non ha celle per i titoli in arrivo, nemmeno se segnati", () => {
    const upcoming = titles.find((title) => title.status === "upcoming")!;
    const withMark = buildPhaseStrip(CATALOG, new Set([upcoming.id]), null);
    const without = buildPhaseStrip(CATALOG, new Set(), null);
    expect(withMark).toEqual(without);
  });

  it("distingue visti, prossimo e da vedere", () => {
    const [first, second] = titles;
    const [phase] = buildPhaseStrip(CATALOG, new Set([first.id]), second.id);
    expect(phase.cells.slice(0, 3)).toEqual(["watched", "next", "todo"]);
    expect(phase.done).toBe(1);
  });
});

describe("filtri attivi", () => {
  it("conta solo le impostazioni diverse dal predefinito", () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
    expect(countActiveFilters({ ...DEFAULT_FILTERS, types: ["film"] })).toBe(1);
    expect(
      countActiveFilters({ types: ["film", "serie"], showAlternate: false, showUpcoming: false }),
    ).toBe(3);
  });
});

describe("fase di un titolo", () => {
  it("restituisce il numero di fase o nulla", () => {
    expect(findPhaseNumber(CATALOG, titles[0].id)).toBe(1);
    expect(findPhaseNumber(CATALOG, "i-inventato")).toBeNull();
  });
});

describe("iniziali dell'avatar", () => {
  it("usa due parole, oppure le prime due lettere", () => {
    expect(initials("Captain Pixel")).toBe("CP");
    expect(initials("Diego")).toBe("DI");
    expect(initials("  é  ")).toBe("É");
    expect(initials("")).toBe("");
  });
});

describe("tema", () => {
  it("scorre sistema, chiaro, scuro e ricomincia", () => {
    expect(nextTheme("system")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("system");
  });
});
