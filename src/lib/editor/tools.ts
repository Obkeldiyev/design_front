import * as fabric from "fabric";
import QRCode from "qrcode";

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function addText(canvas: fabric.Canvas) {
  const t = new fabric.IText("Your text", {
    left: 80,
    top: 80,
    fontFamily: "Inter",
    fontSize: 36,
    fill: "#111111",
  });
  (t as fabric.Object).set("id", nextId("text"));
  canvas.add(t);
  canvas.setActiveObject(t);
  canvas.requestRenderAll();
}

export function addRect(canvas: fabric.Canvas) {
  const r = new fabric.Rect({
    left: 100,
    top: 100,
    width: 180,
    height: 120,
    fill: "#6b8afd",
    rx: 12,
    ry: 12,
  });
  (r as fabric.Object).set("id", nextId("rect"));
  canvas.add(r);
  canvas.setActiveObject(r);
  canvas.requestRenderAll();
}

export function addCircle(canvas: fabric.Canvas) {
  const c = new fabric.Circle({
    left: 120,
    top: 120,
    radius: 60,
    fill: "#f59e0b",
  });
  (c as fabric.Object).set("id", nextId("circle"));
  canvas.add(c);
  canvas.setActiveObject(c);
  canvas.requestRenderAll();
}

export function addTriangle(canvas: fabric.Canvas) {
  const t = new fabric.Triangle({
    left: 140,
    top: 140,
    width: 120,
    height: 120,
    fill: "#10b981",
  });
  (t as fabric.Object).set("id", nextId("tri"));
  canvas.add(t);
  canvas.setActiveObject(t);
  canvas.requestRenderAll();
}

export function addEllipse(canvas: fabric.Canvas) {
  const e = new fabric.Ellipse({
    left: 120,
    top: 120,
    rx: 90,
    ry: 60,
    fill: "#f97316",
  });
  (e as fabric.Object).set("id", nextId("ellipse"));
  canvas.add(e);
  canvas.setActiveObject(e);
  canvas.requestRenderAll();
}

export function addRoundedRect(canvas: fabric.Canvas) {
  const r = new fabric.Rect({
    left: 120,
    top: 120,
    width: 220,
    height: 140,
    fill: "#8b5cf6",
    rx: 24,
    ry: 24,
  });
  (r as fabric.Object).set("id", nextId("rounded-rect"));
  canvas.add(r);
  canvas.setActiveObject(r);
  canvas.requestRenderAll();
}

export function addStar(canvas: fabric.Canvas) {
  const s = new fabric.Polygon(
    [
      { x: 0, y: -60 },
      { x: 18, y: -18 },
      { x: 60, y: -18 },
      { x: 24, y: 6 },
      { x: 36, y: 60 },
      { x: 0, y: 24 },
      { x: -36, y: 60 },
      { x: -24, y: 6 },
      { x: -60, y: -18 },
      { x: -18, y: -18 },
    ],
    {
      left: 140,
      top: 140,
      fill: "#fb7185",
    },
  );
  (s as fabric.Object).set("id", nextId("star"));
  canvas.add(s);
  canvas.setActiveObject(s);
  canvas.requestRenderAll();
}

export function addLine(canvas: fabric.Canvas) {
  const l = new fabric.Line([50, 100, 350, 100], {
    stroke: "#111111",
    strokeWidth: 3,
  });
  (l as fabric.Object).set("id", nextId("line"));
  canvas.add(l);
  canvas.setActiveObject(l);
  canvas.requestRenderAll();
}

export async function addImageFromUrl(canvas: fabric.Canvas, url: string) {
  const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
  img.set({ left: 80, top: 80 });
  const max = 320;
  const scale = Math.min(max / (img.width ?? max), max / (img.height ?? max), 1);
  img.scale(scale);
  (img as fabric.Object).set("id", nextId("image"));
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.requestRenderAll();
}

export async function addImageFromFile(canvas: fabric.Canvas, file: File) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const img = await fabric.FabricImage.fromURL(dataUrl);
        img.set({ left: 80, top: 80 });
        const max = 320;
        const scale = Math.min(max / (img.width ?? max), max / (img.height ?? max), 1);
        img.scale(scale);
        (img as fabric.Object).set("id", nextId("image"));
        (img as fabric.Object).set("meta", { fileName: file.name });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function addQR(canvas: fabric.Canvas, data: string) {
  const dataUrl = await QRCode.toDataURL(data || "https://cardify.app", {
    margin: 1,
    width: 320,
    color: { dark: "#000000", light: "#ffffff" },
  });
  const img = await fabric.FabricImage.fromURL(dataUrl);
  img.set({ left: 100, top: 100 });
  (img as fabric.Object).set("id", nextId("qr"));
  (img as fabric.Object).set("meta", { qrData: data });
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.requestRenderAll();
}

