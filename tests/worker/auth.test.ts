import { beforeEach, describe, expect, it } from "vitest";
import { createAuth } from "../../worker/auth";
import type { Env } from "../../worker/env";
import { createTestDatabase } from "./support/testDatabase";

const env = {
  BETTER_AUTH_URL: "http://localhost:5173",
  BETTER_AUTH_SECRET: "un-segreto-di-prova-lungo-almeno-trentadue-caratteri",
} as Env;

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
