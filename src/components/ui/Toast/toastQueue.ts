import type { ToastOptions } from "./ToastContext";

// `leaving`: it is on its way out (fading and folding), no longer counts against MAX_VISIBLE and is
// removed when its animation ends.
export type ToastItem = ToastOptions & { id: string; leaving?: boolean };

export const MAX_VISIBLE = 3;

const isShown = (item: ToastItem) => !item.leaving;
const leave = (item: ToastItem): ToastItem => ({ ...item, leaving: true });

// Adds a toast to the stack. The same id updates the toast in place; beyond MAX_VISIBLE the oldest
// toast that is not persistent leaves, and an info toast never pushes a persistent one out.
export function addToast(current: ToastItem[], item: ToastItem): ToastItem[] {
  if (current.some((existing) => existing.id === item.id)) {
    return current.map((existing) => (existing.id === item.id ? item : existing));
  }
  const next = [...current, item];
  if (next.filter(isShown).length <= MAX_VISIBLE) return next;
  const evictable = next.findIndex(
    (existing) => isShown(existing) && !existing.persistent && existing.id !== item.id,
  );
  if (evictable >= 0)
    return next.map((existing, index) => (index === evictable ? leave(existing) : existing));
  // Only an error may push another persistent one out; an info toast waits its turn.
  if (!item.persistent) return current;
  const oldest = next.findIndex(isShown);
  return next.map((existing, index) => (index === oldest ? leave(existing) : existing));
}

// Starts a toast's exit; it stays in the list until removeToast.
export function dismissToast(current: ToastItem[], id: string): ToastItem[] {
  return current.map((item) => (item.id === id && isShown(item) ? leave(item) : item));
}

export function removeToast(current: ToastItem[], id: string): ToastItem[] {
  return current.filter((item) => item.id !== id);
}
