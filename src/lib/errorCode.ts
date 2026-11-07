// FNV-1a: the same error on the same page always gives the same short code, with no personal data in it.
export function errorCode(error: unknown, pathname: string): string {
  const name = error instanceof Error ? error.name : "Error";
  const message = error instanceof Error ? error.message : String(error);
  let hash = 0x811c9dc5;
  for (const char of `${name}\n${message}\n${pathname}`) {
    hash = Math.imul(hash ^ char.codePointAt(0)!, 0x01000193) >>> 0;
  }
  return `E-${hash.toString(36).toUpperCase().padStart(5, "0").slice(-5)}`;
}
