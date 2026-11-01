import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthError } from "../src/features/auth/services/authService";
import { ACTION_TIMEOUT_MS, errorKeyOf, withTimeout } from "../src/features/auth/utils/authAction";

describe("errore di un'azione di accesso", () => {
  it("usa la chiave degli AuthError, la rete per i TypeError e il testo generico per il resto", () => {
    expect(errorKeyOf(new AuthError("auth.errors.nameTaken"))).toBe("auth.errors.nameTaken");
    expect(errorKeyOf(new TypeError("Failed to fetch"))).toBe("auth.errors.network");
    expect(errorKeyOf(new Error("boom"))).toBe("auth.errors.generic");
  });
});

describe("attesa massima della richiesta", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("lascia passare una risposta arrivata in tempo", async () => {
    await expect(withTimeout(Promise.resolve("ok"))).resolves.toBe("ok");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("dopo 15 secondi rifiuta con l'errore di rete", async () => {
    const pending = withTimeout(new Promise<never>(() => undefined));
    const outcome = pending.catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(ACTION_TIMEOUT_MS);
    expect(await outcome).toEqual(new AuthError("auth.errors.network"));
  });
});
