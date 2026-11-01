import { count, eq, gte, sql } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  PASSWORD_POLICY_KEY,
  parsePasswordPolicy,
  type PasswordPolicy,
} from "../../shared/passwordPolicy";
import type { JobRun } from "../../shared/admin";
import { siteSetting, user } from "../db/schema";

export type ScheduledRun = "daily" | "weekly";

const MAINTENANCE_KEY = "maintenance";
const MAINTENANCE_CACHE_MS = 5000;
const DELETED_ACCOUNTS_KEY = "deleted_accounts";
const MAX_ERROR_LENGTH = 200;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const runKey = (run: ScheduledRun) => `lastRun:${run}`;

let maintenanceCache: { value: boolean; readAt: number } | null = null;

export function resetMaintenanceCache(): void {
  maintenanceCache = null;
}

async function readSetting(db: Database, key: string): Promise<string | null> {
  const [row] = await db.select().from(siteSetting).where(eq(siteSetting.key, key));
  return row?.value ?? null;
}

async function writeSetting(db: Database, key: string, value: string, now: Date): Promise<void> {
  await db
    .insert(siteSetting)
    .values({ key, value, updatedAt: now })
    .onConflictDoUpdate({ target: siteSetting.key, set: { value, updatedAt: now } });
}

export async function isMaintenanceOn(db: Database, now = Date.now()): Promise<boolean> {
  if (maintenanceCache && now - maintenanceCache.readAt < MAINTENANCE_CACHE_MS) {
    return maintenanceCache.value;
  }
  const value = (await readSetting(db, MAINTENANCE_KEY)) === "on";
  maintenanceCache = { value, readAt: now };
  return value;
}

export async function setMaintenance(
  db: Database,
  enabled: boolean,
  now = new Date(),
): Promise<void> {
  await writeSetting(db, MAINTENANCE_KEY, enabled ? "on" : "off", now);
  maintenanceCache = { value: enabled, readAt: now.getTime() };
}

// Short message for the admin page: no stack, and URLs lose their query string (it may hold a token).
export function describeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/\?\S*/g, "").slice(0, MAX_ERROR_LENGTH);
}

export async function recordRun(
  db: Database,
  run: ScheduledRun,
  now = new Date(),
  error: unknown = null,
): Promise<void> {
  const value: JobRun = {
    at: now.toISOString(),
    status: error === null ? "ok" : "error",
    error: error === null ? null : describeError(error),
  };
  await writeSetting(db, runKey(run), JSON.stringify(value), now);
}

// Also reads the old format, a bare ISO date written before jobs reported their outcome.
function parseRun(raw: string | null): JobRun | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "at" in parsed && "status" in parsed) {
      return parsed as JobRun;
    }
  } catch {
    // Not JSON: the old format.
  }
  return { at: raw, status: "ok", error: null };
}

export async function getLastRuns(db: Database): Promise<Record<ScheduledRun, JobRun | null>> {
  const [daily, weekly] = await Promise.all([
    readSetting(db, runKey("daily")),
    readSetting(db, runKey("weekly")),
  ]);
  return { daily: parseRun(daily), weekly: parseRun(weekly) };
}

// One atomic statement, so two deletions at once never lose a count.
export async function recordDeletedAccount(db: Database, now = new Date()): Promise<void> {
  const first = JSON.stringify({ count: 1, since: now.toISOString() });
  await db
    .insert(siteSetting)
    .values({ key: DELETED_ACCOUNTS_KEY, value: first, updatedAt: now })
    .onConflictDoUpdate({
      target: siteSetting.key,
      set: {
        value: sql`json_set(${siteSetting.value}, '$.count', json_extract(${siteSetting.value}, '$.count') + 1)`,
        updatedAt: now,
      },
    });
}

export async function getUserCounts(db: Database, now = new Date()) {
  const [[total], [recent], raw] = await Promise.all([
    db.select({ n: count() }).from(user),
    db
      .select({ n: count() })
      .from(user)
      .where(gte(user.createdAt, new Date(now.getTime() - WEEK_MS))),
    readSetting(db, DELETED_ACCOUNTS_KEY),
  ]);
  let deleted = { count: 0, since: now.toISOString() };
  if (raw) deleted = JSON.parse(raw) as typeof deleted;
  else await writeSetting(db, DELETED_ACCOUNTS_KEY, JSON.stringify(deleted), now);
  return {
    total: total.n,
    newLastWeek: recent.n,
    deleted: deleted.count,
    deletedSince: deleted.since,
  };
}

// Read on every use, with no cache: editing the row takes effect on the next request.
export async function getPasswordPolicy(db: Database): Promise<PasswordPolicy> {
  return parsePasswordPolicy(await readSetting(db, PASSWORD_POLICY_KEY));
}
