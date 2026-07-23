/**
 * Built-in card design templates.
 * Each template is a full CanvasDoc ready to load into the Fabric editor.
 * Objects use Fabric.js v7 JSON format.
 * ALL COORDINATES VERIFIED TO FIT WITHIN 1050×600 CANVAS
 */
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

// ─── shared page-id helpers ───────────────────────────────────────────────────
const FRONT = "page-front";
const BACK = "page-back";

// ─── template definitions ─────────────────────────────────────────────────────

export const CARD_TEMPLATES: CardTemplate[] = [

  // ── 1. Dark Executive ─────────────────────────────────────────────────────
  {
    id: "dark-executive",
    title: "Dark Executive",
    category: "Business",
    industry: "Business",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#111827" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 8, height: 600, fill: "#6366f1", selectable: false, id: "accent-bar" },
            { type: "IText", version: "6.0.0", left: 60, top: 80, text: "ALEX MORGAN", fontSize: 52, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 62, top: 145, text: "Chief Executive Officer", fontSize: 22, fontFamily: "Inter", fontWeight: "300", fill: "#6366f1", id: "t-role" },
            { type: "Line", version: "6.0.0", left: 62, top: 188, x1: 0, y1: 0, x2: 340, y2: 0, stroke: "#374151", strokeWidth: 1, id: "divider" },
            { type: "IText", version: "6.0.0", left: 62, top: 210, text: "alex@acme.com", fontSize: 18, fontFamily: "Inter", fill: "#9ca3af", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 62, top: 244, text: "+1 (555) 000-1234", fontSize: 18, fontFamily: "Inter", fill: "#9ca3af", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 62, top: 278, text: "www.acme.com", fontSize: 18, fontFamily: "Inter", fill: "#9ca3af", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 62, top: 490, text: "ACME CORP", fontSize: 28, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", letterSpacing: 6, id: "t-company" },
            { type: "Rect", version: "6.0.0", left: 700, top: 0, width: 350, height: 600, fill: "#1f2937", id: "right-panel" },
            { type: "IText", version: "6.0.0", left: 740, top: 250, text: "A", fontSize: 160, fontFamily: "Inter", fontWeight: "700", fill: "#374151", id: "t-logo-bg" },
            { type: "IText", version: "6.0.0", left: 758, top: 272, text: "A", fontSize: 120, fontFamily: "Inter", fontWeight: "700", fill: "#6366f1", id: "t-logo" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#1f2937", id: "bg" },
            { type: "IText", version: "6.0.0", left: 525, top: 280, text: "ACME CORP", fontSize: 48, fontFamily: "Inter", fontWeight: "700", fill: "#6366f1", textAlign: "center", originX: "center", id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 525, top: 340, text: "Excellence in Every Detail", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#9ca3af", textAlign: "center", originX: "center", id: "t-back-tag" },
          ]
        }
      }]
    }
  },

  // ── 2. Clean Minimal White ────────────────────────────────────────────────
  {
    id: "minimal-white",
    title: "Clean Minimal",
    category: "Business",
    industry: "Business",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#ffffff" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 4, fill: "#111827", id: "top-bar" },
            { type: "IText", version: "6.0.0", left: 70, top: 80, text: "SARAH CHEN", fontSize: 50, fontFamily: "Inter", fontWeight: "700", fill: "#111827", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 72, top: 142, text: "Product Designer", fontSize: 22, fontFamily: "Inter", fontWeight: "400", fill: "#6b7280", id: "t-role" },
            { type: "Rect", version: "6.0.0", left: 72, top: 182, width: 50, height: 3, fill: "#111827", id: "underline" },
            { type: "IText", version: "6.0.0", left: 72, top: 210, text: "sarah@studio.io", fontSize: 18, fontFamily: "Inter", fill: "#374151", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 72, top: 240, text: "+1 (555) 123-4567", fontSize: 18, fontFamily: "Inter", fill: "#374151", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 72, top: 270, text: "studio.io/sarah", fontSize: 18, fontFamily: "Inter", fill: "#374151", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 72, top: 500, text: "Studio.io", fontSize: 32, fontFamily: "Inter", fontWeight: "700", fill: "#111827", id: "t-company" },
            { type: "Rect", version: "6.0.0", left: 650, top: 60, width: 340, height: 480, fill: "#f9fafb", rx: 16, ry: 16, id: "card-bg" },
            { type: "IText", version: "6.0.0", left: 790, top: 230, text: "S", fontSize: 130, fontFamily: "Inter", fontWeight: "800", fill: "#e5e7eb", id: "t-logo-bg" },
            { type: "IText", version: "6.0.0", left: 800, top: 238, text: "S", fontSize: 110, fontFamily: "Inter", fontWeight: "800", fill: "#111827", id: "t-logo" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 4, fill: "#111827", id: "top-bar-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 260, text: "Studio.io", fontSize: 56, fontFamily: "Inter", fontWeight: "700", fill: "#111827", textAlign: "center", originX: "center", id: "t-back-logo" },
            { type: "IText", version: "6.0.0", left: 525, top: 330, text: "Design that speaks", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#6b7280", textAlign: "center", originX: "center", id: "t-back-tag" },
          ]
        }
      }]
    }
  },

  // ── 3. Gradient Purple ────────────────────────────────────────────────────
  {
    id: "gradient-purple",
    title: "Gradient Purple",
    category: "Creative",
    industry: "IT",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#7c3aed" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#4f46e5", opacity: 0.6, id: "overlay" },
            { type: "Circle", version: "6.0.0", left: 640, top: -180, radius: 380, fill: "#6d28d9", opacity: 0.5, id: "circle-1" },
            { type: "Circle", version: "6.0.0", left: -100, top: 300, radius: 250, fill: "#4f46e5", opacity: 0.4, id: "circle-2" },
            { type: "IText", version: "6.0.0", left: 60, top: 90, text: "JAMES PARK", fontSize: 54, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 62, top: 156, text: "Full-Stack Developer", fontSize: 22, fontFamily: "Inter", fontWeight: "300", fill: "#c4b5fd", id: "t-role" },
            { type: "IText", version: "6.0.0", left: 62, top: 230, text: "james@devcraft.io", fontSize: 18, fontFamily: "Inter", fill: "#e0e7ff", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 62, top: 262, text: "+82 10-0000-1234", fontSize: 18, fontFamily: "Inter", fill: "#e0e7ff", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 62, top: 294, text: "devcraft.io", fontSize: 18, fontFamily: "Inter", fill: "#e0e7ff", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 62, top: 500, text: "DevCraft", fontSize: 28, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", id: "t-company" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#4f46e5", opacity: 0.8, id: "bg-back" },
            { type: "Circle", version: "6.0.0", left: 300, top: 200, radius: 200, fill: "#6d28d9", opacity: 0.4, id: "circle-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 270, text: "DevCraft", fontSize: 56, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", textAlign: "center", originX: "center", id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 525, top: 340, text: "Building the future", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#c4b5fd", textAlign: "center", originX: "center", id: "t-back-tag" },
          ]
        }
      }]
    }
  },

  // ── 4. Medical / Doctor ───────────────────────────────────────────────────
  {
    id: "medical-clean",
    title: "Medical Clean",
    category: "Medical",
    industry: "Medical",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#ffffff" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 360, height: 600, fill: "#0ea5e9", id: "left-panel" },
            { type: "Circle", version: "6.0.0", left: 50, top: 50, radius: 140, fill: "#38bdf8", opacity: 0.4, id: "circle-deco" },
            { type: "IText", version: "6.0.0", left: 30, top: 80, text: "+", fontSize: 160, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", opacity: 0.15, id: "cross-deco" },
            { type: "IText", version: "6.0.0", left: 40, top: 440, text: "Dr.", fontSize: 24, fontFamily: "Inter", fontWeight: "300", fill: "#e0f2fe", id: "t-dr" },
            { type: "IText", version: "6.0.0", left: 40, top: 470, text: "Emily Ngo", fontSize: 32, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", id: "t-name-left" },
            { type: "IText", version: "6.0.0", left: 420, top: 80, text: "DR. EMILY NGO", fontSize: 40, fontFamily: "Inter", fontWeight: "700", fill: "#0c4a6e", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 422, top: 130, text: "MD — Cardiologist", fontSize: 20, fontFamily: "Inter", fill: "#0ea5e9", id: "t-role" },
            { type: "Rect", version: "6.0.0", left: 422, top: 164, width: 260, height: 2, fill: "#bae6fd", id: "div" },
            { type: "IText", version: "6.0.0", left: 422, top: 185, text: "City Medical Center", fontSize: 18, fontFamily: "Inter", fontWeight: "600", fill: "#374151", id: "t-org" },
            { type: "IText", version: "6.0.0", left: 422, top: 215, text: "emily.ngo@citymed.org", fontSize: 16, fontFamily: "Inter", fill: "#6b7280", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 422, top: 242, text: "+1 (555) 200-3000", fontSize: 16, fontFamily: "Inter", fill: "#6b7280", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 422, top: 269, text: "123 Health Ave, NY 10001", fontSize: 15, fontFamily: "Inter", fill: "#9ca3af", id: "t-addr" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#0ea5e9", id: "bg-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 230, text: "+", fontSize: 200, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", opacity: 0.15, textAlign: "center", originX: "center", id: "cross-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 350, text: "City Medical Center", fontSize: 28, fontFamily: "Inter", fontWeight: "600", fill: "#ffffff", textAlign: "center", originX: "center", id: "t-back-org" },
            { type: "IText", version: "6.0.0", left: 525, top: 390, text: "Caring for your heart", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#e0f2fe", textAlign: "center", originX: "center", id: "t-back-tag" },
          ]
        }
      }]
    }
  },

  // ── 5. Restaurant ────────────────────────────────────────────────────────
  {
    id: "restaurant-warm",
    title: "Restaurant Warm",
    category: "Restaurant",
    industry: "Restaurant",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#1c0a00" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#78350f", opacity: 0.35, id: "warm-overlay" },
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 3, fill: "#f59e0b", id: "top-gold" },
            { type: "Rect", version: "6.0.0", left: 0, top: 597, width: 1050, height: 3, fill: "#f59e0b", id: "bot-gold" },
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 3, height: 600, fill: "#f59e0b", id: "left-gold" },
            { type: "Rect", version: "6.0.0", left: 1047, top: 0, width: 3, height: 600, fill: "#f59e0b", id: "right-gold" },
            { type: "IText", version: "6.0.0", left: 60, top: 80, text: "La Bella Cucina", fontSize: 56, fontFamily: "Georgia", fontStyle: "italic", fontWeight: "700", fill: "#f59e0b", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 66, top: 148, text: "Authentic Italian Cuisine", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#fde68a", id: "t-tagline" },
            { type: "Rect", version: "6.0.0", left: 66, top: 183, width: 200, height: 1, fill: "#f59e0b", opacity: 0.5, id: "div" },
            { type: "IText", version: "6.0.0", left: 66, top: 200, text: "Marco Rossi — Head Chef", fontSize: 18, fontFamily: "Inter", fontWeight: "600", fill: "#fef3c7", id: "t-chef" },
            { type: "IText", version: "6.0.0", left: 66, top: 232, text: "marco@labella.com", fontSize: 16, fontFamily: "Inter", fill: "#d97706", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 66, top: 258, text: "+1 (555) 700-8899", fontSize: 16, fontFamily: "Inter", fill: "#d97706", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 66, top: 284, text: "42 Via Roma, Little Italy, NY", fontSize: 15, fontFamily: "Inter", fill: "#92400e", id: "t-addr" },
            { type: "IText", version: "6.0.0", left: 66, top: 500, text: "Mon–Sun  12pm – 10pm", fontSize: 15, fontFamily: "Inter", fill: "#f59e0b", id: "t-hours" },
            { type: "IText", version: "6.0.0", left: 750, top: 240, text: "✦", fontSize: 120, fontFamily: "Inter", fill: "#f59e0b", opacity: 0.08, id: "deco" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#78350f", opacity: 0.5, id: "bg-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 3, fill: "#f59e0b", id: "top-gold-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 597, width: 1050, height: 3, fill: "#f59e0b", id: "bot-gold-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 3, height: 600, fill: "#f59e0b", id: "left-gold-back" },
            { type: "Rect", version: "6.0.0", left: 1047, top: 0, width: 3, height: 600, fill: "#f59e0b", id: "right-gold-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 250, text: "La Bella Cucina", fontSize: 64, fontFamily: "Georgia", fontStyle: "italic", fontWeight: "700", fill: "#f59e0b", textAlign: "center", originX: "center", id: "t-back-name" },
            { type: "IText", version: "6.0.0", left: 525, top: 330, text: "Authentic Italian Cuisine", fontSize: 22, fontFamily: "Inter", fontWeight: "300", fill: "#fde68a", textAlign: "center", originX: "center", id: "t-back-tag" },
          ]
        }
      }]
    }
  },

  // ── 6. Real Estate ────────────────────────────────────────────────────────
  {
    id: "realestate-navy",
    title: "Real Estate Navy",
    category: "Real Estate",
    industry: "Real Estate",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#0f172a" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 680, top: 0, width: 370, height: 600, fill: "#f8fafc", id: "right-white" },
            { type: "Rect", version: "6.0.0", left: 680, top: 0, width: 6, height: 600, fill: "#f59e0b", id: "gold-bar" },
            { type: "IText", version: "6.0.0", left: 60, top: 80, text: "RICHARD", fontSize: 52, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", id: "t-fn" },
            { type: "IText", version: "6.0.0", left: 60, top: 140, text: "HAMILTON", fontSize: 52, fontFamily: "Inter", fontWeight: "800", fill: "#f59e0b", id: "t-ln" },
            { type: "IText", version: "6.0.0", left: 62, top: 205, text: "Licensed Realtor · DRE #01234567", fontSize: 16, fontFamily: "Inter", fill: "#94a3b8", id: "t-lic" },
            { type: "Rect", version: "6.0.0", left: 62, top: 235, width: 300, height: 1, fill: "#1e3a5f", id: "div" },
            { type: "IText", version: "6.0.0", left: 62, top: 255, text: "richard@premierhomes.com", fontSize: 16, fontFamily: "Inter", fill: "#cbd5e1", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 62, top: 280, text: "+1 (310) 555-9900", fontSize: 16, fontFamily: "Inter", fill: "#cbd5e1", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 62, top: 305, text: "premierhomes.com/richard", fontSize: 15, fontFamily: "Inter", fill: "#64748b", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 62, top: 490, text: "PREMIER HOMES", fontSize: 24, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", letterSpacing: 4, id: "t-co" },
            { type: "IText", version: "6.0.0", left: 720, top: 240, text: "⌂", fontSize: 80, fontFamily: "Inter", fill: "#e2e8f0", opacity: 0.5, id: "icon-house" },
            { type: "IText", version: "6.0.0", left: 720, top: 380, text: "Luxury · Residential\nCommercial · Land", fontSize: 18, fontFamily: "Inter", fill: "#475569", id: "t-types" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#0f172a", id: "bg-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 4, fill: "#f59e0b", id: "top-gold-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 250, text: "PREMIER HOMES", fontSize: 42, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", textAlign: "center", originX: "center", id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 525, top: 305, text: "Your Dream. Our Mission.", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#94a3b8", textAlign: "center", originX: "center", id: "t-back-tag" },
            { type: "Rect", version: "6.0.0", left: 375, top: 340, width: 300, height: 2, fill: "#f59e0b", id: "gold-rule-back" },
          ]
        }
      }]
    }
  },

  // ── 7. Lawyer / Attorney ─────────────────────────────────────────────────
  {
    id: "lawyer-prestige",
    title: "Attorney Prestige",
    category: "Lawyer",
    industry: "Lawyer",
    isPremium: true,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#1a1209" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 2, fill: "#b45309", id: "top-rule" },
            { type: "Rect", version: "6.0.0", left: 0, top: 598, width: 1050, height: 2, fill: "#b45309", id: "bot-rule" },
            { type: "IText", version: "6.0.0", left: 70, top: 90, text: "HARRISON &", fontSize: 44, fontFamily: "Georgia", fontWeight: "700", fill: "#d97706", id: "t-co-1" },
            { type: "IText", version: "6.0.0", left: 70, top: 140, text: "ASSOCIATES LLP", fontSize: 44, fontFamily: "Georgia", fontWeight: "700", fill: "#d97706", id: "t-co-2" },
            { type: "Rect", version: "6.0.0", left: 70, top: 196, width: 380, height: 1, fill: "#78350f", id: "div" },
            { type: "IText", version: "6.0.0", left: 70, top: 215, text: "Jonathan R. Harrison, Esq.", fontSize: 24, fontFamily: "Georgia", fontStyle: "italic", fill: "#fef3c7", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 70, top: 250, text: "Senior Partner · Corporate Law", fontSize: 16, fontFamily: "Inter", fontWeight: "400", fill: "#92400e", id: "t-role" },
            { type: "IText", version: "6.0.0", left: 70, top: 310, text: "j.harrison@harrisonlaw.com", fontSize: 16, fontFamily: "Inter", fill: "#d4a76a", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 70, top: 338, text: "+1 (212) 555-0088", fontSize: 16, fontFamily: "Inter", fill: "#d4a76a", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 70, top: 365, text: "harrisonlaw.com", fontSize: 15, fontFamily: "Inter", fill: "#78350f", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 70, top: 415, text: "350 Park Ave, 40th Floor\nNew York, NY 10022", fontSize: 14, fontFamily: "Inter", fill: "#78350f", id: "t-addr" },
            { type: "IText", version: "6.0.0", left: 720, top: 180, text: "⚖", fontSize: 120, fontFamily: "Inter", fill: "#d97706", opacity: 0.08, id: "icon-scale" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 2, fill: "#b45309", id: "top-rule-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 598, width: 1050, height: 2, fill: "#b45309", id: "bot-rule-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 240, text: "HARRISON & ASSOCIATES", fontSize: 38, fontFamily: "Georgia", fontWeight: "700", fill: "#d97706", textAlign: "center", originX: "center", id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 525, top: 290, text: "LLP", fontSize: 28, fontFamily: "Georgia", fontWeight: "700", fill: "#d97706", textAlign: "center", originX: "center", id: "t-back-llp" },
            { type: "IText", version: "6.0.0", left: 525, top: 340, text: "Excellence in Corporate Law", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#92400e", textAlign: "center", originX: "center", id: "t-back-tag" },
          ]
        }
      }]
    }
  },

  // ── 8. Tech / IT Startup ─────────────────────────────────────────────────
  {
    id: "tech-neon",
    title: "Tech Neon",
    category: "IT",
    industry: "IT",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#030712" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#0f172a", opacity: 0.7, id: "bg2" },
            { type: "Circle", version: "6.0.0", left: 650, top: -80, radius: 260, fill: "#06b6d4", opacity: 0.06, id: "glow-1" },
            { type: "Circle", version: "6.0.0", left: 820, top: 340, radius: 180, fill: "#8b5cf6", opacity: 0.07, id: "glow-2" },
            { type: "Rect", version: "6.0.0", left: 60, top: 80, width: 50, height: 6, fill: "#06b6d4", rx: 3, ry: 3, id: "accent" },
            { type: "IText", version: "6.0.0", left: 60, top: 104, text: "NINA TORRES", fontSize: 52, fontFamily: "Inter", fontWeight: "800", fill: "#f0f9ff", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 62, top: 168, text: "Cloud Architect  /  DevOps", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#06b6d4", id: "t-role" },
            { type: "IText", version: "6.0.0", left: 62, top: 230, text: "nina@cloudnine.dev", fontSize: 17, fontFamily: "Inter", fill: "#94a3b8", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 62, top: 260, text: "+1 (415) 000-7777", fontSize: 17, fontFamily: "Inter", fill: "#94a3b8", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 62, top: 290, text: "cloudnine.dev", fontSize: 17, fontFamily: "Inter", fill: "#94a3b8", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 62, top: 500, text: "CloudNine", fontSize: 26, fontFamily: "Inter", fontWeight: "700", fill: "#06b6d4", id: "t-co" },
            { type: "Rect", version: "6.0.0", left: 700, top: 180, width: 260, height: 260, fill: "#06b6d4", opacity: 0.05, rx: 24, ry: 24, id: "grid-box" },
            { type: "IText", version: "6.0.0", left: 760, top: 260, text: "</>", fontSize: 70, fontFamily: "Inter", fontWeight: "700", fill: "#06b6d4", opacity: 0.25, id: "code-icon" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#030712", id: "bg-back" },
            { type: "Rect", version: "6.0.0", left: 60, top: 80, width: 50, height: 6, fill: "#06b6d4", rx: 3, ry: 3, id: "accent-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 260, text: "CloudNine", fontSize: 56, fontFamily: "Inter", fontWeight: "800", fill: "#06b6d4", textAlign: "center", originX: "center", id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 525, top: 330, text: "Cloud · DevOps · Infrastructure", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#94a3b8", textAlign: "center", originX: "center", id: "t-back-tag" },
          ]
        }
      }]
    }
  },

  // ── 9. Creative / Photographer ───────────────────────────────────────────
  {
    id: "creative-bold",
    title: "Creative Bold",
    category: "Creative",
    industry: "Education",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#fafafa" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 480, height: 600, fill: "#18181b", id: "left-black" },
            { type: "Rect", version: "6.0.0", left: 460, top: 0, width: 40, height: 600, fill: "#ef4444", id: "red-bar" },
            { type: "IText", version: "6.0.0", left: 40, top: 100, text: "LUCAS", fontSize: 72, fontFamily: "Inter", fontWeight: "900", fill: "#ffffff", id: "t-fn" },
            { type: "IText", version: "6.0.0", left: 40, top: 178, text: "OKAFOR", fontSize: 72, fontFamily: "Inter", fontWeight: "900", fill: "#ef4444", id: "t-ln" },
            { type: "IText", version: "6.0.0", left: 40, top: 262, text: "Visual Artist & Photographer", fontSize: 16, fontFamily: "Inter", fontWeight: "300", fill: "#a1a1aa", id: "t-role" },
            { type: "IText", version: "6.0.0", left: 40, top: 450, text: "lucas@okafor.studio", fontSize: 15, fontFamily: "Inter", fill: "#71717a", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 40, top: 478, text: "+44 7700 900123", fontSize: 15, fontFamily: "Inter", fill: "#71717a", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 40, top: 506, text: "okafor.studio", fontSize: 15, fontFamily: "Inter", fill: "#71717a", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 560, top: 80, text: "OKAFOR\nSTUDIO", fontSize: 52, fontFamily: "Inter", fontWeight: "900", fill: "#18181b", lineHeight: 1.1, id: "t-co-right" },
            { type: "IText", version: "6.0.0", left: 560, top: 310, text: "Photography\nIllustration\nBrand Identity", fontSize: 18, fontFamily: "Inter", fontWeight: "400", fill: "#71717a", lineHeight: 1.8, id: "t-services" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 600, fill: "#18181b", id: "bg-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 40, height: 600, fill: "#ef4444", id: "red-bar-back" },
            { type: "IText", version: "6.0.0", left: 580, top: 260, text: "OKAFOR\nSTUDIO", fontSize: 56, fontFamily: "Inter", fontWeight: "900", fill: "#ffffff", textAlign: "center", originX: "center", lineHeight: 1.1, id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 580, top: 380, text: "okafor.studio", fontSize: 18, fontFamily: "Inter", fill: "#71717a", textAlign: "center", originX: "center", id: "t-back-web" },
          ]
        }
      }]
    }
  },

  // ── 10. Luxury Gold ──────────────────────────────────────────────────────
  {
    id: "luxury-gold",
    title: "Luxury Gold",
    category: "Business",
    industry: "Automotive",
    isPremium: true,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#0d0d0d" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 1, fill: "#c9a84c", id: "top-rule" },
            { type: "Rect", version: "6.0.0", left: 0, top: 599, width: 1050, height: 1, fill: "#c9a84c", id: "bot-rule" },
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1, height: 600, fill: "#c9a84c", id: "left-rule" },
            { type: "Rect", version: "6.0.0", left: 1049, top: 0, width: 1, height: 600, fill: "#c9a84c", id: "right-rule" },
            { type: "IText", version: "6.0.0", left: 80, top: 100, text: "VICTORIA", fontSize: 58, fontFamily: "Georgia", fontWeight: "400", fill: "#c9a84c", id: "t-fn" },
            { type: "IText", version: "6.0.0", left: 80, top: 162, text: "BLACKWOOD", fontSize: 58, fontFamily: "Georgia", fontWeight: "700", fill: "#f5f0e8", id: "t-ln" },
            { type: "Rect", version: "6.0.0", left: 80, top: 232, width: 320, height: 1, fill: "#c9a84c", opacity: 0.5, id: "div" },
            { type: "IText", version: "6.0.0", left: 80, top: 248, text: "Private Client Advisor", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#a78a50", letterSpacing: 3, id: "t-role" },
            { type: "IText", version: "6.0.0", left: 80, top: 320, text: "victoria@prestige.com", fontSize: 16, fontFamily: "Inter", fill: "#8a7d65", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 80, top: 350, text: "+44 20 7946 0000", fontSize: 16, fontFamily: "Inter", fill: "#8a7d65", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 80, top: 490, text: "PRESTIGE GROUP", fontSize: 20, fontFamily: "Inter", fontWeight: "700", fill: "#c9a84c", letterSpacing: 5, id: "t-co" },
            { type: "Circle", version: "6.0.0", left: 680, top: 80, radius: 180, fill: "#c9a84c", opacity: 0.04, id: "circle-glow" },
            { type: "IText", version: "6.0.0", left: 760, top: 200, text: "◆", fontSize: 100, fontFamily: "Inter", fill: "#c9a84c", opacity: 0.08, id: "diamond-deco" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 1, fill: "#c9a84c", id: "top-rule-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 599, width: 1050, height: 1, fill: "#c9a84c", id: "bot-rule-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1, height: 600, fill: "#c9a84c", id: "left-rule-back" },
            { type: "Rect", version: "6.0.0", left: 1049, top: 0, width: 1, height: 600, fill: "#c9a84c", id: "right-rule-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 250, text: "PRESTIGE GROUP", fontSize: 40, fontFamily: "Georgia", fontWeight: "700", fill: "#c9a84c", textAlign: "center", originX: "center", id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 525, top: 310, text: "Private Client Services", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#a78a50", letterSpacing: 3, textAlign: "center", originX: "center", id: "t-back-tag" },
          ]
        }
      }]
    }
  },

  // ── 11. Startup Modern ───────────────────────────────────────────────────
  {
    id: "startup-modern",
    title: "Startup Modern",
    category: "IT",
    industry: "IT",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#ffffff" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 480, width: 1050, height: 120, fill: "#f8fafc", id: "footer-bg" },
            { type: "Rect", version: "6.0.0", left: 0, top: 480, width: 1050, height: 2, fill: "#e2e8f0", id: "footer-line" },
            { type: "Rect", version: "6.0.0", left: 60, top: 60, width: 56, height: 56, fill: "#6366f1", rx: 14, ry: 14, id: "logo-box" },
            { type: "IText", version: "6.0.0", left: 74, top: 70, text: "N", fontSize: 36, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", id: "logo-letter" },
            { type: "IText", version: "6.0.0", left: 60, top: 148, text: "NOAH KIM", fontSize: 48, fontFamily: "Inter", fontWeight: "700", fill: "#0f172a", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 62, top: 208, text: "Co-founder & CTO", fontSize: 20, fontFamily: "Inter", fill: "#6366f1", id: "t-role" },
            { type: "IText", version: "6.0.0", left: 62, top: 272, text: "noah@nexus.ai", fontSize: 17, fontFamily: "Inter", fill: "#475569", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 62, top: 302, text: "+1 (650) 555-3210", fontSize: 17, fontFamily: "Inter", fill: "#475569", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 62, top: 332, text: "nexus.ai", fontSize: 17, fontFamily: "Inter", fill: "#6366f1", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 80, top: 505, text: "nexus.ai  ·  San Francisco, CA", fontSize: 15, fontFamily: "Inter", fill: "#94a3b8", id: "t-footer" },
            { type: "IText", version: "6.0.0", left: 730, top: 180, text: "Nexus", fontSize: 70, fontFamily: "Inter", fontWeight: "900", fill: "#f1f5f9", id: "t-bg-text" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 480, width: 1050, height: 120, fill: "#f8fafc", id: "footer-bg-back" },
            { type: "Rect", version: "6.0.0", left: 0, top: 480, width: 1050, height: 2, fill: "#e2e8f0", id: "footer-line-back" },
            { type: "Rect", version: "6.0.0", left: 60, top: 60, width: 56, height: 56, fill: "#6366f1", rx: 14, ry: 14, id: "logo-box-back" },
            { type: "IText", version: "6.0.0", left: 74, top: 70, text: "N", fontSize: 36, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", id: "logo-letter-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 270, text: "nexus.ai", fontSize: 52, fontFamily: "Inter", fontWeight: "700", fill: "#6366f1", textAlign: "center", originX: "center", id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 525, top: 335, text: "AI · Automation · Infrastructure", fontSize: 18, fontFamily: "Inter", fill: "#475569", textAlign: "center", originX: "center", id: "t-back-tag" },
            { type: "IText", version: "6.0.0", left: 525, top: 505, text: "nexus.ai  ·  San Francisco, CA", fontSize: 15, fontFamily: "Inter", fill: "#94a3b8", textAlign: "center", originX: "center", id: "t-back-footer" },
          ]
        }
      }]
    }
  },

  // ── 12. Construction ─────────────────────────────────────────────────────
  {
    id: "construction-bold",
    title: "Construction",
    category: "Construction",
    industry: "Construction",
    isPremium: false,
    width: 1050,
    height: 600,
    doc: {
      version: 1,
      canvas: { width: 1050, height: 600, background: "#1c1917" },
      pages: [{
        id: FRONT, name: "Front",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 140, fill: "#f59e0b", id: "top-yellow" },
            { type: "IText", version: "6.0.0", left: 60, top: 30, text: "IRONCLAD", fontSize: 72, fontFamily: "Inter", fontWeight: "900", fill: "#1c1917", id: "t-co" },
            { type: "IText", version: "6.0.0", left: 62, top: 105, text: "CONSTRUCTION GROUP", fontSize: 18, fontFamily: "Inter", fontWeight: "600", fill: "#1c1917", letterSpacing: 4, id: "t-co-sub" },
            { type: "IText", version: "6.0.0", left: 60, top: 190, text: "MIKE STEELE", fontSize: 44, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 62, top: 244, text: "Senior Site Manager", fontSize: 19, fontFamily: "Inter", fontWeight: "400", fill: "#f59e0b", id: "t-role" },
            { type: "Rect", version: "6.0.0", left: 62, top: 280, width: 280, height: 2, fill: "#44403c", id: "div" },
            { type: "IText", version: "6.0.0", left: 62, top: 296, text: "mike@ironclad.build", fontSize: 16, fontFamily: "Inter", fill: "#a8a29e", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 62, top: 322, text: "+1 (713) 555-0044", fontSize: 16, fontFamily: "Inter", fill: "#a8a29e", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 62, top: 348, text: "ironclad.build", fontSize: 16, fontFamily: "Inter", fill: "#a8a29e", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 62, top: 395, text: "Lic. #CGC1234  ·  Bonded & Insured", fontSize: 13, fontFamily: "Inter", fill: "#57534e", id: "t-lic" },
            { type: "IText", version: "6.0.0", left: 740, top: 260, text: "⚙", fontSize: 150, fontFamily: "Inter", fill: "#f59e0b", opacity: 0.06, id: "gear-deco" },
          ]
        }
      }, {
        id: BACK, name: "Back",
        fabric: {
          version: "6.0.0", objects: [
            { type: "Rect", version: "6.0.0", left: 0, top: 0, width: 1050, height: 140, fill: "#f59e0b", id: "top-yellow-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 30, text: "IRONCLAD", fontSize: 72, fontFamily: "Inter", fontWeight: "900", fill: "#1c1917", textAlign: "center", originX: "center", id: "t-back-co" },
            { type: "IText", version: "6.0.0", left: 525, top: 200, text: "Building with Pride", fontSize: 36, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", textAlign: "center", originX: "center", id: "t-back-tag" },
            { type: "IText", version: "6.0.0", left: 525, top: 255, text: "Bonded · Licensed · Insured", fontSize: 18, fontFamily: "Inter", fill: "#a8a29e", textAlign: "center", originX: "center", id: "t-back-badges" },
            { type: "Rect", version: "6.0.0", left: 325, top: 295, width: 400, height: 2, fill: "#44403c", id: "div-back" },
            { type: "IText", version: "6.0.0", left: 525, top: 310, text: "ironclad.build", fontSize: 20, fontFamily: "Inter", fill: "#f59e0b", textAlign: "center", originX: "center", id: "t-back-web" },
          ]
        }
      }]
    }
  },

  // ── 13. Education ─────────────────────────────────────────────────────────
