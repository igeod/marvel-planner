import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { session, shareLink, userPreference, watchedTitle } from "../db/schema";
import { requireUser } from "../middleware/requireUser";
import type { AppEnv } from "../types";

export const accountRoutes = new Hono<AppEnv>()
  .use(requireUser)

  .get("/export", async (c) => {
    const { user, db } = { user: c.var.user, db: c.var.db };

    const [progress, sessions, shares, preferences] = await Promise.all([
      db
        .select({ titleId: watchedTitle.titleId, watchedAt: watchedTitle.watchedAt })
        .from(watchedTitle)
        .where(eq(watchedTitle.userId, user.id)),
      db
        .select({
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
        })
        .from(session)
        .where(eq(session.userId, user.id)),
      db
        .select({ createdAt: shareLink.createdAt, expiresAt: shareLink.expiresAt })
        .from(shareLink)
        .where(eq(shareLink.userId, user.id)),
      db
        .select({ data: userPreference.data })
        .from(userPreference)
        .where(eq(userPreference.userId, user.id)),
    ]);

    c.header("Content-Disposition", 'attachment; filename="marvel-planner-data.json"');
    c.header("Cache-Control", "no-store");
    return c.json({
      exportedAt: new Date().toISOString(),
      account: {
        id: user.id,
        superheroName: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      watchedTitles: progress,
      preferences: preferences[0] ? JSON.parse(preferences[0].data) : null,
      sessions,
      shareLink: shares[0] ?? null,
    });
  });
