const RANGE_URL = "https://api.pwnedpasswords.com/range/";
const TIMEOUT_MS = 2500;

async function sha1Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

// Have I Been Pwned range API: only the first 5 hex digits of the SHA-1 leave the server, so the
// password itself is never sent.
// shortcut: fails open when the service is down or slow, so sign-up keeps working; switch to
// fail-closed if breached passwords must never get in.
export async function isPwnedPassword(password: string): Promise<boolean> {
  try {
    const hash = await sha1Hex(password);
    const response = await fetch(RANGE_URL + hash.slice(0, 5), {
      headers: { "Add-Padding": "true" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return false;
    const suffix = hash.slice(5);
    return (await response.text()).split(/\r?\n/).some((line) => {
      const [candidate, count] = line.trim().split(":");
      // Padding rows have a count of 0 and are not real matches.
      return candidate === suffix && Number(count) > 0;
    });
  } catch {
    return false;
  }
}
