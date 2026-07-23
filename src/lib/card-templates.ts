/**
 * Card templates — ALL objects fit within 1050×600px canvas.
 * Safe margins: left≥40, top≥30, right≤1010, bottom≤570
 */
import type { CanvasDoc } from "@/lib/api/types";

export type CardTemplate = {
  id: string; title: string; category: string; industry: string;
  isPremium: boolean; width: number; height: number; doc: CanvasDoc;
};

const FRONT = "page-front";
const BACK  = "page-back";

export const CARD_TEMPLATES: CardTemplate[] = [
  // ── 1. Dark Executive
  { id:"dark-executive", title:"Dark Executive", category:"Business", industry:"Business", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#111827" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:6, height:600, fill:"#6366f1", id:"bar" },
        { type:"IText", left:50, top:60, text:"ALEX MORGAN", fontSize:48, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"name" },
        { type:"IText", left:52, top:122, text:"Chief Executive Officer", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#6366f1", id:"role" },
        { type:"Rect", left:52, top:158, width:300, height:1, stroke:"#374151", strokeWidth:1, fill:"#374151", id:"div" },
        { type:"IText", left:52, top:175, text:"alex@acme.com", fontSize:16, fontFamily:"Inter", fill:"#9ca3af", id:"email" },
        { type:"IText", left:52, top:200, text:"+1 (555) 000-1234", fontSize:16, fontFamily:"Inter", fill:"#9ca3af", id:"phone" },
        { type:"IText", left:52, top:225, text:"www.acme.com", fontSize:16, fontFamily:"Inter", fill:"#9ca3af", id:"web" },
        { type:"IText", left:52, top:520, text:"ACME CORP", fontSize:24, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"co" },
        { type:"Rect", left:680, top:0, width:370, height:600, fill:"#1f2937", id:"rp" },
        { type:"IText", left:800, top:220, text:"A", fontSize:140, fontFamily:"Inter", fontWeight:"700", fill:"#374151", id:"logo-bg" },
        { type:"IText", left:815, top:238, text:"A", fontSize:110, fontFamily:"Inter", fontWeight:"700", fill:"#6366f1", id:"logo" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#1f2937", id:"bg" },
        { type:"IText", left:525, top:260, text:"ACME CORP", fontSize:44, fontFamily:"Inter", fontWeight:"700", fill:"#6366f1", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:318, text:"Excellence in Every Detail", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#9ca3af", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 2. Clean Minimal
  { id:"minimal-white", title:"Clean Minimal", category:"Business", industry:"Business", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#ffffff" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#111827", id:"bar" },
        { type:"IText", left:60, top:70, text:"SARAH CHEN", fontSize:46, fontFamily:"Inter", fontWeight:"700", fill:"#111827", id:"name" },
        { type:"IText", left:62, top:130, text:"Product Designer", fontSize:20, fontFamily:"Inter", fontWeight:"400", fill:"#6b7280", id:"role" },
        { type:"Rect", left:62, top:165, width:44, height:3, fill:"#111827", id:"ul" },
        { type:"IText", left:62, top:185, text:"sarah@studio.io", fontSize:16, fontFamily:"Inter", fill:"#374151", id:"email" },
        { type:"IText", left:62, top:210, text:"+1 (555) 123-4567", fontSize:16, fontFamily:"Inter", fill:"#374151", id:"phone" },
        { type:"IText", left:62, top:235, text:"studio.io/sarah", fontSize:16, fontFamily:"Inter", fill:"#374151", id:"web" },
        { type:"IText", left:62, top:520, text:"Studio.io", fontSize:28, fontFamily:"Inter", fontWeight:"700", fill:"#111827", id:"co" },
        { type:"Rect", left:620, top:50, width:360, height:500, fill:"#f9fafb", rx:12, ry:12, id:"card-bg" },
        { type:"IText", left:760, top:220, text:"S", fontSize:120, fontFamily:"Inter", fontWeight:"800", fill:"#e5e7eb", id:"logo-bg" },
        { type:"IText", left:770, top:228, text:"S", fontSize:100, fontFamily:"Inter", fontWeight:"800", fill:"#111827", id:"logo" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#111827", id:"bar" },
        { type:"IText", left:525, top:260, text:"Studio.io", fontSize:50, fontFamily:"Inter", fontWeight:"700", fill:"#111827", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:322, text:"Design that speaks", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#6b7280", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 3. Tech Neon
  { id:"tech-neon", title:"Tech Neon", category:"IT", industry:"IT", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#030712" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#0f172a", id:"bg2" },
        { type:"Rect", left:50, top:65, width:44, height:5, fill:"#06b6d4", rx:2, ry:2, id:"acc" },
        { type:"IText", left:50, top:85, text:"NINA TORRES", fontSize:46, fontFamily:"Inter", fontWeight:"800", fill:"#f0f9ff", id:"name" },
        { type:"IText", left:52, top:144, text:"Cloud Architect  /  DevOps", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#06b6d4", id:"role" },
        { type:"IText", left:52, top:200, text:"nina@cloudnine.dev", fontSize:16, fontFamily:"Inter", fill:"#94a3b8", id:"email" },
        { type:"IText", left:52, top:226, text:"+1 (415) 000-7777", fontSize:16, fontFamily:"Inter", fill:"#94a3b8", id:"phone" },
        { type:"IText", left:52, top:252, text:"cloudnine.dev", fontSize:16, fontFamily:"Inter", fill:"#94a3b8", id:"web" },
        { type:"IText", left:52, top:520, text:"CloudNine", fontSize:24, fontFamily:"Inter", fontWeight:"700", fill:"#06b6d4", id:"co" },
        { type:"Rect", left:680, top:150, width:260, height:260, fill:"#06b6d4", opacity:0.05, rx:20, ry:20, id:"box" },
        { type:"IText", left:705, top:188, text:"</>", fontSize:76, fontFamily:"Inter", fontWeight:"700", fill:"#06b6d4", opacity:0.3, id:"code" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#030712", id:"bg" },
        { type:"IText", left:525, top:258, text:"CloudNine", fontSize:50, fontFamily:"Inter", fontWeight:"800", fill:"#06b6d4", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:322, text:"Cloud · DevOps · Infrastructure", fontSize:17, fontFamily:"Inter", fontWeight:"300", fill:"#94a3b8", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 4. Medical Clean
  { id:"medical-clean", title:"Medical Clean", category:"Medical", industry:"Medical", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#ffffff" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:340, height:600, fill:"#0ea5e9", id:"lp" },
        { type:"IText", left:30, top:50, text:"+", fontSize:140, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", opacity:0.12, id:"cross" },
        { type:"IText", left:38, top:430, text:"Dr.", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#e0f2fe", id:"dr" },
        { type:"IText", left:38, top:458, text:"Emily Ngo", fontSize:28, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"name-l" },
        { type:"IText", left:380, top:60, text:"DR. EMILY NGO", fontSize:36, fontFamily:"Inter", fontWeight:"700", fill:"#0c4a6e", id:"name" },
        { type:"IText", left:382, top:108, text:"MD — Cardiologist", fontSize:18, fontFamily:"Inter", fill:"#0ea5e9", id:"role" },
        { type:"Rect", left:382, top:140, width:240, height:2, fill:"#bae6fd", id:"div" },
        { type:"IText", left:382, top:158, text:"City Medical Center", fontSize:17, fontFamily:"Inter", fontWeight:"600", fill:"#374151", id:"org" },
        { type:"IText", left:382, top:188, text:"emily.ngo@citymed.org", fontSize:15, fontFamily:"Inter", fill:"#6b7280", id:"email" },
        { type:"IText", left:382, top:214, text:"+1 (555) 200-3000", fontSize:15, fontFamily:"Inter", fill:"#6b7280", id:"phone" },
        { type:"IText", left:382, top:240, text:"123 Health Ave, NY 10001", fontSize:14, fontFamily:"Inter", fill:"#9ca3af", id:"addr" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#0ea5e9", id:"bg" },
        { type:"IText", left:525, top:262, text:"City Medical Center", fontSize:32, fontFamily:"Inter", fontWeight:"600", fill:"#ffffff", textAlign:"center", originX:"center", id:"org" },
        { type:"IText", left:525, top:310, text:"Caring for your heart", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#e0f2fe", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 5. Restaurant Warm
  { id:"restaurant-warm", title:"Restaurant Warm", category:"Restaurant", industry:"Restaurant", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#1c0a00" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:3, fill:"#f59e0b", id:"t" },
        { type:"Rect", left:0, top:597, width:1050, height:3, fill:"#f59e0b", id:"b" },
        { type:"Rect", left:0, top:0, width:3, height:600, fill:"#f59e0b", id:"l" },
        { type:"Rect", left:1047, top:0, width:3, height:600, fill:"#f59e0b", id:"r" },
        { type:"IText", left:50, top:60, text:"La Bella Cucina", fontSize:50, fontFamily:"Georgia", fontStyle:"italic", fontWeight:"700", fill:"#f59e0b", id:"name" },
        { type:"IText", left:56, top:124, text:"Authentic Italian Cuisine", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#fde68a", id:"tag" },
        { type:"IText", left:56, top:172, text:"Marco Rossi — Head Chef", fontSize:17, fontFamily:"Inter", fontWeight:"600", fill:"#fef3c7", id:"chef" },
        { type:"IText", left:56, top:202, text:"marco@labella.com", fontSize:15, fontFamily:"Inter", fill:"#d97706", id:"email" },
        { type:"IText", left:56, top:226, text:"+1 (555) 700-8899", fontSize:15, fontFamily:"Inter", fill:"#d97706", id:"phone" },
        { type:"IText", left:56, top:250, text:"42 Via Roma, Little Italy, NY", fontSize:14, fontFamily:"Inter", fill:"#92400e", id:"addr" },
        { type:"IText", left:56, top:510, text:"Mon–Sun  12pm – 10pm", fontSize:14, fontFamily:"Inter", fill:"#f59e0b", id:"hours" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:3, fill:"#f59e0b", id:"t" },
        { type:"Rect", left:0, top:597, width:1050, height:3, fill:"#f59e0b", id:"b" },
        { type:"IText", left:525, top:250, text:"La Bella Cucina", fontSize:58, fontFamily:"Georgia", fontStyle:"italic", fontWeight:"700", fill:"#f59e0b", textAlign:"center", originX:"center", id:"name" },
        { type:"IText", left:525, top:322, text:"Authentic Italian Cuisine", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#fde68a", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 6. Real Estate Navy
  { id:"realestate-navy", title:"Real Estate Navy", category:"Real Estate", industry:"Real Estate", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#0f172a" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:660, top:0, width:390, height:600, fill:"#f8fafc", id:"rw" },
        { type:"Rect", left:660, top:0, width:5, height:600, fill:"#f59e0b", id:"gb" },
        { type:"IText", left:50, top:65, text:"RICHARD", fontSize:48, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", id:"fn" },
        { type:"IText", left:50, top:122, text:"HAMILTON", fontSize:48, fontFamily:"Inter", fontWeight:"800", fill:"#f59e0b", id:"ln" },
        { type:"IText", left:52, top:184, text:"Licensed Realtor · DRE #01234567", fontSize:14, fontFamily:"Inter", fill:"#94a3b8", id:"lic" },
        { type:"IText", left:52, top:215, text:"richard@premierhomes.com", fontSize:15, fontFamily:"Inter", fill:"#cbd5e1", id:"email" },
        { type:"IText", left:52, top:240, text:"+1 (310) 555-9900", fontSize:15, fontFamily:"Inter", fill:"#cbd5e1", id:"phone" },
        { type:"IText", left:52, top:265, text:"premierhomes.com/richard", fontSize:14, fontFamily:"Inter", fill:"#64748b", id:"web" },
        { type:"IText", left:52, top:520, text:"PREMIER HOMES", fontSize:20, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"co" },
        { type:"IText", left:695, top:100, text:"⌂", fontSize:120, fontFamily:"Inter", fill:"#e2e8f0", opacity:0.5, id:"icon" },
        { type:"IText", left:695, top:360, text:"Luxury · Residential\nCommercial · Land", fontSize:16, fontFamily:"Inter", fill:"#475569", id:"types" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#0f172a", id:"bg" },
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#f59e0b", id:"bar" },
        { type:"IText", left:525, top:258, text:"PREMIER HOMES", fontSize:40, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:312, text:"Your Dream. Our Mission.", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#94a3b8", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 7. Attorney Prestige
  { id:"lawyer-prestige", title:"Attorney Prestige", category:"Lawyer", industry:"Lawyer", isPremium:true, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#1a1209" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:2, fill:"#b45309", id:"t" },
        { type:"Rect", left:0, top:598, width:1050, height:2, fill:"#b45309", id:"b" },
        { type:"IText", left:60, top:65, text:"HARRISON &", fontSize:40, fontFamily:"Georgia", fontWeight:"700", fill:"#d97706", id:"co1" },
        { type:"IText", left:60, top:112, text:"ASSOCIATES LLP", fontSize:40, fontFamily:"Georgia", fontWeight:"700", fill:"#d97706", id:"co2" },
        { type:"Rect", left:60, top:163, width:360, height:1, fill:"#78350f", id:"div" },
        { type:"IText", left:60, top:180, text:"Jonathan R. Harrison, Esq.", fontSize:22, fontFamily:"Georgia", fontStyle:"italic", fill:"#fef3c7", id:"name" },
        { type:"IText", left:60, top:215, text:"Senior Partner · Corporate Law", fontSize:15, fontFamily:"Inter", fill:"#92400e", id:"role" },
        { type:"IText", left:60, top:262, text:"j.harrison@harrisonlaw.com", fontSize:15, fontFamily:"Inter", fill:"#d4a76a", id:"email" },
        { type:"IText", left:60, top:288, text:"+1 (212) 555-0088", fontSize:15, fontFamily:"Inter", fill:"#d4a76a", id:"phone" },
        { type:"IText", left:60, top:314, text:"350 Park Ave, 40th Floor, New York", fontSize:13, fontFamily:"Inter", fill:"#78350f", id:"addr" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:2, fill:"#b45309", id:"t" },
        { type:"Rect", left:0, top:598, width:1050, height:2, fill:"#b45309", id:"b" },
        { type:"IText", left:525, top:248, text:"HARRISON & ASSOCIATES", fontSize:34, fontFamily:"Georgia", fontWeight:"700", fill:"#d97706", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:296, text:"LLP", fontSize:26, fontFamily:"Georgia", fontWeight:"700", fill:"#d97706", textAlign:"center", originX:"center", id:"llp" },
        { type:"IText", left:525, top:336, text:"Excellence in Corporate Law", fontSize:17, fontFamily:"Inter", fontWeight:"300", fill:"#92400e", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 8. Luxury Gold
  { id:"luxury-gold", title:"Luxury Gold", category:"Business", industry:"Business", isPremium:true, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#0d0d0d" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:1, fill:"#c9a84c", id:"t" },
        { type:"Rect", left:0, top:599, width:1050, height:1, fill:"#c9a84c", id:"b" },
        { type:"Rect", left:0, top:0, width:1, height:600, fill:"#c9a84c", id:"l" },
        { type:"Rect", left:1049, top:0, width:1, height:600, fill:"#c9a84c", id:"r" },
        { type:"IText", left:70, top:80, text:"VICTORIA", fontSize:52, fontFamily:"Georgia", fontWeight:"400", fill:"#c9a84c", id:"fn" },
        { type:"IText", left:70, top:140, text:"BLACKWOOD", fontSize:52, fontFamily:"Georgia", fontWeight:"700", fill:"#f5f0e8", id:"ln" },
        { type:"Rect", left:70, top:202, width:300, height:1, fill:"#c9a84c", opacity:0.5, id:"div" },
        { type:"IText", left:70, top:218, text:"Private Client Advisor", fontSize:16, fontFamily:"Inter", fontWeight:"300", fill:"#a78a50", id:"role" },
        { type:"IText", left:70, top:285, text:"victoria@prestige.com", fontSize:15, fontFamily:"Inter", fill:"#8a7d65", id:"email" },
        { type:"IText", left:70, top:310, text:"+44 20 7946 0000", fontSize:15, fontFamily:"Inter", fill:"#8a7d65", id:"phone" },
        { type:"IText", left:70, top:510, text:"PRESTIGE GROUP", fontSize:18, fontFamily:"Inter", fontWeight:"700", fill:"#c9a84c", id:"co" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:1, fill:"#c9a84c", id:"t" },
        { type:"Rect", left:0, top:599, width:1050, height:1, fill:"#c9a84c", id:"b" },
        { type:"IText", left:525, top:258, text:"PRESTIGE GROUP", fontSize:38, fontFamily:"Georgia", fontWeight:"700", fill:"#c9a84c", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:310, text:"Private Client Services", fontSize:17, fontFamily:"Inter", fontWeight:"300", fill:"#a78a50", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 9. Creative Bold
  { id:"creative-bold", title:"Creative Bold", category:"Creative", industry:"Creative", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#fafafa" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:460, height:600, fill:"#18181b", id:"lp" },
        { type:"Rect", left:444, top:0, width:36, height:600, fill:"#ef4444", id:"bar" },
        { type:"IText", left:38, top:80, text:"LUCAS", fontSize:68, fontFamily:"Inter", fontWeight:"900", fill:"#ffffff", id:"fn" },
        { type:"IText", left:38, top:154, text:"OKAFOR", fontSize:68, fontFamily:"Inter", fontWeight:"900", fill:"#ef4444", id:"ln" },
        { type:"IText", left:38, top:238, text:"Visual Artist & Photographer", fontSize:14, fontFamily:"Inter", fontWeight:"300", fill:"#a1a1aa", id:"role" },
        { type:"IText", left:38, top:430, text:"lucas@okafor.studio", fontSize:14, fontFamily:"Inter", fill:"#71717a", id:"email" },
        { type:"IText", left:38, top:455, text:"+44 7700 900123", fontSize:14, fontFamily:"Inter", fill:"#71717a", id:"phone" },
        { type:"IText", left:38, top:480, text:"okafor.studio", fontSize:14, fontFamily:"Inter", fill:"#71717a", id:"web" },
        { type:"IText", left:520, top:65, text:"OKAFOR\nSTUDIO", fontSize:46, fontFamily:"Inter", fontWeight:"900", fill:"#18181b", id:"co" },
        { type:"IText", left:520, top:290, text:"Photography\nIllustration\nBrand Identity", fontSize:17, fontFamily:"Inter", fontWeight:"400", fill:"#71717a", id:"svc" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#18181b", id:"bg" },
        { type:"Rect", left:0, top:0, width:36, height:600, fill:"#ef4444", id:"bar" },
        { type:"IText", left:525, top:250, text:"OKAFOR STUDIO", fontSize:46, fontFamily:"Inter", fontWeight:"900", fill:"#ffffff", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:308, text:"okafor.studio", fontSize:18, fontFamily:"Inter", fill:"#71717a", textAlign:"center", originX:"center", id:"web" },
      ]}}
    ]}
  },
  // ── 10. Startup Modern
  { id:"startup-modern", title:"Startup Modern", category:"IT", industry:"IT", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#ffffff" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:470, width:1050, height:130, fill:"#f8fafc", id:"footer" },
        { type:"Rect", left:0, top:470, width:1050, height:2, fill:"#e2e8f0", id:"fline" },
        { type:"Rect", left:50, top:48, width:52, height:52, fill:"#6366f1", rx:12, ry:12, id:"logo-box" },
        { type:"IText", left:63, top:57, text:"N", fontSize:32, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", id:"logo" },
        { type:"IText", left:50, top:128, text:"NOAH KIM", fontSize:44, fontFamily:"Inter", fontWeight:"700", fill:"#0f172a", id:"name" },
        { type:"IText", left:52, top:184, text:"Co-founder & CTO", fontSize:19, fontFamily:"Inter", fill:"#6366f1", id:"role" },
        { type:"IText", left:52, top:242, text:"noah@nexus.ai", fontSize:16, fontFamily:"Inter", fill:"#475569", id:"email" },
        { type:"IText", left:52, top:268, text:"+1 (650) 555-3210", fontSize:16, fontFamily:"Inter", fill:"#475569", id:"phone" },
        { type:"IText", left:52, top:294, text:"nexus.ai", fontSize:16, fontFamily:"Inter", fill:"#6366f1", id:"web" },
        { type:"IText", left:70, top:492, text:"nexus.ai  ·  San Francisco, CA", fontSize:14, fontFamily:"Inter", fill:"#94a3b8", id:"footer-txt" },
        { type:"IText", left:730, top:100, text:"Nexus\nAI", fontSize:80, fontFamily:"Inter", fontWeight:"900", fill:"#f1f5f9", id:"bg-txt" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:470, width:1050, height:130, fill:"#f8fafc", id:"footer" },
        { type:"Rect", left:50, top:48, width:52, height:52, fill:"#6366f1", rx:12, ry:12, id:"logo-box" },
        { type:"IText", left:63, top:57, text:"N", fontSize:32, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", id:"logo" },
        { type:"IText", left:525, top:258, text:"nexus.ai", fontSize:48, fontFamily:"Inter", fontWeight:"700", fill:"#6366f1", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:320, text:"AI · Automation · Infrastructure", fontSize:17, fontFamily:"Inter", fill:"#475569", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 11. Construction
  { id:"construction-bold", title:"Construction", category:"Construction", industry:"Construction", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#1c1917" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:130, fill:"#f59e0b", id:"header" },
        { type:"IText", left:50, top:22, text:"IRONCLAD", fontSize:65, fontFamily:"Inter", fontWeight:"900", fill:"#1c1917", id:"co" },
        { type:"IText", left:52, top:92, text:"CONSTRUCTION GROUP", fontSize:16, fontFamily:"Inter", fontWeight:"600", fill:"#1c1917", id:"co2" },
        { type:"IText", left:50, top:168, text:"MIKE STEELE", fontSize:40, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", id:"name" },
        { type:"IText", left:52, top:220, text:"Senior Site Manager", fontSize:18, fontFamily:"Inter", fontWeight:"400", fill:"#f59e0b", id:"role" },
        { type:"Rect", left:52, top:252, width:260, height:2, fill:"#44403c", id:"div" },
        { type:"IText", left:52, top:268, text:"mike@ironclad.build", fontSize:15, fontFamily:"Inter", fill:"#a8a29e", id:"email" },
        { type:"IText", left:52, top:293, text:"+1 (713) 555-0044", fontSize:15, fontFamily:"Inter", fill:"#a8a29e", id:"phone" },
        { type:"IText", left:52, top:318, text:"ironclad.build", fontSize:15, fontFamily:"Inter", fill:"#a8a29e", id:"web" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:130, fill:"#f59e0b", id:"header" },
        { type:"IText", left:525, top:22, text:"IRONCLAD", fontSize:65, fontFamily:"Inter", fontWeight:"900", fill:"#1c1917", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:200, text:"Building with Pride", fontSize:34, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", textAlign:"center", originX:"center", id:"tag" },
        { type:"IText", left:525, top:250, text:"Bonded · Licensed · Insured", fontSize:17, fontFamily:"Inter", fill:"#a8a29e", textAlign:"center", originX:"center", id:"badges" },
        { type:"IText", left:525, top:300, text:"ironclad.build", fontSize:19, fontFamily:"Inter", fill:"#f59e0b", textAlign:"center", originX:"center", id:"web" },
      ]}}
    ]}
  },
  // ── 12. Gradient Purple
  { id:"gradient-purple", title:"Gradient Purple", category:"Creative", industry:"IT", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#7c3aed" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#4f46e5", opacity:0.5, id:"overlay" },
        { type:"IText", left:55, top:72, text:"JAMES PARK", fontSize:50, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", id:"name" },
        { type:"IText", left:57, top:135, text:"Full-Stack Developer", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#c4b5fd", id:"role" },
        { type:"IText", left:57, top:195, text:"james@devcraft.io", fontSize:16, fontFamily:"Inter", fill:"#e0e7ff", id:"email" },
        { type:"IText", left:57, top:220, text:"+82 10-0000-1234", fontSize:16, fontFamily:"Inter", fill:"#e0e7ff", id:"phone" },
        { type:"IText", left:57, top:245, text:"devcraft.io", fontSize:16, fontFamily:"Inter", fill:"#e0e7ff", id:"web" },
        { type:"IText", left:57, top:520, text:"DevCraft", fontSize:26, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"co" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#4f46e5", id:"bg" },
        { type:"IText", left:525, top:258, text:"DevCraft", fontSize:52, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:324, text:"Building the future", fontSize:19, fontFamily:"Inter", fontWeight:"300", fill:"#c4b5fd", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 13. Education Blue
  { id:"education-blue", title:"Education Blue", category:"Education", industry:"Education", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#1e3a5f" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:6, fill:"#3b82f6", id:"bar" },
        { type:"IText", left:55, top:55, text:"PROF. ANNA WELLS", fontSize:40, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"name" },
        { type:"IText", left:57, top:108, text:"PhD — Mathematics & CS", fontSize:17, fontFamily:"Inter", fontWeight:"300", fill:"#93c5fd", id:"role" },
        { type:"Rect", left:57, top:140, width:260, height:2, fill:"#3b82f6", id:"div" },
        { type:"IText", left:57, top:158, text:"Westfield University", fontSize:18, fontFamily:"Inter", fontWeight:"600", fill:"#bfdbfe", id:"uni" },
        { type:"IText", left:57, top:192, text:"a.wells@westfield.edu", fontSize:15, fontFamily:"Inter", fill:"#93c5fd", id:"email" },
        { type:"IText", left:57, top:218, text:"+1 (617) 555-0032", fontSize:15, fontFamily:"Inter", fill:"#93c5fd", id:"phone" },
        { type:"IText", left:57, top:244, text:"westfield.edu/annawells", fontSize:14, fontFamily:"Inter", fill:"#60a5fa", id:"web" },
        { type:"IText", left:57, top:510, text:"Office: Room 312, Science Hall", fontSize:13, fontFamily:"Inter", fill:"#60a5fa", id:"office" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#1e3a5f", id:"bg" },
        { type:"IText", left:525, top:258, text:"Westfield University", fontSize:38, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:312, text:"Inspiring Minds Since 1892", fontSize:17, fontFamily:"Inter", fontWeight:"300", fill:"#93c5fd", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 14. Finance Slate
  { id:"finance-slate", title:"Finance Slate", category:"Finance", industry:"Finance", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#0f172a" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:290, height:600, fill:"#1e293b", id:"lp" },
        { type:"Rect", left:289, top:0, width:4, height:600, fill:"#22d3ee", id:"acc" },
        { type:"IText", left:28, top:68, text:"WM", fontSize:68, fontFamily:"Inter", fontWeight:"900", fill:"#22d3ee", id:"init" },
        { type:"IText", left:28, top:150, text:"Wealth\nManagement", fontSize:16, fontFamily:"Inter", fontWeight:"300", fill:"#94a3b8", id:"dept" },
        { type:"IText", left:328, top:55, text:"WILLIAM CARTER", fontSize:38, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"name" },
        { type:"IText", left:330, top:106, text:"Senior Financial Advisor", fontSize:16, fontFamily:"Inter", fontWeight:"300", fill:"#22d3ee", id:"role" },
        { type:"IText", left:330, top:155, text:"w.carter@apexwealth.com", fontSize:14, fontFamily:"Inter", fill:"#94a3b8", id:"email" },
        { type:"IText", left:330, top:180, text:"+1 (212) 555-7788", fontSize:14, fontFamily:"Inter", fill:"#94a3b8", id:"phone" },
        { type:"IText", left:330, top:205, text:"apexwealth.com", fontSize:14, fontFamily:"Inter", fill:"#22d3ee", id:"web" },
        { type:"IText", left:330, top:510, text:"APEX WEALTH GROUP", fontSize:17, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"co" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#0f172a", id:"bg" },
        { type:"IText", left:525, top:258, text:"APEX WEALTH GROUP", fontSize:32, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:306, text:"Your Future. Our Expertise.", fontSize:17, fontFamily:"Inter", fontWeight:"300", fill:"#94a3b8", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 15. Freelancer Coral
  { id:"freelancer-coral", title:"Freelancer Coral", category:"Creative", industry:"IT", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#fff7f5" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:7, fill:"#f97316", id:"bar" },
        { type:"IText", left:55, top:48, text:"ZOE", fontSize:76, fontFamily:"Inter", fontWeight:"900", fill:"#f97316", id:"fn" },
        { type:"IText", left:57, top:130, text:"LAMBERT", fontSize:50, fontFamily:"Inter", fontWeight:"900", fill:"#1c1917", id:"ln" },
        { type:"IText", left:59, top:198, text:"Freelance UX Designer & Brand Consultant", fontSize:14, fontFamily:"Inter", fill:"#78716c", id:"role" },
        { type:"Rect", left:59, top:224, width:38, height:4, fill:"#f97316", id:"acc" },
        { type:"IText", left:59, top:246, text:"zoe@zoecreates.co", fontSize:15, fontFamily:"Inter", fill:"#57534e", id:"email" },
        { type:"IText", left:59, top:272, text:"+33 6 00 00 00 00", fontSize:15, fontFamily:"Inter", fill:"#57534e", id:"phone" },
        { type:"IText", left:59, top:298, text:"zoecreates.co", fontSize:15, fontFamily:"Inter", fill:"#f97316", id:"web" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#fff7f5", id:"bg" },
        { type:"Rect", left:0, top:0, width:1050, height:7, fill:"#f97316", id:"bar" },
        { type:"IText", left:525, top:255, text:"zoecreates.co", fontSize:42, fontFamily:"Inter", fontWeight:"900", fill:"#f97316", textAlign:"center", originX:"center", id:"web" },
        { type:"IText", left:525, top:313, text:"UX · Branding · Product Design", fontSize:17, fontFamily:"Inter", fill:"#78716c", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 16. Beauty Rose
  { id:"beauty-rose", title:"Beauty Rose", category:"Beauty", industry:"Beauty", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#fff1f2" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:640, top:0, width:410, height:600, fill:"#fda4af", id:"rp" },
        { type:"IText", left:48, top:65, text:"Bella", fontSize:76, fontFamily:"Georgia", fontStyle:"italic", fontWeight:"700", fill:"#be123c", id:"brand" },
        { type:"IText", left:50, top:155, text:"Beauty & Wellness Studio", fontSize:16, fontFamily:"Inter", fontWeight:"300", fill:"#9f1239", id:"tag" },
        { type:"Rect", left:50, top:186, width:160, height:2, fill:"#fda4af", id:"div" },
        { type:"IText", left:50, top:204, text:"Isabella Romano", fontSize:24, fontFamily:"Inter", fontWeight:"600", fill:"#1c1917", id:"name" },
        { type:"IText", left:50, top:238, text:"Senior Stylist & Colorist", fontSize:15, fontFamily:"Inter", fill:"#9f1239", id:"role" },
        { type:"IText", left:50, top:278, text:"isabella@bellastudio.com", fontSize:14, fontFamily:"Inter", fill:"#57534e", id:"email" },
        { type:"IText", left:50, top:302, text:"+39 02 0000 0000", fontSize:14, fontFamily:"Inter", fill:"#57534e", id:"phone" },
        { type:"IText", left:50, top:326, text:"bellastudio.com", fontSize:14, fontFamily:"Inter", fill:"#be123c", id:"web" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#fff1f2", id:"bg" },
        { type:"Rect", left:0, top:0, width:1050, height:6, fill:"#fda4af", id:"bar" },
        { type:"IText", left:525, top:235, text:"Bella", fontSize:88, fontFamily:"Georgia", fontStyle:"italic", fill:"#be123c", textAlign:"center", originX:"center", id:"brand" },
        { type:"IText", left:525, top:338, text:"Beauty & Wellness Studio", fontSize:17, fontFamily:"Inter", fontWeight:"300", fill:"#9f1239", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 17. Sports Energy
  { id:"sports-energy", title:"Sports Energy", category:"Sports", industry:"Sports", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#0a0a0a" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#171717", id:"bg" },
        { type:"Rect", left:0, top:0, width:5, height:600, fill:"#84cc16", id:"bar" },
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#84cc16", id:"top" },
        { type:"IText", left:50, top:48, text:"TYLER", fontSize:76, fontFamily:"Inter", fontWeight:"900", fill:"#ffffff", id:"fn" },
        { type:"IText", left:50, top:130, text:"BROOKS", fontSize:76, fontFamily:"Inter", fontWeight:"900", fill:"#84cc16", id:"ln" },
        { type:"IText", left:52, top:224, text:"Certified Personal Trainer & Nutritionist", fontSize:14, fontFamily:"Inter", fill:"#a3a3a3", id:"role" },
        { type:"IText", left:52, top:276, text:"tyler@proformfit.com", fontSize:15, fontFamily:"Inter", fill:"#737373", id:"email" },
        { type:"IText", left:52, top:302, text:"+1 (310) 555-6060", fontSize:15, fontFamily:"Inter", fill:"#737373", id:"phone" },
        { type:"IText", left:52, top:328, text:"proformfit.com", fontSize:15, fontFamily:"Inter", fill:"#84cc16", id:"web" },
        { type:"IText", left:52, top:516, text:"PROFORM FITNESS", fontSize:20, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", id:"co" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#171717", id:"bg" },
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#84cc16", id:"top" },
        { type:"IText", left:525, top:255, text:"PROFORM FITNESS", fontSize:38, fontFamily:"Inter", fontWeight:"900", fill:"#ffffff", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:308, text:"Train Hard. Live Strong.", fontSize:19, fontFamily:"Inter", fontWeight:"300", fill:"#84cc16", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 18. Non-profit Green
  { id:"nonprofit-green", title:"Non-profit Green", category:"Non-profit", industry:"Non-profit", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#f0fdf4" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:7, fill:"#16a34a", id:"bar" },
        { type:"Rect", left:0, top:0, width:250, height:600, fill:"#dcfce7", id:"lp" },
        { type:"IText", left:18, top:460, text:"Since\n2010", fontSize:16, fontFamily:"Inter", fontWeight:"600", fill:"#16a34a", textAlign:"center", id:"since" },
        { type:"IText", left:278, top:55, text:"MARIA SANTOS", fontSize:36, fontFamily:"Inter", fontWeight:"700", fill:"#14532d", id:"name" },
        { type:"IText", left:280, top:104, text:"Program Director", fontSize:17, fontFamily:"Inter", fill:"#16a34a", id:"role" },
        { type:"IText", left:280, top:148, text:"Green Futures Foundation", fontSize:15, fontFamily:"Inter", fontWeight:"600", fill:"#166534", id:"org" },
        { type:"IText", left:280, top:178, text:"m.santos@greenfutures.org", fontSize:14, fontFamily:"Inter", fill:"#4b7280", id:"email" },
        { type:"IText", left:280, top:202, text:"+55 11 0000-0000", fontSize:14, fontFamily:"Inter", fill:"#4b7280", id:"phone" },
        { type:"IText", left:280, top:226, text:"greenfutures.org", fontSize:14, fontFamily:"Inter", fill:"#16a34a", id:"web" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#f0fdf4", id:"bg" },
        { type:"Rect", left:0, top:0, width:1050, height:7, fill:"#16a34a", id:"bar" },
        { type:"IText", left:525, top:252, text:"Green Futures Foundation", fontSize:34, fontFamily:"Inter", fontWeight:"700", fill:"#14532d", textAlign:"center", originX:"center", id:"org" },
        { type:"IText", left:525, top:302, text:"Protecting the Planet for Future Generations", fontSize:14, fontFamily:"Inter", fill:"#4b7280", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },
  // ── 19. Government Official
  { id:"government-official", title:"Government Official", category:"Government", industry:"Government", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#f8fafc" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:10, fill:"#1d4ed8", id:"tb" },
        { type:"Rect", left:0, top:590, width:1050, height:10, fill:"#1d4ed8", id:"bb" },
        { type:"Rect", left:0, top:10, width:1050, height:4, fill:"#dc2626", id:"rb" },
        { type:"IText", left:55, top:54, text:"ROBERT J. HAYES", fontSize:38, fontFamily:"Inter", fontWeight:"700", fill:"#1e293b", id:"name" },
        { type:"IText", left:57, top:105, text:"Director of Public Affairs", fontSize:17, fontFamily:"Inter", fill:"#1d4ed8", id:"role" },
        { type:"IText", left:57, top:148, text:"City of Springfield — Office of the Mayor", fontSize:14, fontFamily:"Inter", fontWeight:"600", fill:"#334155", id:"dept" },
        { type:"IText", left:57, top:176, text:"r.hayes@springfield.gov", fontSize:14, fontFamily:"Inter", fill:"#64748b", id:"email" },
        { type:"IText", left:57, top:200, text:"+1 (555) 555-1000", fontSize:14, fontFamily:"Inter", fill:"#64748b", id:"phone" },
        { type:"IText", left:57, top:512, text:"City Hall, 1 Springfield Plaza, IL 62701", fontSize:12, fontFamily:"Inter", fill:"#94a3b8", id:"addr" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#f8fafc", id:"bg" },
        { type:"Rect", left:0, top:0, width:1050, height:10, fill:"#1d4ed8", id:"tb" },
        { type:"Rect", left:0, top:590, width:1050, height:10, fill:"#1d4ed8", id:"bb" },
        { type:"IText", left:525, top:254, text:"City of Springfield", fontSize:36, fontFamily:"Inter", fontWeight:"700", fill:"#1e293b", textAlign:"center", originX:"center", id:"city" },
        { type:"IText", left:525, top:304, text:"Office of Public Affairs", fontSize:19, fontFamily:"Inter", fontWeight:"300", fill:"#1d4ed8", textAlign:"center", originX:"center", id:"dept" },
      ]}}
    ]}
  },
  // ── 20. Healthcare Teal
  { id:"healthcare-teal", title:"Healthcare Teal", category:"Medical", industry:"Medical", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#f0fdfa" }, pages:[
      { id:FRONT, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:680, top:0, width:370, height:600, fill:"#0d9488", id:"rp" },
        { type:"IText", left:48, top:55, text:"LAKEWOOD", fontSize:34, fontFamily:"Inter", fontWeight:"800", fill:"#134e4a", id:"clinic" },
        { type:"IText", left:50, top:100, text:"HEALTH CLINIC", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#0d9488", id:"clinic2" },
        { type:"Rect", left:50, top:132, width:190, height:2, fill:"#99f6e4", id:"div" },
        { type:"IText", left:50, top:150, text:"Dr. Kevin Park", fontSize:27, fontFamily:"Inter", fontWeight:"700", fill:"#134e4a", id:"name" },
        { type:"IText", left:50, top:188, text:"General Practitioner", fontSize:16, fontFamily:"Inter", fill:"#0d9488", id:"role" },
        { type:"IText", left:50, top:230, text:"k.park@lakewoodhealth.com", fontSize:14, fontFamily:"Inter", fill:"#64748b", id:"email" },
        { type:"IText", left:50, top:254, text:"+1 (503) 555-8800", fontSize:14, fontFamily:"Inter", fill:"#64748b", id:"phone" },
        { type:"IText", left:50, top:278, text:"lakewoodhealth.com", fontSize:14, fontFamily:"Inter", fill:"#0d9488", id:"web" },
        { type:"IText", left:710, top:232, text:"✚", fontSize:96, fontFamily:"Inter", fill:"#ffffff", opacity:0.2, id:"cross" },
      ]}},
      { id:BACK, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#0d9488", id:"bg" },
        { type:"IText", left:525, top:250, text:"LAKEWOOD", fontSize:42, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", textAlign:"center", originX:"center", id:"clinic" },
        { type:"IText", left:525, top:302, text:"HEALTH CLINIC", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#99f6e4", textAlign:"center", originX:"center", id:"clinic2" },
        { type:"IText", left:525, top:342, text:"Your Health is Our Priority", fontSize:15, fontFamily:"Inter", fill:"#ccfbf1", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },

];

export const TEMPLATE_CATEGORIES = [
  "All",
  ...Array.from(new Set(CARD_TEMPLATES.map((t) => t.category))),
];
