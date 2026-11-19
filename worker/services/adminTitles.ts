import { and, eq, inArray } from "drizzle-orm";
import {
  REVIEW_TOPICS,
  type AdminRelease,
  type AdminReview,
  type ReviewTopic,
} from "../../shared/admin";
import type { Database } from "../db/client";
import { titleRelease, titleReleaseOverride, titleReview } from "../db/schema";

// The three contents an admin can mark "checked, nothing to add" (the guide is reviewed, not "none").
const VERIFIABLE: ReviewTopic[] = ["postCredits", "keyScenes", "easterEggs"];

export async function getAdminTitleData(
  db: Database,
): Promise<{ releases: AdminRelease[]; reviews: AdminReview[] }> {
  const [dates, overrides, reviews] = await Promise.all([
    db.select().from(titleRelease),
    db.select().from(titleReleaseOverride),
    db.select().from(titleReview),
  ]);
  const byTitle = new Map<string, AdminRelease>();
  for (const row of dates) {
    byTitle.set(row.titleId, {
      titleId: row.titleId,
      tmdbDate: row.releaseDate,
      manualDate: null,
      tmdbDateAtOverride: null,
    });
  }
  for (const row of overrides) {
    byTitle.set(row.titleId, {
      titleId: row.titleId,
      tmdbDate: byTitle.get(row.titleId)?.tmdbDate ?? null,
      manualDate: row.releaseDate,
      tmdbDateAtOverride: row.tmdbDateAtOverride,
    });
  }
  return {
    releases: [...byTitle.values()],
    reviews: reviews
      .filter((row): row is typeof row & { topic: ReviewTopic } =>
        (REVIEW_TOPICS as readonly string[]).includes(row.topic),
      )
      .map((row) => ({ titleId: row.titleId, topic: row.topic })),
  };
}

async function tmdbDateOf(db: Database, titleId: string): Promise<string | null> {
  const [row] = await db.select().from(titleRelease).where(eq(titleRelease.titleId, titleId));
  return row?.releaseDate ?? null;
}

// The checked contents of a title become exactly this set (the unchecked ones are taken away).
export async function setVerified(db: Database, titleId: string, topics: ReviewTopic[]) {
  const wanted = topics.filter((topic) => VERIFIABLE.includes(topic));
  await db
    .delete(titleReview)
    .where(and(eq(titleReview.titleId, titleId), inArray(titleReview.topic, VERIFIABLE)));
  if (wanted.length === 0) return;
  const checkedAt = new Date();
  await db.insert(titleReview).values(wanted.map((topic) => ({ titleId, topic, checkedAt })));
}

export async function markGuideReviewed(db: Database, titleId: string) {
  await db
    .insert(titleReview)
    .values({ titleId, topic: "guide", checkedAt: new Date() })
    .onConflictDoNothing();
}

export async function setReleaseOverride(db: Database, titleId: string, releaseDate: string) {
  const values = {
    releaseDate,
    tmdbDateAtOverride: await tmdbDateOf(db, titleId),
    setAt: new Date(),
  };
  await db
    .insert(titleReleaseOverride)
    .values({ titleId, ...values })
    .onConflictDoUpdate({ target: titleReleaseOverride.titleId, set: values });
}

// Takes the hand-written date away; returns what it was, so the page can offer to put it back.
export async function clearReleaseOverride(db: Database, titleId: string) {
  const [row] = await db
    .select()
    .from(titleReleaseOverride)
    .where(eq(titleReleaseOverride.titleId, titleId));
  await db.delete(titleReleaseOverride).where(eq(titleReleaseOverride.titleId, titleId));
  return { tmdbDate: await tmdbDateOf(db, titleId), previous: row?.releaseDate ?? null };
}

// Keeps the hand-written date and accepts what TMDB says now as the new reference.
export async function keepReleaseOverride(db: Database, titleId: string) {
  await db
    .update(titleReleaseOverride)
    .set({ tmdbDateAtOverride: await tmdbDateOf(db, titleId) })
    .where(eq(titleReleaseOverride.titleId, titleId));
}
