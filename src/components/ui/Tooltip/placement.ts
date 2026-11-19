export type Placement = "top" | "bottom" | "left" | "right";

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Box {
  width: number;
  height: number;
}

export interface TipPosition {
  placement: Placement;
  left: number;
  top: number;
  arrow: number;
}

const VIEWPORT_MARGIN = 8;
const GAP = 10;
const ARROW_SIZE = 10;
const ARROW_INSET = 8;

const ORDER: Record<Placement, Placement[]> = {
  top: ["top", "bottom", "left", "right"],
  bottom: ["bottom", "top", "left", "right"],
  left: ["left", "right", "top", "bottom"],
  right: ["right", "left", "top", "bottom"],
};

// What the bubble is measured from. The painted content of the trigger (icon, text, pill): never its
// transparent touch area or its hover background. With ring > 0 (the keyboard focus ring) it is the
// trigger box grown by the ring on every side, so the bubble never covers the ring.
export function referenceRect(content: Rect, box: Rect, ring: number): Rect {
  if (ring <= 0) return content;
  return {
    left: box.left - ring,
    top: box.top - ring,
    right: box.right + ring,
    bottom: box.bottom + ring,
  };
}

// Whether the middle of the reference is on screen. Once it has scrolled away the bubble has nothing
// to point at: it would be pushed against the edge of the window and stay there.
export function isReferenceVisible(reference: Rect, viewport: Box): boolean {
  const x = (reference.left + reference.right) / 2;
  const y = (reference.top + reference.bottom) / 2;
  return x >= 0 && x <= viewport.width && y >= 0 && y <= viewport.height;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, Math.max(min, max)));

function place(anchor: Rect, box: Box, viewport: Box, placement: Placement) {
  const centerX = (anchor.left + anchor.right) / 2;
  const centerY = (anchor.top + anchor.bottom) / 2;
  const maxLeft = viewport.width - box.width - VIEWPORT_MARGIN;
  const maxTop = viewport.height - box.height - VIEWPORT_MARGIN;

  if (placement === "top" || placement === "bottom") {
    const top = placement === "top" ? anchor.top - GAP - box.height : anchor.bottom + GAP;
    const left = clamp(centerX - box.width / 2, VIEWPORT_MARGIN, maxLeft);
    const fits = top >= VIEWPORT_MARGIN && top <= maxTop;
    return { left, top, fits, arrowAxis: centerX - left, arrowLength: box.width };
  }

  const left = placement === "left" ? anchor.left - GAP - box.width : anchor.right + GAP;
  const top = clamp(centerY - box.height / 2, VIEWPORT_MARGIN, maxTop);
  const fits = left >= VIEWPORT_MARGIN && left <= maxLeft;
  return { left, top, fits, arrowAxis: centerY - top, arrowLength: box.height };
}

export function computePlacement(
  anchor: Rect,
  box: Box,
  viewport: Box,
  preferred: Placement,
): TipPosition {
  const candidates = ORDER[preferred].map((placement) => ({
    placement,
    ...place(anchor, box, viewport, placement),
  }));
  const chosen = candidates.find((candidate) => candidate.fits) ?? candidates[0];
  const arrow = clamp(
    chosen.arrowAxis - ARROW_SIZE / 2,
    ARROW_INSET,
    chosen.arrowLength - ARROW_SIZE - ARROW_INSET,
  );

  return { placement: chosen.placement, left: chosen.left, top: chosen.top, arrow };
}
