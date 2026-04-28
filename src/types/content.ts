export type PlatformName =
  | "Netflix"
  | "Max"
  | "Prime Video"
  | "Disney+"
  | "Apple TV+"
  | "MUBI";

export type MoodId =
  | "adrenaline"
  | "feel-good"
  | "mind-bending"
  | "cozy"
  | "dark";

export interface Title {
  id: string;
  name: string;
  format: "Película" | "Serie";
  year: number;
  duration: string;
  genres: string[];
  moods: MoodId[];
  platforms: PlatformName[];
  director: string;
  cast: string[];
  blurb: string;
  gradient: [string, string];
}

export interface MoodOption {
  id: MoodId;
  label: string;
  prompt: string;
}

export interface NewsItem {
  id: string;
  category: "Estreno" | "Precio" | "Cambio" | "Renovación";
  title: string;
  summary: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  label: string;
  title: string;
  body: string;
  timestamp: string;
}
