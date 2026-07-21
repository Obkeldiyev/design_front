import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Phone, Mail, Globe, MapPin, Download } from "lucide-react";

export const Route = createFileRoute("/card/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Cardify` },
      { name: "description", content: "Digital business card" },
    ],
  }),
  component: CardPublic,
});

// Placeholder card. Real implementation fetches /public/card/:slug
function CardPublic() {
  const { slug } = Route.useParams();
  const [qr, setQr] = useState("");
  const cardUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (!cardUrl) return;
    QRCode.toDataURL(cardUrl, { width: 240, margin: 1 }).then(setQr).catch(() => {});
  }, [cardUrl]);

  // Demo data — replace with API fetch once backend endpoint exists
  const data = {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (m: string) => m.toUpperCase()),
    title: "Digital Business Card",
    description: "Powered by Cardify",
    phone: "+998 90 000 00 00",
    email: "hello@example.com",
    website: "https://example.com",
    address: "Tashkent, Uzbekistan",
  };

  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TEL:${data.phone}
EMAIL:${data.email}
URL:${data.website}
ADR:;;${data.address};;;;
END:VCARD`;

  const downloadVcard = () => {
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="h-32 bg-gradient-to-br from-primary to-accent-foreground" />
        <div className="relative px-6 pb-6 -mt-12">
          <div className="grid h-24 w-24 place-items-center rounded-2xl bg-card font-display text-3xl font-bold ring-4 ring-card">
            {data.name[0]}
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">{data.name}</h1>
          <p className="text-sm text-muted-foreground">{data.title}</p>
          <p className="mt-2 text-sm">{data.description}</p>

          <div className="mt-6 space-y-2">
            <a href={`tel:${data.phone}`} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted">
              <Phone className="h-4 w-4 text-primary" /> <span>{data.phone}</span>
            </a>
            <a href={`mailto:${data.email}`} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted">
              <Mail className="h-4 w-4 text-primary" /> <span>{data.email}</span>
            </a>
            <a href={data.website} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted">
              <Globe className="h-4 w-4 text-primary" /> <span>{data.website}</span>
            </a>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <MapPin className="h-4 w-4 text-primary" /> <span>{data.address}</span>
            </div>
          </div>

          <button
            onClick={downloadVcard}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Save contact
          </button>

          {qr && (
            <div className="mt-6 grid place-items-center">
              <img src={qr} alt="QR" className="h-32 w-32 rounded-md border border-border" />
              <span className="mt-2 text-xs text-muted-foreground">Scan to share</span>
            </div>
          )}

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by{" "}
            <a href="/" className="font-semibold text-primary">
              Cardify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
