import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ArrowLeft } from "lucide-react";
import { downloadDataUrl } from "@/lib/editor/tools";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/qr/new")({
  head: () => ({ meta: [{ title: "New QR — Cardify" }] }),
  component: NewQR,
});

type QRType = "WEBSITE" | "TELEGRAM" | "WHATSAPP" | "PHONE" | "EMAIL" | "VCARD" | "LOCATION" | "CUSTOM";

function NewQR() {
  const { t } = useTranslation();
  const [type, setType] = useState<QRType>("WEBSITE");
  const [value, setValue] = useState("https://cardify.app");
  const [fg, setFg] = useState("#111111");
  const [bg, setBg] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState("");

  function encode(t: QRType, v: string): string {
    switch (t) {
      case "WEBSITE": case "CUSTOM": return v;
      case "TELEGRAM": return `https://t.me/${v.replace(/^@/, "")}`;
      case "WHATSAPP": return `https://wa.me/${v.replace(/\D/g, "")}`;
      case "PHONE": return `tel:${v}`;
      case "EMAIL": return `mailto:${v}`;
      case "LOCATION": return `geo:${v}`;
      case "VCARD": return v;
    }
  }

  useEffect(() => {
    const text = encode(type, value);
    if (!text) return;
    QRCode.toDataURL(text, { width: 400, margin: 1, color: { dark: fg, light: bg } })
      .then(setDataUrl).catch(() => setDataUrl(""));
  }, [type, value, fg, bg]);

  const QR_TYPES: QRType[] = ["WEBSITE","TELEGRAM","WHATSAPP","PHONE","EMAIL","LOCATION","VCARD","CUSTOM"];

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <Link to="/qr" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("qr.back")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">{t("qr.new_title")}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>{t("qr.type")}</Label>
            <Select value={type} onValueChange={(v) => setType(v as QRType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {QR_TYPES.map((qType) => (
                  <SelectItem key={qType} value={qType}>
                    {t(`qr.types.${qType}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("qr.value")}</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("qr.foreground")}</Label>
              <Input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>{t("qr.background")}</Label>
              <Input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6">
          {dataUrl ? (
            <img src={dataUrl} alt="QR preview" className="h-72 w-72 rounded-md" />
          ) : (
            <div className="grid h-72 w-72 place-items-center rounded-md bg-muted text-sm text-muted-foreground">
              {t("qr.enter_value")}
            </div>
          )}
          <Button
            className="mt-6"
            disabled={!dataUrl}
            onClick={() => downloadDataUrl(dataUrl, `qr-${type.toLowerCase()}.png`)}
          >
            <Download className="mr-1 h-4 w-4" /> {t("qr.download")}
          </Button>
        </div>
      </div>
    </div>
  );
}
