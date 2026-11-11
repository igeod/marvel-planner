import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { TMDB_REFS } from "../../shared/tmdbRefs";
import { watchedTitle } from "../db/schema";
import { requireUser } from "../middleware/requireUser";
import type { AppEnv } from "../types";

const MAX_TITLES_PER_REQUEST = 500;
export const ROWS_PER_INSERT = 30;

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

const titleIdSchema = z.string().refine((id) => Object.hasOwn(TMDB_REFS, id));
const addTitlesSchema = z.object({
  titleIds: z.array(titleIdSchema).min(1).max(MAX_TITLES_PER_REQUEST),
});

export const progressRoutes = new Hono<AppEnv>()
  .use(requireUser)

  .get("/", async (c) => {
    const rows = await c.var.db
      .select({ titleId: watchedTitle.titleId })
      .from(watchedTitle)
      .where(eq(watchedTitle.userId, c.var.user.id));
    return c.json({ titleIds: rows.map((row) => row.titleId) });
  })

  .post("/", async (c) => {
    const parsed = addTitlesSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "invalid_body" }, 400);

    const rows = [...new Set(parsed.data.titleIds)].map((titleId) => ({
      userId: c.var.user.id,
      titleId,
    }));
    const [first, ...rest] = chunk(rows, ROWS_PER_INSERT).map((part) =>
      c.var.db.insert(watchedTitle).values(part).onConflictDoNothing(),
    );
    await c.var.db.batch([first, ...rest]);
    return c.body(null, 204);
  })

  .delete("/:titleId", async (c) => {
    const parsed = titleIdSchema.safeParse(c.req.param("titleId"));
    if (!parsed.success) return c.json({ error: "invalid_title" }, 400);

    await c.var.db
      .delete(watchedTitle)
      .where(and(eq(watchedTitle.userId, c.var.user.id), eq(watchedTitle.titleId, parsed.data)));
    return c.body(null, 204);
  })

  .delete("/", async (c) => {
    await c.var.db.delete(watchedTitle).where(eq(watchedTitle.userId, c.var.user.id));
    return c.body(null, 204);
  });
