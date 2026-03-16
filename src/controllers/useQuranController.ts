import { useCallback } from "react";
import { fetchAllSurah, fetchSurahDetail } from "../services/quran.service";
import { useQuranStore } from "../stores/quran.store";

export const useQuranController = () => {
  const {
    surahList,
    selectedSurah,
    isLoading,
    error,
    setSurahList,
    setSelectedSurah,
    setIsLoading,
    setError,
  } = useQuranStore();

  const loadSurahList = useCallback(async () => {
    if (surahList.length > 0) {
      return { status: "cached" as const };
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllSurah();
      setSurahList(data);
      return { status: "success" as const };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load surah list.",
      );
      return { status: "error" as const };
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setSurahList, surahList.length]);

  const loadSurahDetail = useCallback(
    async (id: number | string) => {
      if (selectedSurah?.nomor === Number(id)) {
        return { status: "cached" as const };
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchSurahDetail(id);
        setSelectedSurah(data);
        return { status: "success" as const };
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load surah detail.",
        );
        return { status: "error" as const };
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSurah?.nomor, setError, setIsLoading, setSelectedSurah],
  );

  return {
    surahList,
    selectedSurah,
    isLoading,
    error,
    loadSurahList,
    loadSurahDetail,
  };
};
