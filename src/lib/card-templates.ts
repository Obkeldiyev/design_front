import type { CanvasDoc } from "@/lib/api/types";

export type CardTemplate = {
  id: string;
  title: string;
  category: string;
  industry: string;
  isPremium: boolean;
  width: number;
  height: number;
  doc: CanvasDoc;
};

const WIDTH = 1050;
const HEIGHT = 600;

function text(
  id: string,
  value: string,
  left: number,
  top: number,
  width: number,
  fontSize: number,
  fill: string,
  options: Record<string, unknown> = {},
) {
  return {
    type: "textbox",
    version: "6.0.0",
    id,
    left,
    top,
    width,
    text: value,
    fontSize,
    fontFamily: "Inter",
    fill,
    originX: "left",
    originY: "top",
    splitByGrapheme: false,
    ...options,
  };
}

function rect(
  id: string,
  left: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  options: Record<string, unknown> = {},
) {
  return { type: "rect", version: "6.0.0", id, left, top, width, height, fill, originX: "left", originY: "top", ...options };
}

function doc(background: string, frontObjects: unknown[], backObjects: unknown[]): CanvasDoc {
  return {
    version: 1,
    canvas: { width: WIDTH, height: HEIGHT, background },
    pages: [
      { id: "front", name: "Front", fabric: { version: "6.0.0", objects: frontObjects } },
      { id: "back",  name: "Back",  fabric: { version: "6.0.0", objects: backObjects  } },
    ],
  };
}

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "c1",
    title: "Executive Navy",
    category: "Business",
    industry: "Business",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#111827",
      [
        rect("accent", 56, 64, 8, 472, "#6366f1", { rx: 4, ry: 4 }),
        rect("photo-block", 690, 70, 280, 460, "#1f2937", { rx: 18, ry: 18 }),
        text("name", "ALEX MORGAN", 104, 92, 520, 52, "#ffffff", { fontWeight: "700" }),
        text("role", "Chief Executive Officer", 106, 168, 430, 24, "#818cf8", { fontWeight: "400" }),
        rect("rule", 106, 218, 90, 4, "#818cf8", { rx: 2, ry: 2 }),
        text("email", "alex@acme.com", 106, 258, 360, 22, "#cbd5e1"),
        text("phone", "+1 (555) 000-1234", 106, 294, 360, 22, "#cbd5e1"),
        text("web", "www.acme.com", 106, 330, 360, 22, "#cbd5e1"),
        text("company", "ACME CORP", 106, 492, 320, 28, "#ffffff", { fontWeight: "700" }),
        text("monogram", "A", 782, 210, 120, 160, "#374151", { fontSize: 170, fontWeight: "800", textAlign: "center" }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#1f2937"),
        rect("back-accent", 472, 140, 106, 8, "#6366f1", { rx: 4, ry: 4 }),
        text("back-company", "ACME CORP", 250, 226, 550, 56, "#ffffff", { fontWeight: "800", textAlign: "center" }),
        text("back-tagline", "Excellence in Every Detail", 250, 306, 550, 24, "#cbd5e1", { textAlign: "center" }),
      ],
    ),
  },
  {
    id: "c2",
    title: "Clean Studio",
    category: "Business",
    industry: "Business",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#ffffff",
      [
        rect("top-line", 56, 54, 938, 6, "#111827", { rx: 3, ry: 3 }),
        rect("soft-panel", 652, 108, 300, 384, "#f3f4f6", { rx: 22, ry: 22 }),
        text("name", "SARAH CHEN", 82, 118, 500, 52, "#111827", { fontWeight: "800" }),
        text("role", "Product Designer", 84, 190, 420, 24, "#64748b"),
        rect("rule", 84, 236, 72, 4, "#111827", { rx: 2, ry: 2 }),
        text("email", "sarah@studio.io", 84, 276, 360, 22, "#334155"),
        text("phone", "+1 (555) 123-4567", 84, 312, 360, 22, "#334155"),
        text("web", "studio.io", 84, 348, 360, 22, "#334155"),
        text("company", "Studio.io", 84, 500, 340, 32, "#111827", { fontWeight: "800" }),
        text("monogram", "S", 740, 218, 120, 130, "#d1d5db", { fontSize: 132, fontWeight: "800", textAlign: "center" }),
      ],
      [
        rect("top-line", 56, 54, 938, 6, "#111827", { rx: 3, ry: 3 }),
        text("company", "Studio.io", 250, 236, 550, 56, "#111827", { fontWeight: "800", textAlign: "center" }),
        text("tagline", "Design that speaks.", 250, 316, 550, 24, "#64748b", { textAlign: "center" }),
      ],
    ),
  },
  {
    id: "c3",
    title: "Medical Blue",
    category: "Medical",
    industry: "Medical",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#ffffff",
      [
        rect("side", 0, 0, 300, HEIGHT, "#0ea5e9"),
        text("side-name", "Dr. Emily Ngo", 48, 450, 210, 30, "#ffffff", { fontWeight: "700" }),
        text("name", "DR. EMILY NGO", 370, 92, 500, 44, "#0c4a6e", { fontWeight: "800" }),
        text("role", "MD - Cardiologist", 372, 154, 420, 23, "#0284c7"),
        rect("rule", 372, 202, 230, 3, "#bae6fd", { rx: 2, ry: 2 }),
        text("org", "City Medical Center", 372, 236, 420, 22, "#334155", { fontWeight: "700" }),
        text("email", "emily.ngo@citymed.org", 372, 276, 430, 20, "#64748b"),
        text("phone", "+1 (555) 200-3000", 372, 310, 430, 20, "#64748b"),
        text("addr", "123 Health Ave, NY 10001", 372, 344, 430, 19, "#94a3b8"),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#0ea5e9"),
        text("org", "City Medical Center", 225, 236, 600, 42, "#ffffff", { fontWeight: "700", textAlign: "center" }),
        text("tagline", "Caring for your health", 225, 306, 600, 24, "#e0f2fe", { textAlign: "center" }),
      ],
    ),
  },
  {
    id: "c4",
    title: "Restaurant Warm",
    category: "Restaurant",
    industry: "Restaurant",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#1c0a00",
      [
        rect("top", 36, 36, 978, 4, "#f59e0b"),
        rect("bottom", 36, 560, 978, 4, "#f59e0b"),
        text("name", "La Bella Cucina", 76, 104, 620, 56, "#f59e0b", { fontFamily: "Georgia", fontStyle: "italic", fontWeight: "700" }),
        text("tag", "Authentic Italian Cuisine", 80, 184, 480, 24, "#fde68a"),
        text("chef", "Marco Rossi - Head Chef", 80, 250, 420, 21, "#fef3c7", { fontWeight: "700" }),
        text("email", "marco@labella.com", 80, 288, 400, 19, "#fbbf24"),
        text("phone", "+1 (555) 700-8899", 80, 322, 400, 19, "#fbbf24"),
        text("addr", "42 Via Roma, Little Italy, NY", 80, 356, 500, 18, "#d97706"),
        text("hours", "Mon-Sun  12pm - 10pm", 80, 500, 420, 18, "#f59e0b"),
      ],
      [
        rect("top", 36, 36, 978, 4, "#f59e0b"),
        rect("bottom", 36, 560, 978, 4, "#f59e0b"),
        text("name", "La Bella Cucina", 190, 222, 670, 62, "#f59e0b", { fontFamily: "Georgia", fontStyle: "italic", fontWeight: "700", textAlign: "center" }),
        text("tag", "Authentic Italian Cuisine", 250, 318, 550, 24, "#fde68a", { textAlign: "center" }),
      ],
    ),
  },
  {
    id: "c5",
    title: "Tech Neon",
    category: "IT",
    industry: "IT",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#0f172a",
      [
        rect("accent", 82, 94, 58, 6, "#06b6d4", { rx: 3, ry: 3 }),
        text("name", "NINA TORRES", 82, 126, 500, 52, "#f0f9ff", { fontWeight: "800" }),
        text("role", "Cloud Architect / DevOps", 84, 198, 450, 24, "#06b6d4"),
        text("email", "nina@cloudnine.dev", 84, 270, 380, 22, "#94a3b8"),
        text("phone", "+1 (415) 000-7777", 84, 306, 380, 22, "#94a3b8"),
        text("web", "cloudnine.dev", 84, 342, 380, 22, "#06b6d4"),
        text("company", "CloudNine", 84, 500, 330, 30, "#06b6d4", { fontWeight: "800" }),
        rect("code-box", 700, 166, 250, 250, "#06b6d4", { opacity: 0.08, rx: 22, ry: 22 }),
        text("code", "</>", 726, 244, 200, 86, "#06b6d4", { fontWeight: "800", textAlign: "center", opacity: 0.38 }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#0f172a"),
        text("company", "CloudNine", 250, 236, 550, 56, "#06b6d4", { fontWeight: "800", textAlign: "center" }),
        text("tag", "Cloud - DevOps - Infrastructure", 250, 318, 550, 24, "#94a3b8", { textAlign: "center" }),
      ],
    ),
  },
];

