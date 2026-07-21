import { create } from "zustand";
import { UserAPI } from "@/lib/api/resources";
import { api } from "@/lib/api/client";

export type Theme = "light" | "dark";
const KEY = "cardify_theme";

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readStored(): Theme | null {
  if (typeof window === "undefined") return null;
  const s = window.localStorage.getItem(KEY);
  return s === "light" || s === "dark" ? s : null;
}

function systemPref(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function persist(t: Theme) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, t);
}

type S = {
  theme: Theme;
  /** Initialize from localStorage / system preference. Safe on client only. */
  init: () => void;
  /** Set explicitly (e.g. from server profile) without API write. */
  hydrate: (t: Theme) => void;
  /** Toggle and persist locally + to backend (if logged in). */
  toggle: () => void;
  /** Set value and persist locally + to backend (if logged in). */
  set: (t: Theme) => void;
};

async function pushToServer(theme: Theme) {
  try {
    // Use direct api call with header to avoid triggering global auth redirect on 401
    await api.put(
      "/user/profile",
      { theme },
      { headers: { "x-no-auth-redirect": "1" } as Record<string, string> }
    );
  } catch {
    /* best-effort; localStorage already persisted */
  }
}

export const useThemeStore = create<S>((set, get) => ({
  theme: "light",
  init: () => {
    const t = readStored() ?? systemPref();
    apply(t);
    set({ theme: t });
  },
  hydrate: (t) => {
    apply(t);
    persist(t);
    set({ theme: t });
  },
  toggle: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    apply(next);
    persist(next);
    set({ theme: next });
    void pushToServer(next);
  },
  set: (t) => {
    apply(t);
    persist(t);
    set({ theme: t });
    void pushToServer(t);
  },
}));
