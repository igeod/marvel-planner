import type { SuggestionInput } from "../../../../shared/suggestions";
import { apiRequest } from "../../../lib/apiClient";

export const sendSuggestion = (input: SuggestionInput) =>
  apiRequest("/suggestions", { method: "POST", body: JSON.stringify(input) });
