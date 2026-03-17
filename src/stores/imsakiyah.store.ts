import { create } from "zustand";
import type { ImsakiyahData } from "../models/imsakiyah.model";

type ActiveTab = "table" | "today";

interface ImsakiyahState {
  provinsiList: string[];
  kabkotaList: string[];
  selectedProvinsi: string;
  selectedKabkota: string;
  jadwal: ImsakiyahData | null;
  isLoadingProvinsi: boolean;
  isLoadingKabkota: boolean;
  isLoadingJadwal: boolean;
  error: string | null;
  activeTab: ActiveTab;
  setProvinsiList: (list: string[]) => void;
  setKabkotaList: (list: string[]) => void;
  setSelectedProvinsi: (value: string) => void;
  setSelectedKabkota: (value: string) => void;
  setJadwal: (value: ImsakiyahData | null) => void;
  setIsLoadingProvinsi: (value: boolean) => void;
  setIsLoadingKabkota: (value: boolean) => void;
  setIsLoadingJadwal: (value: boolean) => void;
  setError: (value: string | null) => void;
  setActiveTab: (value: ActiveTab) => void;
  resetKabkotaAndJadwal: () => void;
}

export const useImsakiyahStore = create<ImsakiyahState>((set) => ({
  provinsiList: [],
  kabkotaList: [],
  selectedProvinsi: "",
  selectedKabkota: "",
  jadwal: null,
  isLoadingProvinsi: false,
  isLoadingKabkota: false,
  isLoadingJadwal: false,
  error: null,
  activeTab: "table",
  setProvinsiList: (provinsiList) => set({ provinsiList }),
  setKabkotaList: (kabkotaList) => set({ kabkotaList }),
  setSelectedProvinsi: (selectedProvinsi) => set({ selectedProvinsi }),
  setSelectedKabkota: (selectedKabkota) => set({ selectedKabkota }),
  setJadwal: (jadwal) => set({ jadwal }),
  setIsLoadingProvinsi: (isLoadingProvinsi) => set({ isLoadingProvinsi }),
  setIsLoadingKabkota: (isLoadingKabkota) => set({ isLoadingKabkota }),
  setIsLoadingJadwal: (isLoadingJadwal) => set({ isLoadingJadwal }),
  setError: (error) => set({ error }),
  setActiveTab: (activeTab) => set({ activeTab }),
  resetKabkotaAndJadwal: () =>
    set({
      selectedKabkota: "",
      kabkotaList: [],
      jadwal: null,
      error: null,
      activeTab: "table",
    }),
}));
