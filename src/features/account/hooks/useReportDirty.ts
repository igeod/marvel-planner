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
