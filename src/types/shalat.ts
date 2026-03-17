export interface JadwalShalatEntry {
  tanggal: number;
  tanggal_lengkap: string; // "2026-03-01"
  hari: string; // "Kamis"
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface JadwalShalatData {
  provinsi: string;
  kabkota: string;
  bulan: number;
  tahun: number;
  bulan_nama: string;
  jadwal: JadwalShalatEntry[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
