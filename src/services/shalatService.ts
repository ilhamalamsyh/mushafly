import type { ApiResponse, JadwalShalatData } from "../types/shalat";
import { API_BASE } from "../constants";

const BASE_URL = `${API_BASE}/shalat`;

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }
  const body = (await response.json()) as ApiResponse<T>;
  if (!body || typeof body !== "object" || body.code !== 200) {
    throw new Error("Unexpected API response.");
  }
  return body.data;
};

export const getShalatProvinsi = async (): Promise<ApiResponse<string[]>> => {
  const response = await fetch(`${BASE_URL}/provinsi`);
  const data = await parseResponse<string[]>(response);
  return { code: 200, message: "ok", data };
};

export const getShalatKabkota = async (
  provinsi: string,
): Promise<ApiResponse<string[]>> => {
  const response = await fetch(`${BASE_URL}/kabkota`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinsi }),
  });
  const data = await parseResponse<string[]>(response);
  return { code: 200, message: "ok", data };
};

export const getJadwalShalat = async (
  provinsi: string,
  kabkota: string,
  bulan: number,
  tahun: number,
): Promise<ApiResponse<JadwalShalatData>> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinsi, kabkota, bulan, tahun }),
  });
  const data = await parseResponse<JadwalShalatData>(response);
  return { code: 200, message: "ok", data };
};
