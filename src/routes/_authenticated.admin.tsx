import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SuperAdminAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Cardify" }] }),
  component: Admin,
});

function Admin() {
  const [secret, setSecret] = useState("");
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const s = await SuperAdminAPI.stats(secret);
      setStats(s);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-bold">Admin console</h1>
      </div>
      <p className="mt-1 text-muted-foreground">
        SuperAdmin operations require the secret header.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label>SuperAdmin secret</Label>
          <Input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
        </div>
        <Button onClick={load} disabled={!secret || loading}>
          {loading ? "Loading..." : "Load platform stats"}
        </Button>
      </div>

      {stats && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Platform stats</h2>
          <pre className="mt-3 overflow-auto rounded-md bg-muted p-4 text-xs">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { title: "Users", desc: "Manage roles, deactivate" },
          { title: "Templates", desc: "Curate the public gallery" },
          { title: "Plans & Payments", desc: "Pricing, refunds, history" },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
            <div className="mt-3 text-xs text-muted-foreground">Wiring coming next.</div>
          </div>
        ))}
      </div>

      <Link to="/dashboard" className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back to dashboard
      </Link>
    </div>
  );
}
