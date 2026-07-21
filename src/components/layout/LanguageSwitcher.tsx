import { Check, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS, persistLang, type LangCode } from "@/lib/i18n";
import { UserAPI } from "@/lib/api/resources";
import { useAuthStore } from "@/store/auth";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const current = LANGS.find((l) => l.code === i18n.resolvedLanguage) ?? LANGS[0];

  const choose = (code: LangCode) => {
    persistLang(code);
    if (user) {
      void UserAPI.update({ language: code }).catch(() => {
        /* best-effort sync */
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm hover:bg-muted"
          aria-label="Change language"
        >
          <Globe className="h-3.5 w-3.5 opacity-70" />
          <span className="text-base leading-none">{current.flag}</span>
          {!compact && (
            <span className="text-xs font-medium uppercase">{current.code}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => choose(l.code)}
            className="flex items-center gap-2"
          >
            <span className="text-base">{l.flag}</span>
            <span className="flex-1">{l.label}</span>
            {l.code === current.code && <Check className="h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
