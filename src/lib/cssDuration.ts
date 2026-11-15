// A duration token from the stylesheet (--dur-progress, --dur-hover...) in milliseconds, so the
// scripts that time things read the same value as the CSS. `fallback` covers a missing token.
export function readCssMs(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return fallback;
  return raw.endsWith("ms") ? value : value * 1000;
}
