import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  QrCode,
  Globe,
  BarChart3,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function AppSidebar() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin =
    user?.role?.name === "ADMIN" || user?.role?.name === "SUPER_ADMIN";

  const NAV = [
    { to: "/dashboard",  icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/businesses", icon: Briefcase,        label: t("nav.businesses") },
    { to: "/designs",    icon: Layers,           label: t("nav.designs") },
    { to: "/qr",         icon: QrCode,           label: t("nav.qr") },
    { to: "/websites",   icon: Globe,            label: t("nav.websites") },
    { to: "/analytics",  icon: BarChart3,        label: t("nav.analytics") },
    { to: "/billing",    icon: CreditCard,       label: t("nav.billing") },
    { to: "/settings",   icon: Settings,         label: t("nav.settings") },
  ] as const;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col
      bg-white dark:bg-gray-950
      border-r border-gray-100 dark:border-gray-800
      shadow-[1px_0_0_0_#f0f0f8] dark:shadow-[1px_0_0_0_#1f2937]">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/40">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-display text-lg font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
          Cardify
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 pb-4 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/60 dark:to-blue-950/60 text-violet-700 dark:text-violet-300 shadow-[inset_0_0_0_1px_rgba(124,58,237,0.15)] dark:shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <item.icon
                className={`h-4 w-4 flex-shrink-0 ${
                  active
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all mt-1 ${
              pathname.startsWith("/admin")
                ? "bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/60 dark:to-blue-950/60 text-violet-700 dark:text-violet-300"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Shield className={`h-4 w-4 flex-shrink-0 ${pathname.startsWith("/admin") ? "text-violet-600 dark:text-violet-400" : "text-gray-400 dark:text-gray-500"}`} />
            {t("nav.admin")}
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-2">
        {/* Theme + language */}
        <div className="flex items-center justify-between gap-2 px-1">
          <LanguageSwitcher compact />
          <ThemeToggle />
        </div>

        {/* User card */}
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-blue-400 text-white text-sm font-bold flex-shrink-0 shadow-sm">
            {user?.firstName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
              {user ? `${user.firstName} ${user.lastName}` : "…"}
            </div>
            <div className="truncate text-xs text-gray-400 dark:text-gray-500">
              {user?.email}
            </div>
          </div>
          <button
            onClick={() => { logout(); window.location.href = "/login"; }}
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title={t("nav.logout")}
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
