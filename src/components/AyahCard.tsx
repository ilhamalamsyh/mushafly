import React, { useState } from "react";
import type { Ayah } from "../models/ayah.model";
import type { Bookmark } from "../stores/quran.store";
import GlassCard from "./GlassCard";
import { useAudioStore } from "../stores/audio.store";

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
  const { currentTime, duration, isPlaying: audioIsPlaying, meta, pause } = useAudioStore();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isCurrentAyahPlaying = meta?.ayahId === ayah.nomorAyat && meta?.surahId === surahId;
  const showPauseIcon = isCurrentAyahPlaying && audioIsPlaying;

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <GlassCard className={`${className} ${isPlaying ? "border-mint/70" : ""}`}>
      <div className="p-4">
        {/* Header: Circular Number + Buttons */}
        <div className="flex items-start gap-3">
          {/* Circular Number Badge (First) */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sea/15 border-2 border-sea/40 flex-shrink-0">
            <span className="text-sm font-bold text-sea">{ayah.nomorAyat}</span>
          </div>

          {/* Play and Bookmark Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (showPauseIcon) {
                  pause();
                } else {
                  onPlay(audioSrc, ayah.nomorAyat);
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sea/10 text-sea transition-all hover:bg-sea hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
              aria-pressed={showPauseIcon}
              aria-label={showPauseIcon ? "Playing" : "Play audio"}
              title={showPauseIcon ? "Pause" : "Play"}
            >
              {showPauseIcon ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onToggleBookmark?.({ surahId, ayahId: ayah.nomorAyat })
              }
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea ${
                isBookmarked
                  ? "bg-mint/20 text-mint hover:bg-mint hover:text-white"
                  : "bg-white/20 text-black/60 dark:text-white/60 hover:bg-mint/20 hover:text-mint"
              }`}
              aria-pressed={isBookmarked}
              aria-label={isBookmarked ? "Bookmarked" : "Bookmark"}
              title={isBookmarked ? "Bookmarked" : "Bookmark"}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v16l7-3 7 3V5c0-1.1.89-2 2-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar (when playing) */}
        {isPlaying ? (
          <div className="mt-[44px] flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-sea transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-black/60 dark:text-white/60 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        ) : null}

        {/* Arabic Text with increased spacing */}
        <div className="mt-[44px]">
          <p
            className="arabic-text text-right text-2xl font-semibold leading-[3.25rem] sm:text-3xl sm:leading-[3.75rem]"
            dir="rtl"
            lang="ar"
          >
            {ayah.teksArab}
          </p>

          {/* Transliteration with 8px more spacing (52px total from buttons) */}
          {showTransliteration ? (
            <p className="mt-12 text-sm italic text-black/70 dark:text-white/70">{ayah.teksLatin}</p>
          ) : null}

          {/* Translation with 8px more spacing (52px total from buttons) */}
          {showTranslation ? (
            <p className="mt-12 text-sm text-black/90 dark:text-white/90">{ayah.teksIndonesia}</p>
          ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
// ...existing code...
