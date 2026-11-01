import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const watchedTitle = sqliteTable(
  "watched_title",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    titleId: text("title_id").notNull(),
    watchedAt: integer("watched_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.userId, table.titleId] })],
);

export const shareLink = sqliteTable("share_link", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
});

export const titleDetailsCache = sqliteTable(
  "title_details_cache",
  {
    titleId: text("title_id").notNull(),
    language: text("language").notNull(),
    data: text("data").notNull(),
    fetchedAt: integer("fetched_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.titleId, table.language] })],
);

export const titleWatchCache = sqliteTable("title_watch_cache", {
  titleId: text("title_id").primaryKey(),
  data: text("data").notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp_ms" }).notNull(),
});

export const titleRelease = sqliteTable("title_release", {
  titleId: text("title_id").primaryKey(),
  releaseDate: text("release_date"),
  checkedAt: integer("checked_at", { mode: "timestamp_ms" }).notNull(),
});

export const siteSetting = sqliteTable("site_setting", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const catalogCandidate = sqliteTable("catalog_candidate", {
  key: text("key").primaryKey(),
  kind: text("kind").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  season: integer("season"),
  title: text("title").notNull(),
  releaseDate: text("release_date"),
  foundAt: integer("found_at", { mode: "timestamp_ms" }).notNull(),
  isDismissed: integer("is_dismissed", { mode: "boolean" }).notNull().default(false),
  copiedAt: integer("copied_at", { mode: "timestamp_ms" }),
});
