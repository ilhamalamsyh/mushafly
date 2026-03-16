import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_QARI } from "../constants";
import type { Surah, SurahDetail } from "../models/surah.model";

export interface Bookmark {
  surahId: number;
  ayahId: number;
}

interface QuranState {
  surahList: Surah[];
  selectedSurah: SurahDetail | null;
  isLoading: boolean;
  error: string | null;
  selectedQari: string;
  showTransliteration: boolean;
  showTranslation: boolean;
  bookmarks: Bookmark[];
  theme: "light" | "dark";
  setSurahList: (surah: Surah[]) => void;
  setSelectedSurah: (surah: SurahDetail | null) => void;
  setIsLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  setSelectedQari: (qari: string) => void;
  toggleTheme: () => void;
  toggleTransliteration: () => void;
  toggleTranslation: () => void;
  toggleBookmark: (bookmark: Bookmark) => void;
  isBookmarked: (surahId: number, ayahId: number) => boolean;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      surahList: [],
      selectedSurah: null,
      isLoading: false,
      error: null,
      selectedQari: DEFAULT_QARI,
      showTransliteration: true,
      showTranslation: true,
      bookmarks: [],
      theme:
        (typeof window !== "undefined" &&
          (localStorage.getItem("theme") as "light" | "dark")) ||
        "light",
      setSurahList: (surahList) => set({ surahList }),
      setSelectedSurah: (selectedSurah) => set({ selectedSurah }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSelectedQari: (selectedQari) => set({ selectedQari }),
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === "dark" ? "light" : "dark";
          try {
            localStorage.setItem("theme", next);
          } catch {}
          return { theme: next };
        }),
      toggleTransliteration: () =>
        set((state) => ({ showTransliteration: !state.showTransliteration })),
      toggleTranslation: () =>
        set((state) => ({ showTranslation: !state.showTranslation })),
      toggleBookmark: (bookmark) =>
        set((state) => {
          const exists = state.bookmarks.some(
            (item) =>
              item.surahId === bookmark.surahId &&
              item.ayahId === bookmark.ayahId,
          );
          return {
            bookmarks: exists
              ? state.bookmarks.filter(
                  (item) =>
                    !(
                      item.surahId === bookmark.surahId &&
                      item.ayahId === bookmark.ayahId
                    ),
                )
              : [...state.bookmarks, bookmark],
          };
        }),
      isBookmarked: (surahId, ayahId) =>
        get().bookmarks.some(
          (item) => item.surahId === surahId && item.ayahId === ayahId,
        ),
    }),
    {
      name: "quran-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedQari: state.selectedQari,
        showTransliteration: state.showTransliteration,
        showTranslation: state.showTranslation,
        bookmarks: state.bookmarks,
        theme: state.theme,
      }),
    },
  ),
);
