import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "@/store/editor";

if (!(fabric.FabricObject.customProperties as string[]).includes("id")) {
  (fabric.FabricObject.customProperties as string[]).push("id", "name");
}

export function FabricCanvas({ onReady }: { onReady?: (canvas: fabric.Canvas) => void }) {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const lastPageId = useRef<string | null>(null);
  const lastPageJson = useRef<string>("");

  const doc = useEditorStore((s) => s.doc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const markDirty = useEditorStore((s) => s.markDirty);
  const setSelected = useEditorStore((s) => s.setSelected);

  // ── 1. Mount ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return;
    const canvas = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
      enableRetinaScaling: false,
      width: 100,
      height: 100,
    });
    fabricRef.current = canvas;
    canvas.on("object:modified", markDirty);
    canvas.on("object:added", markDirty);
    canvas.on("object:removed", markDirty);
    canvas.on("selection:created", (e) =>
      setSelected(e.selected?.map((o: any) => o.get?.("id") ?? o.id ?? "") ?? [])
    );
    canvas.on("selection:updated", (e) =>
      setSelected(e.selected?.map((o: any) => o.get?.("id") ?? o.id ?? "") ?? [])
    );
    canvas.on("selection:cleared", () => setSelected([]));
    onReady?.(canvas);
    return () => {
      try { canvas.dispose(); } catch (_) {}
      fabricRef.current = null;
      lastPageId.current = null;
      lastPageJson.current = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. Auto-fit zoom when container resizes ──────────────────────────────
  useEffect(() => {
    if (!wrapperRef.current || !doc) return;
    const el = wrapperRef.current;

    const fit = () => {
      // Observe the PARENT (position:relative container), not the scrollable wrapper
      const parent = el.parentElement;
      const aw = (parent?.clientWidth  ?? el.clientWidth)  - 80;
      const ah = (parent?.clientHeight ?? el.clientHeight) - 80;
      if (aw <= 0 || ah <= 0) return;
      const fz = Math.max(0.15, Math.min(aw / doc.canvas.width, ah / doc.canvas.height, 1));
      setZoom(parseFloat(fz.toFixed(2)));
    };

    // Run immediately and watch for layout changes
    fit();
    const parent = el.parentElement;
    const target = parent ?? el;
    const ro = new ResizeObserver(fit);
    ro.observe(target);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.canvas.width, doc?.canvas.height]);

  // ── 3. Apply zoom: resize canvas element + setZoom ────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    const w = doc.canvas.width * zoom;
    const h = doc.canvas.height * zoom;
    c.setDimensions({ width: w, height: h });
    c.setZoom(zoom);
    applyBg(c, doc.canvas.background || "");
    c.requestRenderAll();
  }, [zoom, doc?.canvas.width, doc?.canvas.height]);

  // ── 4. Background change (no resize needed) ───────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    applyBg(c, doc.canvas.background || "");
    c.requestRenderAll();
  }, [doc?.canvas.background]);

  // ── 5. Clear on doc reset ─────────────────────────────────────────────────
  useEffect(() => {
    if (doc !== null) return;
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.requestRenderAll();
    lastPageId.current = null;
    lastPageJson.current = "";
  }, [doc]);

  // ── 6. Load page ──────────────────────────────────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc || !activePageId) return;
    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page) return;
    const jsonStr = JSON.stringify(page.fabric);
    if (lastPageId.current === activePageId && lastPageJson.current === jsonStr) return;
    lastPageId.current = activePageId;
    lastPageJson.current = jsonStr;
    const json = page.fabric as Record<string, unknown>;
    const bg = doc.canvas.background || "";
    const doLoad = () => {
      c.clear();
      applyBg(c, bg);
      if (!json || !Array.isArray(json.objects) || !(json.objects as any[]).length) {
        c.requestRenderAll();
        return;
      }
      const result = c.loadFromJSON(json);
      const finish = () => { applyBg(c, bg); c.requestRenderAll(); };
      if (result && typeof (result as any).then === "function") {
        (result as any).then(finish).catch(finish);
      } else {
        finish();
      }
    };
    const t = setTimeout(doLoad, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId]);

  if (!doc) return null;

  const scaledW = doc.canvas.width * zoom;
  const scaledH = doc.canvas.height * zoom;

  return (
    /*
     * The wrapper fills the parent absolutely so ResizeObserver
     * gets real dimensions immediately. overflow:auto shows scrollbars
     * if the canvas is bigger than the available space.
     */
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "auto",
        backgroundColor: "hsl(var(--muted) / 0.4)",
      }}
    >
      {/*
       * This div must be at LEAST as wide and tall as the scaled canvas + padding.
       * When it's SMALLER than the wrapper, flexbox centers it.
       * When it's LARGER, the wrapper scrolls.
       */}
      <div
        style={{
          minWidth: scaledW + 80,
          minHeight: scaledH + 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          boxSizing: "border-box",
        }}
      >
        {/* Shadow box sized exactly to the scaled canvas */}
        <div
          style={{
            width: scaledW,
            height: scaledH,
            flexShrink: 0,
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 4px 32px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)",
            outline: "1px solid rgba(128,128,128,0.15)",
            lineHeight: 0,
          }}
        >
          <canvas ref={canvasElRef} style={{ display: "block" }} />
        </div>
      </div>
    </div>
  );
}

function applyBg(c: fabric.Canvas, bg: string) {
  try {
    const isSimple = !bg || /^(#|rgb|hsl|transparent)/i.test(bg);
    c.backgroundColor = isSimple ? (bg || "#ffffff") : "#ffffff";
    c.requestRenderAll();
  } catch (_) {}
}
