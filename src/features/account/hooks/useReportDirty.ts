import { createContext, useContext, useEffect } from "react";

// AccountSettings provides this; each form reports whether it holds edits not yet saved.
export const UnsavedChangesContext = createContext<(id: string, isDirty: boolean) => void>(
  () => undefined,
);

export function useReportDirty(id: string, isDirty: boolean) {
  const report = useContext(UnsavedChangesContext);
  useEffect(() => {
    report(id, isDirty);
    return () => report(id, false);
  }, [report, id, isDirty]);
}

// Each form also reports a request in flight: the popup cannot be closed until it ends.
export const PendingContext = createContext<(id: string, isPending: boolean) => void>(
  () => undefined,
);

export function useReportPending(id: string, isPending: boolean) {
  const report = useContext(PendingContext);
  useEffect(() => {
    report(id, isPending);
    return () => report(id, false);
  }, [report, id, isPending]);
}

// Scrolls the panel so an element (a success message) is fully visible, clear of the keyboard.
export const RevealContext = createContext<(element: HTMLElement | null) => void>(() => undefined);
