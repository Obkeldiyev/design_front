import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "@/store/editor";

if (!(fabric.FabricObject.customProperties as string[]).includes("id")) {
  (fabric.FabricObject.customProperties as string[]).push("id", "name");
}

export function FabricCanvas({ onReady }: { onReady?: (canvas: fabric.Canvas) => void }) {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef   = useRef<fabric.Canvas | null>(null);
  const lastPageId  = useRef<string | null>(null);
  const lastPageJson = useRef<string>("");

  const doc          = useEditorStore((s) => s.doc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const zoom         = useEditorStore((s) => s.zoom);
  const markDirty    = useEditorStore((s) => s.markDirty);
  const setSelected  = useEditorStore((s) => s.setSelected);

  // ── 1. Mount Fabric once ─────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return;
    const c = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
      enableRetinaScaling: false,
      width: 100,
      height: 100,
    });
    fabricRef.current = c;
    c.on("object:modified", markDirty);
    c.on("object:added",    markDirty);
    c.on("object:removed",  markDirty);
    c.on("selection:created", (e) => setSelected(e.selected?.map((o: any) => o.get?.("id") ?? o.id ?? "") ?? []));
    c.on("selection:updated", (e) => setSelected(e.selected?.map((o: any) => o.get?.("id") ?? o.id ?? "") ?? []));
    c.on("selection:cleared", () => setSelected([]));
    onReady?.(c);
    return () => {
      try { c.dispose(); } catch (_) {}
      fabricRef.current = null;
      lastPageId.current = null;
      lastPageJson.current = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. Zoom + resize canvas element ─────────────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    c.setDimensions({ width: doc.canvas.width * zoom, height: doc.canvas.height * zoom });
    c.setZoom(zoom);
    setBg(c, doc.canvas.background || "");
    c.requestRenderAll();
  }, [zoom, doc?.canvas.width, doc?.canvas.height, doc?.canvas.background]);

  // ── 3. Clear on doc reset ────────────────────────────────────────────────
  useEffect(() => {
    if (doc !== null) return;
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.requestRenderAll();
    lastPageId.current = null;
    lastPageJson.current = "";
  }, [doc]);

  // ── 4. Load page JSON ────────────────────────────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc || !activePageId) return;
    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page) return;
    const jsonStr = JSON.stringify(page.fabric);
    if (lastPageId.current === activePageId && lastPageJson.current === jsonStr) return;
    lastPageId.current  = activePageId;
    lastPageJson.current = jsonStr;
    const json = page.fabric as Record<string, unknown>;
    const bg   = doc.canvas.background || "";
    const load = () => {
      c.clear();
      setBg(c, bg);
      if (!json || !Array.isArray(json.objects) || !(json.objects as any[]).length) {
        c.requestRenderAll();
        return;
      }
      const r    = c.loadFromJSON(json);
      const done = () => { setBg(c, bg); c.requestRenderAll(); };
      if (r && typeof (r as any).then === "function") (r as any).then(done).catch(done);
      else done();
    };
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId]);

  if (!doc) return null;

  const scaledW = doc.canvas.width  * zoom;
  const scaledH = doc.canvas.height * zoom;

  // Correct centering pattern for overflow:auto containers:
  // - Outer div: full scroll area, display:flex, min-width/height ensures scroll space
  // - Canvas box: margin:auto centers it when smaller; scroll appears when larger
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // These ensure the flex container is at least as large as the canvas
        // so the canvas never gets clipped — scroll kicks in instead
        minWidth: scaledW + 80,
        minHeight: scaledH + 80,
        boxSizing: "border-box",
        padding: 40,
      }}
    >
      <div
        style={{
          width: scaledW,
          height: scaledH,
          flexShrink: 0,
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          outline: "1px solid rgba(128,128,128,0.15)",
          lineHeight: 0,
        }}
      >
        <canvas ref={canvasElRef} style={{ display: "block" }} />
      </div>
    </div>
  );
}

function setBg(c: fabric.Canvas, bg: string) {
  try {
    c.backgroundColor = /^(#|rgb|hsl|transparent)/i.test(bg) ? (bg || "#ffffff") : "#ffffff";
    c.requestRenderAll();
  } catch (_) {}
}
