import type { AdminOverview, ReviewTopic } from "../../../../shared/admin";
import type { CatalogCandidate } from "../../../../shared/catalogCandidate";
import { apiRequest } from "../../../lib/apiClient";

export const getAdminOverview = () => apiRequest<AdminOverview>("/admin/overview");

export const setMaintenance = (enabled: boolean) =>
  apiRequest("/admin/maintenance", { method: "POST", body: JSON.stringify({ enabled }) });

export const dismissCandidate = (key: string) =>
  apiRequest("/admin/candidates/dismiss", { method: "POST", body: JSON.stringify({ key }) });

export const markCandidateCopied = (key: string) =>
  apiRequest("/admin/candidates/copied", { method: "POST", body: JSON.stringify({ key }) });

export function tmdbUrl(candidate: CatalogCandidate): string {
  const base = `https://www.themoviedb.org/${candidate.kind === "movie" ? "movie" : "tv"}/${candidate.tmdbId}`;
  return candidate.season === null ? base : `${base}/season/${candidate.season}`;
}

const titlePath = (titleId: string, rest: string) =>
  `/admin/titles/${encodeURIComponent(titleId)}/${rest}`;

export const setVerified = (titleId: string, topics: ReviewTopic[]) =>
  apiRequest(titlePath(titleId, "verified"), { method: "PUT", body: JSON.stringify({ topics }) });

export const markGuideReviewed = (titleId: string) =>
  apiRequest(titlePath(titleId, "guide-reviewed"), { method: "POST" });

export const setReleaseDate = (titleId: string, date: string) =>
  apiRequest(titlePath(titleId, "release-date"), { method: "PUT", body: JSON.stringify({ date }) });

export const clearReleaseDate = (titleId: string) =>
  apiRequest<{ tmdbDate: string | null; previous: string | null }>(
    titlePath(titleId, "release-date"),
    { method: "DELETE" },
  );

export const keepReleaseDate = (titleId: string) =>
  apiRequest(titlePath(titleId, "release-date/keep"), { method: "POST" });
