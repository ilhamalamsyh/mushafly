import { useEffect, useMemo, useRef, useState } from "react";
import { useQuranController } from "../controllers/useQuranController";
import ErrorView from "../components/ErrorView";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";
import SurahCard from "../components/SurahCard";

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const HomePage = () => {
  const { surahList, isLoading, error, loadSurahList } = useQuranController();
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void loadSurahList();
  }, [loadSurahList]);

  const filtered = useMemo(() => {
    const key = normalizeText(query);
    if (!key) {
      return surahList;
    }
    return surahList.filter((surah) => {
      const haystack = normalizeText(
        `${surah.namaLatin} ${surah.nama} ${surah.nomor} ${surah.arti} ${surah.tempatTurun}`,
      );
      return haystack.includes(key);
    });
  }, [query, surahList]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12">
      <section className="relative mt-10 overflow-hidden rounded-3xl border border-white/50 bg-white/50 p-6 shadow-glass md:p-10">
        <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-mint/40 blur-3xl" />
        <div className="absolute -bottom-16 -right-8 h-48 w-48 rounded-full bg-coral/40 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-sea">
            Digital Al-Quran
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-black dark:text-white md:text-5xl">
            Read, listen, and bookmark ayat in one calm space.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-black/75 dark:text-white/75 md:text-base">
            Built with smooth navigation, qari preferences, transliteration
            toggles, and persistent bookmarks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                listRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="rounded-xl bg-black dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black"
            >
              Browse Surah
            </button>
            <span className="rounded-xl bg-white/70 dark:bg-white/10 px-4 py-2 text-sm text-black dark:text-white">
              114 Surah available
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-3 md:grid-cols-3">
        <article className="glass-card p-4 text-sm">
          Client-side search on Latin, Arabic, number, and meaning.
        </article>
        <article className="glass-card p-4 text-sm">
          Audio playback with one-player behavior per ayah.
        </article>
        <article className="glass-card p-4 text-sm">
          Preferences and bookmarks persist across reloads.
        </article>
      </section>

      <section ref={listRef} className="mt-10">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Surah List
          </h2>
          <div className="w-full md:w-96">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>

        {isLoading && surahList.length === 0 ? <Spinner /> : null}
        {error ? (
          <ErrorView message={error} onRetry={() => void loadSurahList()} />
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((surah) => (
            <SurahCard key={surah.nomor} surah={surah} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
