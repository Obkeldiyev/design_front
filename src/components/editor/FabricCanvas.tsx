/**
 * FabricCanvas — renders at native size, scales via CSS transform.
 * This completely avoids Fabric zoom/viewport bugs.
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
  const lastPageId  = useRef<string | null>(null);
  const lastJson    = useRef<string>("");

  const doc          = useEditorStore((s) => s.doc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const designKey    = useEditorStore((s) => s.designKey);
  const zoom         = useEditorStore((s) => s.zoom);
  const markDirty    = useEditorStore((s) => s.markDirty);
  const setSelected  = useEditorStore((s) => s.setSelected);

  // ── Mount Fabric at NATIVE size, NO zoom ─────────────────────────────────
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
      lastPageId.current = null;
      lastJson.current = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Resize canvas when doc dimensions change ──────────────────────────────
  // Canvas stays at NATIVE size — no Fabric zoom applied
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    c.setDimensions({ width: doc.canvas.width, height: doc.canvas.height });
    c.setViewportTransform([1, 0, 0, 1, 0, 0]); // identity — no zoom
    setBg(c, doc.canvas.background || "");
    c.requestRenderAll();
  }, [doc?.canvas.width, doc?.canvas.height, doc?.canvas.background]);

  // ── Clear when doc resets ─────────────────────────────────────────────────
  useEffect(() => {
    if (doc !== null) return;
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.setDimensions({ width: 1050, height: 600 });
    c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    c.requestRenderAll();
    lastPageId.current = null;
    lastJson.current = "";
  }, [doc]);

  // ── Load page at native coordinates ──────────────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc || !activePageId) return;
    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page) return;
    lastPageId.current = activePageId;
    lastJson.current   = JSON.stringify(page.fabric);

    const json = page.fabric as Record<string, unknown>;
    const bg   = doc.canvas.background || "";
    const w    = doc.canvas.width;
    const h    = doc.canvas.height;

    const load = () => {
      // Always native size, identity viewport
      c.setDimensions({ width: w, height: h });
      c.setViewportTransform([1, 0, 0, 1, 0, 0]);
      c.clear();
      setBg(c, bg);

      if (!json || !Array.isArray(json.objects) || !(json.objects as any[]).length) {
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

  if (!doc) return <div style={{ display: "none" }}><canvas ref={canvasElRef} /></div>;

  const nativeW = doc.canvas.width;
  const nativeH = doc.canvas.height;
  const radius  = (doc.canvas.borderRadius ?? 0);

  // ── CSS transform scaling — no Fabric zoom bugs ───────────────────────────
  // The canvas renders at native 1050×600.
  // We scale it DOWN visually using CSS transform: scale(zoom).
  // The outer div is sized to the SCALED dimensions so layout is correct.
  return (
    <div style={{
      width: nativeW * zoom,
      height: nativeH * zoom,
      flexShrink: 0,
      flexGrow: 0,
      position: "relative",
      borderRadius: radius * zoom,
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    }}>
      {/* This div scales the native canvas to fit the outer box */}
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
    c.backgroundColor = /^(#|rgb|hsl|transparent)/i.test(bg) ? (bg || "#ffffff") : "#ffffff";
    c.requestRenderAll();
  } catch (_) {}
}
