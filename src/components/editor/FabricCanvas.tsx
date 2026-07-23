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

  // ── 2. Zoom ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    c.setDimensions({ width: doc.canvas.width * zoom, height: doc.canvas.height * zoom });
    c.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
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
    const z    = useEditorStore.getState().zoom;
    const w    = doc.canvas.width;
    const h    = doc.canvas.height;

    const load = () => {
      // Step 1: set correct dimensions
      c.setDimensions({ width: w * z, height: h * z });

      // Step 2: FORCE viewport BEFORE and AFTER clear — Fabric must not pan
      c.setViewportTransform([z, 0, 0, z, 0, 0]);
      c.clear();
      c.setViewportTransform([z, 0, 0, z, 0, 0]);
      setBg(c, bg);

      if (!json || !Array.isArray(json.objects) || !(json.objects as any[]).length) {
        c.requestRenderAll();
        return;
      }

      // Step 3: strip viewportTransform from saved JSON
      const safeJson = { objects: (json.objects as any[]), background: bg };

      const afterLoad = () => {
        setBg(c, bg);
        // Step 4: force viewport again after load — this is the critical call
        c.setViewportTransform([z, 0, 0, z, 0, 0]);
        c.requestRenderAll();
        // Step 5: one more time after next paint to catch any late reset
        requestAnimationFrame(() => {
          if (!fabricRef.current) return;
          fabricRef.current.setViewportTransform([z, 0, 0, z, 0, 0]);
          fabricRef.current.requestRenderAll();
        });
      };

      const result = c.loadFromJSON(safeJson);
      if (result && typeof (result as any).then === "function") {
        (result as any).then(afterLoad).catch(afterLoad);
      } else {
        afterLoad();
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
      borderRadius: 6,
      overflow: "hidden",
      boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
      lineHeight: 0,
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
