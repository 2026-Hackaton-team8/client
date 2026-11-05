import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { clearSession, getSession, updateSession } from "./session";
import type { RefreshResponse } from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_BASE_URL = baseURL;

// Checked when a request goes out, not at import: pages are prerendered at build time and
// must not fail just because the build machine has no API address.
function requireBaseURL() {
  if (!baseURL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set. Add it to client/.env.");
  return baseURL;
}

// Every response is wrapped as { status, code, message, data }.
type Envelope<T> = { status: string; code: number; message: string; data: T };

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Auth endpoints run before there's a token; `retried` marks a request replayed after refresh.
// (Not `auth`: axios already uses that name for basic auth.)
type Config = InternalAxiosRequestConfig & { skipAuth?: boolean; retried?: boolean };

const http = axios.create();

http.interceptors.request.use((config: Config) => {
  config.baseURL = requireBaseURL();
  const token = config.skipAuth ? undefined : getSession()?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Several requests can hit 401 at once; they all wait on the same refresh.
let refreshing: Promise<boolean> | null = null;

function refreshTokens() {
  refreshing ??= (async () => {
    const refreshToken = getSession()?.refreshToken;
    if (!refreshToken) return false;
    try {
      const { data } = await axios.post<Envelope<RefreshResponse>>(
        "/api/auth/refresh",
        { refreshToken },
        { baseURL: requireBaseURL() },
      );
      updateSession(data.data);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

http.interceptors.response.use(undefined, async (error: AxiosError<Partial<Envelope<unknown>>>) => {
  const config = error.config as Config | undefined;
  const status = error.response?.status ?? 0;

  if (status === 401 && config && !config.skipAuth && !config.retried) {
    if (await refreshTokens()) return http({ ...config, retried: true } as Config);
    clearSession();
    // Outside React, so no router here; a full reload also drops any stale in-memory state.
    window.location.replace("/login");
  }

  throw new ApiError(status, error.response?.data?.message ?? "요청을 처리하지 못했어요.");
});

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  // Auth endpoints run before there's a token.
  auth?: boolean;
};

export async function api<T>(path: string, { method = "GET", body, query, auth }: Options = {}) {
  const { data } = await http.request<Envelope<T>>({
    url: path,
    method,
    data: body,
    params: query,
    skipAuth: auth === false,
  } as Config);
  return data?.data as T;
}

// File URLs may come back relative to the API ("/files/…"); point those at the API host.
export function fileUrl(url: string) {
  return /^https?:\/\//.test(url) || !baseURL ? url : new URL(url, baseURL).toString();
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "알 수 없는 오류가 났어요.";
}
