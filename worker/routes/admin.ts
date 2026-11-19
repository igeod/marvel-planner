import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { REVIEW_TOPICS, type AdminCandidate, type AdminOverview } from "../../shared/admin";
import type { CatalogCandidate } from "../../shared/catalogCandidate";
import { isRealIsoDate } from "../../shared/isoDate";
import { TMDB_REFS } from "../../shared/tmdbRefs";
import { catalogCandidate } from "../db/schema";
import { listAdminSuggestions, resolveSuggestion } from "../services/suggestions";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireUser } from "../middleware/requireUser";
import {
  clearReleaseOverride,
  getAdminTitleData,
  keepReleaseOverride,
  markGuideReviewed,
  setReleaseOverride,
  setVerified,
} from "../services/adminTitles";
import {
  getLastRuns,
  getUserCounts,
  isMaintenanceOn,
  setMaintenance,
} from "../services/siteSettings";
import type { AppEnv } from "../types";

const dismissSchema = z.object({ key: z.string().regex(/^(movie|tv):\d+(:s\d+)?$/) });
const maintenanceSchema = z.object({ enabled: z.boolean() });
const verifiedSchema = z.object({
  topics: z.array(z.enum(REVIEW_TOPICS)).max(REVIEW_TOPICS.length),
});
const dateSchema = z.object({ date: z.string().refine(isRealIsoDate) });
const suggestionIdSchema = z.string().uuid();
const isKnownTitle = (id: string) => Object.hasOwn(TMDB_REFS, id);

export const adminRoutes = new Hono<AppEnv>()
  .use(requireUser)
  .use(requireAdmin)

  .get("/overview", async (c) => {
    const [rows, lastRuns, maintenance, users, titleData, suggestions] = await Promise.all([
      c.var.db
        .select()
        .from(catalogCandidate)
        .where(eq(catalogCandidate.isDismissed, false))
        .orderBy(desc(catalogCandidate.foundAt)),
      getLastRuns(c.var.db),
      isMaintenanceOn(c.var.db),
      getUserCounts(c.var.db),
      getAdminTitleData(c.var.db),
      listAdminSuggestions(c.var.db),
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
      ...titleData,
      suggestions,
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

  // A title known to the catalog: the id in the path is checked before anything is written.
  .use("/titles/:id/*", async (c, next) => {
    if (!isKnownTitle(c.req.param("id"))) return c.json({ error: "unknown_title" }, 404);
    await next();
  })

  .put("/titles/:id/verified", async (c) => {
    const parsed = verifiedSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "invalid_body" }, 400);
    await setVerified(c.var.db, c.req.param("id"), parsed.data.topics);
    return c.body(null, 204);
  })

  .post("/titles/:id/guide-reviewed", async (c) => {
    await markGuideReviewed(c.var.db, c.req.param("id"));
    return c.body(null, 204);
  })

  .put("/titles/:id/release-date", async (c) => {
    const parsed = dateSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "invalid_body" }, 400);
    await setReleaseOverride(c.var.db, c.req.param("id"), parsed.data.date);
    return c.body(null, 204);
  })

  .delete("/titles/:id/release-date", async (c) =>
    c.json(await clearReleaseOverride(c.var.db, c.req.param("id"))),
  )

  .post("/titles/:id/release-date/keep", async (c) => {
    await keepReleaseOverride(c.var.db, c.req.param("id"));
    return c.body(null, 204);
  })

  .post("/suggestions/:id/:action", async (c) => {
    const id = suggestionIdSchema.safeParse(c.req.param("id"));
    const action = c.req.param("action");
    if (!id.success || (action !== "done" && action !== "discard")) {
      return c.json({ error: "invalid_body" }, 400);
    }
    await resolveSuggestion(c.var.db, id.data, action === "done" ? "done" : "discarded");
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
