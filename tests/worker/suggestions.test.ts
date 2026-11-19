import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import type { AdminOverview } from "../../shared/admin";
import { adminRoutes } from "../../worker/routes/admin";
import { suggestionRoutes } from "../../worker/routes/suggestions";
import type { Env } from "../../worker/env";
import type { AppEnv } from "../../worker/types";
import { createTestDatabase } from "./support/testDatabase";

let context: ReturnType<typeof createTestDatabase>;

beforeEach(() => {
  context = createTestDatabase();
  const at = Date.now();
  context.sqlite.exec(`
    INSERT INTO user (id, name, email, email_verified, created_at, updated_at)
    VALUES ('admin-id', 'Capo', 'c@example.com', 0, ${at}, ${at}),
           ('user-id', 'Lettore', 'l@example.com', 0, ${at}, ${at});
  `);
});

function createApp() {
  const sessions: Record<string, { user: { id: string; name: string } }> = {
    admin: { user: { id: "admin-id", name: "Capo" } },
    utente: { user: { id: "user-id", name: "Lettore" } },
  };
  const app = new Hono<AppEnv>();
  app.use(async (c, next) => {
    c.set("db", context.db);
    c.set(
      "auth",
      () =>
        ({
          api: {
            getSession: async ({ headers }: { headers: Headers }) =>
              sessions[headers.get("x-session") ?? ""] ?? null,
          },
        }) as unknown as ReturnType<AppEnv["Variables"]["auth"]>,
    );
    await next();
  });
  app.route("/suggestions", suggestionRoutes);
  app.route("/admin", adminRoutes);
  const env = { ADMIN_USER_ID: "admin-id" } as Env;
  return (path: string, session?: string, body?: unknown) =>
    app.request(
      path,
      {
        method: body === undefined ? "GET" : "POST",
        headers: {
          ...(session ? { "x-session": session } : {}),
          "content-type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      },
      env,
    );
}

const valid = {
  titleId: "i-iron-man",
  section: "keyScenes",
  item: "Una scena",
  text: "Manca un dettaglio.",
};

describe("suggerimenti di modifica", () => {
  it("un ospite non può inviare", async () => {
    const call = createApp();
    expect((await call("/suggestions", undefined, valid)).status).toBe(401);
  });

  it("rifiuta testo vuoto o troppo lungo, sezione e titolo sconosciuti", async () => {
    const call = createApp();
    const bad = [
      { ...valid, text: "   " },
      { ...valid, text: "x".repeat(501) },
      { ...valid, section: "plot" },
      { ...valid, titleId: "i-inventato" },
      { ...valid, item: "x".repeat(301) },
    ];
    for (const body of bad) expect((await call("/suggestions", "utente", body)).status).toBe(400);
  });

  it("accetta fino a 5 all'ora per account, poi 429", async () => {
    const call = createApp();
    for (let sent = 0; sent < 5; sent++) {
      expect((await call("/suggestions", "utente", valid)).status).toBe(204);
    }
    expect((await call("/suggestions", "utente", valid)).status).toBe(429);
    // Another account is not affected.
    expect((await call("/suggestions", "admin", valid)).status).toBe(204);
  });

  it("l'amministratore li vede con l'autore, li segna fatti o li scarta", async () => {
    const call = createApp();
    await call("/suggestions", "utente", valid);
    await call("/suggestions", "utente", { ...valid, text: "Un altro." });
    const overview = async () =>
      (await (await call("/admin/overview", "admin")).json()) as AdminOverview;

    const first = await overview();
    expect(first.suggestions).toHaveLength(2);
    expect(first.suggestions[0]).toMatchObject({
      authorName: "Lettore",
      isDone: false,
      section: "keyScenes",
    });

    const [a, b] = first.suggestions;
    expect((await call(`/admin/suggestions/${a.id}/done`, "admin", {})).status).toBe(204);
    expect((await call(`/admin/suggestions/${b.id}/discard`, "admin", {})).status).toBe(204);
    const after = await overview();
    expect(after.suggestions).toHaveLength(1);
    expect(after.suggestions[0]).toMatchObject({ id: a.id, isDone: true });
  });

  it("solo l'amministratore le gestisce, e l'id deve essere valido", async () => {
    const call = createApp();
    expect((await call("/admin/suggestions/x/done", "utente", {})).status).toBe(403);
    expect((await call("/admin/suggestions/non-un-id/done", "admin", {})).status).toBe(400);
  });
});
