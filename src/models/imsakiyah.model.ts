export interface ImsakiyahEntry {
  tanggal: number;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface ImsakiyahData {
  provinsi: string;
  kabkota: string;
  hijriah: string;
  masehi: string;
  imsakiyah: ImsakiyahEntry[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
