import { useCallback, useEffect, useState } from "react";
import type { AdminOverview, AdminRelease, ReviewTopic } from "../../../../shared/admin";
import {
  clearReleaseDate,
  dismissCandidate,
  getAdminOverview,
  keepReleaseDate,
  markCandidateCopied,
  markGuideReviewed,
  resolveSuggestion,
  setMaintenance,
  setReleaseDate,
  setVerified,
} from "../services/adminService";

const VERIFIABLE: ReviewTopic[] = ["postCredits", "keyScenes", "easterEggs"];

// Changes the release row of one title (made if it had none), leaving the others as they are.
function withRelease(
  overview: AdminOverview,
  titleId: string,
  change: (row: AdminRelease) => AdminRelease,
): AdminOverview {
  const empty: AdminRelease = {
    titleId,
    tmdbDate: null,
    manualDate: null,
    tmdbDateAtOverride: null,
  };
  const rows = overview.releases.some((row) => row.titleId === titleId)
    ? overview.releases
    : [...overview.releases, empty];
  return {
    ...overview,
    releases: rows.map((row) => (row.titleId === titleId ? change(row) : row)),
  };
}

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

  // Resolves to whether the action worked, so a dialog can stay open on failure.
  const run = useCallback(async (action: () => Promise<unknown>, apply: () => void) => {
    setHasActionFailed(false);
    try {
      await action();
      apply();
      return true;
    } catch {
      setHasActionFailed(true);
      return false;
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

  const verify = useCallback(
    (titleId: string, topics: ReviewTopic[]) =>
      run(
        () => setVerified(titleId, topics),
        () =>
          update((overview) => ({
            ...overview,
            reviews: [
              ...overview.reviews.filter(
                (row) => row.titleId !== titleId || !VERIFIABLE.includes(row.topic),
              ),
              ...topics.map((topic) => ({ titleId, topic })),
            ],
          })),
      ),
    [run, update],
  );

  const reviewGuide = useCallback(
    (titleId: string) =>
      run(
        () => markGuideReviewed(titleId),
        () =>
          update((overview) => ({
            ...overview,
            reviews: [...overview.reviews, { titleId, topic: "guide" }],
          })),
      ),
    [run, update],
  );

  const setDate = useCallback(
    (titleId: string, date: string) =>
      run(
        () => setReleaseDate(titleId, date),
        () =>
          update((overview) =>
            withRelease(overview, titleId, (row) => ({
              ...row,
              manualDate: date,
              tmdbDateAtOverride: row.tmdbDate,
            })),
          ),
      ),
    [run, update],
  );

  // Resolves to the hand-written date it took away (null if it failed), so the toast can put it back.
  const clearDate = useCallback(
    async (titleId: string): Promise<string | null> => {
      let previous: string | null = null;
      const done = await run(
        async () => {
          previous = (await clearReleaseDate(titleId)).previous;
        },
        () =>
          update((overview) =>
            withRelease(overview, titleId, (row) => ({
              ...row,
              manualDate: null,
              tmdbDateAtOverride: null,
            })),
          ),
      );
      return done ? previous : null;
    },
    [run, update],
  );

  const keepDate = useCallback(
    (titleId: string) =>
      run(
        () => keepReleaseDate(titleId),
        () =>
          update((overview) =>
            withRelease(overview, titleId, (row) => ({ ...row, tmdbDateAtOverride: row.tmdbDate })),
          ),
      ),
    [run, update],
  );

  const handleSuggestion = useCallback(
    (id: string, action: "done" | "discard") =>
      run(
        () => resolveSuggestion(id, action),
        () =>
          update((overview) => ({
            ...overview,
            suggestions:
              action === "discard"
                ? overview.suggestions.filter((item) => item.id !== id)
                : overview.suggestions.map((item) =>
                    item.id === id
                      ? { ...item, isDone: true, resolvedAt: new Date().toISOString() }
                      : item,
                  ),
          })),
      ),
    [run, update],
  );

  return {
    state,
    hasActionFailed,
    toggleMaintenance,
    dismiss,
    markCopied,
    verify,
    reviewGuide,
    setDate,
    clearDate,
    keepDate,
    handleSuggestion,
    reload,
  };
}
