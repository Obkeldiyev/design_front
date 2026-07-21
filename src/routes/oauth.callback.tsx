import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { tokenStore } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth";

export const Route = createFileRoute("/oauth/callback")({
  validateSearch: (s: Record<string, unknown>) => ({
    accessToken: typeof s.accessToken === "string" ? s.accessToken : undefined,
    refreshToken: typeof s.refreshToken === "string" ? s.refreshToken : undefined,
    token: typeof s.token === "string" ? s.token : undefined,
  }),
  component: OAuthCallback,
});

function OAuthCallback() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const refreshUser = useAuthStore((s) => s.refreshUser);

  useEffect(() => {
    const access = search.accessToken ?? search.token;
    if (access) {
      tokenStore.set(access, search.refreshToken);
      refreshUser().then(() => navigate({ to: "/dashboard" }));
    } else {
      navigate({ to: "/login" });
    }
  }, [search, navigate, refreshUser]);

  return (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
      Signing you in...
    </div>
  );
}
