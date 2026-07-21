import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api/client";
import { BlockRenderer } from "@/components/website-builder/BlockRenderer";
import type { Block, WebsiteTheme } from "@/lib/website-blocks";
import { DEFAULT_THEME } from "@/lib/website-blocks";

export const Route = createFileRoute("/site/$subdomain")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subdomain}` },
      { name: "description", content: "Published website" },
    ],
  }),
  component: PublicSite,
});

// ── API helper (no auth needed) ───────────────────────────────────────────────
function getApiBase(): string {
  // In production, API_URL is "/api" (relative) — prepend origin for fetch()
  const base = import.meta.env.VITE_API_URL as string ?? "http://localhost:9000";
  if (base.startsWith("/")) {
    return typeof window !== "undefined" ? `${window.location.origin}${base}` : base;
  }
  return base;
}

async function fetchPublicWebsite(subdomain: string) {
  const res = await fetch(`${getApiBase()}/website/public/${subdomain}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message ?? "Site not found");
  }
  return res.json() as Promise<{
    success: boolean;
    isDraft: boolean;
    website: {
      id: string;
      title: string;
      subdomain: string | null;
      customDomain: string | null;
      status: string;
      config: Record<string, unknown> | null;
      seo: Record<string, unknown> | null;
      business?: { name: string; logoUrl: string | null; slug: string } | null;
    };
  }>;
}

async function recordView(subdomain: string) {
  try {
    await fetch(`${getApiBase()}/website/public/${subdomain}/view`, { method: "POST" });
  } catch {
    // silently ignore
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
function PublicSite() {
  const { subdomain } = Route.useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-site", subdomain],
    queryFn: () => fetchPublicWebsite(subdomain),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  // Record view once when the page loads
  useEffect(() => {
    if (data?.website) {
      recordView(subdomain);
    }
  }, [subdomain, data?.website]);

  // ── SEO: update <title> dynamically ──
  useEffect(() => {
    if (data?.website?.title) {
      document.title = data.website.title;
    }
    const seo = data?.website?.seo as Record<string, string> | undefined;
    if (seo?.description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", seo.description);
    }
  }, [data]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm">Loading site…</span>
        </div>
      </div>
    );
  }

  // ── Error / Not found ─────────────────────────────────────────────────────
  if (error || !data?.website) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-center px-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold">Site not found</h1>
        <p className="text-muted-foreground max-w-sm">
          The address <code className="rounded bg-muted px-1 text-sm">{subdomain}</code> doesn't
          match any published site.
        </p>
        <a
          href="/"
          className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Go to homepage
        </a>
      </div>
    );
  }

  const { website, isDraft } = data;
  const cfg = website.config as Record<string, any> | null;
  const blocks: Block[] = Array.isArray(cfg?.blocks) ? cfg.blocks : [];
  const theme: WebsiteTheme = cfg?.theme ? { ...DEFAULT_THEME, ...cfg.theme } : DEFAULT_THEME;
  const visibleBlocks = blocks.filter((b) => b.visible !== false);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor }}>
      {/* Draft banner */}
      {isDraft && (
        <div className="bg-amber-500 text-white text-center text-sm font-semibold py-2 px-4 sticky top-0 z-50">
          ⚠ This site is in <strong>Draft</strong> mode — only you can see it.
          {" "}
          <a href="/websites" className="underline hover:no-underline">
            Publish it →
          </a>
        </div>
      )}

      {/* Render blocks */}
      {visibleBlocks.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <div className="text-5xl">🚧</div>
          <h1 className="text-xl font-semibold">Coming soon</h1>
          <p className="text-sm">This site is being built. Check back soon.</p>
        </div>
      ) : (
        visibleBlocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            theme={theme}
            editable={false}
          />
        ))
      )}

      {/* Powered-by footer badge */}
      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        Built with{" "}
        <a href="/" className="font-semibold text-primary hover:underline">
          Cardify
        </a>
      </div>
    </div>
  );
}
