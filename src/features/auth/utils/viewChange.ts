export type ViewDirection = "forward" | "back";

export type ViewChange =
  { kind: "none" } | { kind: "instant" } | { kind: "animate"; direction: ViewDirection };

interface Rules<V> {
  // The profile popup and a popup that was just closed swap at once, with no motion.
  isInstant: (from: V | null, to: V) => boolean;
  isBack: (from: V, to: V) => boolean;
}

// What to do when the popup's view changes: nothing, swap at once, or animate in a direction.
export function planViewChange<V>(
  previous: V | null,
  next: V | null,
  { isInstant, isBack }: Rules<V>,
): ViewChange {
  if (next === null || previous === next) return { kind: "none" };
  // From closed there is nothing to leave: show the new view straight away.
  if (previous === null || isInstant(previous, next)) return { kind: "instant" };
  return { kind: "animate", direction: isBack(previous, next) ? "back" : "forward" };
}
