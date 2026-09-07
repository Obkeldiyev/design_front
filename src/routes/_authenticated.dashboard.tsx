import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BusinessAPI, DesignAPI, QRAPI, WebsiteAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Contact,
  Copy,
  FileText,
  Globe,
  Layers,
  Palette,
  Plus,
  QrCode,
  Settings,
  Share2,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Design, QRCodeRecord, Website } from "@/lib/api/types";
import { BrandLogo } from "@/components/layout/BrandLogo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard - card24" }] }),
  component: Dashboard,
});

type StatCardProps = {
  icon: typeof Layers;
  label: string;
  value: string | number;
  description: string;
};

type Shortcut = {
  icon: typeof Layers;
  label: string;
  description: string;
  to: string;
  primary?: boolean;
  disabled?: boolean;
};

type RecentProject = {
  id: string;
  title: string;
  type: string;
  status: string;
  updatedAt?: string;
  to: string;
  params?: Record<string, string>;
};

type OnboardingStep = {
  icon: typeof Layers;
  label: string;
  description: string;
  done: boolean;
  to: string;
  action: string;
};

function StatCard({ icon: Icon, label, value, description }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-400">{label}</div>
          <div className="mt-2 font-display text-3xl font-semibold text-white">{value}</div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md bg-sky-400/10 text-sky-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">{description}</p>
    </div>
  );
}