export function deleteSelected(canvas: fabric.Canvas) {
  const objs = canvas.getActiveObjects();
  objs.forEach((o) => canvas.remove(o));
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

export function bringForward(canvas: fabric.Canvas) {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.bringObjectForward(obj);
    canvas.requestRenderAll();
  }
}

export function sendBackward(canvas: fabric.Canvas) {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.sendObjectBackwards(obj);
    canvas.requestRenderAll();
  }
}

export function duplicateSelected(canvas: fabric.Canvas) {
  const obj = canvas.getActiveObject();
  if (!obj) return;
  obj.clone().then((clone: fabric.Object) => {
    clone.set({ left: (clone.left ?? 0) + 20, top: (clone.top ?? 0) + 20 });
    clone.set("id", nextId("dup"));
    canvas.add(clone);
    canvas.setActiveObject(clone);
    canvas.requestRenderAll();
  });
}

export function exportPNG(canvas: fabric.Canvas, multiplier = 2): string {
  return canvas.toDataURL({
    format: "png",
    multiplier,
    quality: 1,
    left: 0,
    top: 0,
    width: canvas.getWidth(),
    height: canvas.getHeight(),
  });
}

export function exportJPG(canvas: fabric.Canvas, multiplier = 2): string {
  return canvas.toDataURL({
    format: "jpeg",
    multiplier,
    quality: 0.95,
    left: 0,
    top: 0,
    width: canvas.getWidth(),
    height: canvas.getHeight(),
  });
}

export function exportSVG(canvas: fabric.Canvas): string {
  return canvas.toSVG();
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Export all pages of a CanvasDoc as a multi-page PDF.
 * Each page becomes one PDF page sized to the canvas dimensions (in mm).
 *
 * Uses jsPDF which is a pure-JS library — no server needed.
 * Install if not present: npm install jspdf
 */
export async function exportPDF(
  pages: Array<{ fabric: Record<string, unknown> }>,
  canvasWidth: number,
  canvasHeight: number,
  title: string,
  multiplier = 2,
): Promise<void> {
  // Dynamically import jsPDF to keep initial bundle small
  const { jsPDF } = await import("jspdf");

  // Convert px to mm at 96 DPI  (1px = 0.2646mm)
  const pxToMm = (px: number) => px * 0.2646;
  const wMm = pxToMm(canvasWidth);
  const hMm = pxToMm(canvasHeight);

  const pdf = new jsPDF({
    orientation: wMm > hMm ? "landscape" : "portrait",
    unit: "mm",
    format: [wMm, hMm],
  });

  // We need an off-screen fabric canvas to render each page
  const { Canvas: FabricCanvasClass, FabricObject } = await import("fabric");

  // Ensure custom props are registered in this dynamic import context
  if (!(FabricObject.customProperties as string[]).includes("id")) {
    (FabricObject.customProperties as string[]).push("id", "name");
  }

  const el = document.createElement("canvas");
  el.width = canvasWidth;
  el.height = canvasHeight;
  const offscreen = new FabricCanvasClass(el, {
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: "#ffffff",
    enableRetinaScaling: false,
  });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const json = page.fabric as Record<string, unknown>;

    // Clear and load page
    await new Promise<void>((resolve) => {
      offscreen.clear();
      if (!json || !Array.isArray(json.objects) || (json.objects as any[]).length === 0) {
        offscreen.requestRenderAll();
        resolve();
        return;
      }
      const result = offscreen.loadFromJSON(json);
      const finish = () => { offscreen.requestRenderAll(); resolve(); };
      if (result && typeof (result as any).then === "function") {
        (result as any).then(finish).catch(finish);
      } else {
        finish();
      }
    });

    // Give canvas a tick to paint
    await new Promise((r) => setTimeout(r, 50));

    const dataUrl = offscreen.toDataURL({ format: "jpeg", quality: 0.95, multiplier });

    if (i > 0) {
      pdf.addPage([wMm, hMm], wMm > hMm ? "landscape" : "portrait");
    }
    pdf.addImage(dataUrl, "JPEG", 0, 0, wMm, hMm);
  }

  try { offscreen.dispose(); } catch (_) {}

  pdf.save(`${title || "design"}.pdf`);
}
