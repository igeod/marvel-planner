import { Hono } from "hono";
import { suggestionSchema } from "../../shared/suggestions";
import { TMDB_REFS } from "../../shared/tmdbRefs";
import { requireUser } from "../middleware/requireUser";
import { addSuggestion } from "../services/suggestions";
import type { AppEnv } from "../types";

export const suggestionRoutes = new Hono<AppEnv>().use(requireUser).post("/", async (c) => {
  const parsed = suggestionSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success || !Object.hasOwn(TMDB_REFS, parsed.data.titleId)) {
    return c.json({ error: "invalid_body" }, 400);
  }
  const result = await addSuggestion(c.var.db, c.var.user.id, parsed.data);
  if (result === "limit") return c.json({ error: "too_many" }, 429);
  return c.body(null, 204);
});
