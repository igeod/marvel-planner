import { INFINITY_GUIDES } from "./infinity";
import { MULTIVERSE_GUIDES } from "./multiverse";
import type { TitleGuide } from "./types";

const EMPTY_GUIDE: TitleGuide = { prerequisites: [] };

const GUIDES: Record<string, TitleGuide> = { ...INFINITY_GUIDES, ...MULTIVERSE_GUIDES };

// A guide can be written and empty ("nothing to watch first"): that is still a guide.
export const hasGuide = (titleId: string): boolean => Object.hasOwn(GUIDES, titleId);

export function getGuide(titleId: string): TitleGuide {
  return Object.hasOwn(GUIDES, titleId) ? GUIDES[titleId] : EMPTY_GUIDE;
}
