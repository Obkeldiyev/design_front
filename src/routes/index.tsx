import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode, Globe, Layers, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "card24 — Business Cards, QR & Digital Identity in 60 seconds" },
      {
        name: "description",
        content:
          "AI-assisted platform to design business cards, generate QR codes and launch mini-websites. Easier than Canva. Built for entrepreneurs.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const init = useAuthStore((s) => s.init);
  const features = [
    { icon: Layers, label: t("landing.features.cards"), desc: t("landing.features.cards_desc") },
    { icon: QrCode, label: t("landing.features.qr"), desc: t("landing.features.qr_desc") },
    { icon: Globe, label: t("landing.features.sites"), desc: t("landing.features.sites_desc") },
    { icon: Zap, label: t("landing.features.ai"), desc: t("landing.features.ai_desc") },
  ];

  useEffect(() => {
    if (!initialized) init();
  }, [init, initialized]);

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-sky-300/10 bg-[#070b18]/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo compact textClassName="text-white" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/templates" className="text-sm text-slate-400 hover:text-white">
              {t("nav.templates")}
            </Link>
            <Link to="/pricing" className="text-sm text-slate-400 hover:text-white">
              {t("nav.pricing")}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-slate-100 hover:bg-white/10">
                  {t("nav.dashboard")}
                </Button>
              </Link>
            ) : (
              <Link to="/login" search={{ next: "/dashboard" }}>
                <Button variant="ghost" size="sm" className="text-slate-100 hover:bg-white/10">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
            <Link to={user ? "/dashboard" : "/register"}>
              <Button size="sm">
                {user ? t("nav.dashboard") : t("nav.register")}{" "}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(47,107,255,0.24),transparent_38%),radial-gradient(circle_at_12%_82%,rgba(56,215,255,0.12),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,178,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,178,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-300/25 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t("landing.badge")}
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-normal text-white md:text-7xl">
              {t("landing.title_a")}{" "}
              <span className="bg-gradient-to-r from-sky-200 via-blue-400 to-primary bg-clip-text text-transparent">
                {t("landing.title_b")}
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300">{t("landing.subtitle")}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to={user ? "/dashboard" : "/register"}>
                <Button size="lg" className="h-12 px-6">
                  {user ? t("nav.dashboard") : t("landing.cta_start")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link
                to={user ? "/designs/new" : "/login"}
                search={user ? undefined : { next: "/designs/new" }}
              >
                <Button size="lg" variant="outline" className="h-12 px-6">
                  {user ? t("dashboard.actions.create_card") : t("landing.cta_browse")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
              >
                <f.icon className="h-5 w-5 text-sky-300" />
                <div className="mt-3 font-semibold text-white">{f.label}</div>
                <div className="text-sm text-slate-400">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-sky-300/10 bg-[#070b18] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              {t("landing.section_title")}
            </h2>
            <p className="mt-3 text-slate-400">{t("landing.section_sub")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: t("landing.f1_title"), body: t("landing.f1_body") },
              { title: t("landing.f2_title"), body: t("landing.f2_body") },
              { title: t("landing.f3_title"), body: t("landing.f3_body") },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <div className="font-display text-lg font-semibold text-white">{f.title}</div>
                <div className="mt-2 text-sm text-slate-400">{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-sky-300/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 md:flex-row">
          <div>© {new Date().getFullYear()} card24</div>
          <div className="flex items-center gap-6">
            <Link to="/pricing">{t("nav.pricing")}</Link>
            <Link to="/templates">{t("nav.templates")}</Link>
            {user ? (
              <Link to="/dashboard">{t("nav.dashboard")}</Link>
            ) : (
              <Link to="/login" search={{ next: "/dashboard" }}>
                {t("nav.login")}
              </Link>
            )}
            <LanguageSwitcher compact />
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
}
