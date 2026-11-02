import { useCallback, useState, useSyncExternalStore } from "react";

export const DESKTOP_QUERY = "(min-width: 64em)";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (typeof window.matchMedia !== "function") return () => undefined;
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    [query],
  );
  const getSnapshot = () =>
    typeof window.matchMedia === "function" && window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY);

export function useIsDesktopWithReset(onBecomesDesktop: () => void): boolean {
  const isDesktop = useIsDesktop();
  const [wasDesktop, setWasDesktop] = useState(isDesktop);

  if (wasDesktop !== isDesktop) {
    setWasDesktop(isDesktop);
    if (isDesktop) onBecomesDesktop();
  }

  return isDesktop;
}
