import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import type { AdminCandidate, AdminOverview } from "../../shared/admin";
import type { CatalogCandidate } from "../../shared/catalogCandidate";
import { catalogCandidate } from "../db/schema";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireUser } from "../middleware/requireUser";
import {
  getLastRuns,
  getUserCounts,
  isMaintenanceOn,
  setMaintenance,
} from "../services/siteSettings";
import type { AppEnv } from "../types";

const dismissSchema = z.object({ key: z.string().regex(/^(movie|tv):\d+(:s\d+)?$/) });
const maintenanceSchema = z.object({ enabled: z.boolean() });

export const adminRoutes = new Hono<AppEnv>()
  .use(requireUser)
  .use(requireAdmin)

  .get("/overview", async (c) => {
    const [rows, lastRuns, maintenance, users] = await Promise.all([
      c.var.db
        .select()
        .from(catalogCandidate)
        .where(eq(catalogCandidate.isDismissed, false))
        .orderBy(desc(catalogCandidate.foundAt)),
      getLastRuns(c.var.db),
      isMaintenanceOn(c.var.db),
      getUserCounts(c.var.db),
    ]);
    const candidates = rows.map((row): AdminCandidate => ({
      key: row.key,
      kind: row.kind as CatalogCandidate["kind"],
      tmdbId: row.tmdbId,
      season: row.season,
      title: row.title,
      releaseDate: row.releaseDate,
      foundAt: row.foundAt.toISOString(),
      copiedAt: row.copiedAt?.toISOString() ?? null,
    }));
    const overview: AdminOverview = {
      maintenance,
      tmdbConfigured: Boolean(c.env.TMDB_TOKEN),
      lastRuns,
      users,
      candidates,
    };
    c.header("Cache-Control", "no-store");
    return c.json(overview);
  })

  .post("/maintenance", async (c) => {
    const parsed = maintenanceSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "invalid_body" }, 400);
    await setMaintenance(c.var.db, parsed.data.enabled);
    return c.body(null, 204);
  })

  .post("/candidates/copied", async (c) => {
    const parsed = dismissSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "invalid_body" }, 400);

    await c.var.db
      .update(catalogCandidate)
      .set({ copiedAt: new Date() })
      .where(eq(catalogCandidate.key, parsed.data.key));
    return c.body(null, 204);
  })

  .post("/candidates/dismiss", async (c) => {
    const parsed = dismissSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "invalid_body" }, 400);

    await c.var.db
      .update(catalogCandidate)
      .set({ isDismissed: true })
      .where(eq(catalogCandidate.key, parsed.data.key));
    return c.body(null, 204);
  });
