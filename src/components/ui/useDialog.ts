import { useEffect, useRef } from "react";

// Counted, so a confirm dialog opened over another dialog does not unlock the page early.
let scrollLocks = 0;

function lockPageScroll() {
  if (scrollLocks++ === 0) document.body.style.overflow = "hidden";
  return () => {
    if (--scrollLocks === 0) document.body.style.overflow = "";
  };
}

export function useDialog(isOpen: boolean) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => (isOpen ? lockPageScroll() : undefined), [isOpen]);

  return ref;
}
