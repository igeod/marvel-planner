import type { CatalogCandidate } from "./catalogCandidate";

export interface JobRun {
  at: string;
  status: "ok" | "error";
  error: string | null;
}

// A job that has not run for longer than this is shown as overdue.
export const JOB_LATE_AFTER_HOURS = { daily: 36, weekly: 192 } as const;

export interface AdminCandidate extends CatalogCandidate {
  foundAt: string;
  copiedAt: string | null;
}

export interface AdminOverview {
  maintenance: boolean;
  tmdbConfigured: boolean;
  lastRuns: { daily: JobRun | null; weekly: JobRun | null };
  users: { total: number; newLastWeek: number; deleted: number; deletedSince: string | null };
  candidates: AdminCandidate[];
}

export interface SiteStatus {
  maintenance: boolean;
  isAdmin: boolean;
}
