/**
 * Card templates. Canvas: 1050×600px.
 * All objects are within bounds and fill the canvas properly.
 */
import type { CanvasDoc } from "@/lib/api/types";

export type CardTemplate = {
  id: string; title: string; category: string; industry: string;
  isPremium: boolean; width: number; height: number; doc: CanvasDoc;
};

const F = "page-front";
const B = "page-back";

export const CARD_TEMPLATES: CardTemplate[] = [

  // ── 1. Dark Executive ────────────────────────────────────────────────────
  { id:"t1", title:"Dark Executive", category:"Business", industry:"Business", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#111827" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:6, height:600, fill:"#6366f1", id:"a1" },
        { type:"Rect", left:680, top:0, width:370, height:600, fill:"#1f2937", id:"a2" },
        { type:"IText", left:40, top:70, text:"ALEX MORGAN", fontSize:50, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"a3" },
        { type:"IText", left:42, top:135, text:"Chief Executive Officer", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#6366f1", id:"a4" },
        { type:"Rect", left:42, top:170, width:280, height:1, fill:"#374151", id:"a5" },
        { type:"IText", left:42, top:188, text:"alex@acme.com", fontSize:17, fontFamily:"Inter", fill:"#9ca3af", id:"a6" },
        { type:"IText", left:42, top:215, text:"+1 (555) 000-1234", fontSize:17, fontFamily:"Inter", fill:"#9ca3af", id:"a7" },
        { type:"IText", left:42, top:242, text:"www.acme.com", fontSize:17, fontFamily:"Inter", fill:"#9ca3af", id:"a8" },
        { type:"IText", left:42, top:510, text:"ACME CORP", fontSize:22, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"a9" },
        { type:"IText", left:750, top:200, text:"A", fontSize:160, fontFamily:"Inter", fontWeight:"700", fill:"#374151", id:"a10" },
        { type:"IText", left:762, top:222, text:"A", fontSize:118, fontFamily:"Inter", fontWeight:"700", fill:"#6366f1", id:"a11" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#1f2937", id:"b1" },
        { type:"IText", left:525, top:255, text:"ACME CORP", fontSize:46, fontFamily:"Inter", fontWeight:"700", fill:"#6366f1", textAlign:"center", originX:"center", id:"b2" },
        { type:"IText", left:525, top:315, text:"Excellence in Every Detail", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#9ca3af", textAlign:"center", originX:"center", id:"b3" },
      ]}}
    ]}
  },

  // ── 2. Clean White ───────────────────────────────────────────────────────
  { id:"t2", title:"Clean Minimal", category:"Business", industry:"Business", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#ffffff" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#111827", id:"a1" },
        { type:"Rect", left:0, top:596, width:1050, height:4, fill:"#111827", id:"a2" },
        { type:"IText", left:50, top:70, text:"SARAH CHEN", fontSize:48, fontFamily:"Inter", fontWeight:"700", fill:"#111827", id:"a3" },
        { type:"IText", left:52, top:132, text:"Product Designer", fontSize:21, fontFamily:"Inter", fontWeight:"400", fill:"#6b7280", id:"a4" },
        { type:"Rect", left:52, top:168, width:42, height:3, fill:"#111827", id:"a5" },
        { type:"IText", left:52, top:188, text:"sarah@studio.io", fontSize:17, fontFamily:"Inter", fill:"#374151", id:"a6" },
        { type:"IText", left:52, top:214, text:"+1 (555) 123-4567", fontSize:17, fontFamily:"Inter", fill:"#374151", id:"a7" },
        { type:"IText", left:52, top:240, text:"studio.io", fontSize:17, fontFamily:"Inter", fill:"#374151", id:"a8" },
        { type:"IText", left:52, top:512, text:"Studio.io", fontSize:28, fontFamily:"Inter", fontWeight:"700", fill:"#111827", id:"a9" },
        { type:"Rect", left:630, top:40, width:360, height:520, fill:"#f9fafb", rx:14, ry:14, id:"a10" },
        { type:"IText", left:768, top:210, text:"S", fontSize:130, fontFamily:"Inter", fontWeight:"800", fill:"#e5e7eb", id:"a11" },
        { type:"IText", left:776, top:218, text:"S", fontSize:110, fontFamily:"Inter", fontWeight:"800", fill:"#111827", id:"a12" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:4, fill:"#111827", id:"b1" },
        { type:"IText", left:525, top:258, text:"Studio.io", fontSize:52, fontFamily:"Inter", fontWeight:"700", fill:"#111827", textAlign:"center", originX:"center", id:"b2" },
        { type:"IText", left:525, top:322, text:"Design that speaks", fontSize:19, fontFamily:"Inter", fontWeight:"300", fill:"#6b7280", textAlign:"center", originX:"center", id:"b3" },
      ]}}
    ]}
  },

  // ── 3. Purple Gradient ───────────────────────────────────────────────────
  { id:"t3", title:"Gradient Purple", category:"Creative", industry:"IT", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#4f46e5" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#7c3aed", opacity:0.5, id:"a1" },
        { type:"IText", left:50, top:72, text:"JAMES PARK", fontSize:52, fontFamily:"Inter", fontWeight:"800", fill:"#ffffff", id:"a2" },
        { type:"IText", left:52, top:140, text:"Full-Stack Developer", fontSize:21, fontFamily:"Inter", fontWeight:"300", fill:"#c4b5fd", id:"a3" },
        { type:"Rect", left:52, top:176, width:300, height:1, fill:"#6d28d9", id:"a4" },
        { type:"IText", left:52, top:194, text:"james@devcraft.io", fontSize:17, fontFamily:"Inter", fill:"#e0e7ff", id:"a5" },
        { type:"IText", left:52, top:220, text:"+82 10-0000-1234", fontSize:17, fontFamily:"Inter", fill:"#e0e7ff", id:"a6" },
        { type:"IText", left:52, top:246, text:"devcraft.io", fontSize:17, fontFamily:"Inter", fill:"#e0e7ff", id:"a7" },
        { type:"IText", left:52, top:516, text:"DevCraft", fontSize:24, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"a8" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#4f46e5", id:"b1" },
        { type:"IText", left:525, top:258, text:"DevCraft", fontSize:54, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", textAlign:"center", originX:"center", id:"b2" },
        { type:"IText", left:525, top:324, text:"Building the future", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#c4b5fd", textAlign:"center", originX:"center", id:"b3" },
      ]}}
    ]}
  },

  // ── 4. Medical Blue ──────────────────────────────────────────────────────
  { id:"t4", title:"Medical Clean", category:"Medical", industry:"Medical", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#ffffff" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:320, height:600, fill:"#0ea5e9", id:"a1" },
        { type:"IText", left:28, top:50, text:"+", fontSize:180, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", opacity:0.1, id:"a2" },
        { type:"IText", left:36, top:435, text:"Dr.\nEmily Ngo", fontSize:26, fontFamily:"Inter", fontWeight:"700", fill:"#ffffff", id:"a3" },
        { type:"IText", left:356, top:58, text:"DR. EMILY NGO", fontSize:36, fontFamily:"Inter", fontWeight:"700", fill:"#0c4a6e", id:"a4" },
        { type:"IText", left:358, top:106, text:"MD — Cardiologist", fontSize:18, fontFamily:"Inter", fill:"#0ea5e9", id:"a5" },
        { type:"Rect", left:358, top:140, width:240, height:2, fill:"#bae6fd", id:"a6" },
        { type:"IText", left:358, top:158, text:"City Medical Center", fontSize:17, fontFamily:"Inter", fontWeight:"600", fill:"#374151", id:"a7" },
        { type:"IText", left:358, top:188, text:"emily.ngo@citymed.org", fontSize:15, fontFamily:"Inter", fill:"#6b7280", id:"a8" },
        { type:"IText", left:358, top:214, text:"+1 (555) 200-3000", fontSize:15, fontFamily:"Inter", fill:"#6b7280", id:"a9" },
        { type:"IText", left:358, top:240, text:"123 Health Ave, NY 10001", fontSize:14, fontFamily:"Inter", fill:"#9ca3af", id:"a10" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:600, fill:"#0ea5e9", id:"b1" },
        { type:"IText", left:525, top:258, text:"City Medical Center", fontSize:34, fontFamily:"Inter", fontWeight:"600", fill:"#ffffff", textAlign:"center", originX:"center", id:"b2" },
        { type:"IText", left:525, top:308, text:"Caring for your heart", fontSize:19, fontFamily:"Inter", fontWeight:"300", fill:"#e0f2fe", textAlign:"center", originX:"center", id:"b3" },
      ]}}
    ]}
  },

  // ── 5. Restaurant Warm ───────────────────────────────────────────────────
  { id:"t5", title:"Restaurant", category:"Restaurant", industry:"Restaurant", isPremium:false, width:1050, height:600,
    doc:{ version:1, canvas:{ width:1050, height:600, background:"#1c0a00" }, pages:[
      { id:F, name:"Front", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:3, fill:"#f59e0b", id:"a1" },
        { type:"Rect", left:0, top:597, width:1050, height:3, fill:"#f59e0b", id:"a2" },
        { type:"Rect", left:0, top:0, width:3, height:600, fill:"#f59e0b", id:"a3" },
        { type:"Rect", left:1047, top:0, width:3, height:600, fill:"#f59e0b", id:"a4" },
        { type:"IText", left:40, top:58, text:"La Bella Cucina", fontSize:52, fontFamily:"Georgia", fontStyle:"italic", fontWeight:"700", fill:"#f59e0b", id:"a5" },
        { type:"IText", left:46, top:126, text:"Authentic Italian Cuisine", fontSize:18, fontFamily:"Inter", fontWeight:"300", fill:"#fde68a", id:"a6" },
        { type:"Rect", left:46, top:162, width:200, height:1, fill:"#f59e0b", opacity:0.5, id:"a7" },
        { type:"IText", left:46, top:180, text:"Marco Rossi — Head Chef", fontSize:17, fontFamily:"Inter", fontWeight:"600", fill:"#fef3c7", id:"a8" },
        { type:"IText", left:46, top:210, text:"marco@labella.com", fontSize:15, fontFamily:"Inter", fill:"#d97706", id:"a9" },
        { type:"IText", left:46, top:235, text:"+1 (555) 700-8899", fontSize:15, fontFamily:"Inter", fill:"#d97706", id:"a10" },
        { type:"IText", left:46, top:260, text:"42 Via Roma, Little Italy, NY", fontSize:14, fontFamily:"Inter", fill:"#92400e", id:"a11" },
        { type:"IText", left:46, top:512, text:"Mon–Sun  12pm – 10pm", fontSize:14, fontFamily:"Inter", fill:"#f59e0b", id:"a12" },
      ]}},
      { id:B, name:"Back", fabric:{ version:"6.0.0", objects:[
        { type:"Rect", left:0, top:0, width:1050, height:3, fill:"#f59e0b", id:"b1" },
        { type:"Rect", left:0, top:597, width:1050, height:3, fill:"#f59e0b", id:"b2" },
        { type:"IText", left:525, top:248, text:"La Bella Cucina", fontSize:60, fontFamily:"Georgia", fontStyle:"italic", fontWeight:"700", fill:"#f59e0b", textAlign:"center", originX:"center", id:"b3" },
        { type:"IText", left:525, top:322, text:"Authentic Italian Cuisine", fontSize:20, fontFamily:"Inter", fontWeight:"300", fill:"#fde68a", textAlign:"center", originX:"center", id:"b4" },
      ]}}
    ]}
  },

];

export const TEMPLATE_CATEGORIES = [
  "All",
  ...Array.from(new Set(CARD_TEMPLATES.map((t) => t.category))),
];
