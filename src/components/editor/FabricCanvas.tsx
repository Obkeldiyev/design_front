import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "@/store/editor";

// Register 'id' and 'name' as custom properties so Fabric always
// serialises and deserialises them automatically (Fabric v7+).
if (!(fabric.FabricObject.customProperties as string[]).includes("id")) {
  (fabric.FabricObject.customProperties as string[]).push("id", "name");
}

export function FabricCanvas({
  onReady,
}: {
  onReady?: (canvas: fabric.Canvas) => void;
}) {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const lastLoadedPageId = useRef<string | null>(null);
  const lastLoadedPageJson = useRef<string>("");

  const doc = useEditorStore((s) => s.doc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const zoom = useEditorStore((s) => s.zoom);
  const markDirty = useEditorStore((s) => s.markDirty);
  const setSelected = useEditorStore((s) => s.setSelected);

  // ── 1. Mount Fabric canvas once at native resolution ──────────────────────
  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return;
    const canvas = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
      enableRetinaScaling: false,
    });
    fabricRef.current = canvas;

    canvas.on("object:modified", markDirty);
    canvas.on("object:added", markDirty);
    canvas.on("object:removed", markDirty);
    canvas.on("selection:created", (e) =>
      setSelected(e.selected?.map((o: any) => (o.get ? o.get("id") : o.id) ?? "") ?? [])
    );
    canvas.on("selection:updated", (e) =>
      setSelected(e.selected?.map((o: any) => (o.get ? o.get("id") : o.id) ?? "") ?? [])
    );
    canvas.on("selection:cleared", () => setSelected([]));

    onReady?.(canvas);

    return () => {
      try { canvas.dispose(); } catch (_) {}
      fabricRef.current = null;
      lastLoadedPageId.current = null;
      lastLoadedPageJson.current = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. Sync canvas native size to doc dimensions ──────────────────────────
  // The canvas always renders at native (unscaled) size.
  // Visual scaling is done via CSS transform in the JSX below.
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    try {
      c.setDimensions({ width: doc.canvas.width, height: doc.canvas.height });
    } catch (_) {}
    applyBackground(c, doc.canvas.background || "");
    c.requestRenderAll();
  }, [doc?.canvas.width, doc?.canvas.height, doc?.canvas.background]);

  // ── 3. Clear canvas when doc resets ──────────────────────────────────────
  useEffect(() => {
    if (doc !== null) return;
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.requestRenderAll();
    lastLoadedPageId.current = null;
    lastLoadedPageJson.current = "";
  }, [doc]);

  // ── 4. Load page JSON when active page changes ────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc || !activePageId) return;

    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const jsonStr = JSON.stringify(page.fabric);
    if (
      lastLoadedPageId.current === activePageId &&
      lastLoadedPageJson.current === jsonStr
    ) return;

    lastLoadedPageId.current = activePageId;
    lastLoadedPageJson.current = jsonStr;

    const json = page.fabric as Record<string, unknown>;
    const bg = doc.canvas.background || "";

    const doLoad = () => {
      c.clear();
      applyBackground(c, bg);

      if (!json || !Array.isArray(json.objects) || (json.objects as any[]).length === 0) {
        c.requestRenderAll();
        return;
      }

      const result = c.loadFromJSON(json);
      const finish = () => {
        applyBackground(c, bg);
        c.requestRenderAll();
      };

      if (result && typeof (result as any).then === "function") {
        (result as any).then(finish).catch(() => finish());
      } else {
        finish();
      }
    };

    const tid = setTimeout(doLoad, 0);
    return () => clearTimeout(tid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId]);

  if (!doc) return null;

  const w = doc.canvas.width;
  const h = doc.canvas.height;

  // ── CSS-transform based zoom ──────────────────────────────────────────────
  // The canvas renders at native size (w × h). We scale it visually with
  // CSS transform-origin: top center. The outer scroll container gets explicit
  // min-width/min-height so the scrollbar appears at the right size.
  const scaledW = w * zoom;
  const scaledH = h * zoom;

  return (
    // Scroll container — always full width/height of the center column
    <div
      className="w-full h-full overflow-auto bg-muted/40"
      style={{ position: "relative" }}
    >
      {/*
        Inner div is sized to the SCALED dimensions so the scroll area is correct.
        We use padding so there's always breathing room around the canvas.
      */}
      <div
        style={{
          minWidth: scaledW + 80,
          minHeight: scaledH + 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/*
          Transform wrapper: scale from top-left then shift to center.
          transform-origin: top left + translate keeps the math simple.
          We reserve the correct amount of space via width/height on this div.
        */}
        <div
          style={{
            width: scaledW,
            height: scaledH,
            flexShrink: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transformOrigin: "top left",
              transform: `scale(${zoom})`,
              borderRadius: 6,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              outline: "1px solid rgba(0,0,0,0.1)",
              lineHeight: 0,
              overflow: "hidden",
            }}
          >
            <canvas ref={canvasElRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────

function applyBackground(c: fabric.Canvas, bg: string) {
  const isSimple = !bg || /^(#|rgb|rgba|hsl|hsla|transparent)/i.test(bg);
  try {
    if (isSimple) {
      c.backgroundColor = bg || "#ffffff";
    } else {
      c.backgroundColor = "#ffffff";
    }
    c.requestRenderAll();
  } catch (_) {}
}
