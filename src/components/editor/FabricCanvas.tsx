import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "@/store/editor";

if (!(fabric.FabricObject.customProperties as string[]).includes("id")) {
  (fabric.FabricObject.customProperties as string[]).push("id", "name");
}

export function FabricCanvas({ onReady }: { onReady?: (canvas: fabric.Canvas) => void }) {
  const wrapRef      = useRef<HTMLDivElement>(null);
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

  // Mount Fabric once
  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return;
    const c = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
      enableRetinaScaling: false,
      width: 300,
      height: 200,
    });
    fabricRef.current = c;

    // Keep Fabric's wrapper inside our container
    const inner = (c as any).wrapperEl as HTMLElement | undefined;
    if (inner) {
      inner.style.cssText = "position:relative;display:block;margin:0;padding:0;line-height:0;";
    }

    c.on("object:modified", markDirty);
    c.on("object:added", markDirty);
    c.on("object:removed", markDirty);
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
  }, []);

  // Resize + apply zoom
  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !doc) return;
    const w = doc.canvas.width  * zoom;
    const h = doc.canvas.height * zoom;
    c.setDimensions({ width: w, height: h });
    // Apply viewport in next frame after dimensions settle
    requestAnimationFrame(() => {
      if (!fabricRef.current) return;
      fabricRef.current.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
      // Keep Fabric's wrapper contained
      const wrapper = (fabricRef.current as any).wrapperEl as HTMLElement | undefined;
      if (wrapper) {
        wrapper.style.cssText = `position:relative;display:block;margin:0;padding:0;line-height:0;width:${w}px;height:${h}px;overflow:hidden;`;
      }
      setBg(fabricRef.current, doc.canvas.background || "");
      fabricRef.current.requestRenderAll();
    });
  }, [zoom, doc?.canvas.width, doc?.canvas.height, doc?.canvas.background]);

  // Clear when doc resets
  useEffect(() => {
    if (doc !== null) return;
    const c = fabricRef.current;
    if (!c) return;
    c.clear();
    c.setDimensions({ width: 300, height: 200 });
    c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    c.requestRenderAll();
    lastPageId.current = null;
    lastPageJson.current = "";
  }, [doc]);

  // Load page
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
      c.setDimensions({ width: w * z, height: h * z });
      c.clear();
      setBg(c, bg);

      if (!json || !Array.isArray(json.objects) || !(json.objects as any[]).length) {
        requestAnimationFrame(() => {
          if (!fabricRef.current) return;
          fabricRef.current.setViewportTransform([z, 0, 0, z, 0, 0]);
          fabricRef.current.requestRenderAll();
        });
        return;
      }

      const loadJson: Record<string, unknown> = { ...json };
      delete loadJson.viewportTransform;

      const result = c.loadFromJSON(loadJson);
      const done = () => {
        setBg(c, bg);
        // Apply viewport in next frame so Fabric's internal state has settled
        requestAnimationFrame(() => {
          if (!fabricRef.current) return;
          fabricRef.current.setViewportTransform([z, 0, 0, z, 0, 0]);
          fabricRef.current.requestRenderAll();
        });
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
    return (
      <div ref={wrapRef} style={{ display: "none" }}>
        <canvas ref={canvasElRef} />
      </div>
    );
  }

  const scaledW = doc.canvas.width  * zoom;
  const scaledH = doc.canvas.height * zoom;

  return (
    <div
      ref={wrapRef}
      style={{
        width: scaledW,
        height: scaledH,
        flexShrink: 0,
        flexGrow: 0,
        lineHeight: 0,
        overflow: "hidden",
        borderRadius: 6,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        position: "relative",
        isolation: "isolate",
      }}
    >
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
