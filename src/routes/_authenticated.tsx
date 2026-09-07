import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuthStore } from "@/store/auth";
import { tokenStore } from "@/lib/api/client";
import { BarChart3, Globe, LayoutDashboard, Layers, QrCode, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    if (!tokenStore.access) {
      throw redirect({
        to: "/login",
        search: { next: location.pathname },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { t } = useTranslation();
  const initialized = useAuthStore((s) => s.initialized);
  const user = useAuthStore((s) => s.user);
  const init = useAuthStore((s) => s.init);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!initialized) init();
  }, [initialized, init]);

  // Once initialized with no user — navigate to login via the router (no hard reload)
  useEffect(() => {
    if (initialized && !user && !tokenStore.access) {
      navigate({ to: "/login", search: { next: pathname } });
    }
  }, [initialized, user, navigate, pathname]);

  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm">{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Still have a token but no user object — show loading while profile retries
    // (or navigating to login if no token)
    if (tokenStore.access) {
      return (
        <div className="grid min-h-screen place-items-center text-muted-foreground">
          <div className="flex flex-col items-center gap-3">
            <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-sm">{t("common.loading")}</span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-auto flex flex-col pb-16 md:pb-0">
        <Outlet />
      </main>
      <MobileNav pathname={pathname} />
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const { t } = useTranslation();
  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/designs", icon: Layers, label: t("nav.designs") },
    { to: "/websites", icon: Globe, label: t("nav.websites") },
    { to: "/qr", icon: QrCode, label: t("nav.qr") },
    { to: "/analytics", icon: BarChart3, label: t("nav.analytics") },
    { to: "/settings", icon: Settings, label: t("nav.settings") },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-border bg-card/95 px-1 py-1 shadow-lg backdrop-blur md:hidden">
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
