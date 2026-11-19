import type { CatalogCandidate } from "./catalogCandidate";
import type { SuggestionSection } from "./suggestions";

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
  releases: AdminRelease[];
  reviews: AdminReview[];
  suggestions: AdminSuggestion[];
}

export interface SiteStatus {
  maintenance: boolean;
  isAdmin: boolean;
}

// What the admin checks by hand for a title (title_review.topic).
export const REVIEW_TOPICS = ["postCredits", "keyScenes", "easterEggs", "guide"] as const;
export type ReviewTopic = (typeof REVIEW_TOPICS)[number];

// One title that has a date from TMDB, one written by hand, or both. The day TMDB gave when the
// hand-written date was set lets the page say that TMDB has changed its mind since.
export interface AdminRelease {
  titleId: string;
  tmdbDate: string | null;
  manualDate: string | null;
  tmdbDateAtOverride: string | null;
}

export interface AdminReview {
  titleId: string;
  topic: ReviewTopic;
}

export interface AdminSuggestion {
  id: string;
  titleId: string;
  section: SuggestionSection;
  item: string | null;
  text: string;
  isDone: boolean;
  authorName: string;
  createdAt: string;
  resolvedAt: string | null;
}
