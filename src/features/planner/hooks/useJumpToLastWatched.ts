import { useCallback } from "react";
import type { PhaseNumber, Saga, Title, ViewOrder } from "../types";
import { titlesInOrder } from "../utils/order";

// Phases fold and unfold with an animation: wait for it before centring the row.
const UNFOLD_MS = 420;

export function useJumpToLastWatched(
  catalog: Saga[],
  order: ViewOrder,
  watched: ReadonlySet<string>,
  collapsed: ReadonlySet<number>,
  setPhaseCollapsed: (phase: PhaseNumber, isCollapsed: boolean) => void,
) {
  const last = [...titlesInOrder(catalog, order)]
    .reverse()
    .find((title: Title) => watched.has(title.id));

  const jump = useCallback(() => {
    if (!last) return;
    const phase = catalog
      .flatMap((saga) => saga.phases)
      .find((p) => p.titles.some((x) => x.id === last.id));
    const isFolded = order === "release" && phase !== undefined && collapsed.has(phase.number);
    if (isFolded) setPhaseCollapsed(phase.number, false);

    const reach = () => {
      const row = document.getElementById(`title-${last.id}`);
      if (!row) return;
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row.scrollIntoView({ block: "center", behavior: isReduced ? "auto" : "smooth" });
      // The row is announced by the screen reader: the focus goes to its first control.
      row.querySelector<HTMLElement>("input, summary")?.focus({ preventScroll: true });
    };
    if (isFolded) window.setTimeout(reach, UNFOLD_MS);
    else reach();
  }, [last, catalog, order, collapsed, setPhaseCollapsed]);

  return last ? jump : null;
}
