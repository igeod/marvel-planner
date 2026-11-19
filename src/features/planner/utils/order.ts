import { CHRONOLOGICAL_ORDER } from "../data/chronology";
import type { PhaseNumber, Saga, Title, ViewOrder } from "../types";
import { flattenTitles } from "./filters";

const POSITIONS = new Map(CHRONOLOGICAL_ORDER.map((id, index) => [id, index]));

export interface ChronologicalTitles {
  placed: Title[];
  unplaced: Title[];
}

export function chronologicalTitles(catalog: Saga[]): ChronologicalTitles {
  const titles = flattenTitles(catalog);
  const position = (title: Title) => POSITIONS.get(title.id) ?? -1;
  return {
    placed: titles
      .filter((title) => position(title) >= 0)
      .sort((a, b) => position(a) - position(b)),
    unplaced: titles.filter((title) => position(title) < 0),
  };
}

export function titlesInOrder(catalog: Saga[], order: ViewOrder): Title[] {
  if (order === "release") return flattenTitles(catalog);
  const { placed, unplaced } = chronologicalTitles(catalog);
  return [...placed, ...unplaced];
}

// The phase each title belongs to, for the chronological order, which has no phase headings.
export function phaseByTitle(catalog: Saga[]): Map<string, PhaseNumber> {
  return new Map(
    catalog.flatMap((saga) =>
      saga.phases.flatMap((phase) =>
        phase.titles.map((title) => [title.id, phase.number] as const),
      ),
    ),
  );
}

const VIEW_ORDERS: ViewOrder[] = ["release", "chronological"];

export const isViewOrder = (value: unknown): value is ViewOrder =>
  VIEW_ORDERS.includes(value as ViewOrder);
