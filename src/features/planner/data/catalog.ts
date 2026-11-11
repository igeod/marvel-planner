import { toSlug } from "../../../../shared/slug";
import type { MediaType, NoteKey, Phase, PhaseNumber, Saga, Title } from "../types";

interface TitleOptions {
  alternate?: boolean;
  upcoming?: boolean;
  note?: NoteKey;
}

type TitleEntry = [name: string, release: string, type: MediaType, options?: TitleOptions];

function createTitle([name, release, type, options = {}]: TitleEntry): Title {
  return {
    id: `i-${toSlug(name)}`,
    name,
    release,
    type,
    continuity: options.alternate ? "alternate" : "main",
    status: options.upcoming ? "upcoming" : "released",
    note: options.note,
  };
}

function createPhase(number: PhaseNumber, years: string, entries: TitleEntry[]): Phase {
  return { number, years, titles: entries.map(createTitle) };
}

export const CATALOG: Saga[] = [
  {
    id: "infinity",
    phases: [
      createPhase(1, "2008 – 2012", [
        ["Iron Man", "2008", "film"],
        ["The Incredible Hulk", "2008", "film"],
        ["Iron Man 2", "2010", "film"],
        ["Thor", "2011", "film"],
        ["Captain America: The First Avenger", "2011", "film"],
        ["The Avengers", "2012", "film"],
      ]),
      createPhase(2, "2013 – 2015", [
        ["Iron Man 3", "2013", "film"],
        ["Thor: The Dark World", "2013", "film"],
        ["Captain America: The Winter Soldier", "2014", "film"],
        ["Guardians of the Galaxy", "2014", "film"],
        ["Avengers: Age of Ultron", "2015", "film"],
        ["Ant-Man", "2015", "film"],
      ]),
      createPhase(3, "2016 – 2019", [
        ["Captain America: Civil War", "2016", "film"],
        ["Doctor Strange", "2016", "film"],
        ["Guardians of the Galaxy Vol. 2", "2017", "film"],
        ["Spider-Man: Homecoming", "2017", "film"],
        ["Thor: Ragnarok", "2017", "film"],
        ["Black Panther", "2018", "film"],
        ["Avengers: Infinity War", "2018", "film"],
        ["Ant-Man and the Wasp", "2018", "film"],
        ["Captain Marvel", "2019", "film"],
        ["Avengers: Endgame", "2019", "film"],
        ["Spider-Man: Far From Home", "2019", "film"],
      ]),
    ],
  },
  {
    id: "multiverse",
    phases: [
      createPhase(4, "2021 – 2022", [
        ["WandaVision", "2021", "serie"],
        ["The Falcon and the Winter Soldier", "2021", "serie"],
        ["Loki: Stagione 1", "2021", "serie"],
        ["Black Widow", "2021", "film"],
        ["What If…?: Stagione 1", "2021", "serie", { alternate: true }],
        ["Shang-Chi and the Legend of the Ten Rings", "2021", "film"],
        ["Eternals", "2021", "film"],
        ["Hawkeye", "2021", "serie"],
        ["Spider-Man: No Way Home", "2021", "film"],
        ["Moon Knight", "2022", "serie"],
        ["Doctor Strange in the Multiverse of Madness", "2022", "film"],
        ["Ms. Marvel", "2022", "serie"],
        ["Thor: Love and Thunder", "2022", "film"],
        ["I Am Groot: Stagione 1", "2022", "serie", { note: "shorts" }],
        ["She-Hulk: Attorney at Law", "2022", "serie"],
        ["Werewolf by Night", "2022", "special"],
        ["Black Panther: Wakanda Forever", "2022", "film"],
        ["The Guardians of the Galaxy Holiday Special", "2022", "special"],
      ]),
      createPhase(5, "2023 – 2025", [
        ["Ant-Man and the Wasp: Quantumania", "2023", "film"],
        ["Guardians of the Galaxy Vol. 3", "2023", "film"],
        ["Secret Invasion", "2023", "serie"],
        ["Loki: Stagione 2", "2023", "serie"],
        ["The Marvels", "2023", "film"],
        ["What If…?: Stagione 2", "2023", "serie", { alternate: true }],
        ["I Am Groot: Stagione 2", "2023", "serie", { note: "shorts" }],
        ["Echo", "2024", "serie"],
        ["X-Men '97: Stagione 1", "2024", "serie", { alternate: true }],
        ["Deadpool & Wolverine", "2024", "film"],
        ["Agatha All Along", "2024", "serie"],
        ["What If…?: Stagione 3", "2024", "serie", { alternate: true }],
        [
          "Your Friendly Neighborhood Spider-Man: Stagione 1",
          "2025",
          "serie",
          { alternate: true, note: "animated" },
        ],
        ["Captain America: Brave New World", "2025", "film"],
        ["Daredevil: Born Again, Stagione 1", "2025", "serie"],
        ["Thunderbolts*", "2025", "film"],
        ["Ironheart", "2025", "serie"],
      ]),
      createPhase(6, "2025 – 2027", [
        ["The Fantastic Four: First Steps", "2025", "film"],
        ["Eyes of Wakanda", "2025", "serie", { note: "animated" }],
        ["Marvel Zombies", "2025", "serie", { alternate: true, note: "animated" }],
        ["Wonder Man", "2026", "serie"],
        ["Daredevil: Born Again, Stagione 2", "2026", "serie"],
        ["The Punisher: One Last Kill", "2026", "special"],
        ["X-Men '97: Stagione 2", "2026-mid", "serie", { alternate: true, upcoming: true }],
        ["VisionQuest", "2026", "serie", { upcoming: true }],
        ["Spider-Man: Brand New Day", "2026-07-31", "film", { upcoming: true }],
        [
          "Your Friendly Neighborhood Spider-Man: Stagione 2",
          "2026-late",
          "serie",
          { alternate: true, upcoming: true, note: "animated" },
        ],
        ["Avengers: Doomsday", "2026-12-18", "film", { upcoming: true }],
        ["Daredevil: Born Again, Stagione 3", "2027-03", "serie", { upcoming: true }],
        ["Avengers: Secret Wars", "2027-12-17", "film", { upcoming: true }],
      ]),
    ],
  },
];

export const ALL_PHASE_NUMBERS = CATALOG.flatMap((saga) =>
  saga.phases.map((phase) => phase.number),
);

export const TITLES_BY_ID: Record<string, Title> = Object.fromEntries(
  CATALOG.flatMap((saga) =>
    saga.phases.flatMap((phase) => phase.titles.map((title) => [title.id, title] as const)),
  ),
);
