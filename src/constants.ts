export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api";

export const ROUTES = {
  home: "/",
  imsakiyah: "/imsakiyah",
  surahDetail: (id: number | string) => `/surah/${id}`,
};

export const QARI_MAP: Record<string, string> = {
  "01": "Abdullah Al-Juhany",
  "02": "Abdul Muhsin Al-Qasim",
  "03": "Abdurrahman As-Sudais",
  "04": "Ibrahim Al-Dossari",
  "05": "Misyari Rasyid Al-Afasi",
  "06": "Yasser Al-Dosari",
};

export const DEFAULT_QARI = "01";
