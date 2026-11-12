import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { preferencesSchema } from "../../shared/preferences";
import { userPreference } from "../db/schema";
import { requireUser } from "../middleware/requireUser";
import type { AppEnv } from "../types";

export const preferencesRoutes = new Hono<AppEnv>()
  .use(requireUser)

  // null until the account has saved something, so the client keeps what the device already has.
  .get("/", async (c) => {
    const [row] = await c.var.db
      .select({ data: userPreference.data })
      .from(userPreference)
      .where(eq(userPreference.userId, c.var.user.id));
    const parsed = row ? preferencesSchema.safeParse(JSON.parse(row.data)) : null;
    return c.json({ preferences: parsed?.success ? parsed.data : null });
  })

  .put("/", async (c) => {
    const parsed = preferencesSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "invalid_body" }, 400);

    const values = { data: JSON.stringify(parsed.data), updatedAt: new Date() };
    await c.var.db
      .insert(userPreference)
      .values({ userId: c.var.user.id, ...values })
      .onConflictDoUpdate({ target: userPreference.userId, set: values });
    return c.body(null, 204);
  });
