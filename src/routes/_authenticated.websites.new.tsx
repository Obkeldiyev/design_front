import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BusinessAPI, WebsiteAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Globe, Link2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/websites/new")({
  head: () => ({ meta: [{ title: "New website — Cardify" }] }),
  component: NewWebsite,
});

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 63);
}

function NewWebsite() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const businesses = useQuery({ queryKey: ["businesses"], queryFn: BusinessAPI.list });

  const [title, setTitle] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainEdited, setSubdomainEdited] = useState(false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [businessId, setBusinessId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!subdomainEdited) setSubdomain(toSlug(title));
  }, [title, subdomainEdited]);

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const liveUrl = subdomain ? `${origin}/site/${subdomain}` : null;

  const create = useMutation({
    mutationFn: () => WebsiteAPI.create({
      title: title || "My Website",
      subdomain: subdomain || undefined,
      status,
      businessId: businessId ?? undefined,
      config: { blocks: [], theme: {} },
    }),
    onSuccess: (website) => {
      qc.invalidateQueries({ queryKey: ["websites"] });
      toast.success(t("websites.new_title") + " — " + t("common.save"));
      navigate({ to: `/websites/${website.id}/edit` });
    },
    onError: (e) => toast.error(apiError(e)),
  });

  return (
    <div className="mx-auto max-w-2xl p-6 md:p-10">
      <Link to="/websites" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> {t("websites.back")}
      </Link>

      <h1 className="text-3xl font-bold">{t("websites.new_title")}</h1>
      <p className="mt-1 text-muted-foreground mb-8">{t("websites.new_subtitle")}</p>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
        {/* Title */}
        <div className="space-y-2">
          <Label>{t("websites.site_title")}</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={t("websites.title_placeholder")} autoFocus />
        </div>

        {/* Subdomain */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" /> {t("websites.subdomain")}
          </Label>
          <div className="flex items-center rounded-lg border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/30">
            <span className="bg-muted px-3 py-2 text-sm text-muted-foreground border-r border-border whitespace-nowrap">
              {origin}/site/
            </span>
            <input
              className="flex-1 bg-background px-3 py-2 text-sm outline-none font-mono"
              value={subdomain}
              onChange={(e) => { setSubdomainEdited(true); setSubdomain(toSlug(e.target.value)); }}
              placeholder="my-brand"
              spellCheck={false}
            />
          </div>
          {liveUrl && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
              <Link2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-primary hover:underline truncate font-mono">{liveUrl}</a>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("websites.business_optional")}</Label>
            <Select value={businessId ?? "none"} onValueChange={(v) => setBusinessId(v === "none" ? undefined : v)}>
              <SelectTrigger><SelectValue placeholder={t("websites.link_business")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("websites.none")}</SelectItem>
                {businesses.data?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("websites.publish_status")}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "DRAFT" | "PUBLISHED")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLISHED">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    {t("websites.published_label")}
                  </span>
                </SelectItem>
                <SelectItem value="DRAFT">{t("websites.draft_private")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-xl bg-muted/50 border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground flex items-center gap-1.5">
            <Globe className="h-4 w-4" /> {t("websites.how_title")}
          </p>
          <p>{t("websites.how_body1")}</p>
          <p>{t("websites.how_body2")}</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate({ to: "/websites" })}>
            {t("common.cancel")}
          </Button>
          <Button onClick={() => create.mutate()} disabled={create.isPending || !title.trim()} size="lg">
            {create.isPending ? t("websites.creating") : t("websites.create_btn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
