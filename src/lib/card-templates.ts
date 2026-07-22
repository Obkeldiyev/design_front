/**
 * Built-in card design templates.
 * Each template is a full CanvasDoc ready to load into the Fabric editor.
 * Objects use Fabric.js v7 JSON format.
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
            { type: "Circle", version: "6.0.0", left: 700, top: -180, radius: 380, fill: "#6d28d9", opacity: 0.5, id: "circle-1" },
            { type: "Circle", version: "6.0.0", left: -100, top: 300, radius: 250, fill: "#4f46e5", opacity: 0.4, id: "circle-2" },
            { type: "IText", version: "6.0.0", left: 60, top: 90, text: "JAMES PARK", fontSize: 54, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 62, top: 156, text: "Full-Stack Developer", fontSize: 22, fontFamily: "Inter", fontWeight: "300", fill: "#c4b5fd", id: "t-role" },
            { type: "IText", version: "6.0.0", left: 62, top: 230, text: "james@devcraft.io", fontSize: 18, fontFamily: "Inter", fill: "#e0e7ff", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 62, top: 262, text: "+82 10-0000-1234", fontSize: 18, fontFamily: "Inter", fill: "#e0e7ff", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 62, top: 294, text: "devcraft.io", fontSize: 18, fontFamily: "Inter", fill: "#e0e7ff", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 62, top: 500, text: "DevCraft", fontSize: 28, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", id: "t-company" },
            { type: "Rect", version: "6.0.0", left: 62, top: 492, width: 28, height: 28, fill: "#ffffff", rx: 6, ry: 6, opacity: 0, id: "spacer" },
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
            { type: "IText", version: "6.0.0", left: 620, top: 160, text: "✦", fontSize: 200, fontFamily: "Inter", fill: "#f59e0b", opacity: 0.08, id: "deco" },
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
            { type: "IText", version: "6.0.0", left: 720, top: 120, text: "⌂", fontSize: 130, fontFamily: "Inter", fill: "#e2e8f0", opacity: 0.5, id: "icon-house" },
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
            { type: "IText", version: "6.0.0", left: 680, top: 120, text: "⚖", fontSize: 200, fontFamily: "Inter", fill: "#d97706", opacity: 0.07, id: "icon-scale" },
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
            { type: "Circle", version: "6.0.0", left: 600, top: -100, radius: 300, fill: "#06b6d4", opacity: 0.06, id: "glow-1" },
            { type: "Circle", version: "6.0.0", left: 800, top: 300, radius: 200, fill: "#8b5cf6", opacity: 0.07, id: "glow-2" },
            { type: "Rect", version: "6.0.0", left: 60, top: 80, width: 50, height: 6, fill: "#06b6d4", rx: 3, ry: 3, id: "accent" },
            { type: "IText", version: "6.0.0", left: 60, top: 104, text: "NINA TORRES", fontSize: 52, fontFamily: "Inter", fontWeight: "800", fill: "#f0f9ff", id: "t-name" },
            { type: "IText", version: "6.0.0", left: 62, top: 168, text: "Cloud Architect  /  DevOps", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#06b6d4", id: "t-role" },
            { type: "IText", version: "6.0.0", left: 62, top: 230, text: "nina@cloudnine.dev", fontSize: 17, fontFamily: "Inter", fill: "#94a3b8", id: "t-email" },
            { type: "IText", version: "6.0.0", left: 62, top: 260, text: "+1 (415) 000-7777", fontSize: 17, fontFamily: "Inter", fill: "#94a3b8", id: "t-phone" },
            { type: "IText", version: "6.0.0", left: 62, top: 290, text: "cloudnine.dev", fontSize: 17, fontFamily: "Inter", fill: "#94a3b8", id: "t-web" },
            { type: "IText", version: "6.0.0", left: 62, top: 500, text: "CloudNine", fontSize: 26, fontFamily: "Inter", fontWeight: "700", fill: "#06b6d4", id: "t-co" },
            { type: "Rect", version: "6.0.0", left: 700, top: 180, width: 260, height: 260, fill: "#06b6d4", opacity: 0.05, rx: 24, ry: 24, id: "grid-box" },
            { type: "IText", version: "6.0.0", left: 730, top: 220, text: "</>", fontSize: 80, fontFamily: "Inter", fontWeight: "700", fill: "#06b6d4", opacity: 0.25, id: "code-icon" },
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
            { type: "Circle", version: "6.0.0", left: 650, top: 50, radius: 220, fill: "#c9a84c", opacity: 0.04, id: "circle-glow" },
            { type: "IText", version: "6.0.0", left: 700, top: 160, text: "◆", fontSize: 150, fontFamily: "Inter", fill: "#c9a84c", opacity: 0.08, id: "diamond-deco" },
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
            { type: "IText", version: "6.0.0", left: 750, top: 120, text: "Nexus\nAI", fontSize: 88, fontFamily: "Inter", fontWeight: "900", fill: "#f1f5f9", id: "t-bg-text" },
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
            { type: "IText", version: "6.0.0", left: 640, top: 180, text: "⚙", fontSize: 280, fontFamily: "Inter", fill: "#f59e0b", opacity: 0.06, id: "gear-deco" },
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
  { id: "education-blue", title: "Education Blue", category: "Education", industry: "Education", isPremium: false, width: 1050, height: 600,
    doc: { version: 1, canvas: { width: 1050, height: 600, background: "#1e3a5f" }, pages: [
      { id: FRONT, name: "Front", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 6, fill: "#3b82f6", id: "top" },
        { type: "IText", left: 60, top: 80, text: "PROF. ANNA WELLS", fontSize: 44, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", id: "t-name" },
        { type: "IText", left: 62, top: 136, text: "PhD — Mathematics & CS", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#93c5fd", id: "t-role" },
        { type: "Rect", left: 62, top: 170, width: 280, height: 2, fill: "#3b82f6", id: "div" },
        { type: "IText", left: 62, top: 190, text: "Westfield University", fontSize: 20, fontFamily: "Inter", fontWeight: "600", fill: "#bfdbfe", id: "t-uni" },
        { type: "IText", left: 62, top: 225, text: "a.wells@westfield.edu", fontSize: 16, fontFamily: "Inter", fill: "#93c5fd", id: "t-email" },
        { type: "IText", left: 62, top: 252, text: "+1 (617) 555-0032", fontSize: 16, fontFamily: "Inter", fill: "#93c5fd", id: "t-phone" },
        { type: "IText", left: 62, top: 279, text: "westfield.edu/annawells", fontSize: 15, fontFamily: "Inter", fill: "#60a5fa", id: "t-web" },
      ] } },
      { id: BACK, name: "Back", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#1e3a5f", id: "bg" },
        { type: "Rect", left: 0, top: 0, width: 1050, height: 6, fill: "#3b82f6", id: "top-b" },
        { type: "IText", left: 525, top: 270, text: "Westfield University", fontSize: 40, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", textAlign: "center", originX: "center", id: "t-co" },
        { type: "IText", left: 525, top: 325, text: "Inspiring Minds Since 1892", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#93c5fd", textAlign: "center", originX: "center", id: "t-tag" },
      ] } }
    ]}
  },

  // ── 14. Finance ───────────────────────────────────────────────────────────
  { id: "finance-slate", title: "Finance Slate", category: "Finance", industry: "Finance", isPremium: false, width: 1050, height: 600,
    doc: { version: 1, canvas: { width: 1050, height: 600, background: "#0f172a" }, pages: [
      { id: FRONT, name: "Front", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 320, height: 600, fill: "#1e293b", id: "lp" },
        { type: "Rect", left: 318, top: 0, width: 4, height: 600, fill: "#22d3ee", id: "al" },
        { type: "IText", left: 40, top: 100, text: "WM", fontSize: 72, fontFamily: "Inter", fontWeight: "900", fill: "#22d3ee", id: "init" },
        { type: "IText", left: 40, top: 185, text: "Wealth\nManagement", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#94a3b8", lineHeight: 1.4, id: "dept" },
        { type: "IText", left: 360, top: 80, text: "WILLIAM CARTER", fontSize: 42, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", id: "t-name" },
        { type: "IText", left: 362, top: 134, text: "Senior Financial Advisor", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#22d3ee", id: "t-role" },
        { type: "IText", left: 362, top: 185, text: "w.carter@apexwealth.com", fontSize: 16, fontFamily: "Inter", fill: "#94a3b8", id: "t-email" },
        { type: "IText", left: 362, top: 212, text: "+1 (212) 555-7788", fontSize: 16, fontFamily: "Inter", fill: "#94a3b8", id: "t-phone" },
        { type: "IText", left: 362, top: 239, text: "apexwealth.com", fontSize: 15, fontFamily: "Inter", fill: "#22d3ee", id: "t-web" },
        { type: "IText", left: 362, top: 490, text: "APEX WEALTH GROUP", fontSize: 20, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", letterSpacing: 3, id: "t-co" },
      ] } },
      { id: BACK, name: "Back", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#0f172a", id: "bg" },
        { type: "IText", left: 525, top: 270, text: "APEX WEALTH GROUP", fontSize: 36, fontFamily: "Inter", fontWeight: "700", fill: "#ffffff", textAlign: "center", originX: "center", id: "t-co" },
        { type: "IText", left: 525, top: 322, text: "Your Future. Our Expertise.", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#94a3b8", textAlign: "center", originX: "center", id: "t-tag" },
      ] } }
    ]}
  },

  // ── 15. Freelancer ────────────────────────────────────────────────────────
  { id: "freelancer-coral", title: "Freelancer Coral", category: "Creative", industry: "IT", isPremium: false, width: 1050, height: 600,
    doc: { version: 1, canvas: { width: 1050, height: 600, background: "#fff7f5" }, pages: [
      { id: FRONT, name: "Front", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 8, fill: "#f97316", id: "top" },
        { type: "IText", left: 60, top: 70, text: "ZOE", fontSize: 88, fontFamily: "Inter", fontWeight: "900", fill: "#f97316", id: "t-fn" },
        { type: "IText", left: 62, top: 162, text: "LAMBERT", fontSize: 56, fontFamily: "Inter", fontWeight: "900", fill: "#1c1917", id: "t-ln" },
        { type: "IText", left: 64, top: 232, text: "Freelance UX Designer & Brand Consultant", fontSize: 15, fontFamily: "Inter", fill: "#78716c", id: "t-role" },
        { type: "Rect", left: 64, top: 260, width: 40, height: 4, fill: "#f97316", rx: 2, ry: 2, id: "acc" },
        { type: "IText", left: 64, top: 285, text: "zoe@zoecreates.co", fontSize: 15, fontFamily: "Inter", fill: "#57534e", id: "t-email" },
        { type: "IText", left: 64, top: 310, text: "+33 6 00 00 00 00", fontSize: 15, fontFamily: "Inter", fill: "#57534e", id: "t-phone" },
        { type: "IText", left: 64, top: 335, text: "zoecreates.co", fontSize: 15, fontFamily: "Inter", fill: "#f97316", id: "t-web" },
      ] } },
      { id: BACK, name: "Back", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#fff7f5", id: "bg" },
        { type: "Rect", left: 0, top: 0, width: 1050, height: 8, fill: "#f97316", id: "top-b" },
        { type: "IText", left: 525, top: 265, text: "zoecreates.co", fontSize: 44, fontFamily: "Inter", fontWeight: "900", fill: "#f97316", textAlign: "center", originX: "center", id: "t-web" },
        { type: "IText", left: 525, top: 325, text: "UX · Branding · Product Design", fontSize: 18, fontFamily: "Inter", fill: "#78716c", textAlign: "center", originX: "center", id: "t-tag" },
      ] } }
    ]}
  },

  // ── 16. Beauty ────────────────────────────────────────────────────────────
  { id: "beauty-rose", title: "Beauty Rose", category: "Beauty", industry: "Beauty", isPremium: false, width: 1050, height: 600,
    doc: { version: 1, canvas: { width: 1050, height: 600, background: "#fff1f2" }, pages: [
      { id: FRONT, name: "Front", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 660, top: 0, width: 390, height: 600, fill: "#fda4af", id: "rp" },
        { type: "IText", left: 60, top: 90, text: "Bella", fontSize: 82, fontFamily: "Georgia", fontStyle: "italic", fontWeight: "700", fill: "#be123c", id: "t-brand" },
        { type: "IText", left: 62, top: 184, text: "Beauty & Wellness Studio", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#9f1239", id: "t-tagline" },
        { type: "IText", left: 62, top: 235, text: "Isabella Romano", fontSize: 26, fontFamily: "Inter", fontWeight: "600", fill: "#1c1917", id: "t-name" },
        { type: "IText", left: 62, top: 268, text: "Senior Stylist & Colorist", fontSize: 16, fontFamily: "Inter", fill: "#9f1239", id: "t-role" },
        { type: "IText", left: 62, top: 310, text: "isabella@bellastudio.com", fontSize: 15, fontFamily: "Inter", fill: "#57534e", id: "t-email" },
        { type: "IText", left: 62, top: 335, text: "+39 02 0000 0000", fontSize: 15, fontFamily: "Inter", fill: "#57534e", id: "t-phone" },
        { type: "IText", left: 62, top: 360, text: "bellastudio.com", fontSize: 15, fontFamily: "Inter", fill: "#be123c", id: "t-web" },
      ] } },
      { id: BACK, name: "Back", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#fff1f2", id: "bg" },
        { type: "Rect", left: 0, top: 0, width: 1050, height: 6, fill: "#fda4af", id: "top-b" },
        { type: "IText", left: 525, top: 255, text: "Bella", fontSize: 96, fontFamily: "Georgia", fontStyle: "italic", fill: "#be123c", textAlign: "center", originX: "center", id: "t-brand" },
        { type: "IText", left: 525, top: 360, text: "Beauty & Wellness Studio", fontSize: 18, fontFamily: "Inter", fontWeight: "300", fill: "#9f1239", textAlign: "center", originX: "center", id: "t-tag" },
      ] } }
    ]}
  },

  // ── 17. Sports ────────────────────────────────────────────────────────────
  { id: "sports-energy", title: "Sports Energy", category: "Sports", industry: "Sports", isPremium: false, width: 1050, height: 600,
    doc: { version: 1, canvas: { width: 1050, height: 600, background: "#0a0a0a" }, pages: [
      { id: FRONT, name: "Front", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#171717", id: "bg2" },
        { type: "Rect", left: 0, top: 0, width: 6, height: 600, fill: "#84cc16", id: "gb" },
        { type: "Rect", left: 0, top: 0, width: 1050, height: 4, fill: "#84cc16", id: "tb" },
        { type: "IText", left: 60, top: 70, text: "TYLER", fontSize: 80, fontFamily: "Inter", fontWeight: "900", fill: "#ffffff", id: "t-fn" },
        { type: "IText", left: 60, top: 155, text: "BROOKS", fontSize: 80, fontFamily: "Inter", fontWeight: "900", fill: "#84cc16", id: "t-ln" },
        { type: "IText", left: 62, top: 250, text: "Certified Personal Trainer & Nutritionist", fontSize: 15, fontFamily: "Inter", fill: "#a3a3a3", id: "t-role" },
        { type: "IText", left: 62, top: 310, text: "tyler@proformfit.com", fontSize: 15, fontFamily: "Inter", fill: "#737373", id: "t-email" },
        { type: "IText", left: 62, top: 335, text: "+1 (310) 555-6060", fontSize: 15, fontFamily: "Inter", fill: "#737373", id: "t-phone" },
        { type: "IText", left: 62, top: 360, text: "proformfit.com", fontSize: 15, fontFamily: "Inter", fill: "#84cc16", id: "t-web" },
        { type: "IText", left: 62, top: 490, text: "PROFORM FITNESS", fontSize: 22, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", letterSpacing: 4, id: "t-co" },
      ] } },
      { id: BACK, name: "Back", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#171717", id: "bg" },
        { type: "Rect", left: 0, top: 0, width: 1050, height: 4, fill: "#84cc16", id: "tb" },
        { type: "IText", left: 525, top: 265, text: "PROFORM FITNESS", fontSize: 40, fontFamily: "Inter", fontWeight: "900", fill: "#ffffff", textAlign: "center", originX: "center", id: "t-co" },
        { type: "IText", left: 525, top: 320, text: "Train Hard. Live Strong.", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#84cc16", textAlign: "center", originX: "center", id: "t-tag" },
      ] } }
    ]}
  },

  // ── 18. Non-profit ────────────────────────────────────────────────────────
  { id: "nonprofit-green", title: "Non-profit Green", category: "Non-profit", industry: "Non-profit", isPremium: false, width: 1050, height: 600,
    doc: { version: 1, canvas: { width: 1050, height: 600, background: "#f0fdf4" }, pages: [
      { id: FRONT, name: "Front", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 8, fill: "#16a34a", id: "tg" },
        { type: "Rect", left: 0, top: 0, width: 280, height: 600, fill: "#dcfce7", id: "lb" },
        { type: "IText", left: 30, top: 470, text: "Since\n2010", fontSize: 18, fontFamily: "Inter", fontWeight: "600", fill: "#16a34a", textAlign: "center", id: "t-since" },
        { type: "IText", left: 320, top: 80, text: "MARIA SANTOS", fontSize: 40, fontFamily: "Inter", fontWeight: "700", fill: "#14532d", id: "t-name" },
        { type: "IText", left: 322, top: 132, text: "Program Director", fontSize: 18, fontFamily: "Inter", fill: "#16a34a", id: "t-role" },
        { type: "IText", left: 322, top: 182, text: "Green Futures Foundation", fontSize: 17, fontFamily: "Inter", fontWeight: "600", fill: "#166534", id: "t-org" },
        { type: "IText", left: 322, top: 212, text: "m.santos@greenfutures.org", fontSize: 15, fontFamily: "Inter", fill: "#4b7280", id: "t-email" },
        { type: "IText", left: 322, top: 237, text: "+55 11 0000-0000", fontSize: 15, fontFamily: "Inter", fill: "#4b7280", id: "t-phone" },
        { type: "IText", left: 322, top: 262, text: "greenfutures.org", fontSize: 15, fontFamily: "Inter", fill: "#16a34a", id: "t-web" },
      ] } },
      { id: BACK, name: "Back", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#f0fdf4", id: "bg" },
        { type: "Rect", left: 0, top: 0, width: 1050, height: 8, fill: "#16a34a", id: "tg" },
        { type: "IText", left: 525, top: 255, text: "Green Futures Foundation", fontSize: 38, fontFamily: "Inter", fontWeight: "700", fill: "#14532d", textAlign: "center", originX: "center", id: "t-org" },
        { type: "IText", left: 525, top: 310, text: "Protecting the Planet for Future Generations", fontSize: 16, fontFamily: "Inter", fill: "#4b7280", textAlign: "center", originX: "center", id: "t-tag" },
      ] } }
    ]}
  },

  // ── 19. Government ────────────────────────────────────────────────────────
  { id: "government-official", title: "Government Official", category: "Government", industry: "Government", isPremium: false, width: 1050, height: 600,
    doc: { version: 1, canvas: { width: 1050, height: 600, background: "#f8fafc" }, pages: [
      { id: FRONT, name: "Front", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 10, fill: "#1d4ed8", id: "tb" },
        { type: "Rect", left: 0, top: 590, width: 1050, height: 10, fill: "#1d4ed8", id: "bb" },
        { type: "Rect", left: 0, top: 10, width: 1050, height: 4, fill: "#dc2626", id: "rb" },
        { type: "IText", left: 60, top: 70, text: "ROBERT J. HAYES", fontSize: 42, fontFamily: "Inter", fontWeight: "700", fill: "#1e293b", id: "t-name" },
        { type: "IText", left: 62, top: 122, text: "Director of Public Affairs", fontSize: 18, fontFamily: "Inter", fill: "#1d4ed8", id: "t-role" },
        { type: "IText", left: 62, top: 172, text: "City of Springfield — Office of the Mayor", fontSize: 16, fontFamily: "Inter", fontWeight: "600", fill: "#334155", id: "t-dept" },
        { type: "IText", left: 62, top: 202, text: "r.hayes@springfield.gov", fontSize: 15, fontFamily: "Inter", fill: "#64748b", id: "t-email" },
        { type: "IText", left: 62, top: 227, text: "+1 (555) 555-1000", fontSize: 15, fontFamily: "Inter", fill: "#64748b", id: "t-phone" },
        { type: "IText", left: 62, top: 490, text: "City Hall, 1 Springfield Plaza, IL 62701", fontSize: 13, fontFamily: "Inter", fill: "#94a3b8", id: "t-addr" },
      ] } },
      { id: BACK, name: "Back", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#f8fafc", id: "bg" },
        { type: "Rect", left: 0, top: 0, width: 1050, height: 10, fill: "#1d4ed8", id: "tb" },
        { type: "Rect", left: 0, top: 590, width: 1050, height: 10, fill: "#1d4ed8", id: "bb" },
        { type: "IText", left: 525, top: 258, text: "City of Springfield", fontSize: 40, fontFamily: "Inter", fontWeight: "700", fill: "#1e293b", textAlign: "center", originX: "center", id: "t-city" },
        { type: "IText", left: 525, top: 310, text: "Office of Public Affairs", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#1d4ed8", textAlign: "center", originX: "center", id: "t-dept" },
      ] } }
    ]}
  },

  // ── 20. Healthcare ────────────────────────────────────────────────────────
  { id: "healthcare-teal", title: "Healthcare Teal", category: "Medical", industry: "Medical", isPremium: false, width: 1050, height: 600,
    doc: { version: 1, canvas: { width: 1050, height: 600, background: "#f0fdfa" }, pages: [
      { id: FRONT, name: "Front", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 700, top: 0, width: 350, height: 600, fill: "#0d9488", id: "rt" },
        { type: "IText", left: 60, top: 80, text: "LAKEWOOD", fontSize: 38, fontFamily: "Inter", fontWeight: "800", fill: "#134e4a", id: "t-clinic" },
        { type: "IText", left: 62, top: 126, text: "HEALTH CLINIC", fontSize: 20, fontFamily: "Inter", fontWeight: "300", fill: "#0d9488", letterSpacing: 3, id: "t-clinic2" },
        { type: "Rect", left: 62, top: 160, width: 200, height: 2, fill: "#99f6e4", id: "div" },
        { type: "IText", left: 62, top: 180, text: "Dr. Kevin Park", fontSize: 30, fontFamily: "Inter", fontWeight: "700", fill: "#134e4a", id: "t-name" },
        { type: "IText", left: 62, top: 218, text: "General Practitioner", fontSize: 17, fontFamily: "Inter", fill: "#0d9488", id: "t-role" },
        { type: "IText", left: 62, top: 265, text: "k.park@lakewoodhealth.com", fontSize: 15, fontFamily: "Inter", fill: "#64748b", id: "t-email" },
        { type: "IText", left: 62, top: 290, text: "+1 (503) 555-8800", fontSize: 15, fontFamily: "Inter", fill: "#64748b", id: "t-phone" },
        { type: "IText", left: 62, top: 315, text: "lakewoodhealth.com", fontSize: 15, fontFamily: "Inter", fill: "#0d9488", id: "t-web" },
      ] } },
      { id: BACK, name: "Back", fabric: { version: "6.0.0", objects: [
        { type: "Rect", left: 0, top: 0, width: 1050, height: 600, fill: "#0d9488", id: "bg" },
        { type: "IText", left: 525, top: 255, text: "LAKEWOOD", fontSize: 44, fontFamily: "Inter", fontWeight: "800", fill: "#ffffff", textAlign: "center", originX: "center", id: "t-clinic" },
        { type: "IText", left: 525, top: 308, text: "HEALTH CLINIC", fontSize: 22, fontFamily: "Inter", fontWeight: "300", fill: "#99f6e4", letterSpacing: 3, textAlign: "center", originX: "center", id: "t-clinic2" },
        { type: "IText", left: 525, top: 350, text: "Your Health is Our Priority", fontSize: 16, fontFamily: "Inter", fill: "#ccfbf1", textAlign: "center", originX: "center", id: "t-tag" },
      ] } }
    ]}
  },

];

// ─── helper: get unique categories ────────────────────────────────────────────
export const TEMPLATE_CATEGORIES = [
  "All",
  ...Array.from(new Set(CARD_TEMPLATES.map((t) => t.category))),
];
