import { z } from "zod";

// The parts of a title page a reader can suggest a correction for.
export const SUGGESTION_SECTIONS = ["keyScenes", "easterEggs", "postCredits", "guide"] as const;
export type SuggestionSection = (typeof SUGGESTION_SECTIONS)[number];

export const SUGGESTION_MAX_LENGTH = 500;
const ITEM_MAX_LENGTH = 300;
// How many one account can send in an hour.
export const SUGGESTIONS_PER_HOUR = 5;

export const suggestionSchema = z.object({
  titleId: z.string().min(1).max(100),
  section: z.enum(SUGGESTION_SECTIONS),
  // The line the suggestion is about, when it is about one ("a scene", "an Easter egg").
  item: z.string().trim().max(ITEM_MAX_LENGTH).optional(),
  text: z.string().trim().min(1).max(SUGGESTION_MAX_LENGTH),
});

export type SuggestionInput = z.infer<typeof suggestionSchema>;
