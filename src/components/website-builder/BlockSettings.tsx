/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * BlockSettings — rich right-panel property editor for each block type.
 */
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Block, WebsiteTheme } from "@/lib/website-blocks";
import { Trash2, Plus, GripVertical, ChevronDown, ChevronUp } from "lucide-react";

interface BlockSettingsProps {
  block: Block | null;
  theme: WebsiteTheme;
  onUpdate: (content: Record<string, any>) => void;
  onThemeUpdate: (theme: WebsiteTheme) => void;
}

// --- small helper components ---

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded cursor-pointer border border-border"
        />
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="h-8 text-xs font-mono"
        />
      </div>
    </Field>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function SliderField({
  label,
  value,
  min = 0,
  max = 120,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={`${label} (${Math.round(value)}px)`}>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer accent-primary"
        />
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={Math.round(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-8 w-16 text-xs"
        />
      </div>
    </Field>
  );
}

function UploadField({ label, onUpload }: { label: string; onUpload: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => onUpload(String(event.target?.result ?? ""));
    reader.readAsDataURL(file);
  };

  return (
    <Field label={label}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className="flex h-16 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
      >
        Upload or drop image
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
    </Field>
  );
}

const ICON_PRESETS = ["⚡", "✓", "★", "→", "☎", "✉", "#", "$", "▶", "＋", "◆", "●"];

function IconField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 text-xs"
        placeholder="Icon"
      />
      <div className="grid grid-cols-6 gap-1">
        {ICON_PRESETS.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className="grid h-7 place-items-center rounded border border-border bg-background text-sm hover:border-primary"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
        {title}
      </p>
      {children}
    </div>
  );
}

function CommonDesignSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  const defaults = {
    paddingY:
      block.type === "navbar"
        ? 16
        : block.type === "footer"
          ? 56
          : block.type === "text" || block.type === "gallery"
            ? 64
            : 80,
    paddingX: 32,
    itemRadius: block.type === "team" ? 999 : block.type === "navbar" ? 8 : 16,
    imageRadius: block.type === "team" || block.type === "testimonials" ? 999 : 16,
    buttonRadius: 12,
  };
  const num = (key: string, fallback: number) => {
    const value = Number(c[key]);
    return Number.isFinite(value) ? value : fallback;
  };

  return (
    <Section title="Design">
      <div className="grid grid-cols-2 gap-2">
        <SliderField
          label="Top/Bottom"
          value={num("paddingY", defaults.paddingY)}
          min={0}
          max={180}
          onChange={(v) => upd({ paddingY: v })}
        />
        <SliderField
          label="Left/Right"
          value={num("paddingX", defaults.paddingX)}
          min={0}
          max={96}
          onChange={(v) => upd({ paddingX: v })}
        />
      </div>
      <SliderField
        label="Section radius"
        value={num("borderRadius", 0)}
        min={0}
        max={80}
        onChange={(v) => upd({ borderRadius: v })}
      />
      <div className="grid grid-cols-2 gap-2">
        <SliderField
          label="Card radius"
          value={num("itemRadius", defaults.itemRadius)}
          min={0}
          max={999}
          onChange={(v) => upd({ itemRadius: v })}
        />
        <SliderField
          label="Image radius"
          value={num("imageRadius", defaults.imageRadius)}
          min={0}
          max={999}
          onChange={(v) => upd({ imageRadius: v })}
        />
      </div>
      <SliderField
        label="Button radius"
        value={num("buttonRadius", defaults.buttonRadius)}
        min={0}
        max={48}
        onChange={(v) => upd({ buttonRadius: v })}
      />
      <SelectField
        label="Shadow"
        value={c.shadow || "none"}
        options={[
          { value: "none", label: "None" },
          { value: "soft", label: "Soft" },
          { value: "lifted", label: "Lifted" },
          { value: "strong", label: "Strong" },
        ]}
        onChange={(v) => upd({ shadow: v })}
      />
      <SelectField
        label="Animation"
        value={c.animation || "none"}
        options={[
          { value: "none", label: "None" },
          { value: "fade-up", label: "Fade up" },
          { value: "fade-in", label: "Fade in" },
          { value: "scale-in", label: "Scale in" },
          { value: "slide-left", label: "Slide left" },
        ]}
        onChange={(v) => upd({ animation: v })}
      />
      <SliderField
        label="Animation delay"
        value={num("animationDelay", 0)}
        min={0}
        max={1200}
        step={50}
        onChange={(v) => upd({ animationDelay: v })}
      />
    </Section>
  );
}

