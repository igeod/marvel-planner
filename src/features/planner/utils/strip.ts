import type { PhaseNumber, Saga, Title } from "../types";

export type CellState = "watched" | "next" | "todo";

export interface StripPhase {
  // Missing for the single column of the chronological order, which has no phases.
  number?: PhaseNumber;
  done: number;
  total: number;
  cells: CellState[];
}

export function buildPhaseStrip(
  catalog: Saga[],
  watched: ReadonlySet<string>,
  nextId: string | null,
): StripPhase[] {
  return catalog
    .flatMap((saga) => saga.phases)
    .map((phase) => {
      // A title not out yet has no cell: it appears when it is released.
      const cells = phase.titles
        .filter((title) => title.status === "released")
        .map((title): CellState => {
          if (watched.has(title.id)) return "watched";
          return title.id === nextId ? "next" : "todo";
        });
      return {
        number: phase.number,
        done: cells.filter((cell) => cell === "watched").length,
        total: cells.length,
        cells,
      };
    });
}

// The chronological order: one column, the cells in the order of the list (the titles not out yet
// have none, as in the phases).
export function buildChronologicalStrip(
  titles: Title[],
  watched: ReadonlySet<string>,
  nextId: string | null,
): StripPhase[] {
  const cells = titles
    .filter((title) => title.status === "released")
    .map((title): CellState => {
      if (watched.has(title.id)) return "watched";
      return title.id === nextId ? "next" : "todo";
    });
  return [{ done: cells.filter((cell) => cell === "watched").length, total: cells.length, cells }];
}
