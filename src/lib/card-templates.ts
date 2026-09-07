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
  return {
    type: "rect",
    version: "6.0.0",
    id,
    left,
    top,
    width,
    height,
    fill,
    originX: "left",
    originY: "top",
    ...options,
  };
}

function qr(prefix: string, left: number, top: number, cell: number, fill: string) {
  const cells = [
    [0, 0],
    [1, 0],
    [2, 0],
    [4, 0],
    [6, 0],
    [7, 0],
    [0, 1],
    [2, 1],
    [5, 1],
    [7, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [4, 2],
    [6, 2],
    [7, 2],
    [3, 3],
    [5, 3],
    [0, 4],
    [2, 4],
    [3, 4],
    [6, 4],
    [1, 5],
    [4, 5],
    [5, 5],
    [7, 5],
    [0, 6],
    [2, 6],
    [4, 6],
    [6, 6],
    [7, 6],
    [0, 7],
    [1, 7],
    [3, 7],
    [5, 7],
  ];

  return cells.map(([x, y], i) =>
    rect(`${prefix}-${i}`, left + x * cell, top + y * cell, cell * 0.78, cell * 0.78, fill, {
      rx: 2,
      ry: 2,
    }),
  );
}

function doc(background: string, frontObjects: unknown[], backObjects: unknown[]): CanvasDoc {
  return {
    version: 1,
    canvas: { width: WIDTH, height: HEIGHT, background },
    pages: [
      { id: "front", name: "Front", fabric: { version: "6.0.0", objects: frontObjects } },
      { id: "back", name: "Back", fabric: { version: "6.0.0", objects: backObjects } },
    ],
  };
}

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "c1",
    title: "Executive Navy",
    category: "Brand",
    industry: "Brand",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#111827",
      [
        rect("accent", 56, 64, 8, 472, "#6366f1", { rx: 4, ry: 4 }),
        rect("photo-block", 690, 70, 280, 460, "#1f2937", { rx: 18, ry: 18 }),
        text("name", "ALEX MORGAN", 104, 92, 520, 52, "#ffffff", { fontWeight: "700" }),
        text("role", "Chief Executive Officer", 106, 168, 430, 24, "#818cf8", {
          fontWeight: "400",
        }),
        rect("rule", 106, 218, 90, 4, "#818cf8", { rx: 2, ry: 2 }),
        text("email", "alex@acme.com", 106, 258, 360, 22, "#cbd5e1"),
        text("phone", "+1 (555) 000-1234", 106, 294, 360, 22, "#cbd5e1"),
        text("web", "www.acme.com", 106, 330, 360, 22, "#cbd5e1"),
        text("company", "ACME CORP", 106, 492, 320, 28, "#ffffff", { fontWeight: "700" }),
        text("monogram", "A", 782, 210, 120, 160, "#374151", {
          fontSize: 170,
          fontWeight: "800",
          textAlign: "center",
        }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#1f2937"),
        rect("back-accent", 472, 140, 106, 8, "#6366f1", { rx: 4, ry: 4 }),
        text("back-company", "ACME CORP", 250, 226, 550, 56, "#ffffff", {
          fontWeight: "800",
          textAlign: "center",
        }),
        text("back-tagline", "Excellence in Every Detail", 250, 306, 550, 24, "#cbd5e1", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c2",
    title: "Clean Studio",
    category: "Brand",
    industry: "Brand",
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
        text("monogram", "S", 740, 218, 120, 130, "#d1d5db", {
          fontSize: 132,
          fontWeight: "800",
          textAlign: "center",
        }),
      ],
      [
        rect("top-line", 56, 54, 938, 6, "#111827", { rx: 3, ry: 3 }),
        text("company", "Studio.io", 250, 236, 550, 56, "#111827", {
          fontWeight: "800",
          textAlign: "center",
        }),
        text("tagline", "Design that speaks.", 250, 316, 550, 24, "#64748b", {
          textAlign: "center",
        }),
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
        text("org", "City Medical Center", 225, 236, 600, 42, "#ffffff", {
          fontWeight: "700",
          textAlign: "center",
        }),
        text("tagline", "Caring for your health", 225, 306, 600, 24, "#e0f2fe", {
          textAlign: "center",
        }),
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
        text("name", "La Bella Cucina", 76, 104, 620, 56, "#f59e0b", {
          fontFamily: "Georgia",
          fontStyle: "italic",
          fontWeight: "700",
        }),
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
        text("name", "La Bella Cucina", 190, 222, 670, 62, "#f59e0b", {
          fontFamily: "Georgia",
          fontStyle: "italic",
          fontWeight: "700",
          textAlign: "center",
        }),
        text("tag", "Authentic Italian Cuisine", 250, 318, 550, 24, "#fde68a", {
          textAlign: "center",
        }),
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
        text("code", "</>", 726, 244, 200, 86, "#06b6d4", {
          fontWeight: "800",
          textAlign: "center",
          opacity: 0.38,
        }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#0f172a"),
        text("company", "CloudNine", 250, 236, 550, 56, "#06b6d4", {
          fontWeight: "800",
          textAlign: "center",
        }),
        text("tag", "Cloud - DevOps - Infrastructure", 250, 318, 550, 24, "#94a3b8", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c6",
    title: "Finance Gold",
    category: "Finance",
    industry: "Finance",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#0b1120",
      [
        rect("gold-bar", 0, 0, WIDTH, 18, "#d4af37"),
        rect("gold-chip", 802, 96, 156, 156, "#d4af37", { rx: 20, ry: 20, opacity: 0.16 }),
        text("name", "VICTOR HALE", 76, 96, 520, 50, "#ffffff", { fontWeight: "800" }),
        text("role", "Private Wealth Advisor", 78, 164, 460, 24, "#d4af37"),
        text("email", "victor@hale.capital", 78, 260, 420, 22, "#cbd5e1"),
        text("phone", "+1 (212) 555-0188", 78, 298, 420, 22, "#cbd5e1"),
        text("web", "hale.capital", 78, 336, 420, 22, "#d4af37"),
        text("company", "HALE CAPITAL", 78, 496, 460, 30, "#ffffff", { fontWeight: "800" }),
        ...qr("finance-qr", 812, 354, 16, "#d4af37"),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#0b1120"),
        rect("back-line", 170, 278, 710, 4, "#d4af37", { rx: 2, ry: 2 }),
        text("company", "HALE CAPITAL", 210, 206, 630, 52, "#ffffff", {
          fontWeight: "800",
          textAlign: "center",
        }),
        text("tagline", "Discipline. Growth. Trust.", 230, 316, 590, 24, "#d4af37", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c7",
    title: "Real Estate Slate",
    category: "Real Estate",
    industry: "Real Estate",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#f8fafc",
      [
        rect("photo", 0, 0, 390, HEIGHT, "#1e293b"),
        rect("photo-light", 46, 52, 298, 496, "#334155", { rx: 26, ry: 26 }),
        text("monogram", "RH", 116, 234, 160, 70, "#94a3b8", {
          fontSize: 58,
          fontWeight: "800",
          textAlign: "center",
        }),
        text("name", "RACHEL HART", 454, 100, 470, 48, "#0f172a", { fontWeight: "800" }),
        text("role", "Luxury Property Consultant", 456, 164, 470, 24, "#64748b"),
        rect("rule", 456, 214, 180, 4, "#2563eb", { rx: 2, ry: 2 }),
        text("email", "rachel@hartestates.com", 456, 268, 420, 22, "#334155"),
        text("phone", "+1 (310) 555-0240", 456, 306, 420, 22, "#334155"),
        text("addr", "Beverly Hills, California", 456, 344, 420, 22, "#64748b"),
        text("company", "HART ESTATES", 456, 492, 400, 30, "#2563eb", { fontWeight: "800" }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#f8fafc"),
        rect("roof", 364, 174, 322, 6, "#2563eb", { angle: -16, rx: 3, ry: 3 }),
        rect("roof2", 506, 174, 322, 6, "#2563eb", { angle: 16, rx: 3, ry: 3 }),
        text("company", "HART ESTATES", 250, 274, 550, 48, "#0f172a", {
          fontWeight: "800",
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c8",
    title: "Beauty Rose",
    category: "Beauty",
    industry: "Beauty",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#fff1f2",
      [
        rect("rose-panel", 644, 0, 406, HEIGHT, "#be123c"),
        rect("soft-card", 690, 76, 250, 448, "#ffffff", { rx: 32, ry: 32, opacity: 0.18 }),
        text("name", "MAYA LUXE", 74, 112, 520, 54, "#881337", {
          fontFamily: "Georgia",
          fontStyle: "italic",
          fontWeight: "700",
        }),
        text("role", "Makeup Artist & Stylist", 78, 188, 440, 24, "#be123c"),
        text("email", "hello@mayaluxe.studio", 78, 276, 420, 22, "#4c0519"),
        text("phone", "+1 (555) 810-2222", 78, 314, 420, 22, "#4c0519"),
        text("web", "@mayaluxe", 78, 352, 420, 22, "#be123c"),
        text("mark", "ML", 750, 232, 170, 96, "#fff1f2", {
          fontSize: 84,
          fontFamily: "Georgia",
          fontStyle: "italic",
          fontWeight: "700",
          textAlign: "center",
        }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#be123c"),
        text("brand", "Maya Luxe", 255, 230, 540, 70, "#fff1f2", {
          fontSize: 60,
          fontFamily: "Georgia",
          fontStyle: "italic",
          fontWeight: "700",
          textAlign: "center",
        }),
        text("tag", "Beauty in every detail", 255, 326, 540, 24, "#fecdd3", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c9",
    title: "Legal Ivory",
    category: "Legal",
    industry: "Legal",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#faf7ef",
      [
        rect("left", 0, 0, 126, HEIGHT, "#111827"),
        rect("thin", 158, 72, 4, 456, "#b45309", { rx: 2, ry: 2 }),
        text("name", "ELENA MORRIS", 214, 104, 520, 48, "#111827", { fontWeight: "800" }),
        text("role", "Corporate Attorney", 216, 170, 420, 24, "#92400e"),
        text("firm", "Morris & Cole LLP", 216, 240, 430, 24, "#111827", { fontWeight: "700" }),
        text("email", "elena@morriscole.com", 216, 302, 430, 21, "#374151"),
        text("phone", "+1 (646) 555-4410", 216, 338, 430, 21, "#374151"),
        text("addr", "120 Madison Ave, New York", 216, 374, 430, 21, "#6b7280"),
        text("scale", "§", 806, 186, 130, 170, "#d6d3d1", {
          fontSize: 162,
          fontFamily: "Georgia",
          textAlign: "center",
        }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#111827"),
        text("firm", "MORRIS & COLE", 210, 232, 630, 52, "#faf7ef", {
          fontWeight: "800",
          textAlign: "center",
        }),
        text("tag", "Law with clarity", 240, 310, 570, 24, "#b45309", { textAlign: "center" }),
      ],
    ),
  },
  {
    id: "c10",
    title: "Fitness Pulse",
    category: "Fitness",
    industry: "Fitness",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#111111",
      [
        rect("lime", 0, 0, WIDTH, HEIGHT, "#a3e635", { opacity: 0.08 }),
        rect("slash", 620, -80, 190, 760, "#a3e635", { angle: 12, opacity: 0.92 }),
        text("name", "JAX RIVERA", 76, 110, 500, 56, "#ffffff", { fontWeight: "900" }),
        text("role", "Strength Coach", 78, 188, 380, 26, "#a3e635", { fontWeight: "700" }),
        text("email", "coach@jaxfit.com", 78, 286, 380, 22, "#d4d4d4"),
        text("phone", "+1 (555) 321-9090", 78, 324, 380, 22, "#d4d4d4"),
        text("web", "jaxfit.com", 78, 362, 380, 22, "#a3e635"),
        text("mark", "JF", 744, 230, 180, 90, "#111111", {
          fontSize: 82,
          fontWeight: "900",
          textAlign: "center",
        }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#111111"),
        rect("pulse", 220, 292, 610, 8, "#a3e635", { rx: 4, ry: 4 }),
        text("brand", "JAX FIT", 250, 214, 550, 56, "#ffffff", {
          fontWeight: "900",
          textAlign: "center",
        }),
        text("tag", "Train with intent", 250, 326, 550, 24, "#a3e635", { textAlign: "center" }),
      ],
    ),
  },
  {
    id: "c11",
    title: "Creative Pop",
    category: "Creative",
    industry: "Creative",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#fef3c7",
      [
        rect("coral", 0, 0, 352, HEIGHT, "#fb7185"),
        rect("cyan", 308, 0, 56, HEIGHT, "#22d3ee"),
        rect("dot1", 824, 80, 96, 96, "#fb7185", { rx: 999, ry: 999 }),
        rect("dot2", 764, 142, 62, 62, "#22d3ee", { rx: 999, ry: 999 }),
        text("name", "LEO PARK", 414, 112, 450, 56, "#111827", { fontWeight: "900" }),
        text("role", "Brand Illustrator", 416, 188, 420, 24, "#be123c"),
        text("email", "leo@parkcreative.co", 416, 286, 420, 22, "#374151"),
        text("phone", "+1 (555) 450-1111", 416, 324, 420, 22, "#374151"),
        text("web", "parkcreative.co", 416, 362, 420, 22, "#0891b2"),
        text("brand", "PARK CREATIVE", 416, 492, 430, 30, "#111827", { fontWeight: "900" }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#fef3c7"),
        rect("block", 166, 150, 718, 300, "#111827", { rx: 28, ry: 28 }),
        text("brand", "PARK CREATIVE", 248, 246, 554, 58, "#fef3c7", {
          fontWeight: "900",
          textAlign: "center",
        }),
        text("tag", "Illustration for bold brands", 248, 324, 554, 24, "#22d3ee", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c12",
    title: "Construction Safety",
    category: "Construction",
    industry: "Construction",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#18181b",
      [
        rect("yellow", 0, 0, 260, HEIGHT, "#facc15"),
        rect("stripe1", 28, 80, 220, 18, "#18181b", { angle: -18 }),
        rect("stripe2", 28, 170, 220, 18, "#18181b", { angle: -18 }),
        rect("stripe3", 28, 260, 220, 18, "#18181b", { angle: -18 }),
        text("name", "OMAR STONE", 326, 104, 500, 52, "#ffffff", { fontWeight: "900" }),
        text("role", "Site Project Manager", 328, 176, 430, 24, "#facc15"),
        text("email", "omar@stonebuild.com", 328, 272, 420, 22, "#d4d4d8"),
        text("phone", "+1 (555) 601-4040", 328, 310, 420, 22, "#d4d4d8"),
        text("web", "stonebuild.com", 328, 348, 420, 22, "#facc15"),
        text("company", "STONE BUILD", 328, 492, 420, 30, "#ffffff", { fontWeight: "900" }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#facc15"),
        text("brand", "STONE BUILD", 220, 244, 610, 58, "#18181b", {
          fontWeight: "900",
          textAlign: "center",
        }),
        text("tag", "Built strong. Delivered clean.", 220, 326, 610, 24, "#3f3f46", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c13",
    title: "Auto Chrome",
    category: "Automotive",
    industry: "Automotive",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#020617",
      [
        rect("blue-glow", 672, 88, 264, 386, "#0ea5e9", { rx: 40, ry: 40, opacity: 0.18 }),
        rect("line", 76, 82, 460, 4, "#38bdf8", { rx: 2, ry: 2 }),
        text("name", "MAX CARTER", 76, 126, 500, 54, "#e0f2fe", { fontWeight: "900" }),
        text("role", "Performance Auto Specialist", 78, 202, 470, 24, "#38bdf8"),
        text("email", "max@carterauto.com", 78, 292, 420, 22, "#94a3b8"),
        text("phone", "+1 (555) 770-9099", 78, 330, 420, 22, "#94a3b8"),
        text("web", "carterauto.com", 78, 368, 420, 22, "#38bdf8"),
        text("mark", "CAR", 716, 226, 190, 86, "#38bdf8", {
          fontSize: 70,
          fontWeight: "900",
          textAlign: "center",
          opacity: 0.6,
        }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#020617"),
        text("brand", "CARTER AUTO", 220, 242, 610, 56, "#e0f2fe", {
          fontWeight: "900",
          textAlign: "center",
        }),
        rect("back-line", 340, 328, 370, 4, "#38bdf8", { rx: 2, ry: 2 }),
      ],
    ),
  },
  {
    id: "c14",
    title: "Education Fresh",
    category: "Education",
    industry: "Education",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#ecfeff",
      [
        rect("panel", 0, 0, WIDTH, 176, "#0891b2"),
        text("name", "PRIYA SHAH", 72, 94, 520, 52, "#ffffff", { fontWeight: "800" }),
        text("role", "Learning Consultant", 74, 218, 420, 24, "#0e7490"),
        text("email", "priya@brightpath.edu", 74, 290, 420, 22, "#164e63"),
        text("phone", "+1 (555) 230-7070", 74, 328, 420, 22, "#164e63"),
        text("web", "brightpath.edu", 74, 366, 420, 22, "#0891b2"),
        rect("badge", 762, 250, 150, 150, "#0891b2", { rx: 999, ry: 999 }),
        text("bp", "BP", 796, 294, 90, 56, "#ecfeff", {
          fontSize: 46,
          fontWeight: "900",
          textAlign: "center",
        }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#0891b2"),
        text("brand", "BrightPath", 250, 236, 550, 60, "#ecfeff", {
          fontWeight: "800",
          textAlign: "center",
        }),
        text("tag", "Learn better. Grow faster.", 250, 326, 550, 24, "#cffafe", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c15",
    title: "Minimal Mono",
    category: "Brand",
    industry: "Brand",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#ffffff",
      [
        text("name", "NOAH KIM", 76, 90, 520, 54, "#000000", { fontWeight: "800" }),
        text("role", "Independent Consultant", 78, 164, 420, 24, "#525252"),
        rect("rule", 78, 242, 894, 2, "#000000"),
        text("email", "hello@noahkim.co", 78, 300, 420, 22, "#171717"),
        text("phone", "+1 (555) 818-3000", 78, 338, 420, 22, "#171717"),
        text("web", "noahkim.co", 78, 376, 420, 22, "#171717"),
        text("company", "NK", 824, 410, 140, 86, "#000000", {
          fontSize: 76,
          fontWeight: "900",
          textAlign: "right",
        }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#ffffff"),
        text("brand", "NOAH KIM", 250, 250, 550, 52, "#000000", {
          fontWeight: "900",
          textAlign: "center",
        }),
        rect("back-rule", 350, 330, 350, 2, "#000000"),
      ],
    ),
  },
  {
    id: "c16",
    title: "Consultant Sage",
    category: "Consulting",
    industry: "Consulting",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#f7fee7",
      [
        rect("sage", 630, 0, 420, HEIGHT, "#3f6212"),
        rect("white-card", 682, 72, 284, 456, "#ffffff", { rx: 28, ry: 28, opacity: 0.18 }),
        text("name", "ANIKA REED", 76, 112, 520, 52, "#1a2e05", { fontWeight: "800" }),
        text("role", "Operations Consultant", 78, 184, 430, 24, "#4d7c0f"),
        text("email", "anika@reedops.com", 78, 282, 420, 22, "#365314"),
        text("phone", "+1 (555) 908-2626", 78, 320, 420, 22, "#365314"),
        text("web", "reedops.com", 78, 358, 420, 22, "#4d7c0f"),
        ...qr("sage-qr", 772, 236, 14, "#f7fee7"),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#3f6212"),
        text("brand", "REED OPS", 250, 238, 550, 56, "#f7fee7", {
          fontWeight: "800",
          textAlign: "center",
        }),
        text("tag", "Sharper systems. Calmer teams.", 250, 322, 550, 24, "#d9f99d", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c17",
    title: "Photo Noir",
    category: "Photography",
    industry: "Photography",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#050505",
      [
        rect("frame", 52, 52, 946, 496, "transparent", {
          stroke: "#ffffff",
          strokeWidth: 2,
          rx: 22,
          ry: 22,
        }),
        rect("lens", 768, 184, 150, 150, "#ffffff", { rx: 999, ry: 999, opacity: 0.12 }),
        rect("lens2", 808, 224, 70, 70, "#ffffff", { rx: 999, ry: 999, opacity: 0.26 }),
        text("name", "ELIAS VOSS", 92, 116, 520, 56, "#ffffff", { fontWeight: "800" }),
        text("role", "Portrait Photographer", 94, 194, 430, 24, "#a3a3a3"),
        text("email", "book@eliasvoss.photo", 94, 300, 420, 22, "#e5e5e5"),
        text("phone", "+1 (555) 402-9002", 94, 338, 420, 22, "#e5e5e5"),
        text("web", "eliasvoss.photo", 94, 376, 420, 22, "#a3a3a3"),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#050505"),
        rect("frame", 94, 94, 862, 412, "transparent", {
          stroke: "#ffffff",
          strokeWidth: 2,
          rx: 28,
          ry: 28,
        }),
        text("brand", "ELIAS VOSS", 250, 242, 550, 56, "#ffffff", {
          fontWeight: "800",
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c18",
    title: "Event Violet",
    category: "Events",
    industry: "Events",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#2e1065",
      [
        rect("pink", 0, 0, 306, HEIGHT, "#db2777"),
        rect("violet-card", 678, 92, 236, 416, "#ffffff", { rx: 36, ry: 36, opacity: 0.1 }),
        text("name", "LINA FROST", 76, 118, 500, 54, "#ffffff", { fontWeight: "900" }),
        text("role", "Event Producer", 78, 194, 420, 26, "#f9a8d4"),
        text("email", "lina@frostevents.com", 78, 294, 420, 22, "#ddd6fe"),
        text("phone", "+1 (555) 610-8001", 78, 332, 420, 22, "#ddd6fe"),
        text("web", "frostevents.com", 78, 370, 420, 22, "#f9a8d4"),
        text("spark", "✦", 752, 214, 120, 120, "#f9a8d4", { fontSize: 104, textAlign: "center" }),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#db2777"),
        text("brand", "FROST EVENTS", 230, 238, 590, 56, "#ffffff", {
          fontWeight: "900",
          textAlign: "center",
        }),
        text("tag", "Moments people remember", 230, 322, 590, 24, "#fce7f3", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c19",
    title: "Cafe Matcha",
    category: "Restaurant",
    industry: "Restaurant",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#f0fdf4",
      [
        rect("green", 0, 0, 330, HEIGHT, "#166534"),
        text("brand-side", "MATCHA HOUSE", 54, 458, 220, 28, "#dcfce7", { fontWeight: "800" }),
        text("name", "EMI TANAKA", 402, 106, 480, 52, "#14532d", { fontWeight: "800" }),
        text("role", "Cafe Owner", 404, 178, 420, 24, "#16a34a"),
        rect("rule", 404, 232, 150, 4, "#bbf7d0", { rx: 2, ry: 2 }),
        text("email", "hello@matchahouse.co", 404, 292, 420, 22, "#14532d"),
        text("phone", "+1 (555) 712-1010", 404, 330, 420, 22, "#14532d"),
        text("addr", "22 Garden Lane", 404, 368, 420, 22, "#4d7c0f"),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#166534"),
        text("brand", "MATCHA HOUSE", 220, 238, 610, 56, "#dcfce7", {
          fontWeight: "800",
          textAlign: "center",
        }),
        text("tag", "Fresh tea. Quiet mornings.", 220, 322, 610, 24, "#bbf7d0", {
          textAlign: "center",
        }),
      ],
    ),
  },
  {
    id: "c20",
    title: "Startup Pixel",
    category: "IT",
    industry: "IT",
    isPremium: false,
    width: WIDTH,
    height: HEIGHT,
    doc: doc(
      "#111827",
      [
        rect("grid1", 724, 96, 48, 48, "#60a5fa"),
        rect("grid2", 782, 96, 48, 48, "#a78bfa"),
        rect("grid3", 840, 96, 48, 48, "#22d3ee"),
        rect("grid4", 782, 154, 48, 48, "#60a5fa"),
        rect("grid5", 840, 212, 48, 48, "#a78bfa"),
        text("name", "ADAM BYTE", 78, 112, 500, 54, "#ffffff", { fontWeight: "900" }),
        text("role", "Founder / Product Engineer", 80, 188, 460, 24, "#93c5fd"),
        text("email", "adam@pixelstack.dev", 80, 288, 420, 22, "#cbd5e1"),
        text("phone", "+1 (555) 505-2424", 80, 326, 420, 22, "#cbd5e1"),
        text("web", "pixelstack.dev", 80, 364, 420, 22, "#22d3ee"),
        text("company", "PIXELSTACK", 80, 492, 420, 30, "#ffffff", { fontWeight: "900" }),
        ...qr("pixel-qr", 760, 364, 15, "#93c5fd"),
      ],
      [
        rect("back-bg", 0, 0, WIDTH, HEIGHT, "#111827"),
        rect("pixel", 326, 208, 60, 60, "#60a5fa"),
        rect("pixel2", 396, 208, 60, 60, "#a78bfa"),
        rect("pixel3", 466, 208, 60, 60, "#22d3ee"),
        text("brand", "PIXELSTACK", 250, 314, 550, 50, "#ffffff", {
          fontWeight: "900",
          textAlign: "center",
        }),
      ],
    ),
  },
];

export const TEMPLATE_CATEGORIES: string[] = [
  "All",
  ...Array.from(new Set(CARD_TEMPLATES.map((t) => t.category))),
];
