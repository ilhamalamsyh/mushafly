import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AyahCard from "../components/AyahCard";
import ErrorView from "../components/ErrorView";
import GlassCard from "../components/GlassCard";
import Spinner from "../components/Spinner";
import { QARI_MAP, ROUTES } from "../constants";
import { useQuranController } from "../controllers/useQuranController";
import { useQuranStore } from "../stores/quran.store";
import { useAudioStore } from "../stores/audio.store";

const SurahDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const surahId = Number(id);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [ayahFilter, setAyahFilter] = useState("");
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [surahSearch, setSurahSearch] = useState("");

  const {
    surahList,
    selectedSurah,
    isLoading,
    error,
    loadSurahList,
    loadSurahDetail,
  } = useQuranController();
  const {
    selectedQari,
    showTransliteration,
    showTranslation,
    setSelectedQari,
    toggleTransliteration,
    toggleTranslation,
    toggleBookmark,
    isBookmarked,
  } = useQuranStore();

  const { play, pause, stop } = useAudioStore();

  useEffect(() => {
    void loadSurahList();
  }, [loadSurahList]);

  useEffect(() => {
    if (Number.isNaN(surahId) || surahId < 1) {
      navigate(ROUTES.home);
      return;
    }
    void loadSurahDetail(surahId);
  }, [loadSurahDetail, navigate, surahId]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const filteredAyah = useMemo(() => {
    if (!selectedSurah) {
      return [];
    }

    const key = ayahFilter.trim().toLowerCase();
    if (!key) {
      return selectedSurah.ayat;
    }

    return selectedSurah.ayat.filter((ayah) => {
      const haystack =
        `${ayah.nomorAyat} ${ayah.teksArab} ${ayah.teksLatin} ${ayah.teksIndonesia}`.toLowerCase();
      return haystack.includes(key);
    });
  }, [ayahFilter, selectedSurah]);

  const filteredSurahList = useMemo(() => {
    const key = surahSearch.trim().toLowerCase();
    if (!key) return surahList;
    return surahList.filter(
      (surah) =>
        surah.namaLatin.toLowerCase().includes(key) ||
        surah.nomor.toString().includes(key) ||
        surah.nama.includes(key),
    );
  }, [surahSearch, surahList]);

  const playAudio = (
    url: string | undefined,
    ayahId: number | null = null,
    title?: string,
  ) => {
    if (!url) return;
    play(url, {
      surahId: selectedSurah?.nomor,
      ayahId: ayahId ?? undefined,
      title,
    });
    setPlayingAyah(ayahId);
  };

  const resolveQariKey = (available: string[], selected: string) => {
    if (!available || available.length === 0) return selected;
    if (available.includes(selected)) return selected;

    const selNum = String(parseInt(selected, 10));
    const match = available.find((k) => String(parseInt(k, 10)) === selNum);
    if (match) return match;

    return available[0] ?? selected;
  };

  if (isLoading && !selectedSurah) {
    return (
      <main className="mx-auto mt-10 max-w-6xl px-4">
        <Spinner />
      </main>
    );
  }

  if (error && !selectedSurah) {
    return (
      <main className="mx-auto mt-10 max-w-6xl px-4">
        <ErrorView
          message={error}
          onRetry={() => void loadSurahDetail(surahId)}
        />
      </main>
    );
  }

  if (!selectedSurah) {
    return null;
  }

  return (
    <main className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 pb-10 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block glass-card max-h-[80vh] overflow-auto p-3">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/65 dark:text-white/60">
          All Surah
        </p>
        <input
          type="text"
          placeholder="Search surah..."
          value={surahSearch}
          onChange={(e) => setSurahSearch(e.target.value)}
          className="mb-3 w-full rounded-lg border border-white/70 dark:border-white/20 bg-white/60 dark:bg-white/10 px-2 py-1.5 text-xs text-black placeholder-black/40 dark:text-white dark:placeholder-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea transition"
        />
        <div className="space-y-1">
          {filteredSurahList.map((surah) => (
            <Link
              key={surah.nomor}
              to={ROUTES.surahDetail(surah.nomor)}
              className={`block rounded-lg px-3 py-2 text-sm text-black dark:text-white ${surah.nomor === selectedSurah.nomor ? "bg-sea/20 font-semibold" : "hover:bg-white/60 dark:hover:bg-white/20"}`}
            >
              {surah.nomor}. {surah.namaLatin}
            </Link>
          ))}
        </div>
      </aside>

      <section className="space-y-4">
        <GlassCard className="p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
            className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea rounded-lg"
            aria-expanded={isHeaderExpanded}
            aria-label="Toggle surah details"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
              {/* Left: Number, Name, Location, Ayat */}
              <div className="space-y-3">
                {/* Number and Name in one row */}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sea/15 flex-shrink-0">
                    <span className="text-lg font-bold text-sea">
                      {selectedSurah.nomor}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
                      {selectedSurah.namaLatin}
                    </h1>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      {selectedSurah.arti}
                    </p>
                  </div>
                </div>

                {/* Location and Ayat */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-5 w-5 text-sea"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2c-4.41 0-8 3.59-8 8 0 4.99 5.15 10.74 7.3 13.04.5.58 1.4.58 1.9 0C14.85 20.74 20 14.99 20 10c0-4.41-3.59-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                      />
                    </svg>
                    <p className="text-xs uppercase tracking-[0.05em] text-sea font-medium">
                      {selectedSurah.tempatTurun}
                    </p>
                  </div>
                  <div className="rounded-lg bg-mint/10 px-3 py-1">
                    <p className="text-xs font-medium text-sea">
                      {selectedSurah.jumlahAyat} Ayat
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Arabic Name */}
              <div className="flex flex-col items-end justify-start">
                <p
                  className="arabic-text text-2xl font-semibold text-black dark:text-white sm:text-3xl"
                  dir="rtl"
                  lang="ar"
                >
                  {selectedSurah.nama}
                </p>
              </div>

              {/* Expand Icon */}
              <div className="flex items-center justify-center">
                <span
                  className={`text-2xl transition-transform duration-300 ${
                    isHeaderExpanded ? "rotate-180" : ""
                  }`}
                >
                  ⌄
                </span>
              </div>
            </div>
          </button>

          {/* Description (Expanded) */}
          {isHeaderExpanded ? (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="border-t border-white/20 pt-4">
                <div
                  className="prose prose-sm max-w-none text-sm text-black/80 dark:text-white/80"
                  dangerouslySetInnerHTML={{ __html: selectedSurah.deskripsi }}
                />
              </div>
            </div>
          ) : null}

          {/* Play Audio Full Button */}
          <button
            type="button"
            onClick={() => {
              const available = Object.keys(selectedSurah.audioFull || {});
              const effective = resolveQariKey(available, selectedQari);
              const url = selectedSurah.audioFull[effective];
              playAudio(url, null, `${selectedSurah.namaLatin} — Full`);
            }}
            className="mt-4 btn-primary w-full sm:w-auto"
          >
            ▶ Play Audio Full
          </button>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-medium text-black dark:text-white">
              Filter ayah
              <input
                value={ayahFilter}
                onChange={(event) => setAyahFilter(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/70 dark:border-white/20 bg-white/60 dark:bg-white/10 px-3 py-2.5 text-sm text-black placeholder-black/40 dark:text-white dark:placeholder-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea transition"
                placeholder="number or text"
              />
            </label>

            <label className="text-xs font-medium text-black dark:text-white">
              Qari
              <select
                value={selectedQari}
                onChange={(event) => setSelectedQari(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/70 dark:border-white/20 bg-white/60 dark:bg-white/10 px-3 py-2.5 text-sm text-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea transition cursor-pointer"
              >
                {Object.entries(QARI_MAP).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col ">
              <span className="text-xs font-medium text-black dark:text-white mb-2">
                Transliteration
              </span>
              <button
                type="button"
                onClick={toggleTransliteration}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  showTransliteration
                    ? "bg-sea"
                    : "bg-white/60 dark:bg-white/20"
                }`}
                role="switch"
                aria-checked={showTransliteration}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    showTransliteration ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col ">
              <span className="text-xs font-medium text-black dark:text-white mb-2">
                Translation
              </span>
              <button
                type="button"
                onClick={toggleTranslation}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  showTranslation ? "bg-sea" : "bg-white/60 dark:bg-white/20"
                }`}
                role="switch"
                aria-checked={showTranslation}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    showTranslation ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3">
          {filteredAyah.map((ayah) => {
            // resolve ayah audio url robustly: prefer selectedQari, fallback to first available
            const available = Object.keys(ayah.audio || {});
            const effectiveQari = resolveQariKey(available, selectedQari);
            const ayahUrl = ayah.audio[effectiveQari];

            return (
              <AyahCard
                key={ayah.nomorAyat}
                surahId={selectedSurah.nomor}
                ayah={ayah}
                qari={selectedQari}
                isPlaying={playingAyah === ayah.nomorAyat}
                isBookmarked={isBookmarked(selectedSurah.nomor, ayah.nomorAyat)}
                showTransliteration={showTransliteration}
                showTranslation={showTranslation}
                onPlay={() =>
                  playAudio(ayahUrl, ayah.nomorAyat, `Ayah ${ayah.nomorAyat}`)
                }
                onToggleBookmark={toggleBookmark}
              />
            );
          })}
        </div>

        <GlassCard className="flex items-center justify-between p-4 text-sm">
          <button
            type="button"
            disabled={!selectedSurah.suratSebelumnya}
            onClick={() =>
              selectedSurah.suratSebelumnya &&
              navigate(ROUTES.surahDetail(selectedSurah.suratSebelumnya.nomor))
            }
            className="rounded-lg bg-white/70 dark:bg-white/10 text-black dark:text-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-white/80 dark:hover:bg-white/20"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!selectedSurah.suratSelanjutnya}
            onClick={() =>
              selectedSurah.suratSelanjutnya &&
              navigate(ROUTES.surahDetail(selectedSurah.suratSelanjutnya.nomor))
            }
            className="rounded-lg bg-white/70 dark:bg-white/10 text-black dark:text-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-white/80 dark:hover:bg-white/20"
          >
            Next
          </button>
        </GlassCard>
      </section>
    </main>
  );
};

export default SurahDetailPage;
