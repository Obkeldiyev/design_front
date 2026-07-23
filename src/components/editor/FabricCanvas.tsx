import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "@/store/editor";

if (!(fabric.FabricObject.customProperties as string[]).includes("id")) {
  (fabric.FabricObject.customProperties as string[]).push("id", "name");
}

export function FabricCanvas({ onReady }: { onReady?: (canvas: fabric.Canvas) => void }) {
  const canvasElRef  = useRef<HTMLCanvasElement>(null);
  const fabricRef    = useRef<fabric.Canvas | null>(null);
  const lastPageId   = useRef<string | null>(null);
  const lastPageJson = useRef<string>("");

  const doc          = useEditorStore((s) => s.doc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const designKey    = useEditorStore((s) => s.designKey);
  const zoom         = useEditorStore((s) => s.zoom);
  const markDirty    = useEditorStore((s) => s.markDirty);
  const setSelected  = useEditorStore((s) => s.setSelected);

  // ── 1. Mount Fabric at NATIVE size (no zoom) ──────────────────────────────
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

  // ── 2. Update canvas native size when doc dimensions change ───────────────
  // Canvas always renders at NATIVE size (1050×600).
  // Visual scaling is done via CSS transform on the wrapper div.
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    // Set canvas to native (unscaled) dimensions
    c.setDimensions({ width: doc.canvas.width, height: doc.canvas.height });
    // Reset viewport to identity — no zoom, no pan
    c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    setBg(c, doc.canvas.background || "");
    c.requestRenderAll();
  }, [doc?.canvas.width, doc?.canvas.height, doc?.canvas.background]);

  // ── 3. Clear on doc reset ────────────────────────────────────────────────
  useEffect(() => {
    if (doc !== null) return;
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.setDimensions({ width: 100, height: 100 });
    c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    c.requestRenderAll();
    lastPageId.current = null;
    lastPageJson.current = "";
  }, [doc]);

  // ── 4. Load page ──────────────────────────────────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc || !activePageId) return;
    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page) return;
    lastPageId.current   = activePageId;
    lastPageJson.current = JSON.stringify(page.fabric);
    const json = page.fabric as Record<string, unknown>;
    const bg   = doc.canvas.background || "";
    const load = () => {
      c.clear();
      // Always reset to identity viewport before loading
      c.setViewportTransform([1, 0, 0, 1, 0, 0]);
      setBg(c, bg);
      if (!json || !Array.isArray(json.objects) || !(json.objects as any[]).length) {
        c.requestRenderAll();
        return;
      }
      // Strip any saved viewport from the JSON
      const cleanJson = { ...json, viewportTransform: [1, 0, 0, 1, 0, 0] };
      const r    = c.loadFromJSON(cleanJson);
      const done = () => {
        setBg(c, bg);
        // Ensure viewport is identity after load
        c.setViewportTransform([1, 0, 0, 1, 0, 0]);
        c.requestRenderAll();
      };
      if (r && typeof (r as any).then === "function") (r as any).then(done).catch(done);
      else done();
    };
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId, designKey]);

  if (!doc) {
    return <div style={{ display: "none" }}><canvas ref={canvasElRef} /></div>;
  }

  // ── CSS transform scaling ─────────────────────────────────────────────────
  // The Fabric canvas renders at NATIVE size (1050×600).
  // We scale it visually via CSS transform. This avoids all Fabric zoom bugs.
  const nativeW = doc.canvas.width;
  const nativeH = doc.canvas.height;
  const scaledW = nativeW * zoom;
  const scaledH = nativeH * zoom;

  return (
    // Outer div is sized to the SCALED dimensions — this is what the layout sees
    <div style={{
      width: scaledW,
      height: scaledH,
      flexShrink: 0,
      flexGrow: 0,
      position: "relative",
      borderRadius: 6,
      overflow: "hidden",
      boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
    }}>
      {/* Inner div transforms the native-size canvas to fit the scaled box */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        transformOrigin: "top left",
        transform: `scale(${zoom})`,
        // Pointer events still work because we just scale the visual
      }}>
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
