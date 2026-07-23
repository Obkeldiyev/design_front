/**
 * Business card templates — canvas 1050×600px.
 * Objects fill the full canvas area with proper layout.
 */
import type { CanvasDoc } from "@/lib/api/types";

export type CardTemplate = {
  id: string; title: string; category: string; industry: string;
  isPremium: boolean; width: number; height: number; doc: CanvasDoc;
};

const F = "page-front";
const B = "page-back";

export const CARD_TEMPLATES: CardTemplate[] = [

  // 1. Dark Executive
  { id:"c1", title:"Dark Executive", category:"Business", industry:"Business", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#111827" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:8, height:600, fill:"#6366f1", id:"bar" },
        { type:"Rect", left:680, top:0, width:370, height:600, fill:"#1f2937", id:"rp" },
        { type:"IText", left:40, top:80, text:"ALEX MORGAN", fontSize:52, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"name" },
        { type:"IText", left:40, top:148, text:"Chief Executive Officer", fontSize:22, fontFamily:"Inter", fontWeight:"300", fill:"#6366f1", id:"role" },
        { type:"IText", left:40, top:200, text:"alex@acme.com", fontSize:18, fontFamily:"Inter", fill:"#9ca3af", id:"email" },
        { type:"IText", left:40, top:230, text:"+1 (555) 000-1234", fontSize:18, fontFamily:"Inter", fill:"#9ca3af", id:"phone" },
        { type:"IText", left:40, top:260, text:"www.acme.com", fontSize:18, fontFamily:"Inter", fill:"#9ca3af", id:"web" },
        { type:"IText", left:40, top:530, text:"ACME CORP", fontSize:24, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"co" },
        { type:"IText", left:750, top:200, text:"A", fontSize:180, fontFamily:"Inter", fontWeight:"700", fill:"#374151", id:"lg" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#1f2937", id:"bg" },
        { type:"IText", left:525, top:260, text:"ACME CORP", fontSize:48, fontFamily:"Inter", fontWeight:"700", fill:"#6366f1", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:325, text:"Excellence in Every Detail", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#9ca3af", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },

  // 2. Clean White
  { id:"c2", title:"Clean Minimal", category:"Business", industry:"Business", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#ffffff" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:6, fill:"#111827", id:"bar" },
        { type:"IText", left:50, top:80, text:"SARAH CHEN", fontSize:52, fontFamily:"Inter", fontWeight:"700", fill:"#111827", id:"name" },
        { type:"IText", left:50, top:148, text:"Product Designer", fontSize:22, fontFamily:"Inter", fontWeight:"400", fill:"#6b7280", id:"role" },
        { type:"Rect", left:50, top:184, width:50, height:4, fill:"#111827", id:"ul" },
        { type:"IText", left:50, top:206, text:"sarah@studio.io", fontSize:18, fontFamily:"Inter", fill:"#374151", id:"email" },
        { type:"IText", left:50, top:236, text:"+1 (555) 123-4567", fontSize:18, fontFamily:"Inter", fill:"#374151", id:"phone" },
        { type:"IText", left:50, top:266, text:"studio.io", fontSize:18, fontFamily:"Inter", fill:"#374151", id:"web" },
        { type:"IText", left:50, top:530, text:"Studio.io", fontSize:30, fontFamily:"Inter", fontWeight:"700", fill:"#111827", id:"co" },
        { type:"Rect", left:640, top:50, width:360, height:500, fill:"#f9fafb", rx:12, ry:12, id:"box" },
        { type:"IText", left:780, top:230, text:"S", fontSize:120, fontFamily:"Inter", fontWeight:"800", fill:"#e5e7eb", id:"lg" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:6, fill:"#111827", id:"bar" },
        { type:"IText", left:525, top:268, text:"Studio.io", fontSize:54, fontFamily:"Inter", fontWeight:"700", fill:"#111827", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:336, text:"Design that speaks.", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#6b7280", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },

  // 3. Medical Blue
  { id:"c3", title:"Medical Clean", category:"Medical", industry:"Medical", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#ffffff" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:330, height:600, fill:"#0ea5e9", id:"lp" },
        { type:"IText", left:40, top:440, text:"Dr. Emily Ngo", fontSize:28, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"name-l" },
        { type:"IText", left:370, top:60, text:"DR. EMILY NGO", fontSize:40, fontFamily:"Inter", fontWeight:"700", fill:"#0c4a6e", id:"name" },
        { type:"IText", left:372, top:115, text:"MD — Cardiologist", fontSize:20, fontFamily:"Inter", fill:"#0ea5e9", id:"role" },
        { type:"Rect", left:372, top:150, width:250, height:2, fill:"#bae6fd", id:"div" },
        { type:"IText", left:372, top:168, text:"City Medical Center", fontSize:18, fontFamily:"Inter", fontWeight:"600", fill:"#374151", id:"org" },
        { type:"IText", left:372, top:200, text:"emily.ngo@citymed.org", fontSize:16, fontFamily:"Inter", fill:"#6b7280", id:"email" },
        { type:"IText", left:372, top:228, text:"+1 (555) 200-3000", fontSize:16, fontFamily:"Inter", fill:"#6b7280", id:"phone" },
        { type:"IText", left:372, top:256, text:"123 Health Ave, NY 10001", fontSize:15, fontFamily:"Inter", fill:"#9ca3af", id:"addr" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#0ea5e9", id:"bg" },
        { type:"IText", left:525, top:265, text:"City Medical Center", fontSize:36, fontFamily:"Inter", fontWeight:"600", fill:"#ffffff", textAlign:"center", originX:"center", id:"org" },
        { type:"IText", left:525, top:318, text:"Caring for your health", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#e0f2fe", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },

  // 4. Restaurant
  { id:"c4", title:"Restaurant Warm", category:"Restaurant", industry:"Restaurant", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#1c0a00" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#f59e0b", id:"t" },
        { type:"Rect", left:0, top:596, width:1050, height:4, fill:"#f59e0b", id:"b" },
        { type:"Rect", left:0, top:0, width:4, height:600, fill:"#f59e0b", id:"l" },
        { type:"Rect", left:1046, top:0, width:4, height:600, fill:"#f59e0b", id:"r" },
        { type:"IText", left:40, top:68, text:"La Bella Cucina", fontSize:54, fontFamily:"Georgia", fontStyle:"italic", fontWeight:"700", fill:"#f59e0b", id:"name" },
        { type:"IText", left:44, top:140, text:"Authentic Italian Cuisine", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#fde68a", id:"tag" },
        { type:"IText", left:44, top:185, text:"Marco Rossi — Head Chef", fontSize:18, fontFamily:"Inter", fontWeight:"600", fill:"#fef3c7", id:"chef" },
        { type:"IText", left:44, top:218, text:"marco@labella.com", fontSize:16, fontFamily:"Inter", fill:"#d97706", id:"email" },
        { type:"IText", left:44, top:246, text:"+1 (555) 700-8899", fontSize:16, fontFamily:"Inter", fill:"#d97706", id:"phone" },
        { type:"IText", left:44, top:274, text:"42 Via Roma, Little Italy, NY", fontSize:15, fontFamily:"Inter", fill:"#92400e", id:"addr" },
        { type:"IText", left:44, top:524, text:"Mon–Sun  12pm – 10pm", fontSize:15, fontFamily:"Inter", fill:"#f59e0b", id:"hours" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#f59e0b", id:"t" },
        { type:"Rect", left:0, top:596, width:1050, height:4, fill:"#f59e0b", id:"b" },
        { type:"IText", left:525, top:255, text:"La Bella Cucina", fontSize:62, fontFamily:"Georgia", fontStyle:"italic", fontWeight:"700", fill:"#f59e0b", textAlign:"center", originX:"center", id:"name" },
        { type:"IText", left:525, top:332, text:"Authentic Italian Cuisine", fontSize:22, fontFamily:"Inter", fontWeight:"300", fill:"#fde68a", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },

  // 5. Tech Neon
  { id:"c5", title:"Tech Neon", category:"IT", industry:"IT", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#0f172a" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:40, top:72, width:50, height:6, fill:"#06b6d4", rx:3, ry:3, id:"acc" },
        { type:"IText", left:40, top:96, text:"NINA TORRES", fontSize:52, fontFamily:"Inter", fontWeight:"800", fill:"#f0f9ff", id:"name" },
        { type:"IText", left:42, top:162, text:"Cloud Architect  /  DevOps", fontSize:22, fontFamily:"Inter", fontWeight:"300", fill:"#06b6d4", id:"role" },
        { type:"IText", left:42, top:218, text:"nina@cloudnine.dev", fontSize:18, fontFamily:"Inter", fill:"#94a3b8", id:"email" },
        { type:"IText", left:42, top:248, text:"+1 (415) 000-7777", fontSize:18, fontFamily:"Inter", fill:"#94a3b8", id:"phone" },
        { type:"IText", left:42, top:278, text:"cloudnine.dev", fontSize:18, fontFamily:"Inter", fill:"#06b6d4", id:"web" },
        { type:"IText", left:42, top:530, text:"CloudNine", fontSize:26, fontFamily:"Inter", fontWeight:"700", fill:"#06b6d4", id:"co" },
        { type:"Rect", left:700, top:160, width:260, height:260, fill:"#06b6d4", opacity:0.06, rx:20, ry:20, id:"box" },
        { type:"IText", left:724, top:198, text:"</>", fontSize:80, fontFamily:"Inter", fontWeight:"700", fill:"#06b6d4", opacity:0.3, id:"code" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#0f172a", id:"bg" },
        { type:"IText", left:525, top:262, text:"CloudNine", fontSize:54, fontFamily:"Inter", fontWeight:"800", fill:"#06b6d4", textAlign:"center", originX:"center", id:"co" },
        { type:"IText", left:525, top:332, text:"Cloud · DevOps · Infrastructure", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#94a3b8", textAlign:"center", originX:"center", id:"tag" },
      ]}}
    ]}
  },

];

export const TEMPLATE_CATEGORIES = [
  "All",
  ...Array.from(new Set(CARD_TEMPLATES.map((t) => t.category))),
];
