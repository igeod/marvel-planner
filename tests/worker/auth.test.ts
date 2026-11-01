import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAuth } from "../../worker/auth";
import type { Env } from "../../worker/env";
import { createTestDatabase } from "./support/testDatabase";

const env = {
  BETTER_AUTH_URL: "http://localhost:5173",
  BETTER_AUTH_SECRET: "un-segreto-di-prova-lungo-almeno-trentadue-caratteri",
} as Env;

// Offline by default: the breach check fails open when the network is unreachable.
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("")),
  );
});
afterEach(() => vi.unstubAllGlobals());

async function sha1(text: string) {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

let context: ReturnType<typeof createTestDatabase>;
let auth: ReturnType<typeof createAuth>;

beforeEach(() => {
  context = createTestDatabase();
  auth = createAuth(env, context.db);
});

const register = (name: string, email: string) =>
  auth.api.signUpEmail({ body: { name, email, password: "una-password-lunga-10" } });

const codeOf = async (action: Promise<unknown>) => {
  try {
    await action;
    return null;
  } catch (error) {
    return (error as { body?: { code?: string } }).body?.code ?? "ERRORE";
  }
};

describe("registrazione", () => {
  it("crea l'account e normalizza il nome", async () => {
    await register("  Iron   Fan ", "a@example.com");
    expect(context.sqlite.prepare("SELECT name FROM user").all()).toEqual([{ name: "Iron Fan" }]);
  });

  it("segnala che l'email è già presente", async () => {
    await register("Iron Fan", "a@example.com");
    expect(await codeOf(register("Altro Nome", "a@example.com"))).toMatch(/USER_ALREADY_EXISTS/);
  });

  it("segnala che il nome da supereroe è già in uso, senza distinguere maiuscole", async () => {
    await register("Iron Fan", "a@example.com");
    expect(await codeOf(register("iron fan", "b@example.com"))).toBe("NAME_TAKEN");
    expect(await codeOf(register("IRON  FAN", "c@example.com"))).toBe("NAME_TAKEN");
    expect(context.sqlite.prepare("SELECT COUNT(*) AS n FROM user").get()).toEqual({ n: 1 });
  });

  it("accetta nomi diversi", async () => {
    await register("Iron Fan", "a@example.com");
    expect(await codeOf(register("Thor Fan", "b@example.com"))).toBeNull();
  });

  it("rifiuta nomi troppo corti", async () => {
    expect(await codeOf(register(" a ", "a@example.com"))).toBe("INVALID_NAME");
  });
});

describe("cambio del nome", () => {
  const signIn = async (email: string) => {
    const response = await auth.api.signInEmail({
      body: { email, password: "una-password-lunga-10" },
      returnHeaders: true,
    });
    return new Headers({
      cookie: response.headers
        .getSetCookie()
        .map((c) => c.split(";")[0])
        .join("; "),
    });
  };

  it("non permette di prendere il nome di un altro utente", async () => {
    await register("Iron Fan", "a@example.com");
    await register("Thor Fan", "b@example.com");
    const headers = await signIn("b@example.com");
    expect(await codeOf(auth.api.updateUser({ body: { name: "iron fan" }, headers }))).toBe(
      "NAME_TAKEN",
    );
  });

  it("permette di cambiare maiuscole del proprio nome e di scegliere un nome libero", async () => {
    await register("Iron Fan", "a@example.com");
    const headers = await signIn("a@example.com");
    expect(await codeOf(auth.api.updateUser({ body: { name: "IRON FAN" }, headers }))).toBeNull();
    expect(await codeOf(auth.api.updateUser({ body: { name: "Hulk Fan" }, headers }))).toBeNull();
    expect(context.sqlite.prepare("SELECT name FROM user").all()).toEqual([{ name: "Hulk Fan" }]);
  });

  it("cambia l'email subito e ignora quella di un altro utente", async () => {
    await register("Iron Fan", "a@example.com");
    await register("Hulk Fan", "b@example.com");
    const headers = await signIn("a@example.com");
    await auth.api.changeEmail({ body: { newEmail: "nuova@example.com" }, headers });
    expect(context.sqlite.prepare("SELECT email FROM user WHERE name = 'Iron Fan'").get()).toEqual({
      email: "nuova@example.com",
    });
    await auth.api.changeEmail({ body: { newEmail: "b@example.com" }, headers });
    expect(context.sqlite.prepare("SELECT email FROM user WHERE name = 'Iron Fan'").get()).toEqual({
      email: "nuova@example.com",
    });
  });
});

describe("regola della password dal database", () => {
  const setPolicy = (value: string) =>
    context.sqlite
      .prepare("UPDATE site_setting SET value = ? WHERE key = 'password_policy'")
      .run(value);
  const withPassword = (password: string) =>
    auth.api.signUpEmail({ body: { name: "Iron Fan", email: "p@example.com", password } });

  it("rifiuta solo le password troppo corte, senza regole di composizione", async () => {
    expect(await codeOf(withPassword("abc1"))).toBe("PASSWORD_TOO_SHORT");
    expect(await codeOf(withPassword("soloLettere"))).toBeNull();
  });

  it("accetta frasi lunghe con spazi e Unicode", async () => {
    expect(
      await codeOf(withPassword("la mia frase è più lunga così ☕ 123 ".repeat(2))),
    ).toBeNull();
  });

  it("segue la riga della tabella senza nuovo deploy", async () => {
    setPolicy('{"minLength":12}');
    expect(await codeOf(withPassword("abcdefgh12"))).toBe("PASSWORD_TOO_SHORT");
    expect(await codeOf(withPassword("soloLettereLunghe"))).toBeNull();
  });

  it("rifiuta le password trapelate", async () => {
    const leaked = "una-password-gia-trapelata";
    const hash = await sha1(leaked);
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async (url: string) =>
          new Response(url.endsWith(hash.slice(0, 5)) ? `${hash.slice(5)}:42\n` : ""),
      ),
    );
    expect(await codeOf(withPassword(leaked))).toBe("PASSWORD_WEAK");
    expect(await codeOf(withPassword("un-altra-password-mai-vista"))).toBeNull();
  });
});

describe("cambio della password", () => {
  const signIn = async (email: string, password: string) => {
    const response = await auth.api.signInEmail({
      body: { email, password },
      returnHeaders: true,
    });
    return new Headers({
      cookie: response.headers
        .getSetCookie()
        .map((c) => c.split(";")[0])
        .join("; "),
    });
  };

  it("chiude le sessioni degli altri dispositivi e lascia aperta quella appena creata", async () => {
    await register("Iron Fan", "a@example.com");
    const first = await signIn("a@example.com", "una-password-lunga-10");
    const second = await signIn("a@example.com", "una-password-lunga-10");
    expect(await auth.api.getSession({ headers: second })).not.toBeNull();

    // The server replaces every session with a fresh one and sends its cookie back.
    const response = await auth.api.changePassword({
      body: {
        currentPassword: "una-password-lunga-10",
        newPassword: "un-altra-password-lunga-11",
        revokeOtherSessions: true,
      },
      headers: first,
      returnHeaders: true,
    });
    const current = new Headers({
      cookie: response.headers
        .getSetCookie()
        .map((c) => c.split(";")[0])
        .join("; "),
    });

    expect(await auth.api.getSession({ headers: current })).not.toBeNull();
    expect(await auth.api.getSession({ headers: second })).toBeNull();
  });
});
