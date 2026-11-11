import { eq, sql } from "drizzle-orm";
import type { Database } from "../db/client";
import { rateLimit } from "../db/schema";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_MISSES = 20;

const keyFor = (scope: string, client: string) => `${scope}:${client}`;

export async function isBlocked(
  db: Database,
  scope: string,
  client: string,
  now = Date.now(),
): Promise<boolean> {
  const [row] = await db
    .select({ count: rateLimit.count, lastRequest: rateLimit.lastRequest })
    .from(rateLimit)
    .where(eq(rateLimit.key, keyFor(scope, client)));
  return Boolean(row) && now - row.lastRequest < WINDOW_MS && row.count >= MAX_MISSES;
}

// One statement, so parallel misses never lose a count: the counter restarts after a quiet window.
export async function recordMiss(
  db: Database,
  scope: string,
  client: string,
  now = Date.now(),
): Promise<void> {
  const key = keyFor(scope, client);
  await db
    .insert(rateLimit)
    .values({ id: key, key, count: 1, lastRequest: now })
    .onConflictDoUpdate({
      target: rateLimit.key,
      set: {
        count: sql`CASE WHEN ${now} - ${rateLimit.lastRequest} < ${WINDOW_MS} THEN ${rateLimit.count} + 1 ELSE 1 END`,
        lastRequest: now,
      },
    });
}
