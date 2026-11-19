import type { AdminRelease, AdminReview } from "../../../../shared/admin";
import { isRealIsoDate } from "../../../../shared/isoDate";
import { getEasterEggs } from "../../planner/data/easterEggs";
import { hasGuide } from "../../planner/data/guides";
import { getKeyScenes } from "../../planner/data/keyScenes";
import { getPostCredits } from "../../planner/data/postCredits";
import type { MediaType, NoteKey, PhaseNumber, Saga, Title } from "../../planner/types";
import { applyReleaseDates, type ReleaseDates } from "../../planner/utils/releases";

export const CONTENT_KINDS = ["guide", "postCredits", "keyScenes", "easterEggs"] as const;
export type ContentKind = (typeof CONTENT_KINDS)[number];
export type ContentState = "present" | "missing" | "verifiedNone";
// yearOnly: no date from TMDB or by hand, and the catalog has only a year or an approximate one.
export type DateIssue = "yearOnly" | "tmdbChanged" | null;

export interface AdminTitle {
  id: string;
  name: string;
  type: MediaType;
  note?: NoteKey;
  phase: PhaseNumber;
  isReleased: boolean;
  // The release as the planner shows it: a full date, or the catalog's year / approximate text.
  release: string;
  // The date in use, when it is a full one.
  releaseDate: string | null;
  tmdbDate: string | null;
  manualDate: string | null;
  content: Record<ContentKind, ContentState>;
  // Released, but its guide was written while the title was upcoming, and nobody has reviewed it.
  guideToReview: boolean;
  dateIssue: DateIssue;
}

function contentState(isPresent: boolean, isChecked: boolean): ContentState {
  if (isPresent) return "present";
  return isChecked ? "verifiedNone" : "missing";
}

export function buildAdminTitles(
  catalog: Saga[],
  releases: AdminRelease[],
  reviews: AdminReview[],
  today: string,
): AdminTitle[] {
  const byTitle = new Map(releases.map((row) => [row.titleId, row]));
  const checked = new Set(reviews.map((row) => `${row.titleId}:${row.topic}`));
  const dates: ReleaseDates = {};
  for (const row of releases) dates[row.titleId] = row.manualDate ?? row.tmdbDate;
  const resolved = applyReleaseDates(catalog, dates, today);

  return catalog.flatMap((saga, sagaIndex) =>
    saga.phases.flatMap((phase, phaseIndex) =>
      phase.titles.map((original, titleIndex): AdminTitle => {
        const title: Title = resolved[sagaIndex].phases[phaseIndex].titles[titleIndex];
        const row = byTitle.get(title.id);
        const manualDate = row?.manualDate ?? null;
        const tmdbDate = row?.tmdbDate ?? null;
        const inUse = manualDate ?? tmdbDate;
        const isReleased = title.status === "released";
        const isChecked = (topic: string) => checked.has(`${title.id}:${topic}`);
        const hasOnlyApproximateDate = !inUse && !isRealIsoDate(original.release);
        let dateIssue: DateIssue = null;
        if (manualDate && row && row.tmdbDate !== row.tmdbDateAtOverride) dateIssue = "tmdbChanged";
        else if (hasOnlyApproximateDate) dateIssue = "yearOnly";

        return {
          id: title.id,
          name: title.name,
          type: title.type,
          note: title.note,
          phase: phase.number,
          isReleased,
          release: isRealIsoDate(title.release) ? title.release : original.release,
          releaseDate: inUse ?? (isRealIsoDate(original.release) ? original.release : null),
          tmdbDate,
          manualDate,
          content: {
            guide: hasGuide(title.id) ? "present" : "missing",
            postCredits: contentState(getPostCredits(title.id) !== null, isChecked("postCredits")),
            keyScenes: contentState(getKeyScenes(title.id).length > 0, isChecked("keyScenes")),
            easterEggs: contentState(getEasterEggs(title.id).length > 0, isChecked("easterEggs")),
          },
          // The guide of a title that was upcoming in the catalog carries the provisional list.
          guideToReview: isReleased && original.status === "upcoming" && !isChecked("guide"),
          dateIssue,
        };
      }),
    ),
  );
}

export type TodoFilter = "todo" | "review" | "all";

const hasMissing = (title: AdminTitle) =>
  CONTENT_KINDS.some((kind) => title.content[kind] === "missing");

// The released titles the list shows, most recent first.
export function filterTodoTitles(titles: AdminTitle[], filter: TodoFilter): AdminTitle[] {
  const released = titles.filter((title) => title.isReleased);
  const shown = released.filter((title) => {
    if (filter === "review") return title.guideToReview;
    if (filter === "todo") return hasMissing(title) || title.guideToReview;
    return true;
  });
  return [...shown].sort((a, b) =>
    (b.releaseDate ?? b.release).localeCompare(a.releaseDate ?? a.release),
  );
}

// The titles whose date needs a look: no full date, TMDB changed its mind, or one written by hand.
export const titlesWithDates = (titles: AdminTitle[]): AdminTitle[] =>
  titles.filter((title) => title.dateIssue !== null || title.manualDate !== null);

// An empty card for what is missing, to fill in the code: no text from the plot, no spoilers.
export function buildContentTemplate(title: Pick<AdminTitle, "id" | "content">): string {
  const empty = 'l("", "", "", "", "")';
  const parts: Partial<Record<ContentKind, string>> = {
    guide: `"${title.id}": guide([\n  essential("i-…", ${empty}),\n]),`,
    postCredits: `"${title.id}": scenes(\n  scene("end", ${empty}),\n),`,
    keyScenes: `"${title.id}": [\n  ${empty},\n],`,
    easterEggs: `"${title.id}": stanLee(\n  ${empty},\n),`,
  };
  return CONTENT_KINDS.filter((kind) => title.content[kind] === "missing")
    .map((kind) => `// ${kind}\n${parts[kind]}`)
    .join("\n\n");
}
