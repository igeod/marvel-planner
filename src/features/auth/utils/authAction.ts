import type { TranslationKey } from "../../../i18n/types";
import { AuthError } from "../services/authService";

export const ACTION_TIMEOUT_MS = 15_000;

// A failed fetch is a TypeError; the service already turns known server answers into AuthError.
export function errorKeyOf(caught: unknown): TranslationKey {
  if (caught instanceof AuthError) return caught.messageKey;
  if (caught instanceof TypeError) return "auth.errors.network";
  return "auth.errors.generic";
}

// The request itself is not cancelled; the form just stops waiting for it.
export function withTimeout<T>(promise: Promise<T>, ms = ACTION_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new AuthError("auth.errors.network")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
