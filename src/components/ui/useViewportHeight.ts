import { useEffect } from "react";

// The sheet height follows the visual viewport so the keyboard and browser bars never cover fields.
// Sets --viewport-height on the dialog while `isEnabled`.
export function useViewportHeight(
  getDialog: () => HTMLDialogElement | null | undefined,
  isEnabled: boolean,
) {
  useEffect(() => {
    const dialog = getDialog();
    const viewport = window.visualViewport;
    if (!dialog || !viewport || !isEnabled) return;
    const sync = () => dialog.style.setProperty("--viewport-height", `${viewport.height}px`);
    sync();
    viewport.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      window.removeEventListener("resize", sync);
      dialog.style.removeProperty("--viewport-height");
    };
  }, [getDialog, isEnabled]);
}
