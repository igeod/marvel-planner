import { useEffect, useRef } from "react";

// How the last interaction happened: a touch or a click gives the focus back without the ring,
// the keyboard with it.
let isPointerInput = false;
if (typeof document !== "undefined") {
  document.addEventListener("pointerdown", () => (isPointerInput = true), true);
  document.addEventListener("keydown", () => (isPointerInput = false), true);
}

export function restoreFocus(target: Element | null) {
  if (!(target instanceof HTMLElement) || !target.isConnected) return;
  // `focusVisible` is not in every TypeScript lib yet; browsers that ignore it show the ring as before.
  target.focus({ focusVisible: !isPointerInput } as FocusOptions);
}

export function useDialog(isOpen: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      openerRef.current = document.activeElement;
      dialog.showModal();
    }
    if (!isOpen && dialog.open) {
      dialog.close();
      restoreFocus(openerRef.current);
    }
  }, [isOpen]);

  return ref;
}
