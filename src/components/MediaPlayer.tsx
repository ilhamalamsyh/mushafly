import { useEffect } from "react";
import { useAudioStore } from "../stores/audio.store";
import { useQuranStore } from "../stores/quran.store";
import { QARI_MAP } from "../constants";

const format = (s: number) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

const MediaPlayer = () => {
  const { url, meta, isPlaying, currentTime, duration, pause, play, stop } =
    useAudioStore();
  const { selectedQari } = useQuranStore();

  useEffect(() => {
    // nothing extra for now
  }, [url, isPlaying]);

  // Only show media player for full surah audio (ayahId is undefined)
  // Hide it for individual ayah plays (progress shown inline in AyahCard)
  if (!url || meta?.ayahId !== undefined) return null;

  const selectedQariName = QARI_MAP[selectedQari] ?? "Reciter unknown";

  return (
    <div className="fixed left-0 right-0 bottom-3 z-50 mx-auto w-full max-w-3xl px-4">
      <div className="glass-card flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <div className="font-semibold text-black dark:text-white">
              {meta?.title ?? "Audio"}
            </div>
            <div className="text-xs text-black/60 dark:text-white/60">
              {meta?.surahId ? selectedQariName : ""}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button
            onClick={() => (isPlaying ? pause() : play(url, meta ?? undefined))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sea text-white transition-all hover:bg-sea/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="text-xs text-black/70 dark:text-white/70">
            {format(currentTime)} / {format(duration)}
          </div>

          <button
            onClick={() => stop()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-black/60 dark:text-white/60 transition-all hover:bg-white/40 dark:hover:bg-white/20 hover:text-black dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
            aria-label="Close"
            title="Close"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
