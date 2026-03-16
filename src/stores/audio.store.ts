import { create } from "zustand";

interface AudioMeta {
  surahId?: number;
  ayahId?: number;
  title?: string;
}

interface AudioState {
  url: string | null;
  meta: AudioMeta | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: (url: string, meta?: AudioMeta) => void;
  pause: () => void;
  stop: () => void;
}

let audioEl: HTMLAudioElement | null = null;

export const useAudioStore = create<AudioState>((set) => ({
  url: null,
  meta: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  play(url: string, meta: AudioMeta | undefined = undefined) {
    try {
      // If same audio is already loaded, resume playback from currentTime
      if (audioEl && audioEl.src && audioEl.src.includes(url)) {
        audioEl
          .play()
          .then(() => set({ url, meta: meta ?? null, isPlaying: true }))
          .catch(() => set({ isPlaying: false }));
        return;
      }

      // Otherwise, stop existing audio and create a new element
      if (audioEl) {
        audioEl.pause();
        audioEl.src = "";
        audioEl = null;
      }

      audioEl = new Audio(url);
      audioEl.preload = "auto";

      audioEl.onloadedmetadata = () => {
        set({ duration: audioEl?.duration ?? 0 });
      };

      audioEl.ontimeupdate = () => {
        set({ currentTime: audioEl?.currentTime ?? 0 });
      };

      audioEl.onended = () => {
        set({ isPlaying: false, url: null, meta: null, currentTime: 0 });
      };

      audioEl
        .play()
        .then(() => {
          set({ url, meta: meta ?? null, isPlaying: true });
        })
        .catch(() => {
          set({ isPlaying: false });
        });
    } catch (err) {
      set({ isPlaying: false });
    }
  },
  pause() {
    if (audioEl) {
      // Pause but keep audioEl so a subsequent play() with same URL will resume
      audioEl.pause();
      set({ isPlaying: false });
    }
  },
  stop() {
    if (audioEl) {
      audioEl.pause();
      audioEl.src = "";
      audioEl = null;
    }
    set({
      isPlaying: false,
      url: null,
      meta: null,
      currentTime: 0,
      duration: 0,
    });
  },
}));
