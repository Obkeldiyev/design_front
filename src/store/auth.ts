import { create } from "zustand";
import { tokenStore } from "@/lib/api/client";
import { AuthAPI, UserAPI, SuperAdminAPI } from "@/lib/api/resources";
import type { User } from "@/lib/api/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

function extractTokens(payload: Record<string, unknown>): {
  access?: string;
  refresh?: string;
} {
  const access =
    (payload.accessToken as string) ??
    (payload.access_token as string) ??
    (payload.token as string) ??
    ((payload.tokens as Record<string, string> | undefined)?.accessToken);
  const refresh =
    (payload.refreshToken as string) ??
    (payload.refresh_token as string) ??
    ((payload.tokens as Record<string, string> | undefined)?.refreshToken);
  return { access, refresh };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  init: async () => {
    // Already initialized (e.g. just logged in) — do nothing
    if (get().initialized) return;

    if (!tokenStore.access) {
      set({ initialized: true });
      return;
    }
    try {
      const user = await UserAPI.profile();
      set({ user, initialized: true });
    } catch (e: any) {
      // Only clear token on actual auth failures (401/403)
      // — NOT on network errors or server errors so offline doesn't log the user out
      const status = e?.response?.status ?? e?.status;
      if (status === 401 || status === 403) {
        tokenStore.clear();
        set({ user: null, initialized: true });
      } else {
        // Network error / server down — keep token, mark initialized with no user
        // The layout will redirect to login, user can retry
        set({ user: null, initialized: true });
      }
    }
  },
  login: async (identifier, password) => {
    set({ loading: true });
    try {
      let res: Record<string, unknown> = {};
      if (identifier.includes("@")) {
        res = await AuthAPI.login(identifier, password);
      } else {
        res = await SuperAdminAPI.login({ username: identifier, password });
      }
      const { access, refresh } = extractTokens(res);
      if (!access) throw new Error("No access token returned by backend");
      tokenStore.set(access, refresh);

      // Extract user from login response directly — avoids a second round-trip
      const user =
        (res.user as User | undefined) ??
        (res.superAdmin as User | undefined) ??
        null;

      if (user) {
        set({ user, loading: false, initialized: true });
      } else {
        // Fallback: fetch profile (e.g. OAuth flows that don't return user inline)
        const fetched = await UserAPI.profile();
        set({ user: fetched, loading: false, initialized: true });
      }
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },
  register: async (data) => {
    set({ loading: true });
    try {
      const res = await AuthAPI.register(data);
      const { access, refresh } = extractTokens(res);
      if (access) {
        tokenStore.set(access, refresh);
        const user = (res.user as User | undefined) ?? null;
        if (user) {
          set({ user, loading: false, initialized: true });
        } else {
          const fetched = await UserAPI.profile();
          set({ user: fetched, loading: false, initialized: true });
        }
      } else {
        // Backend may require separate login after register
        await get().login(data.email, data.password);
      }
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },
  logout: () => {
    tokenStore.clear();
    set({ user: null });
  },
  refreshUser: async () => {
    try {
      const user = await UserAPI.profile();
      set({ user });
    } catch {
      // ignore
    }
  },
}));
