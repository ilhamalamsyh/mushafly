import { useCallback, useEffect, useRef } from "react";
import {
  getShalatProvinsi,
  getShalatKabkota,
  getJadwalShalat,
} from "../services/shalatService";
import { useJadwalShalatStore } from "../stores/jadwalshalat.store";

export const useJadwalShalatController = () => {
  const {
    provinsiList,
    kabkotaList,
    selectedProvinsi,
    selectedKabkota,
    selectedBulan,
    jadwal,
    isLoadingProvinsi,
    isLoadingKabkota,
    isLoadingJadwal,
    error,
    activeTab,
    setProvinsiList,
    setKabkotaList,
    setSelectedProvinsi,
    setSelectedKabkota,
    setSelectedBulan,
    setJadwal,
    setIsLoadingProvinsi,
    setIsLoadingKabkota,
    setIsLoadingJadwal,
    setError,
    setActiveTab,
    resetKabkotaAndJadwal,
  } = useJadwalShalatStore();

  const lastActionRef = useRef<"provinsi" | "kabkota" | "jadwal" | null>(null);
  const kabkotaRequestIdRef = useRef(0);
  const jadwalRequestIdRef = useRef(0);

  const loadProvinsi = useCallback(async () => {
    setIsLoadingProvinsi(true);
    setError(null);
    lastActionRef.current = "provinsi";

    try {
      const result = await getShalatProvinsi();
      setProvinsiList(result.data);
      return { status: "success" as const };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat daftar provinsi.",
      );
      return { status: "error" as const };
    } finally {
      setIsLoadingProvinsi(false);
    }
  }, [setError, setIsLoadingProvinsi, setProvinsiList]);

  const loadKabkota = useCallback(
    async (provinsi: string) => {
      const requestId = ++kabkotaRequestIdRef.current;
      setIsLoadingKabkota(true);
      setError(null);
      lastActionRef.current = "kabkota";

      try {
        const result = await getShalatKabkota(provinsi);

        if (
          requestId !== kabkotaRequestIdRef.current ||
          useJadwalShalatStore.getState().selectedProvinsi !== provinsi
        ) {
          return { status: "stale" as const };
        }

        setKabkotaList(result.data);
        return { status: "success" as const };
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat daftar kabupaten/kota.",
        );
        return { status: "error" as const };
      } finally {
        if (requestId === kabkotaRequestIdRef.current) {
          setIsLoadingKabkota(false);
        }
      }
    },
    [setError, setIsLoadingKabkota, setKabkotaList],
  );

  const loadJadwal = useCallback(
    async (provinsi: string, kabkota: string, bulan: number) => {
      const tahun = new Date().getFullYear();
      const requestId = ++jadwalRequestIdRef.current;
      setIsLoadingJadwal(true);
      setError(null);
      lastActionRef.current = "jadwal";

      try {
        const result = await getJadwalShalat(provinsi, kabkota, bulan, tahun);

        const state = useJadwalShalatStore.getState();
        if (
          requestId !== jadwalRequestIdRef.current ||
          state.selectedProvinsi !== provinsi ||
          state.selectedKabkota !== kabkota
        ) {
          return { status: "stale" as const };
        }

        setJadwal(result.data);
        return { status: "success" as const };
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat jadwal shalat.",
        );
        return { status: "error" as const };
      } finally {
        if (requestId === jadwalRequestIdRef.current) {
          setIsLoadingJadwal(false);
        }
      }
    },
    [setError, setIsLoadingJadwal, setJadwal],
  );

  const onProvinsiChange = useCallback(
    async (provinsi: string) => {
      setSelectedProvinsi(provinsi);
      resetKabkotaAndJadwal();

      if (!provinsi) {
        return;
      }

      await loadKabkota(provinsi);
    },
    [loadKabkota, resetKabkotaAndJadwal, setSelectedProvinsi],
  );

  const onKabkotaChange = useCallback(
    async (kabkota: string) => {
      setSelectedKabkota(kabkota);
      setJadwal(null);
      setError(null);

      const state = useJadwalShalatStore.getState();
      const currentProvinsi = state.selectedProvinsi;
      const currentBulan = state.selectedBulan;

      if (!currentProvinsi || !kabkota) {
        return;
      }

      await loadJadwal(currentProvinsi, kabkota, currentBulan);
    },
    [loadJadwal, setError, setJadwal, setSelectedKabkota],
  );

  const onBulanChange = useCallback(
    async (bulan: number) => {
      setSelectedBulan(bulan);

      const state = useJadwalShalatStore.getState();
      const currentProvinsi = state.selectedProvinsi;
      const currentKabkota = state.selectedKabkota;

      if (!currentProvinsi || !currentKabkota) {
        return;
      }

      await loadJadwal(currentProvinsi, currentKabkota, bulan);
    },
    [loadJadwal, setSelectedBulan],
  );

  const retryLastAction = useCallback(async () => {
    const state = useJadwalShalatStore.getState();

    if (lastActionRef.current === "kabkota" && state.selectedProvinsi) {
      await loadKabkota(state.selectedProvinsi);
      return;
    }

    if (
      lastActionRef.current === "jadwal" &&
      state.selectedProvinsi &&
      state.selectedKabkota
    ) {
      await loadJadwal(
        state.selectedProvinsi,
        state.selectedKabkota,
        state.selectedBulan,
      );
      return;
    }

    await loadProvinsi();
  }, [loadJadwal, loadKabkota, loadProvinsi]);

  useEffect(() => {
    if (provinsiList.length > 0) {
      return;
    }

    void loadProvinsi();
  }, [loadProvinsi, provinsiList.length]);

  return {
    provinsiList,
    kabkotaList,
    selectedProvinsi,
    selectedKabkota,
    selectedBulan,
    jadwal,
    isLoadingProvinsi,
    isLoadingKabkota,
    isLoadingJadwal,
    error,
    activeTab,
    setActiveTab,
    onProvinsiChange,
    onKabkotaChange,
    onBulanChange,
    retryLastAction,
  };
};
