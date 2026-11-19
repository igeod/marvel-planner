import { and, count, desc, eq, gte, inArray } from "drizzle-orm";
import type { AdminSuggestion } from "../../shared/admin";
import {
  SUGGESTIONS_PER_HOUR,
  type SuggestionInput,
  type SuggestionSection,
} from "../../shared/suggestions";
import type { Database } from "../db/client";
import { suggestion, user } from "../db/schema";

const HOUR_MS = 60 * 60 * 1000;

// Adds a suggestion unless this account has sent too many in the last hour.
export async function addSuggestion(
  db: Database,
  userId: string,
  input: SuggestionInput,
  now = new Date(),
): Promise<"added" | "limit"> {
  const [recent] = await db
    .select({ total: count() })
    .from(suggestion)
    .where(
      and(
        eq(suggestion.userId, userId),
        gte(suggestion.createdAt, new Date(now.getTime() - HOUR_MS)),
      ),
    );
  if (recent.total >= SUGGESTIONS_PER_HOUR) return "limit";

  await db.insert(suggestion).values({
    id: crypto.randomUUID(),
    userId,
    titleId: input.titleId,
    section: input.section,
    item: input.item || null,
    text: input.text,
    createdAt: now,
  });
  return "added";
}

// The new and the done ones, newest first; the discarded are gone from the page.
export async function listAdminSuggestions(db: Database): Promise<AdminSuggestion[]> {
  const rows = await db
    .select({
      id: suggestion.id,
      titleId: suggestion.titleId,
      section: suggestion.section,
      item: suggestion.item,
      text: suggestion.text,
      status: suggestion.status,
      createdAt: suggestion.createdAt,
      resolvedAt: suggestion.resolvedAt,
      authorName: user.name,
    })
    .from(suggestion)
    .innerJoin(user, eq(user.id, suggestion.userId))
    .where(inArray(suggestion.status, ["new", "done"]))
    .orderBy(desc(suggestion.createdAt));
  return rows.map((row) => ({
    id: row.id,
    titleId: row.titleId,
    section: row.section as SuggestionSection,
    item: row.item,
    text: row.text,
    isDone: row.status === "done",
    authorName: row.authorName,
    createdAt: row.createdAt.toISOString(),
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
  }));
}

export async function resolveSuggestion(db: Database, id: string, status: "done" | "discarded") {
  await db.update(suggestion).set({ status, resolvedAt: new Date() }).where(eq(suggestion.id, id));
}
