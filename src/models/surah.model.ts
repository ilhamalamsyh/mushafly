import type { Ayah, AudioMap } from "./ayah.model";

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: AudioMap;
}

export interface SurahListResponse {
  code: number;
  message: string;
  data: Surah[];
}

export interface SurahNeighbor {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

export interface SurahDetail extends Surah {
  ayat: Ayah[];
  suratSelanjutnya: SurahNeighbor | false;
  suratSebelumnya: SurahNeighbor | false;
}
