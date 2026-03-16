import { API_BASE } from "../constants";
import type { ApiResponse, Surah, SurahDetail } from "../models/surah.model";

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  const body = (await response.json()) as ApiResponse<T>;
  if (!body || typeof body !== "object" || body.code !== 200) {
    throw new Error("Unexpected API response. Please retry in a moment.");
  }

  return body.data;
};

export const fetchAllSurah = async (
  baseUrl: string = API_BASE,
): Promise<Surah[]> => {
  try {
    const response = await fetch(`${baseUrl}/surat`);
    return await parseResponse<Surah[]>(response);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Failed to load surah list: ${error.message}`
        : "Failed to load surah list.",
    );
  }
};

export const fetchSurahDetail = async (
  id: number | string,
  baseUrl: string = API_BASE,
): Promise<SurahDetail> => {
  try {
    const response = await fetch(`${baseUrl}/surat/${id}`);
    return await parseResponse<SurahDetail>(response);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Failed to load surah details: ${error.message}`
        : "Failed to load surah details.",
    );
  }
};
