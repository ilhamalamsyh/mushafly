import type { DoaDetailResponse, DoaListResponse } from "../types/doa";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_V1 as string | undefined) ??
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  "";

const parseJson = async <T extends { status?: string; message?: string }>(
  response: Response,
): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }

  const body = (await response.json()) as T;
  if (!body || typeof body !== "object") {
    throw new Error("Unexpected API response.");
  }

  if (body.status && body.status !== "success") {
    throw new Error(body.message || "Request failed.");
  }

  return body;
};

export const getAllDoa = async (params?: {
  grup?: string;
  tag?: string;
}): Promise<DoaListResponse> => {
  const query = new URLSearchParams();
  if (params?.grup) {
    query.set("grup", params.grup);
  }
  if (params?.tag) {
    query.set("tag", params.tag);
  }

  const qs = query.toString() ? `?${query.toString()}` : "";
  const response = await fetch(`${BASE_URL}/api/doa${qs}`);
  return parseJson<DoaListResponse>(response);
};

export const getDoaById = async (id: number): Promise<DoaDetailResponse> => {
  const response = await fetch(`${BASE_URL}/api/doa/${id}`);
  return parseJson<DoaDetailResponse>(response);
};
