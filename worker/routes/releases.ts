import { Hono } from "hono";
import { getReleases } from "../services/releases";
import type { AppEnv } from "../types";

const BROWSER_CACHE_SECONDS = 60 * 60;

export const releaseRoutes = new Hono<AppEnv>().get("/", async (c) => {
  c.header("Cache-Control", `public, max-age=${BROWSER_CACHE_SECONDS}`);
  return c.json({ releases: await getReleases(c.var.db) });
});
