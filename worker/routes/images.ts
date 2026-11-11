import { Hono } from "hono";
import { UPSTREAM_TIMEOUT_MS } from "../services/upstream";
import type { AppEnv } from "../types";

const IMAGE_ORIGIN = "https://image.tmdb.org/t/p";
const ALLOWED_SIZES = new Set(["w154", "w342", "w780"]);
const FILE_PATTERN = /^[A-Za-z0-9_-]{10,60}\.(jpg|png)$/;
const CACHE_SECONDS = 60 * 60 * 24 * 30;

export const imageRoutes = new Hono<AppEnv>().get("/:size/:file", async (c) => {
  const { size, file } = c.req.param();
  if (!ALLOWED_SIZES.has(size) || !FILE_PATTERN.test(file)) {
    return c.json({ error: "not_found" }, 404);
  }

  const upstream = await fetch(`${IMAGE_ORIGIN}/${size}/${file}`, {
    cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!upstream.ok || !upstream.headers.get("content-type")?.startsWith("image/")) {
    return c.json({ error: "not_found" }, 404);
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
    },
  });
});
