import type { ToastOptions } from "./ToastContext";

export type ToastItem = ToastOptions & { id: string };

export const MAX_VISIBLE = 3;

// Adds a toast to the stack. The same id updates the toast in place; beyond MAX_VISIBLE the oldest
// toast that is not persistent leaves, and an info toast never pushes a persistent one out.
export function addToast(current: ToastItem[], item: ToastItem): ToastItem[] {
  if (current.some((existing) => existing.id === item.id)) {
    return current.map((existing) => (existing.id === item.id ? item : existing));
  }
  const next = [...current, item];
  if (next.length <= MAX_VISIBLE) return next;
  const evictable = next.findIndex((existing) => !existing.persistent && existing.id !== item.id);
  if (evictable >= 0) return next.filter((_, index) => index !== evictable);
  // Only an error may push another persistent one out; an info toast waits its turn.
  return item.persistent ? next.slice(1) : current;
}
