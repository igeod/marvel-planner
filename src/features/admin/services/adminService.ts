import type { AdminOverview } from "../../../../shared/admin";
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
