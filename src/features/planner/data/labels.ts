import type { TranslationKey } from "../../../i18n/types";
import type { MediaType, NoteKey } from "../types";

export const MEDIA_TYPE_KEYS: Record<MediaType, TranslationKey> = {
  film: "planner.types.film",
  serie: "planner.types.serie",
  special: "planner.types.special",
};

// A note turns the type into one phrase ("Animated series"), so the row shows one label, not two.
const NOTE_TYPE_KEYS: Record<NoteKey, TranslationKey> = {
  shorts: "planner.types.shorts",
  animated: "planner.types.animated",
};

export function typeLabelKey(type: MediaType, note?: NoteKey): TranslationKey {
  return note ? NOTE_TYPE_KEYS[note] : MEDIA_TYPE_KEYS[type];
}

export const TYPE_FILTER_OPTIONS: { value: MediaType; labelKey: TranslationKey }[] = [
  { value: "film", labelKey: "planner.filters.film" },
  { value: "serie", labelKey: "planner.filters.serie" },
  { value: "special", labelKey: "planner.filters.special" },
];
