import { useState } from "react";
import type { TranslationKey } from "../../../i18n/types";
import { useI18n } from "../../../i18n/useI18n";
import { AuthError } from "../services/authService";
import { usePasswordPolicy } from "./usePasswordPolicy";

export function useAuthAction<T>(action: (values: T) => Promise<void>, onSuccess?: () => void) {
  const { t } = useI18n();
  const policy = usePasswordPolicy();
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const run = async (values: T) => {
    setErrorKey(null);
    setIsDone(false);
    setIsPending(true);
    try {
      await action(values);
      setIsDone(true);
      onSuccess?.();
    } catch (caught) {
      setErrorKey(caught instanceof AuthError ? caught.messageKey : "auth.errors.generic");
    } finally {
      setIsPending(false);
    }
  };

  const error = errorKey && t(errorKey, { min: policy.minLength });
  return { run, error, isPending, isDone };
}
