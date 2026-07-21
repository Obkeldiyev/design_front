import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, QrCode, Globe, Layers, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardify — Business Cards, QR & Digital Identity in 60 seconds" },
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
  const features = [
    { icon: Layers, label: t("landing.features.cards"), desc: t("landing.features.cards_desc") },
    { icon: QrCode, label: t("landing.features.qr"), desc: t("landing.features.qr_desc") },
    { icon: Globe, label: t("landing.features.sites"), desc: t("landing.features.sites_desc") },
    { icon: Zap, label: t("landing.features.ai"), desc: t("landing.features.ai_desc") },
  ];
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 backdrop-blur sticky top-0 z-40 bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
              Cardify
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground">
              {t("nav.templates")}
            </Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              {t("nav.pricing")}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                {t("nav.register")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t("landing.badge")}
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              {t("landing.title_a")}{" "}
              <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                {t("landing.title_b")}
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {t("landing.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="h-12 px-6">
                  {t("landing.cta_start")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button size="lg" variant="outline" className="h-12 px-6">
                  {t("landing.cta_browse")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur"
              >
                <f.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 font-semibold">{f.label}</div>
                <div className="text-sm text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              {t("landing.section_title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("landing.section_sub")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: t("landing.f1_title"), body: t("landing.f1_body") },
              { title: t("landing.f2_title"), body: t("landing.f2_body") },
              { title: t("landing.f3_title"), body: t("landing.f3_body") },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="font-display text-lg font-semibold">{f.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Cardify</div>
          <div className="flex items-center gap-6">
            <Link to="/pricing">{t("nav.pricing")}</Link>
            <Link to="/templates">{t("nav.templates")}</Link>
            <Link to="/login">{t("nav.login")}</Link>
            <LanguageSwitcher compact />
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
}