export const TEMPLATE_CATEGORIES = [
  "All",
  ...Array.from(new Set(CARD_TEMPLATES.map((template) => template.category))),
  {
    id: "c6", title: "Real Estate", category: "Real Estate", industry: "Real Estate", isPremium: false, width: WIDTH, height: HEIGHT,
    doc: doc("#0f172a", [
      rect("rp", 680, 0, 370, HEIGHT, "#1e293b"),
      rect("gb", 680, 0, 5, HEIGHT, "#f59e0b"),
      text("fn", "RICHARD", 60, 80, 560, 54, "#ffffff", { fontWeight: "800" }),
      text("ln", "HAMILTON", 60, 148, 560, 54, "#f59e0b", { fontWeight: "800" }),
      text("lic", "Licensed Realtor · DRE #01234567", 62, 222, 480, 18, "#94a3b8"),
      text("email", "richard@premierhomes.com", 62, 268, 480, 20, "#cbd5e1"),
      text("phone", "+1 (310) 555-9900", 62, 304, 480, 20, "#cbd5e1"),
      text("web", "premierhomes.com", 62, 340, 480, 20, "#f59e0b"),
      text("co", "PREMIER HOMES", 62, 500, 400, 24, "#ffffff", { fontWeight: "700" }),
    ], [
      rect("bg", 0, 0, WIDTH, HEIGHT, "#0f172a"),
      rect("bar", 0, 0, WIDTH, 5, "#f59e0b"),
      text("co", "PREMIER HOMES", 250, 248, 550, 44, "#ffffff", { fontWeight: "800", textAlign: "center" }),
      text("tag", "Your Dream. Our Mission.", 250, 312, 550, 22, "#94a3b8", { textAlign: "center" }),
    ]),
  },
  {
    id: "c7", title: "Creative Bold", category: "Creative", industry: "Creative", isPremium: false, width: WIDTH, height: HEIGHT,
    doc: doc("#fafafa", [
      rect("lb", 0, 0, 460, HEIGHT, "#18181b"),
      rect("rb", 444, 0, 32, HEIGHT, "#ef4444"),
      text("fn", "LUCAS", 40, 100, 380, 72, "#ffffff", { fontWeight: "900" }),
      text("ln", "OKAFOR", 40, 180, 380, 72, "#ef4444", { fontWeight: "900" }),
      text("role", "Visual Artist & Photographer", 40, 274, 380, 18, "#a1a1aa"),
      text("email", "lucas@okafor.studio", 40, 430, 380, 17, "#71717a"),
      text("phone", "+44 7700 900123", 40, 462, 380, 17, "#71717a"),
      text("web", "okafor.studio", 40, 494, 380, 17, "#71717a"),
      text("co", "OKAFOR\nSTUDIO", 510, 90, 480, 54, "#18181b", { fontWeight: "900" }),
      text("svc", "Photography\nIllustration\nBrand Identity", 510, 316, 440, 22, "#71717a"),
    ], [
      rect("bg", 0, 0, WIDTH, HEIGHT, "#18181b"),
      rect("bar", 0, 0, 32, HEIGHT, "#ef4444"),
      text("co", "OKAFOR STUDIO", 200, 248, 650, 52, "#ffffff", { fontWeight: "900", textAlign: "center" }),
      text("web", "okafor.studio", 200, 320, 650, 22, "#71717a", { textAlign: "center" }),
    ]),
  },
  {
    id: "c8", title: "Luxury Gold", category: "Business", industry: "Business", isPremium: true, width: WIDTH, height: HEIGHT,
    doc: doc("#0d0d0d", [
      rect("t", 0, 0, WIDTH, 2, "#c9a84c"),
      rect("b", 0, 598, WIDTH, 2, "#c9a84c"),
      rect("l", 0, 0, 2, HEIGHT, "#c9a84c"),
      rect("r", 1048, 0, 2, HEIGHT, "#c9a84c"),
      text("fn", "VICTORIA", 80, 100, 580, 58, "#c9a84c", { fontFamily: "Georgia" }),
      text("ln", "BLACKWOOD", 80, 170, 580, 58, "#f5f0e8", { fontFamily: "Georgia", fontWeight: "700" }),
      rect("rule", 80, 244, 280, 1, "#c9a84c"),
      text("role", "Private Client Advisor", 80, 268, 420, 20, "#a78a50"),
      text("email", "victoria@prestige.com", 80, 320, 420, 18, "#8a7d65"),
      text("phone", "+44 20 7946 0000", 80, 354, 420, 18, "#8a7d65"),
      text("co", "PRESTIGE GROUP", 80, 500, 420, 22, "#c9a84c", { fontWeight: "700" }),
    ], [
      rect("t", 0, 0, WIDTH, 2, "#c9a84c"),
      rect("b", 0, 598, WIDTH, 2, "#c9a84c"),
      text("co", "PRESTIGE GROUP", 225, 248, 600, 44, "#c9a84c", { fontFamily: "Georgia", fontWeight: "700", textAlign: "center" }),
      text("tag", "Private Client Services", 225, 310, 600, 22, "#a78a50", { textAlign: "center" }),
    ]),
  },
  {
    id: "c9", title: "Construction", category: "Construction", industry: "Construction", isPremium: false, width: WIDTH, height: HEIGHT,
    doc: doc("#1c1917", [
      rect("header", 0, 0, WIDTH, 130, "#f59e0b"),
      text("co", "IRONCLAD", 52, 22, 680, 68, "#1c1917", { fontWeight: "900" }),
      text("co2", "CONSTRUCTION GROUP", 54, 96, 680, 20, "#1c1917", { fontWeight: "600" }),
      text("name", "MIKE STEELE", 52, 178, 560, 44, "#ffffff", { fontWeight: "800" }),
      text("role", "Senior Site Manager", 54, 234, 500, 22, "#f59e0b"),
      rect("rule", 54, 272, 240, 2, "#44403c"),
      text("email", "mike@ironclad.build", 54, 292, 440, 18, "#a8a29e"),
      text("phone", "+1 (713) 555-0044", 54, 322, 440, 18, "#a8a29e"),
      text("web", "ironclad.build", 54, 352, 440, 18, "#a8a29e"),
    ], [
      rect("header", 0, 0, WIDTH, 130, "#f59e0b"),
      text("co", "IRONCLAD", 250, 22, 550, 68, "#1c1917", { fontWeight: "900", textAlign: "center" }),
      text("tag", "Building with Pride", 250, 200, 550, 38, "#ffffff", { fontWeight: "700", textAlign: "center" }),
      text("web", "ironclad.build", 250, 260, 550, 22, "#f59e0b", { textAlign: "center" }),
    ]),
  },
  {
    id: "c10", title: "Startup Modern", category: "IT", industry: "IT", isPremium: false, width: WIDTH, height: HEIGHT,
    doc: doc("#ffffff", [
      rect("footer", 0, 468, WIDTH, 132, "#f8fafc"),
      rect("fline", 0, 468, WIDTH, 2, "#e2e8f0"),
      rect("logo-box", 56, 60, 56, 56, "#6366f1", { rx: 14, ry: 14 }),
      text("logo-l", "N", 68, 70, 36, 36, "#ffffff", { fontWeight: "800", textAlign: "center" }),
      text("name", "NOAH KIM", 56, 150, 560, 50, "#0f172a", { fontWeight: "700" }),
      text("role", "Co-founder & CTO", 58, 216, 460, 24, "#6366f1"),
      text("email", "noah@nexus.ai", 58, 278, 440, 22, "#475569"),
      text("phone", "+1 (650) 555-3210", 58, 314, 440, 22, "#475569"),
      text("web", "nexus.ai", 58, 350, 440, 22, "#6366f1"),
      text("ft", "nexus.ai  ·  San Francisco, CA", 72, 494, 500, 18, "#94a3b8"),
      text("bg-txt", "Nexus\nAI", 730, 110, 250, 88, "#f1f5f9", { fontWeight: "900" }),
    ], [
      rect("footer", 0, 468, WIDTH, 132, "#f8fafc"),
      rect("fline", 0, 468, WIDTH, 2, "#e2e8f0"),
      text("co", "nexus.ai", 250, 230, 550, 56, "#6366f1", { fontWeight: "700", textAlign: "center" }),
      text("tag", "AI · Automation · Infrastructure", 250, 310, 550, 22, "#475569", { textAlign: "center" }),
    ]),
  },
];

export const TEMPLATE_CATEGORIES = [
  "All",
  ...Array.from(new Set(CARD_TEMPLATES.map((t) => t.category))),
];
