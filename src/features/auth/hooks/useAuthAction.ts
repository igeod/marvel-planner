import { useCallback, useEffect, useState } from "react";
import type { TranslationKey } from "../../../i18n/types";
import { useI18n } from "../../../i18n/useI18n";
import { errorKeyOf, retryAfterOf, withTimeout } from "../utils/authAction";
import { usePasswordPolicy } from "./usePasswordPolicy";

export function useAuthAction<T>(action: (values: T) => Promise<unknown>, onSuccess?: () => void) {
  const { t } = useI18n();
  const policy = usePasswordPolicy();
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isDone, setIsDone] = useState(false);
  // Set when the server says how long to wait (429): the form stays off until then.
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  // Changes on every success, so a repeated message can start its fade again.
  const [resultId, setResultId] = useState(0);

  const run = async (values: T): Promise<boolean> => {
    setErrorKey(null);
    setIsDone(false);
    setIsPending(true);
    try {
      await withTimeout(action(values));
      setIsDone(true);
      setResultId((current) => current + 1);
      onSuccess?.();
      return true;
    } catch (caught) {
      setErrorKey(errorKeyOf(caught));
      const wait = retryAfterOf(caught);
      if (wait) setBlockedUntil(Date.now() + wait * 1000);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  const reset = useCallback(() => {
    setErrorKey(null);
    setIsDone(false);
  }, []);

  useEffect(() => {
    if (blockedUntil === null) return;
    const timer = setTimeout(
      () => {
        setBlockedUntil(null);
        setErrorKey(null);
      },
      Math.max(blockedUntil - Date.now(), 0),
    );
    return () => clearTimeout(timer);
  }, [blockedUntil]);

  const error = errorKey && t(errorKey, { min: policy.minLength });
  const isBlocked = blockedUntil !== null;
  return { run, reset, error, errorCode: errorKey, isPending, isBlocked, isDone, resultId };
}
