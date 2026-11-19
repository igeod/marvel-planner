import type { TranslationKey } from "../../i18n/types";
import type { SuggestTarget } from "./context/SuggestContext";

export const SECTION_KEYS: Record<SuggestTarget["section"], TranslationKey> = {
  keyScenes: "details.keyScenes.heading",
  easterEggs: "details.easterEggs.heading",
  postCredits: "postCredits.heading",
  guide: "prerequisites.heading",
};
