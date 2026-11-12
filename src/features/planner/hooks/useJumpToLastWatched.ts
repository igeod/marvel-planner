import { useCallback } from "react";
import type { PhaseNumber, Saga, Title, ViewOrder } from "../types";
import { titlesInOrder } from "../utils/order";

// Phases fold and unfold with an animation: wait for it before centring the row.
const UNFOLD_MS = 420;
// How long the row stays lit after the jump.
const FOUND_MS = 2400;
// The longest wait for the scroll to end before the row is lit anyway.
const SCROLL_WAIT_MS = 700;

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
      // The row is lit when the scroll ends (at most SCROLL_WAIT_MS later), so the eye finds it there.
      const light = () => {
        row.classList.remove("title-row--found");
        void row.offsetWidth;
        row.classList.add("title-row--found");
        window.setTimeout(() => row.classList.remove("title-row--found"), FOUND_MS);
      };
      if (isReduced || !("onscrollend" in window)) {
        light();
      } else {
        let isLit = false;
        const once = () => {
          if (isLit) return;
          isLit = true;
          window.removeEventListener("scrollend", once);
          light();
        };
        window.addEventListener("scrollend", once);
        window.setTimeout(once, SCROLL_WAIT_MS);
      }
      // The row is announced by the screen reader: the focus goes to its first control.
      row.querySelector<HTMLElement>("input, summary")?.focus({ preventScroll: true });
    };
    if (isFolded) window.setTimeout(reach, UNFOLD_MS);
    else reach();
  }, [last, catalog, order, collapsed, setPhaseCollapsed]);

  return { lastId: last?.id ?? null, jump };
}
