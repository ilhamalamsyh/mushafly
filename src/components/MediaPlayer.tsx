import { useEffect } from "react";
import { useAudioStore } from "../stores/audio.store";

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

  useEffect(() => {
    // nothing extra for now
  }, [url, isPlaying]);

  if (!url) return null;

  return (
    <div className="fixed left-0 right-0 bottom-3 z-50 mx-auto w-full max-w-3xl px-4">
      <div className="glass-card flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="text-sm">
            <div className="font-semibold">{meta?.title ?? "Audio"}</div>
            <div className="text-xs text-ink/60">
              {meta?.surahId ? `Surah ${meta.surahId}` : ""}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button
            onClick={() => (isPlaying ? pause() : play(url, meta ?? undefined))}
            className="btn-primary"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <div className="text-xs text-ink/70 ml-auto sm:ml-0">
            {format(currentTime)} / {format(duration)}
          </div>
          <button onClick={() => stop()} className="btn-ghost ml-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
