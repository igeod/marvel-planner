import { describe, expect, it } from "vitest";
import { CATALOG } from "../src/features/planner/data/catalog";
import {
  buildAdminTitles,
  buildContentTemplate,
  filterTodoTitles,
  titlesWithDates,
} from "../src/features/admin/utils/adminTitles";

const today = "2026-11-19";
const find = (titles: ReturnType<typeof buildAdminTitles>, id: string) =>
  titles.find((title) => title.id === id)!;

describe("titoli in /admin", () => {
  it("un contenuto assente è 'manca', e 'verificato' se l'admin l'ha controllato", () => {
    const none = buildAdminTitles(CATALOG, [], [], today);
    const target = none.find((title) => title.content.easterEggs === "missing")!;
    expect(target.content.easterEggs).toBe("missing");

    const checked = buildAdminTitles(
      CATALOG,
      [],
      [{ titleId: target.id, topic: "easterEggs" }],
      today,
    );
    expect(find(checked, target.id).content.easterEggs).toBe("verifiedNone");
  });

  it("la data a mano decide se è uscito; TMDB che cambia dopo la correzione si segnala", () => {
    const id = "i-avengers-doomsday";
    const manual = {
      titleId: id,
      tmdbDate: null,
      manualDate: "2026-11-01",
      tmdbDateAtOverride: null,
    };
    expect(find(buildAdminTitles(CATALOG, [manual], [], today), id).isReleased).toBe(true);

    const changed = { ...manual, tmdbDate: "2026-12-18" };
    const title = find(buildAdminTitles(CATALOG, [changed], [], today), id);
    expect(title.dateIssue).toBe("tmdbChanged");
    expect(titlesWithDates([title])).toHaveLength(1);

    const kept = { ...changed, tmdbDateAtOverride: "2026-12-18" };
    expect(find(buildAdminTitles(CATALOG, [kept], [], today), id).dateIssue).toBeNull();
  });

  it("senza data né da TMDB né a mano, un anno o 'metà anno' è 'solo l'anno'", () => {
    const titles = buildAdminTitles(CATALOG, [], [], today);
    expect(find(titles, "i-x-men-97-stagione-2").dateIssue).toBe("yearOnly");
    expect(find(titles, "i-spider-man-brand-new-day").dateIssue).toBeNull();
  });

  it("la guida da rivedere si accende all'uscita e si spegne con la revisione", () => {
    const id = "i-spider-man-brand-new-day";
    expect(find(buildAdminTitles(CATALOG, [], [], today), id).guideToReview).toBe(true);
    const reviewed = buildAdminTitles(CATALOG, [], [{ titleId: id, topic: "guide" }], today);
    expect(find(reviewed, id).guideToReview).toBe(false);
  });

  it("l'elenco mostra solo i titoli usciti, i più recenti prima, secondo il filtro", () => {
    const titles = buildAdminTitles(CATALOG, [], [], today);
    const all = filterTodoTitles(titles, "all");
    expect(all.every((title) => title.isReleased)).toBe(true);
    const dates = all.map((title) => title.releaseDate ?? title.release);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(filterTodoTitles(titles, "review").every((title) => title.guideToReview)).toBe(true);
  });

  it("il modello ha solo i campi vuoti di ciò che manca", () => {
    const template = buildContentTemplate({
      id: "i-x",
      content: {
        guide: "present",
        postCredits: "missing",
        keyScenes: "verifiedNone",
        easterEggs: "present",
      },
    });
    expect(template).toContain('"i-x": scenes(');
    expect(template).not.toContain("guide(");
    expect(template).not.toContain("keyScenes");
  });
});
