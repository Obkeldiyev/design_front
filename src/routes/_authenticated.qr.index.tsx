import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Plus, QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/qr/")({
  head: () => ({ meta: [{ title: "QR Codes — Cardify" }] }),
  component: QrIndex,
});

function QrIndex() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("qr.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("qr.subtitle")}</p>
        </div>
        <Link to="/qr/new">
          <Button><Plus className="mr-1 h-4 w-4" />{t("qr.new")}</Button>
        </Link>
      </div>
      <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
        <QrCode className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 font-display text-lg font-semibold">{t("qr.coming_soon_title")}</h2>
        <p className="text-sm text-muted-foreground">{t("qr.coming_soon_sub")}</p>
        <Link to="/qr/new" className="mt-4 inline-block">
          <Button><Plus className="mr-1 h-4 w-4" />{t("qr.try")}</Button>
        </Link>
      </div>
    </div>
  );
}
