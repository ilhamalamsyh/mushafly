import { useCallback, useEffect, useState } from "react";
import type { DoaItem } from "../types/doa";
import { getDoaById } from "../services/doaService";

export const useDoaDetailController = (id: number) => {
  const [doa, setDoa] = useState<DoaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoa = useCallback(async () => {
    if (!Number.isFinite(id) || id <= 0) {
      setDoa(null);
      setError("Doa tidak ditemukan.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getDoaById(id);
      setDoa(response.data ?? null);

      if (!response.data) {
        setError("Doa tidak ditemukan.");
      }
    } catch (err) {
      setDoa(null);
      setError(err instanceof Error ? err.message : "Gagal memuat detail doa.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadDoa();
  }, [loadDoa]);

  return {
    doa,
    isLoading,
    error,
    refetch: loadDoa,
  };
};
