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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  // Track last loaded page so we only reload JSON when the page actually changes,
  // not when background/width/height change.
  const lastLoadedPageId = useRef<string | null>(null);
  const lastLoadedPageJson = useRef<string>("");

  const doc = useEditorStore((s) => s.doc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const zoom = useEditorStore((s) => s.zoom);
  const markDirty = useEditorStore((s) => s.markDirty);
  const setSelected = useEditorStore((s) => s.setSelected);

  // ── 1. Mount the Fabric canvas once ──────────────────────────────────────
  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return;
    const canvas = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
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

  // ── 2. Apply background + dimensions whenever they change ─────────────────
  // This effect does NOT touch the objects on the canvas at all.
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;

    // Dimensions
    try {
      c.setDimensions({ width: doc.canvas.width, height: doc.canvas.height });
    } catch (_) {}

    applyBackground(c, containerRef.current, doc.canvas.background || "");
  }, [doc, doc?.canvas.width, doc?.canvas.height, doc?.canvas.background]);

  // ── 2b. Clear canvas when doc is reset (navigating to a different design) ──
  useEffect(() => {
    if (doc !== null) return;   // doc is set — don't touch
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.requestRenderAll();
    lastLoadedPageId.current = null;
    lastLoadedPageJson.current = "";
  }, [doc]);

  // ── 3. Load page JSON only when the active page actually changes ──────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc || !activePageId) return;

    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page) return;

    const jsonStr = JSON.stringify(page.fabric);

    // Skip reload if same page + same JSON (e.g. background-only doc change)
    if (
      lastLoadedPageId.current === activePageId &&
      lastLoadedPageJson.current === jsonStr
    ) {
      return;
    }

    lastLoadedPageId.current = activePageId;
    lastLoadedPageJson.current = jsonStr;

    const json = page.fabric as Record<string, unknown>;
    const bg = doc.canvas.background || "";

    const doLoad = () => {
      c.clear();
      // Re-apply background immediately after clear (clear() resets it)
      applyBackground(c, containerRef.current, bg);

      if (!json || !Array.isArray(json.objects) || (json.objects as any[]).length === 0) {
        c.requestRenderAll();
        return;
      }

      const result = c.loadFromJSON(json);
      const finish = () => {
        c.forEachObject((obj) => {
          if (obj.visible === undefined) obj.set({ visible: true });
        });
        // Re-apply bg after loadFromJSON (it can reset backgroundColor)
        applyBackground(c, containerRef.current, bg);
        c.requestRenderAll();
      };

      if (result && typeof (result as any).then === "function") {
        (result as any).then(finish).catch(() => finish());
      } else {
        finish();
      }
    };

    // Small delay to ensure canvas DOM is ready
    const tid = setTimeout(doLoad, 0);
    return () => clearTimeout(tid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId]);

  // ── 4. Zoom ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    c.setZoom(zoom);
    c.requestRenderAll();
  }, [zoom]);

  if (!doc) return null;

  const scaledW = doc.canvas.width * zoom;
  const scaledH = doc.canvas.height * zoom;

  return (
    // overflow-auto so the user can scroll when canvas is larger than viewport.
    // min-w/min-h ensure the inner div can grow beyond the flex parent size.
    // We center using auto margins on the inner div rather than grid place-items-center
    // so that centering degrades gracefully to scroll when the canvas is too wide.
    <div
      ref={wrapperRef}
      className="h-full w-full overflow-auto bg-muted/40"
      style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}
    >
      {/* Padding wrapper — gives breathing room around the canvas */}
      <div style={{ padding: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: scaledW + 80, minHeight: scaledH + 80 }}>
        <div
          ref={containerRef}
          className="rounded-md shadow-2xl ring-1 ring-border flex-shrink-0"
          style={{ width: scaledW, height: scaledH }}
        >
          <canvas ref={canvasElRef} />
        </div>
      </div>
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────

function applyBackground(
  c: fabric.Canvas,
  containerEl: HTMLDivElement | null,
  bg: string
) {
  const isSimple = !bg || /^(#|rgb|rgba|hsl|hsla|transparent)/i.test(bg);
  try {
    if (isSimple) {
      c.backgroundColor = bg || "#ffffff";
      if (containerEl) containerEl.style.background = "";
    } else {
      // Gradient / image — render via CSS on the wrapper
      c.backgroundColor = "";
      if (containerEl) containerEl.style.background = bg;
    }
    c.requestRenderAll();
  } catch (_) {}
}
