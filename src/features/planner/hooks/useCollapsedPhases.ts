import { useCallback, useEffect, useRef, useState } from "react";
import { preferencesSchema, type Preferences } from "../../../../shared/preferences";
import { apiRequest } from "../../../lib/apiClient";
import { readJson, writeJson } from "../../../lib/storage";
import { STORAGE_KEYS } from "../../../lib/storageKeys";
import { useAuth } from "../../auth/hooks/useAuth";
import { ALL_PHASE_NUMBERS } from "../data/catalog";

const toPreferences = (collapsed: ReadonlySet<number>): Preferences => ({
  collapsedPhases: [...collapsed].sort((a, b) => a - b),
});

// Anything that is not what we wrote (a hand edit, an old version) counts as nothing saved.
function readDevice(): ReadonlySet<number> {
  const parsed = preferencesSchema.safeParse(readJson<unknown>(STORAGE_KEYS.preferences, null));
  return new Set(parsed.success ? parsed.data.collapsedPhases : []);
}

// The device always keeps a copy, so a refresh opens as you left it; an account's copy on the server
// wins once it arrives, so the choice follows the person to other devices.
export function useCollapsedPhases() {
  const { status } = useAuth();
  const isAccount = status === "authenticated";
  const [collapsed, setCollapsed] = useState<ReadonlySet<number>>(readDevice);
  // What is already stored, so what we just loaded is not written straight back.
  const stored = useRef(JSON.stringify(toPreferences(collapsed)));

  useEffect(() => {
    if (!isAccount) return;
    let isActive = true;
    apiRequest<{ preferences: Preferences | null }>("/preferences")
      .then(({ preferences }) => {
        if (!isActive || !preferences) return;
        stored.current = JSON.stringify(preferences);
        writeJson(STORAGE_KEYS.preferences, preferences);
        setCollapsed(new Set(preferences.collapsedPhases));
      })
      .catch(() => undefined); // The device copy keeps working; a layout choice is not worth an error.
    return () => {
      isActive = false;
    };
  }, [isAccount]);

  useEffect(() => {
    const preferences = toPreferences(collapsed);
    const serialized = JSON.stringify(preferences);
    if (serialized === stored.current) return;
    stored.current = serialized;
    writeJson(STORAGE_KEYS.preferences, preferences);
    if (isAccount) {
      apiRequest("/preferences", { method: "PUT", body: serialized }).catch(() => undefined);
    }
  }, [collapsed, isAccount]);

  const setPhaseCollapsed = useCallback((phase: number, isCollapsed: boolean) => {
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (isCollapsed) next.add(phase);
      else next.delete(phase);
      return next;
    });
  }, []);

  const areAllCollapsed = collapsed.size === ALL_PHASE_NUMBERS.length;

  const toggleAll = useCallback(() => {
    setCollapsed(areAllCollapsed ? new Set() : new Set(ALL_PHASE_NUMBERS));
  }, [areAllCollapsed]);

  return { collapsed, areAllCollapsed, setPhaseCollapsed, toggleAll };
}