// --- per-block settings panels ---

function NavbarSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Branding">
        <Field label="Logo Text">
          <Input
            value={c.logo || ""}
            onChange={(e) => upd({ logo: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Logo Image URL">
          <Input
            value={c.logoUrl || ""}
            onChange={(e) => upd({ logoUrl: e.target.value })}
            className="h-8 text-sm"
            placeholder="https://..."
          />
        </Field>
        <UploadField label="Logo Upload" onUpload={(logoUrl) => upd({ logoUrl })} />
        <Field label="CTA Button Text">
          <Input
            value={c.ctaText || ""}
            onChange={(e) => upd({ ctaText: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="CTA Button Link">
          <Input
            value={c.ctaLink || ""}
            onChange={(e) => upd({ ctaLink: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
      </Section>
      <Section title="Colors">
        <ColorField
          label="Background"
          value={c.backgroundColor || "#ffffff"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
        <ColorField
          label="Text Color"
          value={c.textColor || "#111827"}
          onChange={(v) => upd({ textColor: v })}
        />
      </Section>
      <Section title="Nav Links">
        <div className="space-y-2">
          {(c.links || []).map((link: any, i: number) => (
            <div key={i} className="flex gap-1 items-center">
              <Input
                value={link.label}
                onChange={(e) => {
                  const l = [...c.links];
                  l[i] = { ...l[i], label: e.target.value };
                  upd({ links: l });
                }}
                className="h-7 text-xs"
                placeholder="Label"
              />
              <Input
                value={link.href}
                onChange={(e) => {
                  const l = [...c.links];
                  l[i] = { ...l[i], href: e.target.value };
                  upd({ links: l });
                }}
                className="h-7 text-xs"
                placeholder="URL"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive flex-shrink-0"
                onClick={() => {
                  const l = c.links.filter((_: any, li: number) => li !== i);
                  upd({ links: l });
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() => upd({ links: [...(c.links || []), { label: "Link", href: "#" }] })}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Link
          </Button>
        </div>
      </Section>
    </>
  );
}

function HeroSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Content">
        <Field label="Headline">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Subheadline">
          <Input
            value={c.subtitle || ""}
            onChange={(e) => upd({ subtitle: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Primary Button">
          <Input
            value={c.buttonText || ""}
            onChange={(e) => upd({ buttonText: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Primary Button Link">
          <Input
            value={c.buttonLink || ""}
            onChange={(e) => upd({ buttonLink: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Secondary Button">
          <Input
            value={c.secondaryButtonText || ""}
            onChange={(e) => upd({ secondaryButtonText: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
      </Section>
      <Section title="Branding">
        <Field label="Logo Text">
          <Input
            value={c.logoText || ""}
            onChange={(e) => upd({ logoText: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Logo Image URL">
          <Input
            value={c.logoUrl || ""}
            onChange={(e) => upd({ logoUrl: e.target.value })}
            className="h-8 text-sm"
            placeholder="https://..."
          />
        </Field>
        <UploadField label="Logo Upload" onUpload={(logoUrl) => upd({ logoUrl })} />
      </Section>
      <Section title="Background">
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#0f172a"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
        <ColorField
          label="Text Color"
          value={c.textColor || "#ffffff"}
          onChange={(v) => upd({ textColor: v })}
        />
        <Field label="Background Image URL">
          <Input
            value={c.backgroundImage || ""}
            onChange={(e) => upd({ backgroundImage: e.target.value })}
            className="h-8 text-sm"
            placeholder="https://..."
          />
        </Field>
        <UploadField
          label="Background Upload"
          onUpload={(backgroundImage) => upd({ backgroundImage })}
        />
        {c.backgroundImage && (
          <Field label={`Overlay Opacity (${Math.round((c.overlayOpacity ?? 0.5) * 100)}%)`}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={c.overlayOpacity ?? 0.5}
              onChange={(e) => upd({ overlayOpacity: parseFloat(e.target.value) })}
              className="w-full"
            />
          </Field>
        )}
        <SelectField
          label="Image Fit"
          value={c.backgroundFit || "cover"}
          options={[
            { value: "cover", label: "Cover" },
            { value: "contain", label: "Contain" },
            { value: "auto", label: "Original" },
          ]}
          onChange={(v) => upd({ backgroundFit: v })}
        />
        <SelectField
          label="Image Position"
          value={c.backgroundPosition || "center"}
          options={[
            { value: "center", label: "Center" },
            { value: "top", label: "Top" },
            { value: "bottom", label: "Bottom" },
            { value: "left", label: "Left" },
            { value: "right", label: "Right" },
          ]}
          onChange={(v) => upd({ backgroundPosition: v })}
        />
      </Section>
      <Section title="Layout">
        <SelectField
          label="Text Alignment"
          value={c.layout || "center"}
          options={[
            { value: "center", label: "Center" },
            { value: "left", label: "Left" },
            { value: "right", label: "Right" },
          ]}
          onChange={(v) => upd({ layout: v })}
        />
      </Section>
    </>
  );
}

function FeaturesSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Header">
        <Field label="Title">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Subtitle">
          <Input
            value={c.subtitle || ""}
            onChange={(e) => upd({ subtitle: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#ffffff"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
        <SelectField
          label="Columns"
          value={String(c.columns || 3)}
          options={[
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
          onChange={(v) => upd({ columns: parseInt(v) })}
        />
      </Section>
      <Section title="Features">
        <div className="space-y-2">
          {(c.items || []).map((item: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-2 space-y-1.5">
              <div className="flex gap-1">
                <div className="w-24">
                  <IconField
                    value={item.icon || ""}
                    onChange={(icon) => {
                      const it = [...c.items];
                      it[i] = { ...it[i], icon };
                      upd({ items: it });
                    }}
                  />
                </div>
                <Input
                  value={item.title}
                  onChange={(e) => {
                    const it = [...c.items];
                    it[i] = { ...it[i], title: e.target.value };
                    upd({ items: it });
                  }}
                  className="h-7 text-xs flex-1"
                  placeholder="Title"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive flex-shrink-0"
                  onClick={() => upd({ items: c.items.filter((_: any, fi: number) => fi !== i) })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={item.description}
                onChange={(e) => {
                  const it = [...c.items];
                  it[i] = { ...it[i], description: e.target.value };
                  upd({ items: it });
                }}
                className="h-7 text-xs"
                placeholder="Description"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() =>
              upd({
                items: [...(c.items || []), { icon: "⚡", title: "New Feature", description: "" }],
              })
            }
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Feature
          </Button>
        </div>
      </Section>
    </>
  );
}

function TestimonialsSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Header">
        <Field label="Title">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Subtitle">
          <Input
            value={c.subtitle || ""}
            onChange={(e) => upd({ subtitle: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#f8fafc"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
      </Section>
      <Section title="Reviews">
        <div className="space-y-2">
          {(c.items || []).map((item: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-2 space-y-1.5">
              <div className="flex gap-1">
                <Input
                  value={item.author}
                  onChange={(e) => {
                    const it = [...c.items];
                    it[i] = { ...it[i], author: e.target.value };
                    upd({ items: it });
                  }}
                  className="h-7 text-xs flex-1"
                  placeholder="Name"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive flex-shrink-0"
                  onClick={() => upd({ items: c.items.filter((_: any, fi: number) => fi !== i) })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={item.role}
                onChange={(e) => {
                  const it = [...c.items];
                  it[i] = { ...it[i], role: e.target.value };
                  upd({ items: it });
                }}
                className="h-7 text-xs"
                placeholder="Role / Company"
              />
              <textarea
                value={item.text}
                onChange={(e) => {
                  const it = [...c.items];
                  it[i] = { ...it[i], text: e.target.value };
                  upd({ items: it });
                }}
                className="w-full border border-border rounded px-2 py-1 text-xs resize-none h-16"
                placeholder="Review text"
              />
              <Field label="Avatar URL">
                <Input
                  value={item.avatar || ""}
                  onChange={(e) => {
                    const it = [...c.items];
                    it[i] = { ...it[i], avatar: e.target.value };
                    upd({ items: it });
                  }}
                  className="h-7 text-xs"
                  placeholder="Photo URL"
                />
              </Field>
              <UploadField
                label="Avatar Upload"
                onUpload={(avatar) => {
                  const it = [...c.items];
                  it[i] = { ...it[i], avatar };
                  upd({ items: it });
                }}
              />
              <Field label="Rating">
                <select
                  value={item.rating || 5}
                  onChange={(e) => {
                    const it = [...c.items];
                    it[i] = { ...it[i], rating: parseInt(e.target.value) };
                    upd({ items: it });
                  }}
                  className="w-full h-7 rounded border border-border bg-background px-2 text-xs"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() =>
              upd({
                items: [
                  ...(c.items || []),
                  {
                    author: "New Person",
                    role: "Role",
                    text: "Great product!",
                    rating: 5,
                    avatar: "",
                  },
                ],
              })
            }
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Review
          </Button>
        </div>
      </Section>
    </>
  );
}

function TextSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Content">
        <Field label="Section Title (optional)">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Text">
          <textarea
            value={c.text || ""}
            onChange={(e) => upd({ text: e.target.value })}
            className="w-full border border-border rounded-md px-3 py-2 text-sm resize-none h-28 bg-background"
          />
        </Field>
      </Section>
      <Section title="Style">
        <SelectField
          label="Text Alignment"
          value={c.align || "left"}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
          onChange={(v) => upd({ align: v })}
        />
        <SelectField
          label="Max Width"
          value={c.maxWidth || "3xl"}
          options={[
            { value: "2xl", label: "Narrow" },
            { value: "3xl", label: "Medium" },
            { value: "4xl", label: "Wide" },
          ]}
          onChange={(v) => upd({ maxWidth: v })}
        />
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#ffffff"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
      </Section>
    </>
  );
}

function StatsSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Style">
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#0f172a"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
        <ColorField
          label="Text Color"
          value={c.textColor || "#ffffff"}
          onChange={(v) => upd({ textColor: v })}
        />
      </Section>
      <Section title="Stats">
        <div className="space-y-2">
          {(c.items || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-1 items-center">
              <Input
                value={item.value}
                onChange={(e) => {
                  const it = [...c.items];
                  it[i] = { ...it[i], value: e.target.value };
                  upd({ items: it });
                }}
                className="h-7 text-xs w-20"
                placeholder="10K+"
              />
              <Input
                value={item.label}
                onChange={(e) => {
                  const it = [...c.items];
                  it[i] = { ...it[i], label: e.target.value };
                  upd({ items: it });
                }}
                className="h-7 text-xs flex-1"
                placeholder="Label"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive flex-shrink-0"
                onClick={() => upd({ items: c.items.filter((_: any, fi: number) => fi !== i) })}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() => upd({ items: [...(c.items || []), { value: "0", label: "Metric" }] })}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Stat
          </Button>
        </div>
      </Section>
    </>
  );
}

function CtaSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Content">
        <Field label="Title">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Subtitle">
          <Input
            value={c.subtitle || ""}
            onChange={(e) => upd({ subtitle: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Primary Button">
          <Input
            value={c.buttonText || ""}
            onChange={(e) => upd({ buttonText: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Primary Button Link">
          <Input
            value={c.buttonLink || ""}
            onChange={(e) => upd({ buttonLink: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Secondary Button">
          <Input
            value={c.secondaryButtonText || ""}
            onChange={(e) => upd({ secondaryButtonText: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
      </Section>
      <Section title="Style">
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#6366f1"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
        <ColorField
          label="Text Color"
          value={c.textColor || "#ffffff"}
          onChange={(v) => upd({ textColor: v })}
        />
      </Section>
    </>
  );
}

function ContactSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Content">
        <Field label="Title">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Subtitle">
          <Input
            value={c.subtitle || ""}
            onChange={(e) => upd({ subtitle: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Button Text">
          <Input
            value={c.buttonText || ""}
            onChange={(e) => upd({ buttonText: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#ffffff"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
      </Section>
      <Section title="Contact Info">
        <Field label="Email">
          <Input
            value={c.email || ""}
            onChange={(e) => upd({ email: e.target.value })}
            className="h-8 text-sm"
            placeholder="hello@example.com"
          />
        </Field>
        <Field label="Phone">
          <Input
            value={c.phone || ""}
            onChange={(e) => upd({ phone: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Address">
          <Input
            value={c.address || ""}
            onChange={(e) => upd({ address: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
      </Section>
    </>
  );
}

function GallerySettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Header">
        <Field label="Title">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <SelectField
          label="Columns"
          value={String(c.columns || 3)}
          options={[
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
          onChange={(v) => upd({ columns: parseInt(v) })}
        />
        <SelectField
          label="Gap"
          value={c.gap || "medium"}
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ]}
          onChange={(v) => upd({ gap: v })}
        />
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#ffffff"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
      </Section>
      <Section title="Images">
        <div className="space-y-2">
          {(c.items || []).map((item: any, i: number) => (
            <div key={i} className="border border-border rounded p-2 space-y-1">
              <div className="flex gap-1">
                <Input
                  value={item.caption || ""}
                  onChange={(e) => {
                    const it = [...c.items];
                    it[i] = { ...it[i], caption: e.target.value };
                    upd({ items: it });
                  }}
                  className="h-7 text-xs flex-1"
                  placeholder="Caption"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive flex-shrink-0"
                  onClick={() => upd({ items: c.items.filter((_: any, fi: number) => fi !== i) })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={item.image || ""}
                onChange={(e) => {
                  const it = [...c.items];
                  it[i] = { ...it[i], image: e.target.value };
                  upd({ items: it });
                }}
                className="h-7 text-xs"
                placeholder="Image URL"
              />
              <UploadField
                label="Image Upload"
                onUpload={(image) => {
                  const it = [...c.items];
                  it[i] = { ...it[i], image };
                  upd({ items: it });
                }}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() =>
              upd({
                items: [
                  ...(c.items || []),
                  { image: "", caption: `Image ${(c.items || []).length + 1}`, link: "" },
                ],
              })
            }
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Image
          </Button>
        </div>
      </Section>
    </>
  );
}

function TeamSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Header">
        <Field label="Title">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Subtitle">
          <Input
            value={c.subtitle || ""}
            onChange={(e) => upd({ subtitle: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <SelectField
          label="Columns"
          value={String(c.columns || 4)}
          options={[
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
          onChange={(v) => upd({ columns: parseInt(v) })}
        />
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#ffffff"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
      </Section>
      <Section title="Members">
        <div className="space-y-2">
          {(c.members || []).map((m: any, i: number) => (
            <div key={i} className="border border-border rounded p-2 space-y-1">
              <div className="flex gap-1">
                <Input
                  value={m.name || ""}
                  onChange={(e) => {
                    const ms = [...c.members];
                    ms[i] = { ...ms[i], name: e.target.value };
                    upd({ members: ms });
                  }}
                  className="h-7 text-xs flex-1"
                  placeholder="Name"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive flex-shrink-0"
                  onClick={() =>
                    upd({ members: c.members.filter((_: any, fi: number) => fi !== i) })
                  }
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={m.role || ""}
                onChange={(e) => {
                  const ms = [...c.members];
                  ms[i] = { ...ms[i], role: e.target.value };
                  upd({ members: ms });
                }}
                className="h-7 text-xs"
                placeholder="Role"
              />
              <Input
                value={m.image || ""}
                onChange={(e) => {
                  const ms = [...c.members];
                  ms[i] = { ...ms[i], image: e.target.value };
                  upd({ members: ms });
                }}
                className="h-7 text-xs"
                placeholder="Photo URL"
              />
              <UploadField
                label="Photo Upload"
                onUpload={(image) => {
                  const ms = [...c.members];
                  ms[i] = { ...ms[i], image };
                  upd({ members: ms });
                }}
              />
              <Input
                value={m.bio || ""}
                onChange={(e) => {
                  const ms = [...c.members];
                  ms[i] = { ...ms[i], bio: e.target.value };
                  upd({ members: ms });
                }}
                className="h-7 text-xs"
                placeholder="Short bio"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() =>
              upd({
                members: [
                  ...(c.members || []),
                  { name: "New Member", role: "Role", image: "", bio: "" },
                ],
              })
            }
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Member
          </Button>
        </div>
      </Section>
    </>
  );
}

function PricingSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Header">
        <Field label="Title">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Subtitle">
          <Input
            value={c.subtitle || ""}
            onChange={(e) => upd({ subtitle: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#ffffff"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
      </Section>
      <Section title="Plans">
        <div className="space-y-2">
          {(c.plans || []).map((plan: any, i: number) => (
            <div key={i} className="border border-border rounded p-2 space-y-1.5">
              <div className="flex gap-1">
                <Input
                  value={plan.name}
                  onChange={(e) => {
                    const ps = [...c.plans];
                    ps[i] = { ...ps[i], name: e.target.value };
                    upd({ plans: ps });
                  }}
                  className="h-7 text-xs flex-1"
                  placeholder="Plan Name"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive flex-shrink-0"
                  onClick={() => upd({ plans: c.plans.filter((_: any, fi: number) => fi !== i) })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-1">
                <Input
                  value={plan.price}
                  onChange={(e) => {
                    const ps = [...c.plans];
                    ps[i] = { ...ps[i], price: e.target.value };
                    upd({ plans: ps });
                  }}
                  className="h-7 text-xs w-20"
                  placeholder="$29"
                />
                <Input
                  value={plan.period || "/mo"}
                  onChange={(e) => {
                    const ps = [...c.plans];
                    ps[i] = { ...ps[i], period: e.target.value };
                    upd({ plans: ps });
                  }}
                  className="h-7 text-xs w-16"
                  placeholder="/mo"
                />
              </div>
              <Input
                value={plan.description || ""}
                onChange={(e) => {
                  const ps = [...c.plans];
                  ps[i] = { ...ps[i], description: e.target.value };
                  upd({ plans: ps });
                }}
                className="h-7 text-xs"
                placeholder="Plan description"
              />
              <Field label="Features (one per line)">
                <textarea
                  value={(plan.features || []).join("\n")}
                  onChange={(e) => {
                    const ps = [...c.plans];
                    ps[i] = { ...ps[i], features: e.target.value.split("\n") };
                    upd({ plans: ps });
                  }}
                  className="w-full border border-border rounded px-2 py-1 text-xs resize-none h-20 bg-background"
                />
              </Field>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!plan.featured}
                  onChange={(e) => {
                    const ps = [...c.plans];
                    ps[i] = { ...ps[i], featured: e.target.checked };
                    upd({ plans: ps });
                  }}
                />
                Featured plan
              </label>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() =>
              upd({
                plans: [
                  ...(c.plans || []),
                  {
                    name: "New Plan",
                    price: "$0",
                    period: "/mo",
                    description: "",
                    features: [],
                    buttonText: "Get Started",
                    featured: false,
                  },
                ],
              })
            }
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Plan
          </Button>
        </div>
      </Section>
    </>
  );
}

function VideoSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Content">
        <Field label="Title">
          <Input
            value={c.title || ""}
            onChange={(e) => upd({ title: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Video Embed URL">
          <Input
            value={c.videoUrl || ""}
            onChange={(e) => upd({ videoUrl: e.target.value })}
            className="h-8 text-sm"
            placeholder="https://youtube.com/embed/..."
          />
        </Field>
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#0f172a"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
        <SelectField
          label="Aspect Ratio"
          value={c.aspectRatio || "16/9"}
          options={[
            { value: "16/9", label: "16:9 (Widescreen)" },
            { value: "4/3", label: "4:3 (Classic)" },
            { value: "1/1", label: "1:1 (Square)" },
          ]}
          onChange={(v) => upd({ aspectRatio: v })}
        />
      </Section>
    </>
  );
}

function FooterSettings({ block, onUpdate }: { block: Block; onUpdate: (c: any) => void }) {
  const c = block.content;
  const upd = (p: any) => onUpdate({ ...c, ...p });
  return (
    <>
      <Section title="Branding">
        <Field label="Logo Text">
          <Input
            value={c.logo || ""}
            onChange={(e) => upd({ logo: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Tagline">
          <Input
            value={c.tagline || ""}
            onChange={(e) => upd({ tagline: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
        <Field label="Copyright">
          <Input
            value={c.copyright || ""}
            onChange={(e) => upd({ copyright: e.target.value })}
            className="h-8 text-sm"
          />
        </Field>
      </Section>
      <Section title="Style">
        <ColorField
          label="Background Color"
          value={c.backgroundColor || "#0f172a"}
          onChange={(v) => upd({ backgroundColor: v })}
        />
        <ColorField
          label="Text Color"
          value={c.textColor || "#94a3b8"}
          onChange={(v) => upd({ textColor: v })}
        />
      </Section>
    </>
  );
}

// --- Theme Settings Panel ---

export function ThemeSettings({
  theme,
  onUpdate,
}: {
  theme: WebsiteTheme;
  onUpdate: (t: WebsiteTheme) => void;
}) {
  const upd = (p: Partial<WebsiteTheme>) => onUpdate({ ...theme, ...p });
  return (
    <div className="p-4 space-y-4">
      <p className="text-sm font-semibold">Site Theme</p>
      <Section title="Colors">
        <ColorField
          label="Primary Color"
          value={theme.primaryColor}
          onChange={(v) => upd({ primaryColor: v })}
        />
        <ColorField
          label="Secondary Color"
          value={theme.secondaryColor}
          onChange={(v) => upd({ secondaryColor: v })}
        />
        <ColorField
          label="Text Color"
          value={theme.textColor}
          onChange={(v) => upd({ textColor: v })}
        />
        <ColorField
          label="Page Background"
          value={theme.backgroundColor}
          onChange={(v) => upd({ backgroundColor: v })}
        />
      </Section>
      <Section title="Typography">
        <SelectField
          label="Font Family"
          value={theme.fontFamily}
          options={[
            { value: "Inter", label: "Inter (Modern)" },
            { value: "Georgia", label: "Georgia (Classic)" },
            { value: "system-ui", label: "System UI" },
            { value: "monospace", label: "Monospace" },
          ]}
          onChange={(v) => upd({ fontFamily: v })}
        />
      </Section>
      <Section title="Border Radius">
        <SelectField
          label="Corner Style"
          value={theme.borderRadius}
          options={[
            { value: "0px", label: "Sharp (0px)" },
            { value: "4px", label: "Slight (4px)" },
            { value: "8px", label: "Rounded (8px)" },
            { value: "16px", label: "Soft (16px)" },
            { value: "999px", label: "Pill (full)" },
          ]}
          onChange={(v) => upd({ borderRadius: v })}
        />
      </Section>
    </div>
  );
}

// --- Main export ---

export function BlockSettings({ block, theme, onUpdate, onThemeUpdate }: BlockSettingsProps) {
  if (!block) {
    return (
      <div className="flex flex-col h-full">
        <ThemeSettings theme={theme} onUpdate={onThemeUpdate} />
      </div>
    );
  }

  const upd = (c: Record<string, any>) => onUpdate(c);

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <p className="text-sm font-semibold capitalize">{block.type} Settings</p>
      {block.type === "navbar" && <NavbarSettings block={block} onUpdate={upd} />}
      {block.type === "hero" && <HeroSettings block={block} onUpdate={upd} />}
      {block.type === "features" && <FeaturesSettings block={block} onUpdate={upd} />}
      {block.type === "testimonials" && <TestimonialsSettings block={block} onUpdate={upd} />}
      {block.type === "text" && <TextSettings block={block} onUpdate={upd} />}
      {block.type === "stats" && <StatsSettings block={block} onUpdate={upd} />}
      {block.type === "cta" && <CtaSettings block={block} onUpdate={upd} />}
      {block.type === "contact" && <ContactSettings block={block} onUpdate={upd} />}
      {block.type === "gallery" && <GallerySettings block={block} onUpdate={upd} />}
      {block.type === "team" && <TeamSettings block={block} onUpdate={upd} />}
      {block.type === "pricing" && <PricingSettings block={block} onUpdate={upd} />}
      {block.type === "video" && <VideoSettings block={block} onUpdate={upd} />}
      {block.type === "footer" && <FooterSettings block={block} onUpdate={upd} />}
      <CommonDesignSettings block={block} onUpdate={upd} />
    </div>
  );
}
