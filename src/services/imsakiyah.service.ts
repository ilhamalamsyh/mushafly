import type { ApiResponse, ImsakiyahData } from "../models/imsakiyah.model";
import { API_BASE } from "../constants";

const BASE_URL = `${API_BASE}/imsakiyah`;

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

export const getProvinsi = async (): Promise<ApiResponse<string[]>> => {
  const response = await fetch(`${BASE_URL}/provinsi`);
  const data = await parseResponse<string[]>(response);
  return { code: 200, message: "ok", data };
};

export const getKabkota = async (
  provinsi: string,
): Promise<ApiResponse<string[]>> => {
  const response = await fetch(`${BASE_URL}/kabkota`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ provinsi }),
  });

  const data = await parseResponse<string[]>(response);
  return { code: 200, message: "ok", data };
};

export const getJadwal = async (
  provinsi: string,
  kabkota: string,
): Promise<ApiResponse<ImsakiyahData>> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ provinsi, kabkota }),
  });

  const data = await parseResponse<ImsakiyahData>(response);
  return { code: 200, message: "ok", data };
};
