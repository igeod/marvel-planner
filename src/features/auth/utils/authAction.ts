import type { TranslationKey } from "../../../i18n/types";
import { AuthError } from "../services/authService";

export const ACTION_TIMEOUT_MS = 15_000;

// A failed fetch is a TypeError; the service already turns known server answers into AuthError.
export function errorKeyOf(caught: unknown): TranslationKey {
  if (caught instanceof AuthError) return caught.messageKey;
  if (caught instanceof TypeError) return "auth.errors.network";
  return "auth.errors.generic";
}

// Better Auth's rate limiter answers with X-Retry-After; the standard header is read too.
export function retryAfterFromHeaders(response: Response): number | undefined {
  const raw = response.headers.get("retry-after") ?? response.headers.get("x-retry-after");
  const seconds = Number(raw);
  return raw && Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : undefined;
}

export function retryAfterOf(caught: unknown): number | undefined {
  return caught instanceof AuthError ? caught.retryAfter : undefined;
}

// The request itself is not cancelled; the form just stops waiting for it.
export function withTimeout<T>(promise: Promise<T>, ms = ACTION_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new AuthError("auth.errors.network")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
