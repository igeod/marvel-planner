// Stored as JSON in site_setting under PASSWORD_POLICY_KEY, so it can change without a deploy.
// Length only: composition rules ("one capital, one number") are not enforced, as NIST advises.
// Passwords that appeared in a data breach are rejected by the worker (see pwnedPasswords.ts).
export interface PasswordPolicy {
  minLength: number;
}

export const PASSWORD_POLICY_KEY = "password_policy";

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = { minLength: 8 };

// Longer passwords are rejected, never truncated. Must stay at 64 or more.
export const MAX_PASSWORD_LENGTH = 128;

const MAX_MIN_LENGTH = 64;

// A missing, broken or out-of-range row falls back to the default. Unknown fields (the old
// requireLetter / requireNumber) are ignored.
export function parsePasswordPolicy(raw: string | null | undefined): PasswordPolicy {
  let minLength: unknown;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") {
      minLength = (parsed as { minLength?: unknown }).minLength;
    }
  } catch {
    // Keep the default.
  }
  return {
    minLength:
      typeof minLength === "number" &&
      Number.isInteger(minLength) &&
      minLength >= 1 &&
      minLength <= MAX_MIN_LENGTH
        ? minLength
        : DEFAULT_PASSWORD_POLICY.minLength,
  };
}

export function isLongEnough(policy: PasswordPolicy, password: string): boolean {
  return password.length >= policy.minLength;
}
