import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "@/store/editor";

if (!(fabric.FabricObject.customProperties as string[]).includes("id")) {
  (fabric.FabricObject.customProperties as string[]).push("id", "name");
}

/** Apply zoom from top-left corner (0,0) — no pan offset */
function applyZoom(c: fabric.Canvas, z: number) {
  c.zoomToPoint(new fabric.Point(0, 0), z);
}

export function FabricCanvas({ onReady }: { onReady?: (canvas: fabric.Canvas) => void }) {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef   = useRef<fabric.Canvas | null>(null);
  const lastPageId  = useRef<string | null>(null);
  const lastPageJson = useRef<string>("");

  const doc          = useEditorStore((s) => s.doc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const designKey    = useEditorStore((s) => s.designKey);
  const zoom         = useEditorStore((s) => s.zoom);
  const markDirty    = useEditorStore((s) => s.markDirty);
  const setSelected  = useEditorStore((s) => s.setSelected);

  // ── 1. Mount ──────────────────────────────────────────────────────────────
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

  // ── 2. Apply zoom + resize ────────────────────────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    const w = doc.canvas.width;
    const h = doc.canvas.height;
    // Resize canvas element to scaled size
    c.setDimensions({ width: w * zoom, height: h * zoom });
    // Zoom from top-left (0,0) — this correctly scales ALL object positions
    applyZoom(c, zoom);
    setBg(c, doc.canvas.background || "");
    c.requestRenderAll();
  }, [zoom, doc?.canvas.width, doc?.canvas.height, doc?.canvas.background]);

  // ── 3. Clear on reset ─────────────────────────────────────────────────────
  useEffect(() => {
    if (doc !== null) return;
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.setDimensions({ width: 100, height: 100 });
    applyZoom(c, 1);
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
    const z    = useEditorStore.getState().zoom;
    const w    = doc.canvas.width;
    const h    = doc.canvas.height;

    const load = () => {
      // 1. Set native size first (no zoom yet)
      c.setDimensions({ width: w, height: h });
      applyZoom(c, 1); // identity
      c.clear();
      setBg(c, bg);

      if (!json || !Array.isArray(json.objects) || !(json.objects as any[]).length) {
        // 2. Apply zoom after clearing
        c.setDimensions({ width: w * z, height: h * z });
        applyZoom(c, z);
        c.requestRenderAll();
        return;
      }

      // 3. Load objects at NATIVE coordinates (zoom=1)
      const loadJson: Record<string, unknown> = { ...json };
      delete (loadJson as any).viewportTransform;

      const result = c.loadFromJSON(loadJson);
      const done = () => {
        setBg(c, bg);
        // 4. NOW apply zoom — objects are at native coords, zoom scales them correctly
        c.setDimensions({ width: w * z, height: h * z });
        applyZoom(c, z);
        c.requestRenderAll();
      };

      if (result && typeof (result as any).then === "function") {
        (result as any).then(done).catch(done);
      } else {
        done();
      }
    };

    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId, designKey]);

  if (!doc) {
    return <div style={{ display: "none" }}><canvas ref={canvasElRef} /></div>;
  }

  const scaledW = doc.canvas.width  * zoom;
  const scaledH = doc.canvas.height * zoom;

  return (
    <div style={{
      width: scaledW,
      height: scaledH,
      flexShrink: 0,
      flexGrow: 0,
      lineHeight: 0,
      overflow: "hidden",
      borderRadius: 6,
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    }}>
      <canvas ref={canvasElRef} style={{ display: "block" }} />
    </div>
  );
}

function setBg(c: fabric.Canvas, bg: string) {
  try {
    c.backgroundColor = /^(#|rgb|hsl|transparent)/i.test(bg) ? (bg || "#ffffff") : "#ffffff";
    c.requestRenderAll();
  } catch (_) {}
}
