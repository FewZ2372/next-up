import { create } from "zustand";

import { getRecapCandidates } from "../data/catalog";
import { moods } from "../data/moods";
import { MoodId, PlatformName } from "../types/content";

interface AppState {
  userName: string;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  selectedPlatforms: PlatformName[];
  selectedGenres: string[];
  selectedDirectors: string[];
  selectedActors: string[];
  recapQueueIds: string[];
  recapCursor: number;
  seenIds: string[];
  dismissedIds: string[];
  watchlistIds: string[];
  currentMood: MoodId;
  login: (name: string) => void;
  logout: () => void;
  togglePlatform: (platform: PlatformName) => void;
  toggleGenre: (genre: string) => void;
  toggleDirector: (director: string) => void;
  toggleActor: (actor: string) => void;
  prepareRecap: () => void;
  classifyRecapTitle: (seen: boolean) => void;
  setMood: (mood: MoodId) => void;
  markTitleSeen: (id: string) => void;
  dismissTitle: (id: string) => void;
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  clearWatchlist: () => void;
  clearDismissed: () => void;
  restartOnboarding: () => void;
}

const initialState = {
  userName: "",
  isAuthenticated: false,
  onboardingCompleted: false,
  selectedPlatforms: [] as PlatformName[],
  selectedGenres: [] as string[],
  selectedDirectors: [] as string[],
  selectedActors: [] as string[],
  recapQueueIds: [] as string[],
  recapCursor: 0,
  seenIds: [] as string[],
  dismissedIds: [] as string[],
  watchlistIds: [] as string[],
  currentMood: moods[0].id,
};

const toggleInArray = <T,>(collection: T[], value: T) =>
  collection.includes(value)
    ? collection.filter((entry) => entry !== value)
    : [...collection, value];

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  login: (name) =>
    set({
      userName: name.trim() || "Invitado",
      isAuthenticated: true,
    }),
  logout: () => set({ ...initialState }),
  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: toggleInArray(state.selectedPlatforms, platform),
    })),
  toggleGenre: (genre) =>
    set((state) => ({
      selectedGenres: toggleInArray(state.selectedGenres, genre),
    })),
  toggleDirector: (director) =>
    set((state) => ({
      selectedDirectors: toggleInArray(state.selectedDirectors, director),
    })),
  toggleActor: (actor) =>
    set((state) => ({
      selectedActors: toggleInArray(state.selectedActors, actor),
    })),
  prepareRecap: () => {
    const state = get();
    const recapTitles = getRecapCandidates({
      selectedPlatforms: state.selectedPlatforms,
      selectedGenres: state.selectedGenres,
      selectedDirectors: state.selectedDirectors,
      selectedActors: state.selectedActors,
    });

    set({
      recapQueueIds: recapTitles.map((title) => title.id),
      recapCursor: 0,
    });
  },
  classifyRecapTitle: (seen) => {
    const state = get();
    const currentId = state.recapQueueIds[state.recapCursor];
    const nextCursor = state.recapCursor + 1;
    const finished = nextCursor >= state.recapQueueIds.length;

    if (!currentId) {
      set({ onboardingCompleted: true });
      return;
    }

    set({
      recapCursor: nextCursor,
      seenIds:
        seen && !state.seenIds.includes(currentId) ? [...state.seenIds, currentId] : state.seenIds,
      onboardingCompleted: finished,
    });
  },
  setMood: (mood) => set({ currentMood: mood }),
  markTitleSeen: (id) =>
    set((state) => ({
      seenIds: state.seenIds.includes(id) ? state.seenIds : [...state.seenIds, id],
    })),
  dismissTitle: (id) =>
    set((state) => ({
      dismissedIds: state.dismissedIds.includes(id) ? state.dismissedIds : [...state.dismissedIds, id],
    })),
  addToWatchlist: (id) =>
    set((state) => ({
      watchlistIds: state.watchlistIds.includes(id) ? state.watchlistIds : [...state.watchlistIds, id],
    })),
  removeFromWatchlist: (id) =>
    set((state) => ({
      watchlistIds: state.watchlistIds.filter((entry) => entry !== id),
    })),
  clearWatchlist: () => set({ watchlistIds: [] }),
  clearDismissed: () => set({ dismissedIds: [] }),
  restartOnboarding: () =>
    set({
      onboardingCompleted: false,
      recapQueueIds: [],
      recapCursor: 0,
      seenIds: [],
      dismissedIds: [],
      watchlistIds: [],
    }),
}));
