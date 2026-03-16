import { ReactNode } from "react";

export type AudioMap = Record<string, string>;

export interface Ayah {
  terjemahan: any;
  arabic: ReactNode;
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: AudioMap;
}
