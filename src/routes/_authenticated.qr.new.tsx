import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Download, ExternalLink, QrCode, Save } from "lucide-react";
import { downloadDataUrl } from "@/lib/editor/tools";
import { QRAPI } from "@/lib/api/resources";
import { apiError } from "@/lib/api/client";
import type { QRType } from "@/lib/api/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/qr/new")({
  head: () => ({ meta: [{ title: "New QR - card24" }] }),
  component: NewQR,
});

const QR_TYPES: QRType[] = [
  "BUSINESS_CARD",
  "PERSONAL_WEBSITE",
  "EXTERNAL_WEBSITE",
  "PHONE",
  "EMAIL",
  "WIFI",
  "TELEGRAM",
  "WHATSAPP",
  "SOCIAL_MEDIA",
  "LOCATION",
  "PLAIN_TEXT",
  "VCARD",
];

function toSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || `qr-${Date.now()}`;
}

function encode(type: QRType, value: string): string {
  const trimmed = value.trim();
  switch (type) {
    case "BUSINESS_CARD":
    case "PERSONAL_WEBSITE":
    case "EXTERNAL_WEBSITE":
    case "WEBSITE":
    case "SOCIAL_MEDIA":
    case "CUSTOM":
      return trimmed;
    case "TELEGRAM":
      return `https://t.me/${trimmed.replace(/^@/, "")}`;
    case "WHATSAPP":
      return `https://wa.me/${trimmed.replace(/\D/g, "")}`;
    case "PHONE":
      return `tel:${trimmed}`;
    case "EMAIL":
      return `mailto:${trimmed}`;
    case "LOCATION":
      return `geo:${trimmed.replace(/\s+/g, "")}`;
    case "WIFI":
      return `WIFI:T:WPA;S:${trimmed};P:;H:false;;`;
    case "VCARD":
    case "PLAIN_TEXT":
      return trimmed;
  }
}

function validateDestination(type: QRType, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "qr.errors.required";

  if (
    ["BUSINESS_CARD", "PERSONAL_WEBSITE", "EXTERNAL_WEBSITE", "WEBSITE", "SOCIAL_MEDIA"].includes(
      type,
    )
  ) {
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "https:") return "qr.errors.https";
    } catch {
      return "qr.errors.url";
    }
  }

  if (type === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "qr.errors.email";
  if ((type === "PHONE" || type === "WHATSAPP") && trimmed.replace(/\D/g, "").length < 7)
    return "qr.errors.phone";
  if (type === "TELEGRAM" && !/^@?[a-zA-Z0-9_]{5,32}$/.test(trimmed)) return "qr.errors.telegram";
  if (type === "LOCATION" && !/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(trimmed))
    return "qr.errors.location";

  return null;
}

function downloadText(text: string, filename: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function NewQR() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [type, setType] = useState<QRType>("EXTERNAL_WEBSITE");
  const [value, setValue] = useState("https://card24.uz");
  const [fg, setFg] = useState("#111827");
  const [bg, setBg] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState("");

  const validationKey = useMemo(() => validateDestination(type, value), [type, value]);
  const encoded = useMemo(() => encode(type, value), [type, value]);
  const fileBase = toSlug(name || t(`qr.types.${type}`));

  useEffect(() => {
    if (validationKey) {
      setDataUrl("");
      return;
    }

    QRCode.toDataURL(encoded, { width: 480, margin: 2, color: { dark: fg, light: bg } })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [encoded, fg, bg, validationKey]);

  const create = useMutation({
    mutationFn: () =>
      QRAPI.create({
        title: name || t(`qr.types.${type}`),
        slug: fileBase,
        type,
        data: {
          destination: value.trim(),
          encoded,
          foreground: fg,
          background: bg,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["qrCodes"] });
      toast.success(t("qr.saved"));
      navigate({ to: "/qr" });
    },
    onError: (error) => toast.error(apiError(error)),
  });

  const downloadSvg = async () => {
    const svg = await QRCode.toString(encoded, {
      type: "svg",
      margin: 2,
      color: { dark: fg, light: bg },
    });
    downloadText(svg, `${fileBase}.svg`, "image/svg+xml");
  };

  const downloadPdf = () => {
    if (!dataUrl) return;
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    pdf.text(name || t(`qr.types.${type}`), 72, 72);
    pdf.addImage(dataUrl, "PNG", 150, 100, 300, 300);
    pdf.save(`${fileBase}.pdf`);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-10">
      <Link
        to="/qr"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("qr.back")}
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-normal">{t("qr.new_title")}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t("qr.new_subtitle")}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("qr.name")}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("qr.name_placeholder")}
              />
              <p className="text-xs leading-5 text-muted-foreground">{t("qr.help.name")}</p>
            </div>

            <div className="space-y-2">
              <Label>{t("qr.type")}</Label>
              <Select value={type} onValueChange={(v) => setType(v as QRType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QR_TYPES.map((qType) => (
                    <SelectItem key={qType} value={qType}>
                      {t(`qr.types.${qType}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs leading-5 text-muted-foreground">{t(`qr.type_help.${type}`)}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t("qr.value")}</Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t(`qr.placeholders.${type}`)}
              />
              <p className="text-xs leading-5 text-muted-foreground">{t("qr.help.destination")}</p>
              {validationKey && (
                <p className="text-xs font-medium text-destructive">{t(validationKey)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("qr.foreground")}</Label>
              <Input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("qr.background")}</Label>
              <Input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <h2 className="font-display text-lg font-semibold">{t("qr.result_title")}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("qr.result_desc")}</p>
            {!validationKey && (
              <div className="mt-3 rounded-md bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
                {encoded}
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">{t("qr.preview")}</h2>
          </div>

          <div className="mt-5 grid place-items-center rounded-lg border border-border bg-background p-4">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt={t("qr.preview")}
                className="aspect-square w-full max-w-[280px] rounded-md object-contain"
              />
            ) : (
              <div className="grid aspect-square w-full max-w-[280px] place-items-center rounded-md bg-muted text-center text-sm text-muted-foreground">
                {t("qr.enter_value")}
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-2">
            <Button
              onClick={() => create.mutate()}
              disabled={!dataUrl || Boolean(validationKey) || create.isPending}
            >
              <Save className="h-4 w-4" /> {create.isPending ? t("qr.saving") : t("qr.save")}
            </Button>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                disabled={!dataUrl}
                onClick={() => downloadDataUrl(dataUrl, `${fileBase}.png`)}
              >
                PNG
              </Button>
              <Button variant="outline" disabled={!dataUrl} onClick={downloadSvg}>
                SVG
              </Button>
              <Button variant="outline" disabled={!dataUrl} onClick={downloadPdf}>
                PDF
              </Button>
            </div>
            <Button asChild variant="secondary" disabled={Boolean(validationKey)}>
              <a href={encoded} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> {t("qr.test")}
              </a>
            </Button>
            <Link to="/qr">
              <Button variant="ghost" className="w-full">
                {t("common.cancel")}
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
