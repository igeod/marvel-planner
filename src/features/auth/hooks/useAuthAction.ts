import { useCallback, useState } from "react";
import type { TranslationKey } from "../../../i18n/types";
import { useI18n } from "../../../i18n/useI18n";
import { errorKeyOf, withTimeout } from "../utils/authAction";
import { usePasswordPolicy } from "./usePasswordPolicy";

export function useAuthAction<T>(action: (values: T) => Promise<unknown>, onSuccess?: () => void) {
  const { t } = useI18n();
  const policy = usePasswordPolicy();
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isDone, setIsDone] = useState(false);
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
      return false;
    } finally {
      setIsPending(false);
    }
  };

  const reset = useCallback(() => {
    setErrorKey(null);
    setIsDone(false);
  }, []);

  const error = errorKey && t(errorKey, { min: policy.minLength });
  return { run, reset, error, errorCode: errorKey, isPending, isDone, resultId };
}
