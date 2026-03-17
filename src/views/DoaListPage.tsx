import { useNavigate } from "react-router-dom";
import DoaCard from "../components/doa/DoaCard";
import DoaEmptyState from "../components/doa/DoaEmptyState";
import DoaListSkeleton from "../components/doa/DoaListSkeleton";
import DoaSearchBar from "../components/doa/DoaSearchBar";
import GrupSelect from "../components/doa/GrupSelect";
import TagSelect from "../components/doa/TagSelect";
import { useDoaListController } from "../controllers/useDoaListController";
import { useToast } from "../hooks/useToast";
import type { DoaItem } from "../types/doa";

const DoaListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    displayedDoa,
    total,
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
  } = useDoaListController();

  const onBaca = (id: number) => {
    navigate(`/doa/${id}`);
  };

  const onBagikan = async (doa: DoaItem) => {
    try {
      const shareUrl = `${window.location.origin}/doa/${doa.id}`;

      if (navigator.share) {
        await navigator.share({
          title: doa.nama,
          text: doa.nama,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      showToast("Link berhasil disalin!", "success");
    } catch {
      showToast("Gagal membagikan doa.", "error");
    }
  };

  return (
    <main className="mx-auto mt-6 max-w-6xl px-4 pb-12">
      <section className="rounded-2xl border border-[#e2d9c5] bg-[#fdf6e3]/85 p-5 shadow-glass transition-colors duration-300 dark:border-[#1e2d4a] dark:bg-[#0f1a30]/85">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">
          Doa Harian
        </p>
        <h1 className="mt-2 text-3xl font-bold text-black dark:text-white sm:text-4xl">
          Kumpulan Doa Harian
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-black/70 dark:text-white/70">
          Kumpulan doa-doa harian dalam Islam lengkap dengan teks Arab,
          transliterasi, dan terjemahan bahasa Indonesia.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {total} Doa
          </span>
          <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {grupList.length} Kategori
          </span>
        </div>

        <div className="mt-6">
          <DoaSearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <GrupSelect
            value={selectedGrup}
            onChange={setSelectedGrup}
            options={grupList}
          />
          <TagSelect
            value={selectedTag}
            onChange={setSelectedTag}
            options={tagList}
          />
        </div>

        <p className="mt-4 text-sm text-black/70 dark:text-white/70">
          Menampilkan {displayedDoa.length} dari {total} doa
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>⚠️ {error}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-6">
        {isLoading && total === 0 ? <DoaListSkeleton /> : null}

        {!isLoading && displayedDoa.length === 0 ? <DoaEmptyState /> : null}

        {!isLoading && displayedDoa.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedDoa.map((doa) => (
              <DoaCard
                key={doa.id}
                doa={doa}
                onBaca={onBaca}
                onBagikan={onBagikan}
              />
            ))}
          </div>
        ) : null}
      </section>

      <footer className="mt-8 border-t border-[#e2d9c5] pt-4 text-xs text-black/70 dark:border-[#1e2d4a] dark:text-white/70">
        Sumber data: Bimas Islam Kementerian Agama RI
      </footer>
    </main>
  );
};

export default DoaListPage;
