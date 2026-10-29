import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createDb } from "./db/client";
import type { Env } from "./env";
import { withContext } from "./middleware/context";
import { maintenance } from "./middleware/maintenance";
import { securityHeaders } from "./middleware/securityHeaders";
import { sameOrigin } from "./middleware/sameOrigin";
import { accountRoutes } from "./routes/account";
import { adminRoutes } from "./routes/admin";
import { imageRoutes } from "./routes/images";
import { progressRoutes } from "./routes/progress";
import { releaseRoutes } from "./routes/releases";
import { seoRoutes } from "./routes/seo";
import { shareRoutes, sharedRoutes } from "./routes/share";
import { statusRoutes } from "./routes/status";
import { titleRoutes } from "./routes/titles";
import { runDiscovery } from "./services/discovery";
import { purgeExpiredData } from "./services/maintenance";
import { refreshReleases } from "./services/releases";
import { recordRun } from "./services/siteSettings";
import type { AppEnv } from "./types";

const SCHEDULED_REFRESH_LIMIT = 30;
const WEEKLY_DISCOVERY_CRON = "43 4 * * 1";

const api = new Hono<AppEnv>()
  .use(sameOrigin)
  .use(withContext)
  .use(maintenance)
  .on(["GET", "POST"], "/auth/*", (c) => c.var.auth.handler(c.req.raw))
  .route("/account", accountRoutes)
  .route("/admin", adminRoutes)
  .route("/images", imageRoutes)
  .route("/progress", progressRoutes)
  .route("/releases", releaseRoutes)
  .route("/share", shareRoutes)
  .route("/shared", sharedRoutes)
  .route("/status", statusRoutes)
  .route("/titles", titleRoutes)
  .all("*", (c) => c.json({ error: "not_found" }, 404));

const app = new Hono<AppEnv>()
  .use(securityHeaders)
  .route("/api", api)
  .route("/", seoRoutes)
  .all("*", async (c) => {
    const asset = await c.env.ASSETS.fetch(c.req.raw);
    return new Response(asset.body, asset);
  });

app.onError((error, c) => {
  if (error instanceof HTTPException) return error.getResponse();
  console.error(error);
  return c.json({ error: "internal_error" }, 500);
});

async function runScheduledTasks(env: Env, cron: string) {
  const db = createDb(env.DB);
  if (cron === WEEKLY_DISCOVERY_CRON) {
    if (env.TMDB_TOKEN) await runDiscovery(db, env.TMDB_TOKEN);
    await recordRun(db, "weekly");
    return;
  }
  await purgeExpiredData(db);
  if (env.TMDB_TOKEN) await refreshReleases(db, env.TMDB_TOKEN, SCHEDULED_REFRESH_LIMIT);
  await recordRun(db, "daily");
}

export default {
  fetch: app.fetch,
  scheduled: (event, env, ctx) => {
    ctx.waitUntil(runScheduledTasks(env, event.cron));
  },
} satisfies ExportedHandler<Env>;
