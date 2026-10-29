import type { Language } from "./languages";

export interface CastMember {
  name: string;
  character: string;
}

export interface Episode {
  number: number;
  title: string;
  summary: string;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Trailer {
  key: string;
  name: string;
}

export interface PlotText {
  text: string;
  language: Language;
  sourceUrl: string;
}

export interface TitleDetails {
  name: string;
  originalName: string;
  releaseDate: string | null;
  runtime: number | null;
  posterPath: string | null;
  backdropPath: string | null;
  synopsis: string;
  directors: string[];
  creators: string[];
  cast: CastMember[];
  seasons: Season[];
  trailer: Trailer | null;
  plot: PlotText | null;
}
