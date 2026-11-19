import { createContext } from "react";
import type { SuggestionSection } from "../../../../shared/suggestions";

// What a suggestion is about: a title, a part of its page, and (if it is about one line) that line.
export interface SuggestTarget {
  titleId: string;
  section: SuggestionSection;
  item?: string;
}

export interface SuggestContextValue {
  open(target: SuggestTarget): void;
}

export const SuggestContext = createContext<SuggestContextValue | null>(null);
