export interface DoaItem {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
}

export interface DoaListResponse {
  status: string;
  total: number;
  data: DoaItem[];
  message?: string;
}

export interface DoaDetailResponse {
  status: string;
  data: DoaItem;
  message?: string;
}
