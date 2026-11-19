import type { SuggestTarget } from "./context/SuggestContext";

// The same suggestion (title, part of the page, line) is the same draft.
export const draftKey = (target: SuggestTarget) =>
  `${target.titleId}|${target.section}|${target.item ?? ""}`;
