import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/auth";

import appCss from "../styles.css?url";
import "@/lib/i18n";
import { applyClientLocale, persistLang } from "@/lib/i18n";
import { useThemeStore } from "@/store/theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">This page doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something broke</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cardify — AI Business Card & Digital Identity Platform" },
      {
        name: "description",
        content:
          "Create business cards, digital cards, QR codes and mini-websites in under 60 seconds with AI. The faster alternative to Canva for brand identity.",
      },
      { property: "og:title", content: "Cardify — AI Business Card Platform" },
      {
        property: "og:description",
        content: "Business cards, QR codes, digital cards and mini-sites in 60 seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `// Remove browser extension injected attributes that break hydration
try{(function(){const attrs=['data-new-gr-c-s-check-loaded','data-gr-ext-installed'];const el=document && document.body?document.body:document.documentElement;attrs.forEach(a=>{try{if(el&&el.hasAttribute&&el.hasAttribute(a))el.removeAttribute(a)}catch(e){}});})();}catch(e){}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthBootstrap() {
  const init = useAuthStore((s) => s.init);
  const user = useAuthStore((s) => s.user);
  const initTheme = useThemeStore((s) => s.init);
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  // Client-only: apply persisted locale + local theme on mount.
  useEffect(() => {
    applyClientLocale();
    initTheme();
    void init();
  }, [init, initTheme]);

  // When the user profile arrives, prefer server-side preferences.
  useEffect(() => {
    if (!user) return;
    if (user.language) persistLang(user.language);
    if (user.theme) hydrateTheme(user.theme);
  }, [user, hydrateTheme]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
