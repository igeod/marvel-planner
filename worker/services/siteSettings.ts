import { eq } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  PASSWORD_POLICY_KEY,
  parsePasswordPolicy,
  type PasswordPolicy,
} from "../../shared/passwordPolicy";
import { siteSetting } from "../db/schema";

export type ScheduledRun = "daily" | "weekly";

const MAINTENANCE_KEY = "maintenance";
const MAINTENANCE_CACHE_MS = 5000;

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

export async function recordRun(db: Database, run: ScheduledRun, now = new Date()): Promise<void> {
  await writeSetting(db, runKey(run), now.toISOString(), now);
}

export async function getLastRuns(db: Database): Promise<Record<ScheduledRun, string | null>> {
  const [daily, weekly] = await Promise.all([
    readSetting(db, runKey("daily")),
    readSetting(db, runKey("weekly")),
  ]);
  return { daily, weekly };
}

// Read on every use, with no cache: editing the row takes effect on the next request.
export async function getPasswordPolicy(db: Database): Promise<PasswordPolicy> {
  return parsePasswordPolicy(await readSetting(db, PASSWORD_POLICY_KEY));
}
