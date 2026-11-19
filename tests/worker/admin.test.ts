import type { AdminOverview } from "../../shared/admin";
import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import { adminRoutes } from "../../worker/routes/admin";
import { getReleases } from "../../worker/services/releases";
import { catalogCandidate, siteSetting, titleRelease, user } from "../../worker/db/schema";
import type { Env } from "../../worker/env";
import {
  describeError,
  getLastRuns,
  getUserCounts,
  recordDeletedAccount,
  recordRun,
} from "../../worker/services/siteSettings";
import type { AppEnv } from "../../worker/types";
import { createTestDatabase } from "./support/testDatabase";

let db: ReturnType<typeof createTestDatabase>["db"];

beforeEach(() => {
  db = createTestDatabase().db;
});

function createApp() {
  const sessions: Record<string, { user: { id: string } }> = {
    admin: { user: { id: "admin-id" } },
    utente: { user: { id: "user-id" } },
  };
  const app = new Hono<AppEnv>();
  app.use(async (c, next) => {
    c.set("db", db);
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
  app.route("/admin", adminRoutes);
  const env = { ADMIN_USER_ID: "admin-id" } as Env;
  return (path: string, session?: string, body?: unknown, method?: string) =>
    app.request(
      path,
      {
        method: method ?? (body === undefined ? "GET" : "POST"),
        headers: {
          ...(session ? { "x-session": session } : {}),
          "content-type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      },
      env,
    );
}

describe("esito delle attività automatiche", () => {
  it("registra stato ed errore, senza stack né parametri degli URL", async () => {
    await recordRun(db, "daily", new Date("2026-10-24T03:17:00Z"));
    await recordRun(
      db,
      "weekly",
      new Date("2026-10-26T04:43:00Z"),
      new Error("TMDB 500 su https://api.themoviedb.org/3/x?api_key=segreto"),
    );
    const runs = await getLastRuns(db);
    expect(runs.daily).toEqual({ at: "2026-10-24T03:17:00.000Z", status: "ok", error: null });
    expect(runs.weekly?.status).toBe("error");
    expect(runs.weekly?.error).toBe("TMDB 500 su https://api.themoviedb.org/3/x");
  });

  it("tronca i messaggi lunghi a 200 caratteri", () => {
    expect(describeError(new Error("x".repeat(500)))).toHaveLength(200);
  });

  it("legge anche il vecchio formato, una data ISO", async () => {
    await db.insert(siteSetting).values({
      key: "lastRun:daily",
      value: "2026-10-24T03:17:00.000Z",
      updatedAt: new Date(),
    });
    expect((await getLastRuns(db)).daily).toEqual({
      at: "2026-10-24T03:17:00.000Z",
      status: "ok",
      error: null,
    });
  });
});

describe("conteggi degli iscritti", () => {
  it("conta totale e nuovi della settimana, e gli account eliminati dal primo conteggio", async () => {
    const now = new Date("2026-10-30T12:00:00Z");
    await db.insert(user).values([
      { id: "a", name: "Alfa", email: "a@x.it", createdAt: new Date("2026-10-01T00:00:00Z") },
      { id: "b", name: "Beta", email: "b@x.it", createdAt: new Date("2026-10-28T00:00:00Z") },
    ]);
    expect(await getUserCounts(db, now)).toMatchObject({ total: 2, newLastWeek: 1, deleted: 0 });

    await recordDeletedAccount(db, now);
    await recordDeletedAccount(db, new Date("2026-10-31T00:00:00Z"));
    expect(await getUserCounts(db, now)).toMatchObject({
      deleted: 2,
      deletedSince: "2026-10-30T12:00:00.000Z",
    });
  });
});

describe("rotte dell'amministratore", () => {
  const key = "movie:123";

  beforeEach(async () => {
    await db.insert(catalogCandidate).values({
      key,
      kind: "movie",
      tmdbId: 123,
      title: "Nuovo film",
      foundAt: new Date("2026-10-20T00:00:00Z"),
    });
  });

  it("l'overview include date, copiato, iscritti e nuovo formato dei job", async () => {
    const call = createApp();
    const body = (await (await call("/admin/overview", "admin")).json()) as AdminOverview;
    expect(body.candidates[0]).toMatchObject({
      key,
      foundAt: "2026-10-20T00:00:00.000Z",
      copiedAt: null,
    });
    expect(body.lastRuns).toEqual({ daily: null, weekly: null });
    expect(body.users).toMatchObject({ total: 0, deleted: 0 });
  });

  it("segna un candidato come copiato", async () => {
    const call = createApp();
    expect((await call("/admin/candidates/copied", "admin", { key })).status).toBe(204);
    const body = (await (await call("/admin/overview", "admin")).json()) as AdminOverview;
    expect(body.candidates[0].copiedAt).not.toBeNull();
  });

  it("rifiuta chiavi non valide e chi non è amministratore", async () => {
    const call = createApp();
    expect((await call("/admin/candidates/copied", "admin", { key: "x" })).status).toBe(400);
    expect((await call("/admin/candidates/copied", "utente", { key })).status).not.toBe(204);
    expect((await call("/admin/candidates/copied", undefined, { key })).status).not.toBe(204);
  });
});

describe("date e controlli dei titoli", () => {
  const id = "i-iron-man";

  it("la data scritta a mano vince su quella di TMDB e si può togliere", async () => {
    const call = createApp();
    await db
      .insert(titleRelease)
      .values({ titleId: id, releaseDate: "2008-05-02", checkedAt: new Date() });
    expect(
      (await call(`/admin/titles/${id}/release-date`, "admin", { date: "2008-05-09" }, "PUT"))
        .status,
    ).toBe(204);
    expect((await getReleases(db))[id]).toBe("2008-05-09");

    const removed = await call(`/admin/titles/${id}/release-date`, "admin", undefined, "DELETE");
    expect(await removed.json()).toEqual({ tmdbDate: "2008-05-02", previous: "2008-05-09" });
    expect((await getReleases(db))[id]).toBe("2008-05-02");
  });

  it("segnala quando TMDB cambia la data dopo la correzione, e si può tenere la propria", async () => {
    const call = createApp();
    await db
      .insert(titleRelease)
      .values({ titleId: id, releaseDate: "2008-05-02", checkedAt: new Date() });
    await call(`/admin/titles/${id}/release-date`, "admin", { date: "2008-05-09" }, "PUT");
    await db.update(titleRelease).set({ releaseDate: "2008-06-01" });

    let overview = (await (await call("/admin/overview", "admin")).json()) as AdminOverview;
    expect(overview.releases.find((row) => row.titleId === id)).toEqual({
      titleId: id,
      tmdbDate: "2008-06-01",
      manualDate: "2008-05-09",
      tmdbDateAtOverride: "2008-05-02",
    });

    await call(`/admin/titles/${id}/release-date/keep`, "admin", {});
    overview = (await (await call("/admin/overview", "admin")).json()) as AdminOverview;
    expect(overview.releases.find((row) => row.titleId === id)?.tmdbDateAtOverride).toBe(
      "2008-06-01",
    );
  });

  it("rifiuta date non valide, titoli sconosciuti e chi non è amministratore", async () => {
    const call = createApp();
    for (const date of ["2026-13-40", "20/10/2026", "2026-02-30", ""]) {
      expect(
        (await call(`/admin/titles/${id}/release-date`, "admin", { date }, "PUT")).status,
      ).toBe(400);
    }
    expect((await call("/admin/titles/i-inventato/guide-reviewed", "admin", {})).status).toBe(404);
    expect((await call(`/admin/titles/${id}/guide-reviewed`, "utente", {})).status).toBe(403);
  });

  it("i controlli: l'insieme sostituisce i precedenti e la guida si segna una volta", async () => {
    const call = createApp();
    await call(
      `/admin/titles/${id}/verified`,
      "admin",
      { topics: ["postCredits", "keyScenes"] },
      "PUT",
    );
    await call(`/admin/titles/${id}/verified`, "admin", { topics: ["keyScenes"] }, "PUT");
    await call(`/admin/titles/${id}/guide-reviewed`, "admin", {});
    await call(`/admin/titles/${id}/guide-reviewed`, "admin", {});
    const overview = (await (await call("/admin/overview", "admin")).json()) as AdminOverview;
    expect(overview.reviews.map((row) => row.topic).sort()).toEqual(["guide", "keyScenes"]);
  });
});
