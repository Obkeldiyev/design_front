import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BusinessAPI, WebsiteAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Globe, Link2, CheckCircle2, Layout, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { useTranslation } from "react-i18next";
import { WEBSITE_TEMPLATES, WEBSITE_TEMPLATE_CATEGORIES, instantiateTemplate } from "@/lib/website-templates";
import { DEFAULT_THEME } from "@/lib/website-blocks";

export const Route = createFileRoute("/_authenticated/websites/new")({
  head: () => ({ meta: [{ title: "New website — Cardify" }] }),
  component: NewWebsite,
});

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 63);
}

type Step = "pick" | "configure";

function NewWebsite() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const businesses = useQuery({ queryKey: ["businesses"], queryFn: BusinessAPI.list });

  const [step, setStep] = useState<Step>("pick");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [title, setTitle] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainEdited, setSubdomainEdited] = useState(false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [businessId, setBusinessId] = useState<string | undefined>(undefined);

  const selectedTemplate = WEBSITE_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? null;
  const filteredTemplates = categoryFilter === "All"
    ? WEBSITE_TEMPLATES
    : WEBSITE_TEMPLATES.filter((t) => t.category === categoryFilter);

  useEffect(() => {
    if (!subdomainEdited) setSubdomain(toSlug(title));
  }, [title, subdomainEdited]);

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const liveUrl = subdomain ? `${origin}/site/${subdomain}` : null;

  const create = useMutation({
    mutationFn: () => {
      const blocks = selectedTemplate
        ? instantiateTemplate(selectedTemplate)
        : [];
      const theme = selectedTemplate
        ? { ...DEFAULT_THEME, ...selectedTemplate.theme }
        : DEFAULT_THEME;
      return WebsiteAPI.create({
        title: title || "My Website",
        subdomain: subdomain || undefined,
        status,
        businessId: businessId ?? undefined,
        config: { blocks, theme },
      });
    },
    onSuccess: (website) => {
      qc.invalidateQueries({ queryKey: ["websites"] });
      toast.success("Website created!");
      navigate({ to: `/websites/${website.id}/edit` });
    },
    onError: (e) => toast.error(apiError(e)),
  });

  // ── Step 1: Pick template ─────────────────────────────────────────────────
  if (step === "pick") {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/websites" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">New Website</h1>
              <p className="text-xs text-muted-foreground">Choose a template or start blank</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setSelectedTemplateId(null); setStep("configure"); }}>
              <Layout className="h-4 w-4 mr-1.5" /> Start blank
            </Button>
            <Button disabled={!selectedTemplateId} onClick={() => setStep("configure")}>
              Use template <ArrowLeft className="h-4 w-4 ml-1.5 rotate-180" />
            </Button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap px-6 py-3 border-b border-border bg-card flex-shrink-0">
          {WEBSITE_TEMPLATE_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {/* Blank option — always first */}
            <button
              onClick={() => { setSelectedTemplateId(null); setStep("configure"); }}
              className="group rounded-xl border-2 border-dashed border-border hover:border-primary/60 hover:shadow-lg transition-all text-left overflow-hidden bg-muted/30 hover:bg-primary/5"
            >
              <div className="aspect-[4/3] w-full flex flex-col items-center justify-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                <Layout className="h-10 w-10" />
                <span className="text-sm font-semibold">Start blank</span>
                <span className="text-xs opacity-60">Empty canvas — add blocks manually</span>
              </div>
              <div className="p-3 bg-card border-t border-border">
                <p className="text-sm font-semibold">Blank Website</p>
                <p className="text-xs text-muted-foreground mt-0.5">0 blocks</p>
              </div>
            </button>

            {filteredTemplates.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(isSelected ? null : tmpl.id)}
                  className={`group rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-lg ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/30 shadow-lg"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {/* Preview card */}
                  <div
                    className="aspect-[4/3] w-full flex flex-col items-end justify-start p-3 relative overflow-hidden"
                    style={{ backgroundColor: tmpl.theme.backgroundColor ?? "#ffffff" }}
                  >
                    {/* Simulated nav bar */}
                    <div className="absolute top-0 left-0 right-0 h-6 flex items-center px-3 gap-2"
                      style={{ backgroundColor: tmpl.theme.primaryColor ?? "#6366f1" }}>
                      <div className="w-12 h-2 bg-white/40 rounded-full" />
                      <div className="flex-1" />
                      <div className="w-8 h-2 bg-white/40 rounded-full" />
                      <div className="w-8 h-2 bg-white/40 rounded-full" />
                    </div>
                    {/* Simulated hero */}
                    <div className="absolute top-8 left-0 right-0 bottom-0 flex flex-col items-center justify-center gap-1 px-4"
                      style={{ backgroundColor: tmpl.theme.backgroundColor ?? "#f8fafc" }}>
                      <div className="w-3/4 h-3 rounded" style={{ backgroundColor: tmpl.previewColor, opacity: 0.7 }} />
                      <div className="w-1/2 h-2 rounded bg-gray-200 mt-1" />
                      <div className="w-1/2 h-2 rounded bg-gray-200" />
                      <div className="mt-2 px-3 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: tmpl.previewColor }}>
                        CTA
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center z-10">
                        <div className="bg-primary rounded-full p-2">
                          <Check className="h-5 w-5 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-card">
                    <p className="text-sm font-semibold">{tmpl.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tmpl.category} · {tmpl.blocks.length} blocks</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Configure ─────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl p-6 md:p-10">
      <button onClick={() => setStep("pick")} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to templates
      </button>

      {/* Template preview */}
      <div className="flex items-start gap-5 mb-8">
        <div
          className="w-[160px] h-[96px] rounded-xl border-2 border-border overflow-hidden flex-shrink-0 shadow-md flex flex-col"
          style={{ backgroundColor: selectedTemplate?.theme.backgroundColor ?? "#f8fafc" }}
        >
          {selectedTemplate ? (
            <>
              <div className="h-5 w-full flex items-center px-2 gap-1"
                style={{ backgroundColor: selectedTemplate.previewColor }}>
                <div className="w-8 h-1.5 bg-white/50 rounded-full" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-1 px-2">
                <div className="w-3/4 h-2 rounded" style={{ backgroundColor: selectedTemplate.previewColor, opacity: 0.6 }} />
                <div className="w-1/2 h-1.5 rounded bg-gray-200" />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <Layout className="h-6 w-6" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {selectedTemplate ? selectedTemplate.title : "Blank Website"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {selectedTemplate
              ? selectedTemplate.description
              : "Start with an empty canvas and add blocks manually in the editor."}
          </p>
          {selectedTemplate && (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedTemplate.blocks.length} pre-built sections included
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
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
