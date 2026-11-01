import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import type { Env } from "../../worker/env";
import { maintenance } from "../../worker/middleware/maintenance";
import {
  getLastRuns,
  isMaintenanceOn,
  recordRun,
  resetMaintenanceCache,
  setMaintenance,
} from "../../worker/services/siteSettings";
import type { AppEnv } from "../../worker/types";
import { createTestDatabase } from "./support/testDatabase";

let db: ReturnType<typeof createTestDatabase>["db"];

beforeEach(() => {
  db = createTestDatabase().db;
  resetMaintenanceCache();
});

function createApp() {
  const sessions: Record<string, { user: { id: string } }> = {
    admin: { user: { id: "admin-id" } },
    utente: { user: { id: "user-id" } },
  };
  const app = new Hono<AppEnv>();
  app.use(async (c, next) => {
    c.set("db", db);
    c.set("auth", {
      api: {
        getSession: async ({ headers }: { headers: Headers }) =>
          sessions[headers.get("x-session") ?? ""] ?? null,
      },
    } as unknown as AppEnv["Variables"]["auth"]);
    await next();
  });
  app.use(maintenance);
  app.all("*", (c) => c.json({ ok: true }));
  const env = { ADMIN_USER_ID: "admin-id" } as Env;
  const call = (path: string, session?: string) =>
    app.request(path, { headers: session ? { "x-session": session } : {} }, env);
  return { call };
}

describe("modalità manutenzione", () => {
  it("con il sito online lascia passare tutti", async () => {
    await setMaintenance(db, false);
    const { call } = createApp();
    expect((await call("/api/progress")).status).toBe(200);
  });

  it("in manutenzione blocca le API per utenti e anonimi", async () => {
    await setMaintenance(db, true);
    const { call } = createApp();
    const anonymous = await call("/api/titles/i-iron-man");
    expect(anonymous.status).toBe(503);
    expect(anonymous.headers.get("Retry-After")).toBe("3600");
    expect((await call("/api/progress", "utente")).status).toBe(503);
  });

  it("dopo le migrazioni il sito parte in manutenzione", async () => {
    resetMaintenanceCache();
    expect(await isMaintenanceOn(db)).toBe(true);
    const { call } = createApp();
    expect((await call("/api/titles/i-iron-man")).status).toBe(503);
  });

  it("in manutenzione non ci si può registrare né usare altre funzioni di accesso", async () => {
    await setMaintenance(db, true);
    const { call } = createApp();
    expect((await call("/api/auth/sign-up/email")).status).toBe(503);
    expect((await call("/api/auth/delete-user")).status).toBe(503);
    expect((await call("/api/auth/change-password")).status).toBe(503);
  });

  it("in manutenzione restano aperti solo accesso e stato del sito", async () => {
    await setMaintenance(db, true);
    const { call } = createApp();
    expect((await call("/api/auth/sign-in/email")).status).toBe(200);
    expect((await call("/api/auth/get-session")).status).toBe(200);
    expect((await call("/api/auth/sign-out")).status).toBe(200);
    expect((await call("/api/status")).status).toBe(200);
    expect((await call("/api/statusx")).status).toBe(503);
  });

  it("l'amministratore passa sempre", async () => {
    await setMaintenance(db, true);
    const { call } = createApp();
    expect((await call("/api/admin/overview", "admin")).status).toBe(200);
  });

  it("senza ADMIN_USER_ID configurato nessuno passa", async () => {
    await setMaintenance(db, true);
    const app = new Hono<AppEnv>();
    app.use(async (c, next) => {
      c.set("db", db);
      c.set("auth", {
        api: { getSession: async () => ({ user: { id: "" } }) },
      } as unknown as AppEnv["Variables"]["auth"]);
      await next();
    });
    app.use(maintenance);
    app.all("*", (c) => c.json({ ok: true }));
    expect((await app.request("/api/progress", {}, {} as Env)).status).toBe(503);
  });
});

describe("impostazioni del sito", () => {
  it("ricordano l'interruttore e lo rileggono dal database", async () => {
    await setMaintenance(db, true);
    resetMaintenanceCache();
    expect(await isMaintenanceOn(db)).toBe(true);
    await setMaintenance(db, false);
    resetMaintenanceCache();
    expect(await isMaintenanceOn(db)).toBe(false);
  });

  it("registrano l'ultima esecuzione delle attività automatiche", async () => {
    expect(await getLastRuns(db)).toEqual({ daily: null, weekly: null });
    await recordRun(db, "daily", new Date("2026-10-24T03:17:00Z"));
    expect(await getLastRuns(db)).toEqual({
      daily: { at: "2026-10-24T03:17:00.000Z", status: "ok", error: null },
      weekly: null,
    });
  });
});
