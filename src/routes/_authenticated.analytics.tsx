import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BusinessAPI, DesignAPI } from "@/lib/api/resources";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Cardify" }] }),
  component: Analytics,
});

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Analytics() {
  const { t } = useTranslation();
  const businesses = useQuery({ queryKey: ["businesses"], queryFn: BusinessAPI.list });
  const designs = useQuery({ queryKey: ["designs"], queryFn: DesignAPI.list });

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <h1 className="font-display text-3xl font-bold">{t("analytics.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("analytics.subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t("analytics.businesses")} value={businesses.data?.length ?? 0} />
        <Stat label={t("analytics.designs")} value={designs.data?.length ?? 0} />
        <Stat label={t("analytics.qr_scans")} value={0} />
        <Stat label={t("analytics.website_views")} value={0} />
      </div>

      <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border p-16">
        <BarChart3 className="h-10 w-10 text-muted-foreground" />
        <h2 className="mt-3 font-display text-lg font-semibold">{t("analytics.charts_soon_title")}</h2>
        <p className="text-sm text-muted-foreground">{t("analytics.charts_soon_sub")}</p>
      </div>
    </div>
  );
}
