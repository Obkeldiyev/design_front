import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BusinessAPI, DesignAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { Layers, Briefcase, QrCode, Globe, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Cardify" }] }),
  component: Dashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Layers;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Dashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const businesses = useQuery({ queryKey: ["businesses"], queryFn: BusinessAPI.list });
  const designs = useQuery({ queryKey: ["designs"], queryFn: DesignAPI.list });

  const businessItems = Array.isArray(businesses.data) ? businesses.data : [];
  const designItems = Array.isArray(designs.data) ? designs.data : [];

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {t("dashboard.title", { name: user?.firstName ?? "there" })}
          </h1>
          <p className="mt-1 text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <Link to="/designs/new">
          <Button><Plus className="mr-1 h-4 w-4" /> {t("dashboard.new_design")}</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Briefcase} label={t("dashboard.businesses")} value={businessItems.length} />
        <StatCard icon={Layers} label={t("dashboard.designs")} value={designItems.length} />
        <StatCard icon={QrCode} label={t("dashboard.qr_codes")} value={0} />
        <StatCard icon={Globe} label={t("dashboard.websites")} value={0} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{t("dashboard.recent_designs")}</h2>
            <Link to="/designs" className="text-sm text-muted-foreground hover:text-foreground">{t("dashboard.view_all")}</Link>
          </div>
          {designs.isLoading && <div className="py-12 text-center text-sm text-muted-foreground">{t("dashboard.loading")}</div>}
          {designs.isError && <div className="py-12 text-center text-sm text-destructive">{t("dashboard.backend_error")}</div>}
          {designs.data && designs.data.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <div className="text-sm text-muted-foreground">{t("dashboard.no_designs")}</div>
              <Link to="/designs/new" className="mt-3 inline-block">
                <Button size="sm"><Plus className="mr-1 h-4 w-4" /> {t("dashboard.create_first")}</Button>
              </Link>
            </div>
          )}
          {designItems.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {designItems.slice(0, 6).map((d) => (
                <Link key={d.id} to="/editor/$designId" params={{ designId: d.id }}
                  className="group rounded-xl border border-border bg-background p-4 hover:border-primary">
                  <div className="aspect-[7/4] rounded-md" style={{ background: d.data?.canvas?.background ?? "linear-gradient(135deg, var(--muted), var(--accent))" }} />
                  <div className="mt-3 text-sm font-medium">{d.title}</div>
                  <div className="text-xs text-muted-foreground">{d.type}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">{t("dashboard.your_businesses")}</h2>
          <div className="mt-4 space-y-3">
            {businessItems.slice(0, 5).map((b) => (
              <Link key={b.id} to="/businesses/$id" params={{ id: b.id }}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary font-semibold">{b.name[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{b.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{b.industry ?? "—"}</div>
                </div>
              </Link>
            ))}
            <Link to="/businesses/new" className="block">
              <Button variant="outline" size="sm" className="w-full"><Plus className="mr-1 h-4 w-4" /> {t("dashboard.add_business")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
