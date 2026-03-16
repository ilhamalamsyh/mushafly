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
      <aside className="glass-card max-h-[80vh] overflow-auto p-3">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/65">
          All Surah
        </p>
        <div className="space-y-1">
          {surahList.map((surah) => (
            <Link
              key={surah.nomor}
              to={ROUTES.surahDetail(surah.nomor)}
              className={`block rounded-lg px-3 py-2 text-sm ${surah.nomor === selectedSurah.nomor ? "bg-sea/20 font-semibold" : "hover:bg-white/60"}`}
            >
              {surah.nomor}. {surah.namaLatin}
            </Link>
          ))}
        </div>
      </aside>

      <section className="space-y-4">
        <GlassCard className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sea">
                {selectedSurah.tempatTurun}
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-ink">
                {selectedSurah.namaLatin}
              </h1>
              <p
                className="arabic-text mt-1 text-right text-3xl"
                dir="rtl"
                lang="ar"
              >
                {selectedSurah.nama}
              </p>
              <p className="mt-2 text-sm text-ink/75">{selectedSurah.arti}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const available = Object.keys(selectedSurah.audioFull || {});
                const effective = resolveQariKey(available, selectedQari);
                const url = selectedSurah.audioFull[effective];
                playAudio(url, null, `${selectedSurah.namaLatin} — Full`);
              }}
              className="rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-white"
            >
              Play Audio Full
            </button>
          </div>
          <div
            className="prose prose-sm mt-4 max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedSurah.deskripsi }}
          />
        </GlassCard>

        <GlassCard className="p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-medium text-ink">
              Filter ayah
              <input
                value={ayahFilter}
                onChange={(event) => setAyahFilter(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/70 bg-white/60 px-2 py-2 text-sm"
                placeholder="number or text"
              />
            </label>

            <label className="text-xs font-medium text-ink">
              Qari
              <select
                value={selectedQari}
                onChange={(event) => setSelectedQari(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/70 bg-white/60 px-2 py-2 text-sm"
              >
                {Object.entries(QARI_MAP).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={toggleTransliteration}
              className="rounded-lg border border-white/70 bg-white/60 px-2 py-2 text-xs font-semibold text-ink"
            >
              Transliteration: {showTransliteration ? "ON" : "OFF"}
            </button>

            <button
              type="button"
              onClick={toggleTranslation}
              className="rounded-lg border border-white/70 bg-white/60 px-2 py-2 text-xs font-semibold text-ink"
            >
              Translation: {showTranslation ? "ON" : "OFF"}
            </button>
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
            className="rounded-lg bg-white/70 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="rounded-lg bg-white/70 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </GlassCard>
      </section>
    </main>
  );
};

export default SurahDetailPage;
