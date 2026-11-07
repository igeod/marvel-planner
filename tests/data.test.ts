import { describe, expect, it } from "vitest";
import { LANGUAGES } from "../shared/languages";
import { TMDB_REFS } from "../shared/tmdbRefs";
import { CATALOG } from "../src/features/planner/data/catalog";
import { EASTER_EGGS } from "../src/features/planner/data/easterEggs";
import { getGuide } from "../src/features/planner/data/guides";
import { getKeyScenes } from "../src/features/planner/data/keyScenes";
import { POST_CREDITS } from "../src/features/planner/data/postCredits";
import { flattenTitles } from "../src/features/planner/utils/filters";
import { de as deMessages } from "../src/i18n/locales/de";
import { en as enMessages } from "../src/i18n/locales/en";
import { es as esMessages } from "../src/i18n/locales/es";
import { fr as frMessages } from "../src/i18n/locales/fr";
import { it as itMessages } from "../src/i18n/locales/it";

const titles = flattenTitles(CATALOG);
const ids = new Set(titles.map((title) => title.id));

describe("catalogo", () => {
  it("ha identificatori univoci", () => {
    expect(ids.size).toBe(titles.length);
  });

  it("ogni titolo ha un riferimento TMDB e viceversa", () => {
    expect(titles.filter((title) => !(title.id in TMDB_REFS)).map((title) => title.id)).toEqual([]);
    expect(Object.keys(TMDB_REFS).filter((id) => !ids.has(id))).toEqual([]);
  });

  it("le guide rimandano solo a titoli esistenti e mai a se stessi", () => {
    for (const title of titles) {
      for (const prerequisite of getGuide(title.id).prerequisites) {
        expect(ids.has(prerequisite.id), `${title.id} -> ${prerequisite.id}`).toBe(true);
        expect(prerequisite.id).not.toBe(title.id);
      }
    }
  });

  it("scene post-credit, easter egg e scene chiave riguardano titoli esistenti", () => {
    expect(Object.keys(POST_CREDITS).filter((id) => !ids.has(id))).toEqual([]);
    expect(Object.keys(EASTER_EGGS).filter((id) => !ids.has(id))).toEqual([]);
  });

  it("le scene chiave sono tradotte in tutte le lingue", () => {
    for (const title of titles) {
      for (const scene of getKeyScenes(title.id)) {
        for (const language of LANGUAGES) expect(scene[language].trim()).not.toBe("");
      }
    }
  });
});

function leaves(value: object, prefix = ""): [string, unknown][] {
  return Object.entries(value).flatMap(([key, child]): [string, unknown][] =>
    typeof child === "object" && child !== null
      ? leaves(child, `${prefix}${key}.`)
      : [[`${prefix}${key}`, child]],
  );
}

describe("traduzioni", () => {
  const reference = leaves(itMessages).map(([key]) => key);

  it.each([
    ["en", enMessages],
    ["fr", frMessages],
    ["es", esMessages],
    ["de", deMessages],
  ])("%s ha le stesse chiavi dell'italiano", (_, messages) => {
    expect(leaves(messages).map(([key]) => key)).toEqual(reference);
  });

  it("nessuna traduzione è vuota", () => {
    // The 429 quip exists in Italian and English only; the other languages leave it empty on purpose.
    const quip = "auth.errors.tooManyRequestsJoke";
    const messagesByLanguage = [
      [itMessages, false],
      [enMessages, false],
      [frMessages, true],
      [esMessages, true],
      [deMessages, true],
    ] as const;
    for (const [messages, mayOmitQuip] of messagesByLanguage) {
      const empty = leaves(messages).filter(
        ([key, value]) =>
          typeof value === "string" && value.trim() === "" && !(mayOmitQuip && key === quip),
      );
      expect(empty).toEqual([]);
    }
  });
});
