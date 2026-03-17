import { useCallback, useEffect, useMemo, useRef } from "react";
import { getAllDoa } from "../services/doaService";
import { useDoaStore } from "../stores/doa.store";

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const useDoaListController = () => {
  const {
    doaList,
    allDoa,
    selectedGrup,
    selectedTag,
    searchQuery,
    isLoading,
    error,
    setDoaList,
    setAllDoa,
    setSelectedGrup,
    setSelectedTag,
    setSearchQuery,
    setIsLoading,
    setError,
  } = useDoaStore();

  const requestIdRef = useRef(0);

  const fetchDoa = useCallback(
    async (filters?: { grup?: string; tag?: string }) => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAllDoa(filters);
        if (requestId !== requestIdRef.current) {
          return { status: "stale" as const };
        }

        setDoaList(response.data);
        setAllDoa(response.data);

        return { status: "success" as const, total: response.total };
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return { status: "stale" as const };
        }

        setError(
          err instanceof Error ? err.message : "Gagal memuat daftar doa.",
        );

        return { status: "error" as const };
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [setAllDoa, setDoaList, setError, setIsLoading],
  );

  const refetch = useCallback(async () => {
    await fetchDoa({
      grup: selectedGrup || undefined,
      tag: selectedTag || undefined,
    });
  }, [fetchDoa, selectedGrup, selectedTag]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const displayedDoa = useMemo(() => {
    const key = normalizeText(searchQuery);

    if (!key) {
      return allDoa;
    }

    return allDoa.filter((doa) => {
      const haystack = normalizeText(`${doa.nama} ${doa.idn} ${doa.ar}`);
      return haystack.includes(key);
    });
  }, [allDoa, searchQuery]);

  const grupList = useMemo(
    () => Array.from(new Set(doaList.map((item) => item.grup))).sort(),
    [doaList],
  );

  const tagList = useMemo(
    () => Array.from(new Set(doaList.flatMap((item) => item.tag ?? []))).sort(),
    [doaList],
  );

  return {
    doaList,
    displayedDoa,
    total: doaList.length,
    grupList,
    tagList,
    searchQuery,
    selectedGrup,
    selectedTag,
    isLoading,
    error,
    setSearchQuery,
    setSelectedGrup,
    setSelectedTag,
    refetch,
  };
};
