import type { TranslationKey } from "../i18n/types";

export type FieldErrors<Field extends string> = Partial<Record<Field, TranslationKey>>;

// One "@", dot-separated domain labels without empty parts, a letters-only TLD of 2+.
const EMAIL_PATTERN = /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

const COMMON_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "libero.it",
  "live.com",
];

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

// "mario@gmial.com" -> "mario@gmail.com"; null when the domain is fine or unknown.
export function suggestEmail(value: string): string | null {
  const email = value.trim();
  if (!isValidEmail(email)) return null;
  const at = email.lastIndexOf("@");
  const domain = email.slice(at + 1).toLowerCase();
  if (COMMON_DOMAINS.includes(domain)) return null;
  // Distance 1 is a slip; swapped neighbours ("gmial") cost 2 but keep the same letters.
  const sortedLetters = (value: string) => [...value].sort().join("");
  const match = COMMON_DOMAINS.find((known) => {
    const distance = editDistance(domain, known);
    return distance === 1 || (distance === 2 && sortedLetters(domain) === sortedLetters(known));
  });
  return match ? `${email.slice(0, at)}@${match}` : null;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}

export function focusFirstInvalidField(form: HTMLFormElement, errors: object) {
  const invalidNames = new Set(Object.keys(errors));
  const firstInvalid = Array.from(form.elements).find(
    (element): element is HTMLInputElement =>
      element instanceof HTMLInputElement && invalidNames.has(element.name),
  );
  firstInvalid?.focus();
}
