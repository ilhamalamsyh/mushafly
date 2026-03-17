import { create } from "zustand";
import type { DoaItem } from "../types/doa";

interface DoaStoreState {
  doaList: DoaItem[];
  allDoa: DoaItem[];
  selectedGrup: string;
  selectedTag: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setDoaList: (value: DoaItem[]) => void;
  setAllDoa: (value: DoaItem[]) => void;
  setSelectedGrup: (value: string) => void;
  setSelectedTag: (value: string) => void;
  setSearchQuery: (value: string) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  resetFilters: () => void;
}

export const useDoaStore = create<DoaStoreState>((set) => ({
  doaList: [],
  allDoa: [],
  selectedGrup: "",
  selectedTag: "",
  searchQuery: "",
  isLoading: false,
  error: null,
  setDoaList: (doaList) => set({ doaList }),
  setAllDoa: (allDoa) => set({ allDoa }),
  setSelectedGrup: (selectedGrup) => set({ selectedGrup }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetFilters: () =>
    set({ selectedGrup: "", selectedTag: "", searchQuery: "" }),
}));
