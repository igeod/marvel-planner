import type { Language } from "../../../../../shared/languages";

export type PrerequisiteLevel = "essential" | "recommended" | "optional";

export type Localized = Record<Language, string>;

export interface Prerequisite {
  id: string;
  level: PrerequisiteLevel;
  reason: Localized;
}

// A title worth watching first that is not in this planner: it has no state (it cannot be marked).
export interface ExternalPrerequisite {
  name: string;
  level: PrerequisiteLevel;
  reason: Localized;
}

export interface TitleGuide {
  prerequisites: Prerequisite[];
  outside?: ExternalPrerequisite[];
}

export function localized(en: string, it: string, fr: string, es: string, de: string): Localized {
  return { en, it, fr, es, de };
}

const prerequisite =
  (level: PrerequisiteLevel) =>
  (id: string, reason: Localized): Prerequisite => ({ id, level, reason });

export const essential = prerequisite("essential");
export const recommended = prerequisite("recommended");
export const optional = prerequisite("optional");

export const external = (
  level: PrerequisiteLevel,
  name: string,
  reason: Localized,
): ExternalPrerequisite => ({ name, level, reason });

export function guide(prerequisites: Prerequisite[], outside?: ExternalPrerequisite[]): TitleGuide {
  return { prerequisites, outside };
}
