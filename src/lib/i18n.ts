import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import uz from "@/locales/uz.json";

export const LANGS = [
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "uz", label: "O'zbekcha",  flag: "🇺🇿" },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

export const LANG_STORAGE_KEY = "cardify_lang";

// Always use the latest JSON bundles — works both on first load and HMR re-runs
const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ru", "uz"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    // Return key on missing — makes missing keys obvious in dev
    saveMissing: false,
  });
} else {
  // HMR: refresh all bundles so newly added keys are immediately available
  (["en", "ru", "uz"] as const).forEach((code) => {
    i18n.addResourceBundle(code, "translation", resources[code].translation, true, true);
  });
}

export function getStoredLang(): LangCode | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(LANG_STORAGE_KEY);
  return v === "en" || v === "ru" || v === "uz" ? v : null;
}

export function persistLang(code: LangCode) {
  if (typeof window !== "undefined")
    window.localStorage.setItem(LANG_STORAGE_KEY, code);
  if (i18n.resolvedLanguage !== code) void i18n.changeLanguage(code);
}

export function applyClientLocale() {
  const stored = getStoredLang();
  if (stored && i18n.resolvedLanguage !== stored) void i18n.changeLanguage(stored);
}

export default i18n;
