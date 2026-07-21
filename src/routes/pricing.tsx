import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Cardify" },
      { name: "description", content: "Free, Pro and Business plans for Cardify." },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    features: ["5 designs", "Basic templates", "QR codes", "PNG export"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    features: [
      "Unlimited designs",
      "Premium templates",
      "Mini websites",
      "Analytics",
      "PDF + SVG export",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Business",
    price: "$39",
    period: "/month",
    features: [
      "Multiple businesses",
      "Team access",
      "Custom domains",
      "Priority support",
      "API access",
    ],
    cta: "Contact us",
    highlight: false,
  },
];

function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="font-display text-xl font-semibold">
            Cardify
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Simple, honest pricing.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you need more power.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${
                p.highlight
                  ? "border-primary bg-card ring-2 ring-primary/30"
                  : "border-border bg-card"
              }`}
            >
              <div className="text-sm font-medium text-muted-foreground">{p.name}</div>
              <div className="mt-2 flex items-baseline">
                <span className="font-display text-4xl font-bold">{p.price}</span>
                <span className="ml-1 text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-6 block">
                <Button className="w-full" variant={p.highlight ? "default" : "outline"}>
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
