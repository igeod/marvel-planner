import { useCallback, useEffect, useState } from "react";
import type { SharedPlanner } from "../../../../shared/share";
import { ApiError } from "../../../lib/apiClient";
import { getSharedPlanner } from "../services/shareService";

type Outcome =
  { status: "notFound" } | { status: "error" } | { status: "ready"; planner: SharedPlanner };
type State = { status: "loading" } | Outcome;

export function useSharedPlanner(
  code: string,
): State & { retry: () => void; isRetrying: boolean; attempt: number } {
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${code}:${attempt}`;
  const [result, setResult] = useState<{ requestKey: string; outcome: Outcome } | null>(null);

  useEffect(() => {
    let isActive = true;
    const finish = (outcome: Outcome) => isActive && setResult({ requestKey, outcome });
    getSharedPlanner(code)
      .then((planner) => finish({ status: "ready", planner }))
      .catch((error: unknown) =>
        finish({
          status: error instanceof ApiError && error.status === 404 ? "notFound" : "error",
        }),
      );
    return () => {
      isActive = false;
    };
  }, [code, requestKey]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  const current = result?.requestKey === requestKey ? result.outcome : null;
  // A retry keeps the error on screen (its button shows the wait) until the new answer arrives.
  const wasError =
    result?.outcome.status === "error" && result.requestKey.startsWith(`${code}:`) && attempt > 0;
  const state: State = current ?? (wasError ? { status: "error" } : { status: "loading" });
  return { ...state, retry, isRetrying: current === null && wasError, attempt };
}
