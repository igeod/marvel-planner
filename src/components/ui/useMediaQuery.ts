import { useCallback, useState, useSyncExternalStore } from "react";

export const TABLET_QUERY = "(min-width: 48em)";
const DESKTOP_QUERY = "(min-width: 64em)";

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

// Runs `onMatch` when the viewport grows into `query` (to close what only the small layout opens).
export function useMediaQueryWithReset(query: string, onMatch: () => void): boolean {
  const matches = useMediaQuery(query);
  const [didMatch, setDidMatch] = useState(matches);

  if (didMatch !== matches) {
    setDidMatch(matches);
    if (matches) onMatch();
  }

  return matches;
}

export const useIsDesktopWithReset = (onBecomesDesktop: () => void) =>
  useMediaQueryWithReset(DESKTOP_QUERY, onBecomesDesktop);