function ShortcutCard({ shortcut, priorityLabel }: { shortcut: Shortcut; priorityLabel: string }) {
  const Icon = shortcut.icon;

  if (shortcut.disabled) {
    return (
      <div className="min-h-[132px] rounded-lg border border-dashed border-white/10 bg-white/[0.03] p-4 opacity-70">
        <div className="flex h-full flex-col gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-white/[0.04] text-slate-500">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-300">{shortcut.label}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">{shortcut.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={shortcut.to}
      className={[
        "group block min-h-[132px] rounded-lg border bg-white/[0.04] p-4 shadow-sm transition",
        "hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:shadow-md",
        "active:translate-y-0 active:bg-white/[0.06]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        shortcut.primary ? "border-primary/35 bg-primary/10" : "border-white/10",
      ].join(" ")}
    >
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-sky-400/10 text-sky-300 transition group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-5 w-5" />
          </div>
          {shortcut.primary && (
            <span className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
              {priorityLabel}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{shortcut.label}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">{shortcut.description}</p>
        </div>
      </div>
    </Link>
  );
}

function NextStepCard({
  step,
  title,
  progressLabel,
  openLabel,
}: {
  step: OnboardingStep;
  title: string;
  progressLabel: string;
  openLabel: string;
}) {
  const Icon = step.icon;

  return (
    <div className="rounded-lg border border-primary/25 bg-primary/10 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {progressLabel}
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold tracking-normal">{title}</h2>
          <p className="mt-1 text-sm font-semibold">{step.label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">{step.description}</p>
        </div>
      </div>
      <Button asChild className="mt-4 w-full">
        <Link to={step.to}>
          {step.action || openLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function WorkflowStepCard({ step, index }: { step: OnboardingStep; index: number }) {
  const Icon = step.icon;

  return (
    <Link
      to={step.to}
      className={[
        "group rounded-lg border bg-white/[0.04] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:shadow-md",
        step.done ? "border-emerald-400/35" : "border-white/10",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${
            step.done
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-white/[0.06] text-slate-400 group-hover:bg-primary group-hover:text-primary-foreground"
          }`}
        >
          {step.done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{index + 1}</p>
          <h3 className="mt-1 text-sm font-semibold text-white">{step.label}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">{step.description}</p>
        </div>
      </div>
    </Link>
  );
}

function DashboardIdentityMock() {
  return (
    <div className="relative mx-auto aspect-[85/55] w-full max-w-sm">
      <div className="absolute left-8 top-2 h-full w-full rotate-[-9deg] rounded-[28px] border border-sky-200/30 bg-white/10 shadow-[0_0_80px_rgba(56,189,248,0.22)] backdrop-blur" />
      <div className="absolute inset-0 rotate-[5deg] overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-blue-500 via-blue-600 to-slate-950 p-7 shadow-[0_30px_100px_rgba(37,99,235,0.55)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.26),transparent_35%),radial-gradient(circle_at_85%_12%,rgba(56,189,248,0.22),transparent_34%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/18">
              <div className="h-9 w-9 rounded-full bg-white shadow-sm" />
            </div>
            <div>
              <div className="h-3 w-36 rounded-full bg-white" />
              <div className="mt-3 h-2.5 w-24 rounded-full bg-sky-100/70" />
            </div>
          </div>
          <div className="grid h-12 w-12 grid-cols-3 gap-1 rounded-xl bg-white p-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className={`rounded-sm ${[0, 2, 3, 4, 6, 8].includes(index) ? "bg-slate-950" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>
        <div className="relative mt-10 space-y-3">
          <div className="h-3 w-56 rounded-full bg-white/90" />
          <div className="h-3 w-44 rounded-full bg-white/55" />
          <div className="h-3 w-32 rounded-full bg-white/35" />
        </div>
        <div className="relative mt-12 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
            Create. Share. Be You.
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            Live
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const normalized = status ?? "DRAFT";
  const cls =
    normalized === "PUBLISHED" || normalized === "SAVED"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : normalized === "ARCHIVED" || normalized === "DISABLED"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";

  return <span className={`rounded-md px-2 py-1 text-xs font-medium ${cls}`}>{normalized}</span>;
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(value),
  );
}

function Dashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const businesses = useQuery({ queryKey: ["businesses"], queryFn: BusinessAPI.list });
  const designs = useQuery({ queryKey: ["designs"], queryFn: DesignAPI.list });
  const websites = useQuery({ queryKey: ["websites"], queryFn: WebsiteAPI.list });
  const qrCodes = useQuery({ queryKey: ["qrCodes"], queryFn: QRAPI.list, retry: false });

  const businessItems = Array.isArray(businesses.data) ? businesses.data : [];
  const designItems = Array.isArray(designs.data) ? designs.data : [];
  const websiteItems = Array.isArray(websites.data) ? websites.data : [];
  const qrItems = Array.isArray(qrCodes.data) ? qrCodes.data : [];
  const totalQrScans = qrItems.reduce((sum, item) => sum + (item.scanCount ?? 0), 0);
  const publishedCount =
    designItems.filter((item) => item.status === "PUBLISHED").length +
    websiteItems.filter((item) => item.status === "PUBLISHED").length;
  const hasPublishedContent = publishedCount > 0 || totalQrScans > 0;

  const onboarding: OnboardingStep[] = [
    {
      icon: Settings,
      label: t("dashboard.onboarding.profile"),
      description: t("dashboard.workflow.profile_desc"),
      done: Boolean(user?.firstName && user?.lastName),
      to: "/settings",
      action: t("dashboard.workflow.open_profile"),
    },
    {
      icon: Briefcase,
      label: t("dashboard.onboarding.business"),
      description: t("dashboard.workflow.business_desc"),
      done: businessItems.length > 0,
      to: "/businesses/new",
      action: t("dashboard.workflow.open_business"),
    },
    {
      icon: Layers,
      label: t("dashboard.onboarding.card"),
      description: t("dashboard.workflow.card_desc"),
      done: designItems.length > 0,
      to: "/designs/new",
      action: t("dashboard.workflow.open_card"),
    },
    {
      icon: Globe,
      label: t("dashboard.onboarding.website"),
      description: t("dashboard.workflow.website_desc"),
      done: websiteItems.length > 0,
      to: "/websites/new",
      action: t("dashboard.workflow.open_website"),
    },
    {
      icon: QrCode,
      label: t("dashboard.onboarding.qr"),
      description: t("dashboard.workflow.qr_desc"),
      done: qrItems.length > 0,
      to: "/qr/new",
      action: t("dashboard.workflow.open_qr"),
    },
    {
      icon: Copy,
      label: t("dashboard.onboarding.publish"),
      description: t("dashboard.workflow.publish_desc"),
      done: publishedCount > 0,
      to: designItems.length > 0 ? "/designs" : "/websites",
      action: t("dashboard.workflow.open_publish"),
    },
    {
      icon: Share2,
      label: t("dashboard.onboarding.share"),
      description: t("dashboard.workflow.share_desc"),
      done: totalQrScans > 0,
      to: "/analytics",
      action: t("dashboard.workflow.open_analytics"),
    },
  ];
  const completedSteps = onboarding.filter((item) => item.done).length;
  const nextStep =
    onboarding.find((item) => !item.done) ??
    ({
      icon: BarChart3,
      label: t("dashboard.next_step_done"),
      description: t("dashboard.next_step_done_desc"),
      done: true,
      to: "/analytics",
      action: t("dashboard.workflow.open_analytics"),
    } satisfies OnboardingStep);

  const shortcuts: Array<{ category: string; items: Shortcut[] }> = [
    {
      category: t("dashboard.shortcut_groups.business_cards"),
      items: [
        {
          icon: Plus,
          label: t("dashboard.shortcuts.create_card"),
          description: t("dashboard.shortcuts.create_card_desc"),
          to: "/designs/new",
          primary: true,
        },
        {
          icon: Layers,
          label: t("dashboard.shortcuts.my_cards"),
          description: t("dashboard.shortcuts.my_cards_desc"),
          to: "/designs",
        },
        {
          icon: Palette,
          label: t("dashboard.shortcuts.templates"),
          description: t("dashboard.shortcuts.templates_desc"),
          to: "/templates",
        },
      ],
    },
    {
      category: t("dashboard.shortcut_groups.websites"),
      items: [
        {
          icon: Globe,
          label: t("dashboard.shortcuts.create_website"),
          description: t("dashboard.shortcuts.create_website_desc"),
          to: "/websites/new",
          primary: true,
        },
        {
          icon: FileText,
          label: t("dashboard.shortcuts.edit_website"),
          description: t("dashboard.shortcuts.edit_website_desc"),
          to: "/websites",
        },
      ],
    },
    {
      category: t("dashboard.shortcut_groups.growth"),
      items: [
        {
          icon: QrCode,
          label: t("dashboard.shortcuts.create_qr"),
          description: t("dashboard.shortcuts.create_qr_desc"),
          to: "/qr/new",
          primary: true,
        },
        {
          icon: Share2,
          label: t("dashboard.shortcuts.my_qr"),
          description: t("dashboard.shortcuts.my_qr_desc"),
          to: "/qr",
        },
        {
          icon: BarChart3,
          label: t("dashboard.shortcuts.analytics"),
          description: t("dashboard.shortcuts.analytics_desc"),
          to: "/analytics",
          disabled: !hasPublishedContent,
        },
      ],
    },
    {
      category: t("dashboard.shortcut_groups.account"),
      items: [
        {
          icon: Contact,
          label: t("dashboard.shortcuts.contacts"),
          description: t("dashboard.shortcuts.contacts_desc"),
          to: "/businesses",
        },
        {
          icon: Settings,
          label: t("dashboard.shortcuts.settings"),
          description: t("dashboard.shortcuts.settings_desc"),
          to: "/settings",
        },
      ],
    },
  ];

  const recentProjects: RecentProject[] = [
    ...designItems.map((item: Design) => ({
      id: item.id,
      title: item.title,
      type: t("dashboard.project_types.card"),
      status: item.status,
      updatedAt: item.updatedAt,
      to: "/editor/$designId",
      params: { designId: item.id },
    })),
    ...websiteItems.map((item: Website) => ({
      id: item.id,
      title: item.title,
      type: t("dashboard.project_types.website"),
      status: item.status,
      updatedAt: item.updatedAt,
      to: "/websites/$id/edit",
      params: { id: item.id },
    })),
    ...qrItems.map((item: QRCodeRecord) => ({
      id: item.id,
      title: item.title ?? item.slug,
      type: t("dashboard.project_types.qr"),
      status: "SAVED",
      updatedAt: item.updatedAt,
      to: "/qr",
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
    .slice(0, 6);

  const anyLoading =
    businesses.isLoading || designs.isLoading || websites.isLoading || qrCodes.isLoading;
  const anyError = businesses.isError || designs.isError || websites.isError;

  return (
    <div className="min-h-full bg-[#05070f]">
      <div className="mx-auto max-w-7xl space-y-8 p-4 text-slate-100 sm:p-6 md:p-10">
        <section className="relative overflow-hidden rounded-2xl border border-sky-300/15 bg-[#070b18] p-5 shadow-[0_30px_100px_rgba(2,8,28,0.65)] md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(47,107,255,0.24),transparent_42%),radial-gradient(circle_at_10%_85%,rgba(56,215,255,0.12),transparent_38%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,178,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,178,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <BrandLogo className="mb-5" imageClassName="h-12 w-12" />
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/25 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                {t("dashboard.welcome_badge")}
              </div>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-normal text-white md:text-5xl">
                {t("dashboard.title", { name: user?.firstName ?? t("dashboard.fallback_name") })}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                {t("dashboard.subtitle")}
              </p>
              <p className="mt-3 text-sm font-medium text-sky-100">{t("dashboard.next_action")}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Button asChild>
                  <Link to="/designs/new">
                    <Plus className="h-4 w-4" /> {t("dashboard.actions.create_card")}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white">
                  <Link to="/websites/new">
                    <Globe className="h-4 w-4" /> {t("dashboard.actions.create_website")}
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/qr/new">
                    <QrCode className="h-4 w-4" /> {t("dashboard.actions.create_qr")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-5 lg:w-[420px]">
              <DashboardIdentityMock />
              <NextStepCard
                step={nextStep}
                title={t("dashboard.next_step_title")}
                progressLabel={t("dashboard.progress_label", {
                  done: completedSteps,
                  total: onboarding.length,
                })}
                openLabel={t("dashboard.open_step")}
              />
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-sm">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              icon={Briefcase}
              label={t("dashboard.businesses")}
              value={businessItems.length}
              description={t("dashboard.stat_desc.businesses")}
            />
            <StatCard
              icon={Layers}
              label={t("dashboard.designs")}
              value={designItems.length}
              description={t("dashboard.stat_desc.cards")}
            />
            <StatCard
              icon={Globe}
              label={t("dashboard.websites")}
              value={websiteItems.length}
              description={t("dashboard.stat_desc.websites")}
            />
            <StatCard
              icon={QrCode}
              label={t("dashboard.qr_codes")}
              value={qrItems.length}
              description={t("dashboard.stat_desc.qr")}
            />
            <StatCard
              icon={BarChart3}
              label={t("dashboard.total_scans")}
              value={totalQrScans}
              description={t("dashboard.stat_desc.scans")}
            />
          </section>
        </div>

        {anyError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {t("dashboard.backend_error")}
          </div>
        )}

        <section>
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold tracking-normal text-white">
              {t("dashboard.start_here_title")}
            </h2>
            <p className="text-sm text-slate-400">{t("dashboard.start_here_subtitle")}</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {onboarding.slice(1, 5).map((step, index) => (
              <WorkflowStepCard key={step.label} step={step} index={index} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-normal">
                  {t("dashboard.shortcuts_title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("dashboard.shortcuts_subtitle")}
                </p>
              </div>
              <div className="mt-5 space-y-6">
                {shortcuts.map((group) => (
                  <div key={group.category}>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                      {group.category}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {group.items.map((shortcut) => (
                        <ShortcutCard
                          key={shortcut.label}
                          shortcut={shortcut}
                          priorityLabel={t("dashboard.priority")}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-normal">
                    {t("dashboard.recent_projects")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("dashboard.recent_projects_subtitle")}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/designs">{t("dashboard.view_all")}</Link>
                </Button>
              </div>

              {anyLoading && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  {t("dashboard.loading")}
                </div>
              )}

              {!anyLoading && recentProjects.length === 0 && (
                <div className="mt-5 rounded-lg border border-dashed border-border p-8 text-center">
                  <FileText className="mx-auto h-9 w-9 text-muted-foreground" />
                  <h3 className="mt-3 font-display text-lg font-semibold">
                    {t("dashboard.empty_recent_title")}
                  </h3>
                  <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                    {t("dashboard.empty_recent_desc")}
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/designs/new">
                      <Plus className="h-4 w-4" /> {t("dashboard.create_first")}
                    </Link>
                  </Button>
                </div>
              )}

              {recentProjects.length > 0 && (
                <div className="mt-5 divide-y divide-border rounded-lg border border-border">
                  {recentProjects.map((project) => (
                    <Link
                      key={`${project.type}-${project.id}`}
                      to={project.to}
                      params={project.params}
                      className="flex flex-col gap-3 p-4 transition hover:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold">{project.title}</h3>
                          <StatusBadge status={project.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {project.type}
                          {project.updatedAt
                            ? ` - ${t("dashboard.updated")} ${formatDate(project.updatedAt)}`
                            : ""}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        {t("dashboard.continue_editing")}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-normal">
                    {t("dashboard.onboarding_title")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("dashboard.onboarding_subtitle")}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {completedSteps}/{onboarding.length}
                </span>
              </div>
              <Progress className="mt-4" value={(completedSteps / onboarding.length) * 100} />
              <div className="mt-5 space-y-3">
                {onboarding.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-md ${item.done ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}
                    >
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </span>
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <h2 className="font-display text-xl font-semibold tracking-normal">
                {t("dashboard.feature_value_title")}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
                <p>
                  <strong className="text-foreground">
                    {t("dashboard.feature_value.card_title")}
                  </strong>{" "}
                  {t("dashboard.feature_value.card_desc")}
                </p>
                <p>
                  <strong className="text-foreground">
                    {t("dashboard.feature_value.website_title")}
                  </strong>{" "}
                  {t("dashboard.feature_value.website_desc")}
                </p>
                <p>
                  <strong className="text-foreground">
                    {t("dashboard.feature_value.qr_title")}
                  </strong>{" "}
                  {t("dashboard.feature_value.qr_desc")}
                </p>
                <p>
                  <strong className="text-foreground">
                    {t("dashboard.feature_value.analytics_title")}
                  </strong>{" "}
                  {t("dashboard.feature_value.analytics_desc")}
                </p>
              </div>
            </div>

            {!hasPublishedContent && (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-5">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
                <h2 className="mt-3 font-display text-lg font-semibold">
                  {t("dashboard.no_analytics_title")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {t("dashboard.no_analytics_desc")}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/designs/new">
                    <Copy className="h-4 w-4" /> {t("dashboard.publish_first")}
                  </Link>
                </Button>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
