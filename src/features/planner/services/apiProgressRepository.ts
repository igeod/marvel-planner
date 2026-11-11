import { TMDB_REFS } from "../../../../shared/tmdbRefs";
import { apiRequest } from "../../../lib/apiClient";
import type { ProgressRepository } from "./progressRepository";

export const apiProgressRepository: ProgressRepository = {
  load: async () => {
    const { titleIds } = await apiRequest<{ titleIds: string[] }>("/progress");
    return titleIds;
  },
  add: async (titleIds) => {
    const known = titleIds.filter((id) => Object.hasOwn(TMDB_REFS, id));
    if (known.length === 0) return;
    await apiRequest("/progress", { method: "POST", body: JSON.stringify({ titleIds: known }) });
  },
  remove: (titleId) => apiRequest(`/progress/${encodeURIComponent(titleId)}`, { method: "DELETE" }),
  removeMany: async (titleIds) => {
    await Promise.all(
      titleIds.map((id) => apiRequest(`/progress/${encodeURIComponent(id)}`, { method: "DELETE" })),
    );
  },
  clear: () => apiRequest("/progress", { method: "DELETE" }),
};
