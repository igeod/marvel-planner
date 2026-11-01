import { useCallback, useEffect, useState } from "react";
import type { AdminOverview } from "../../../../shared/admin";
import {
  dismissCandidate,
  getAdminOverview,
  markCandidateCopied,
  setMaintenance,
} from "../services/adminService";

type State =
  { status: "loading" } | { status: "error" } | { status: "ready"; overview: AdminOverview };

export function useAdminOverview() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [hasActionFailed, setHasActionFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;
    getAdminOverview()
      .then((overview) => isActive && setState({ status: "ready", overview }))
      .catch(() => isActive && setState({ status: "error" }));
    return () => {
      isActive = false;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((current) => current + 1);
  }, []);

  const update = useCallback((change: (overview: AdminOverview) => AdminOverview) => {
    setState((current) =>
      current.status === "ready"
        ? { status: "ready", overview: change(current.overview) }
        : current,
    );
  }, []);

  const run = useCallback(async (action: () => Promise<unknown>, apply: () => void) => {
    setHasActionFailed(false);
    try {
      await action();
      apply();
    } catch {
      setHasActionFailed(true);
    }
  }, []);

  const toggleMaintenance = useCallback(
    (enabled: boolean) =>
      run(
        () => setMaintenance(enabled),
        () => update((overview) => ({ ...overview, maintenance: enabled })),
      ),
    [run, update],
  );

  const dismiss = useCallback(
    (key: string) =>
      run(
        () => dismissCandidate(key),
        () =>
          update((overview) => ({
            ...overview,
            candidates: overview.candidates.filter((candidate) => candidate.key !== key),
          })),
      ),
    [run, update],
  );

  const markCopied = useCallback(
    (key: string) =>
      run(
        () => markCandidateCopied(key),
        () =>
          update((overview) => ({
            ...overview,
            candidates: overview.candidates.map((candidate) =>
              candidate.key === key
                ? { ...candidate, copiedAt: new Date().toISOString() }
                : candidate,
            ),
          })),
      ),
    [run, update],
  );

  return { state, hasActionFailed, toggleMaintenance, dismiss, markCopied, reload };
}
