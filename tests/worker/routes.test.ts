import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import type { Env } from "../../worker/env";
import { sameOrigin } from "../../worker/middleware/sameOrigin";
import { progressRoutes } from "../../worker/routes/progress";
import type { AppEnv } from "../../worker/types";
import { createTestDatabase } from "./support/testDatabase";

let context: ReturnType<typeof createTestDatabase>;

beforeEach(() => {
  context = createTestDatabase();
  const at = Date.now();
  context.sqlite.exec(
    `INSERT INTO user (id, name, email, email_verified, created_at, updated_at)
     VALUES ('u1', 'Iron Fan', 'a@example.com', 0, ${at}, ${at})`,
  );
});

function createApp() {
  const app = new Hono<AppEnv>();
  app.use(async (c, next) => {
    c.set("db", context.db);
    c.set(
      "auth",
      () =>
        ({
          api: { getSession: async () => ({ user: { id: "u1" } }) },
        }) as unknown as ReturnType<AppEnv["Variables"]["auth"]>,
    );
    await next();
  });
  app.use(sameOrigin);
  app.route("/api/progress", progressRoutes);
  const post = (body: unknown, headers: Record<string, string> = {}) =>
    app.request(
      "http://site.test/api/progress",
      {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify(body),
      },
      {} as Env,
    );
  return { app, post };
}

const storedIds = () =>
  context.sqlite
    .prepare("SELECT title_id FROM watched_title ORDER BY title_id")
    .all()
    .map((row) => row.title_id);

describe("progressi: identificatori ammessi", () => {
  it("accetta i titoli del catalogo", async () => {
    const { post } = createApp();
    expect((await post({ titleIds: ["i-iron-man", "i-thor"] })).status).toBe(204);
    expect(storedIds()).toEqual(["i-iron-man", "i-thor"]);
  });

  it("rifiuta identificatori inventati senza salvare nulla", async () => {
    const { post } = createApp();
    expect((await post({ titleIds: ["i-iron-man", "i-inventato"] })).status).toBe(400);
    expect(storedIds()).toEqual([]);
  });

  it("rifiuta corpi non validi", async () => {
    const { post } = createApp();
    expect((await post({ titleIds: [] })).status).toBe(400);
    expect((await post({ altro: 1 })).status).toBe(400);
  });
});

describe("richieste da altri siti", () => {
  it("blocca le scritture con Origin diverso", async () => {
    const { post } = createApp();
    const response = await post({ titleIds: ["i-iron-man"] }, { origin: "https://evil.example" });
    expect(response.status).toBe(403);
    expect(storedIds()).toEqual([]);
  });

  it("blocca le scritture segnalate come cross-site", async () => {
    const { post } = createApp();
    const response = await post({ titleIds: ["i-iron-man"] }, { "sec-fetch-site": "cross-site" });
    expect(response.status).toBe(403);
  });

  it("accetta le scritture dello stesso sito", async () => {
    const { post } = createApp();
    const response = await post(
      { titleIds: ["i-iron-man"] },
      { origin: "http://site.test", "sec-fetch-site": "same-origin" },
    );
    expect(response.status).toBe(204);
  });

  it("non limita le letture", async () => {
    const { app } = createApp();
    const response = await app.request(
      "http://site.test/api/progress",
      { headers: { origin: "https://evil.example" } },
      {} as Env,
    );
    expect(response.status).toBe(200);
  });
});
