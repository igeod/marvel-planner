import { computeProgress as tally } from "../../planner/utils/progress";
import type { MediaType, PhaseNumber, Progress, Saga } from "../../planner/types";

export interface ProgressStats {
  overall: Progress;
  byPhase: ({ number: PhaseNumber } & Progress)[];
  byType: ({ type: MediaType } & Progress)[];
  byYear: ({ year: string } & Progress)[];
}

const MEDIA_TYPES: MediaType[] = ["film", "serie", "special"];

// Titles not out yet do not count (see computeProgress), so a group made only of them is left out.
export function computeStats(catalog: Saga[], watched: ReadonlySet<string>): ProgressStats {
  const phases = catalog.flatMap((saga) => saga.phases);
  const titles = phases.flatMap((phase) => phase.titles);
  const years = [...new Set(titles.map((title) => title.release.slice(0, 4)))].sort();

  return {
    overall: tally(titles, watched),
    byPhase: phases
      .map((phase) => ({ number: phase.number, ...tally(phase.titles, watched) }))
      .filter((entry) => entry.total > 0),
    byType: MEDIA_TYPES.map((type) => ({
      type,
      ...tally(
        titles.filter((title) => title.type === type),
        watched,
      ),
    })).filter((entry) => entry.total > 0),
    byYear: years
      .map((year) => ({
        year,
        ...tally(
          titles.filter((title) => title.release.startsWith(year)),
          watched,
        ),
      }))
      .filter((entry) => entry.total > 0),
  };
}
