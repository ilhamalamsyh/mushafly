import React from "react";
import type { Ayah } from "../models/ayah.model";
import type { Bookmark } from "../stores/quran.store";
import GlassCard from "./GlassCard";

interface AyahCardProps {
  surahId: number;
  ayah: Ayah;
  qari: string;
  isPlaying: boolean;
  isBookmarked?: boolean;
  onPlay: (src?: string, ayahNumber?: number) => void;
  onToggleBookmark?: (bookmark: Bookmark) => void;
  className?: string;
  showTransliteration?: boolean; // added
  showTranslation?: boolean; // added
}

// ...existing code...
export default function AyahCard({
  surahId,
  ayah,
  qari,
  isPlaying,
  isBookmarked = false,
  onPlay,
  onToggleBookmark,
  className = "",
  showTransliteration = true,
  showTranslation = true,
}: AyahCardProps) {
  const audioSrc = ayah.audio?.[qari] ?? undefined;

  return (
    <GlassCard className={`${className} ${isPlaying ? "border-mint/70" : ""}`}>
      <div className="p-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="rounded-lg bg-sea/15 px-2 py-1 text-xs font-semibold text-sea">
            Ayah {ayah.nomorAyat}
          </span>

          <div className="flex w-full flex-col items-stretch gap-2 text-xs sm:flex-row sm:w-auto sm:items-center">
            <button
              type="button"
              onClick={() => onPlay(audioSrc, ayah.nomorAyat)}
              className="btn-primary"
              aria-pressed={isPlaying}
            >
              {isPlaying ? "Playing" : "Play"}
            </button>

            <button
              type="button"
              onClick={() =>
                onToggleBookmark?.({ surahId, ayahId: ayah.nomorAyat })
              }
              className={`btn-ghost ml-2 ${isBookmarked ? "text-mint" : ""}`}
              aria-pressed={isBookmarked}
            >
              {isBookmarked ? "Unsave" : "Save"}
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <p
            className="arabic-text mt-4 text-right text-2xl leading-relaxed sm:text-3xl"
            dir="rtl"
            lang="ar"
          >
            {ayah.teksArab}
          </p>
          {showTransliteration ? (
            <p className="mt-3 text-sm italic text-ink/70">{ayah.teksLatin}</p>
          ) : null}
          {showTranslation ? (
            <p className="mt-2 text-sm text-ink/90">{ayah.teksIndonesia}</p>
          ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
// ...existing code...
