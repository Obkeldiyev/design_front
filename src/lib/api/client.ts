import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// In production (deployed), API_URL is /api — relative to current origin.
// In dev (localhost), use the env var or fall back to localhost:9000.
// This runtime check ensures it works whether VITE_API_URL is set or not.
function resolveApiUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl) return envUrl;
  // If running in a browser and NOT on localhost, assume /api
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
    return "/api";
  }
  return "http://localhost:9000";
}

export const API_URL = resolveApiUrl();

const TOKEN_KEY = "cardify_access_token";
const REFRESH_KEY = "cardify_refresh_token";

export const tokenStore = {
  get access() {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh?: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, access);
    if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.access;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.refresh;
  if (!refreshToken) return null;
  try {
    const res = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
    const access = res.data?.accessToken ?? res.data?.access_token ?? res.data?.token;
    const refresh = res.data?.refreshToken ?? res.data?.refresh_token;
    if (access) {
      tokenStore.set(access, refresh ?? refreshToken);
      return access;
    }
    return null;
  } catch {
    tokenStore.clear();
    return null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt token refresh once per request
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      // Try to refresh the access token silently
      if (!refreshing) refreshing = refreshAccessToken();
      const newToken = await refreshing;
      refreshing = null;

      if (newToken) {
        original.headers.set("Authorization", `Bearer ${newToken}`);
        return api.request(original);
      }
      // Refresh failed — don't clear token here, let the auth store handle it
      // The next call to init() will detect the invalid token and clear it cleanly
    }

    return Promise.reject(error);
  },
);

export function apiError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    return (
      (e.response?.data as { message?: string; error?: string } | undefined)?.message ??
      (e.response?.data as { error?: string } | undefined)?.error ??
      e.message
    );
  }
  return (e as Error)?.message ?? "Unknown error";
}
