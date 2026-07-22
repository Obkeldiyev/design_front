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
          <span className="text-sm">Loading…</span>
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
            <span className="text-sm">Loading…</span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
