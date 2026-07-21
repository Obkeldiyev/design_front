import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({ meta: [{ title: "Billing — Cardify" }] }),
  component: Billing,
});

function Billing() {
  const { t } = useTranslation();

  const PLANS = [
    { name: "Free",     price: "$0",  features: ["5 designs", "Basic templates", "QR codes"] },
    { name: "Pro",      price: "$12", features: ["Unlimited designs", "Premium templates", "Websites", "Analytics"] },
    { name: "Business", price: "$39", features: ["Multiple businesses", "Team access", "Custom domains"] },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <h1 className="font-display text-3xl font-bold">{t("billing.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("billing.subtitle")}</p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{t("billing.current_plan")}</div>
            <div className="font-display text-2xl font-semibold">Free</div>
          </div>
          <Button variant="outline">{t("billing.manage")}</Button>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">{p.name}</div>
            <div className="mt-1 font-display text-3xl font-bold">{p.price}</div>
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button className="mt-6 w-full" variant="outline" disabled>
              {t("billing.coming_soon")}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">{t("billing.payment_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("billing.payment_sub")}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-muted px-3 py-1">Click</span>
          <span className="rounded-full bg-muted px-3 py-1">Payme</span>
          <span className="rounded-full bg-muted px-3 py-1">Stripe</span>
        </div>
      </div>
    </div>
  );
}
