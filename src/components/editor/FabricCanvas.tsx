/**
 * FabricCanvas — renders at NATIVE size, scales via CSS transform.
 * No Fabric zoom/viewport manipulation — completely avoids those bugs.
 */
import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "@/store/editor";

if (!(fabric.FabricObject.customProperties as string[]).includes("id")) {
  (fabric.FabricObject.customProperties as string[]).push("id", "name");
}

export function FabricCanvas({ onReady }: { onReady?: (canvas: fabric.Canvas) => void }) {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef   = useRef<fabric.Canvas | null>(null);

  const doc          = useEditorStore((s) => s.doc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const designKey    = useEditorStore((s) => s.designKey);
  const zoom         = useEditorStore((s) => s.zoom);
  const markDirty    = useEditorStore((s) => s.markDirty);
  const setSelected  = useEditorStore((s) => s.setSelected);

  // Mount once
  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return;
    const c = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
      enableRetinaScaling: false,
      width: 1050,
      height: 600,
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync native size + background
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    c.setDimensions({ width: doc.canvas.width, height: doc.canvas.height });
    c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    setBg(c, doc.canvas.background || "");
    c.requestRenderAll();
  }, [doc?.canvas.width, doc?.canvas.height, doc?.canvas.background]);

  // Clear on reset
  useEffect(() => {
    if (doc !== null) return;
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.setDimensions({ width: 1050, height: 600 });
    c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    c.requestRenderAll();
  }, [doc]);

  // Load page
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc || !activePageId) return;
    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page) return;
    const json = page.fabric as Record<string, unknown>;
    const bg   = doc.canvas.background || "";
    const w    = doc.canvas.width;
    const h    = doc.canvas.height;
    const load = () => {
      c.setDimensions({ width: w, height: h });
      c.setViewportTransform([1, 0, 0, 1, 0, 0]);
      c.clear();
      setBg(c, bg);
      const objects = (json?.objects as unknown[]) ?? [];
      if (!Array.isArray(objects) || objects.length === 0) {
        c.requestRenderAll();
        return;
      }
      const loadJson = { ...json } as any;
      delete loadJson.viewportTransform;
      const result = c.loadFromJSON(loadJson);
      const done = () => {
        setBg(c, bg);
        c.setViewportTransform([1, 0, 0, 1, 0, 0]);
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

  const nativeW = doc.canvas.width;
  const nativeH = doc.canvas.height;
  const radius  = (doc.canvas.borderRadius ?? 0) * zoom;

  return (
    <div style={{
      position: "relative",
      width: nativeW * zoom,
      height: nativeH * zoom,
      flexShrink: 0,
      flexGrow: 0,
      borderRadius: radius,
      overflow: "hidden",
      boxShadow: "0 4px 32px rgba(0,0,0,0.45)",
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: nativeW,
        height: nativeH,
        transformOrigin: "top left",
        transform: `scale(${zoom})`,
        lineHeight: 0,
      }}>
        <canvas ref={canvasElRef} style={{ display: "block" }} />
      </div>
    </div>
  );
}

function setBg(c: fabric.Canvas, bg: string) {
  try {
    c.backgroundColor = bg && /^(#|rgb|hsl|transparent)/i.test(bg) ? bg : "#ffffff";
    c.requestRenderAll();
  } catch (_) {}
}
