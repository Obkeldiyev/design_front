import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BusinessAPI, DesignAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { slugify } from "@/lib/slug";
import { ArrowLeft, Check, Sparkles, FileText } from "lucide-react";
import type { CanvasDoc, DesignType } from "@/lib/api/types";
import { CARD_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/card-templates";
import { TemplatePreview } from "@/components/editor/TemplatePreview";
import { generateId } from "@/lib/uuid";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/designs/new")({
  head: () => ({ meta: [{ title: "New design — Cardify" }] }),
  component: NewDesign,
});

const SIZE_PRESETS = [
  { id: "us-card",  label: 'US Business Card (3.5" × 2")', w: 1050, h: 600 },
  { id: "eu-card",  label: "EU Business Card (85 × 55 mm)", w: 1004, h: 650 },
  { id: "square",   label: "Square (1080 × 1080)", w: 1080, h: 1080 },
  { id: "story",    label: "Vertical / Story (1080 × 1920)", w: 1080, h: 1920 },
];

type Step = "pick" | "configure";

function NewDesign() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const businesses = useQuery({ queryKey: ["businesses"], queryFn: BusinessAPI.list });

  const [step, setStep] = useState<Step>("pick");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [title, setTitle] = useState("Untitled design");
  const [businessId, setBusinessId] = useState<string | undefined>(undefined);
  const [preset, setPreset] = useState("us-card");
  const [type, setType] = useState<DesignType>("BUSINESS_CARD");

  const selectedTemplate = CARD_TEMPLATES.find((t) => t.id === selectedTemplateId);
  const filteredTemplates = categoryFilter === "All" ? CARD_TEMPLATES : CARD_TEMPLATES.filter((t) => t.category === categoryFilter);

  const create = useMutation({
    mutationFn: () => {
      let doc: CanvasDoc;
      if (selectedTemplate) {
        doc = JSON.parse(JSON.stringify(selectedTemplate.doc));
      } else {
        const p = SIZE_PRESETS.find((x) => x.id === preset) ?? SIZE_PRESETS[0];
        doc = { version: 1, canvas: { width: p.w, height: p.h, background: "#ffffff" }, pages: [{ id: generateId(), name: "Front", fabric: { version: "6.0.0", objects: [] } }] };
      }
      return DesignAPI.create({ title, slug: slugify(title || "untitled-design"), type, businessId: businessId ?? null, data: doc } as Parameters<typeof DesignAPI.create>[0]);
    },
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["designs"] });
      toast.success(t("designs.created"));
      navigate({ to: "/editor/$designId", params: { designId: d.id } });
    },
    onError: (e) => toast.error(apiError(e)),
  });

  // ── Step 1: Pick template ─────────────────────────────────────────────────
  if (step === "pick") {
    return (
      <div className="flex flex-col h-full min-h-screen bg-background overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/designs" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
            <div>
              <h1 className="text-xl font-bold">{t("designs.new_title")}</h1>
              <p className="text-xs text-muted-foreground">{t("designs.new_subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setSelectedTemplateId(null); setStep("configure"); }}>
              <FileText className="h-4 w-4 mr-1.5" /> {t("designs.start_blank")}
            </Button>
            <Button disabled={!selectedTemplateId} onClick={() => setStep("configure")}>
              {t("designs.use_template")} <ArrowLeft className="h-4 w-4 ml-1.5 rotate-180" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap px-6 py-3 border-b border-border bg-card flex-shrink-0">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {/* Start blank — always first */}
            <button
              onClick={() => { setSelectedTemplateId(null); setStep("configure"); }}
              className="group rounded-xl border-2 border-dashed border-border hover:border-primary/60 hover:shadow-lg transition-all text-left overflow-hidden bg-muted/30 hover:bg-primary/5"
            >
              <div className="aspect-[7/4] w-full flex flex-col items-center justify-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                <FileText className="h-10 w-10" />
                <span className="text-sm font-semibold">{t("designs.start_blank")}</span>
                <span className="text-xs opacity-60">{t("designs.blank_desc")}</span>
              </div>
              <div className="p-3 bg-card border-t border-border">
                <p className="text-sm font-semibold">{t("designs.blank_canvas")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">1050 × 600</p>
              </div>
            </button>

            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplateId === template.id;
              return (
                <button key={template.id} onClick={() => setSelectedTemplateId(isSelected ? null : template.id)}
                  className={`group rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-lg ${isSelected ? "border-primary ring-2 ring-primary/30 shadow-lg" : "border-border hover:border-primary/40"}`}>
                  <div className="relative overflow-hidden">
                    <TemplatePreview template={template} displayWidth={280} className="w-full" />
                    {isSelected && <div className="absolute inset-0 bg-primary/20 flex items-center justify-center"><div className="bg-primary rounded-full p-2"><Check className="h-5 w-5 text-primary-foreground" /></div></div>}
                    {template.isPremium && <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"><Sparkles className="h-3 w-3" /> Pro</div>}
                  </div>
                  <div className="p-3 bg-card">
                    <p className="text-sm font-semibold">{template.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{template.category} · {template.width}×{template.height}</p>
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
        <ArrowLeft className="h-4 w-4" /> {t("designs.back_templates")}
      </button>

      <div className="flex items-start gap-6 mb-8">
        {selectedTemplate ? (
          <div className="rounded-xl border border-border overflow-hidden flex-shrink-0 shadow-md">
            <TemplatePreview template={selectedTemplate} displayWidth={200} />
          </div>
        ) : (
          <div className="w-[200px] h-[115px] rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground flex-shrink-0">
            <FileText className="h-8 w-8" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{selectedTemplate ? selectedTemplate.title : t("designs.blank_canvas")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {selectedTemplate ? `${selectedTemplate.category} — ${selectedTemplate.width}×${selectedTemplate.height}px` : t("designs.blank_desc")}
          </p>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label>{t("designs.design_title")}</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("designs.design_title_placeholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("designs.design_type")}</Label>
          <Select value={type} onValueChange={(v) => setType(v as DesignType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BUSINESS_CARD">{t("designs.type_card")}</SelectItem>
              <SelectItem value="DIGITAL_CARD">{t("designs.type_digital")}</SelectItem>
              <SelectItem value="MARKETING_ASSET">{t("designs.type_marketing")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("designs.business_optional")}</Label>
          <Select value={businessId ?? "none"} onValueChange={(v) => setBusinessId(v === "none" ? undefined : v)}>
            <SelectTrigger><SelectValue placeholder={t("designs.link_business")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("designs.none")}</SelectItem>
              {businesses.data?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {!selectedTemplate && (
          <div className="space-y-2">
            <Label>{t("designs.canvas_size")}</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {SIZE_PRESETS.map((p) => (
                <button key={p.id} type="button" onClick={() => setPreset(p.id)}
                  className={`rounded-lg border p-3 text-left text-sm transition ${preset === p.id ? "border-primary ring-1 ring-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <div className="font-medium">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.w} × {p.h}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end pt-2">
          <Button onClick={() => create.mutate()} disabled={create.isPending} size="lg">
            {create.isPending ? t("designs.creating") : t("designs.open_editor")}
          </Button>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Slug: <code className="rounded bg-muted px-1">{slugify(title) || "untitled-design"}</code>
      </p>
    </div>
  );
}
