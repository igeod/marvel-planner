import type { PhaseNumber, Saga } from "../types";

export type CellState = "watched" | "next" | "todo";

export interface StripPhase {
  number: PhaseNumber;
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
