import { useEffect, useRef } from "react";

// Past 80px, or a quick flick (0.5 px/ms) of at least 24px, a downward drag dismisses the sheet.
const CLOSE_DISTANCE = 80;
const FLICK_SPEED = 0.5;
const FLICK_MIN_DISTANCE = 24;
// The header strip that always starts a drag; elsewhere only content scrolled to the top does.
const HEADER_HEIGHT = 56;
// A drag upwards stretches at most this far.
const MAX_UPWARD_PULL = 12;
const DRAG_START_DISTANCE = 6;
// Matches --dur-ui, the release time.
const RELEASE_MS = 180;

function isScrolledAwayFromTop(target: EventTarget | null, boundary: HTMLElement): boolean {
  for (
    let node = target as HTMLElement | null;
    node && node !== boundary;
    node = node.parentElement
  ) {
    if (node.scrollTop > 0) return true;
  }
  return false;
}

// Bottom sheet that follows the finger. The backdrop lightens in step through --drag (0 to 1).
// On release it springs back or calls onDismiss; onDismiss may refuse (unsaved changes) and the
// sheet simply stays. `isEnabled` turns the gesture off, e.g. on desktop.
export function useSheetDrag(
  getDialog: () => HTMLDialogElement | null | undefined,
  onDismiss: () => void,
  isEnabled: boolean,
) {
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    const dialog = getDialog();
    if (!dialog || !isEnabled) return;

    let start: {
      x: number;
      y: number;
      time: number;
      fromHeader: boolean;
      target: EventTarget | null;
    } | null = null;
    let isDragging = false;
    let offset = 0;

    const reset = () => {
      start = null;
      isDragging = false;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return reset();
      const touch = event.touches[0];
      start = {
        x: touch.clientX,
        y: touch.clientY,
        time: event.timeStamp,
        fromHeader: touch.clientY - dialog.getBoundingClientRect().top <= HEADER_HEIGHT,
        target: event.target,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!start) return;
      const touch = event.touches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (!isDragging) {
        if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < DRAG_START_DISTANCE) return;
        const fromContent = dy > 0 && !isScrolledAwayFromTop(start.target, dialog);
        if (!start.fromHeader && !fromContent) return reset();
        isDragging = true;
        dialog.dataset.dragging = "";
      }
      event.preventDefault();
      offset = dy >= 0 ? dy : -Math.min(MAX_UPWARD_PULL, -dy / 3);
      dialog.style.transform = `translateY(${offset}px)`;
      const fraction = Math.min(Math.max(offset / dialog.offsetHeight, 0), 1);
      dialog.style.setProperty("--drag", String(fraction));
    };

    const onTouchEnd = (event: TouchEvent) => {
      const current = start;
      const wasDragging = isDragging;
      reset();
      if (!current || !wasDragging) return;
      const elapsed = Math.max(event.timeStamp - current.time, 1);
      const isFlick = offset >= FLICK_MIN_DISTANCE && offset / elapsed >= FLICK_SPEED;
      const shouldDismiss = offset > CLOSE_DISTANCE || isFlick;
      delete dialog.dataset.dragging;
      dialog.style.transitionDuration = `${RELEASE_MS}ms`;
      dialog.style.transform = "";
      dialog.style.removeProperty("--drag");
      window.setTimeout(() => dialog.style.removeProperty("transition-duration"), RELEASE_MS + 40);
      offset = 0;
      if (shouldDismiss) dismissRef.current();
    };

    dialog.addEventListener("touchstart", onTouchStart, { passive: true });
    dialog.addEventListener("touchmove", onTouchMove, { passive: false });
    dialog.addEventListener("touchend", onTouchEnd);
    dialog.addEventListener("touchcancel", onTouchEnd);
    return () => {
      dialog.removeEventListener("touchstart", onTouchStart);
      dialog.removeEventListener("touchmove", onTouchMove);
      dialog.removeEventListener("touchend", onTouchEnd);
      dialog.removeEventListener("touchcancel", onTouchEnd);
      delete dialog.dataset.dragging;
      dialog.style.transform = "";
      dialog.style.removeProperty("--drag");
    };
  }, [getDialog, isEnabled]);
}
