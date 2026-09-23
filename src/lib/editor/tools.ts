import * as fabric from "fabric";
import QRCode from "qrcode";

export type SocialPlatform = "instagram" | "telegram" | "whatsapp" | "facebook" | "x";
export type SocialLayout = "horizontal" | "logo-top" | "text-top";

export const SOCIAL_PLATFORMS: Record<
  SocialPlatform,
  { label: string; color: string; textPrefix: string }
> = {
  instagram: { label: "Instagram", color: "#e1306c", textPrefix: "@" },
  telegram: { label: "Telegram", color: "#229ed9", textPrefix: "@" },
  whatsapp: { label: "WhatsApp", color: "#25d366", textPrefix: "+" },
  facebook: { label: "Facebook", color: "#1877f2", textPrefix: "@" },
  x: { label: "X", color: "#111111", textPrefix: "@" },
};

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
  (t as fabric.Object).set("name", "Text");
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
    rx: 16,
    ry: 16,
  });
  (r as fabric.Object).set("id", nextId("rect"));
  (r as fabric.Object).set("name", "Rectangle");
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
  (c as fabric.Object).set("name", "Circle");
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
  (t as fabric.Object).set("name", "Triangle");
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
  (e as fabric.Object).set("name", "Ellipse");
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
  (r as fabric.Object).set("name", "Rounded rectangle");
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
  (s as fabric.Object).set("name", "Star");
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
  (l as fabric.Object).set("name", "Line");
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
  (img as fabric.Object).set("name", "Image");
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
        (img as fabric.Object).set("name", "Image");
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
  const dataUrl = await QRCode.toDataURL(data || "https://card24.uz", {
    margin: 1,
    width: 320,
    color: { dark: "#000000", light: "#ffffff" },
  });
  const img = await fabric.FabricImage.fromURL(dataUrl);
  img.set({ left: 100, top: 100 });
  (img as fabric.Object).set("id", nextId("qr"));
  (img as fabric.Object).set("name", "QR code");
  (img as fabric.Object).set("meta", { qrData: data });
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.requestRenderAll();
}

function normalizedSocialText(platform: SocialPlatform, username: string) {
  const value = username.trim() || "username";
  if (/^(https?:\/\/|@|\+|t\.me\/|wa\.me\/)/i.test(value)) return value;
  return `${SOCIAL_PLATFORMS[platform].textPrefix}${value}`;
}

function makeSocialLogo(platform: SocialPlatform, socialId: string) {
  const config = SOCIAL_PLATFORMS[platform];
  const iconSize = 44;
  const bg = new fabric.Rect({
    width: iconSize,
    height: iconSize,
    rx: platform === "instagram" ? 13 : 22,
    ry: platform === "instagram" ? 13 : 22,
    fill: config.color,
    originX: "left",
    originY: "top",
  });
  bg.set("name", `${config.label} logo`);

  const marks: fabric.FabricObject[] = [bg];
  if (platform === "instagram") {
    marks.push(
      new fabric.Circle({
        left: 13,
        top: 13,
        radius: 9,
        fill: "",
        stroke: "#ffffff",
        strokeWidth: 3,
      }),
      new fabric.Circle({ left: 29, top: 10, radius: 3, fill: "#ffffff" }),
    );
  } else if (platform === "telegram") {
    marks.push(
      new fabric.Polygon(
        [
          { x: 10, y: 22 },
          { x: 34, y: 11 },
          { x: 28, y: 34 },
          { x: 21, y: 27 },
          { x: 17, y: 31 },
          { x: 18, y: 25 },
        ],
        { fill: "#ffffff" },
      ),
    );
  } else if (platform === "whatsapp") {
    marks.push(
      new fabric.Circle({
        left: 9,
        top: 8,
        radius: 13,
        fill: "",
        stroke: "#ffffff",
        strokeWidth: 3,
      }),
      new fabric.Polygon(
        [
          { x: 14, y: 32 },
          { x: 18, y: 28 },
          { x: 23, y: 34 },
        ],
        { fill: "#ffffff" },
      ),
      new fabric.Path("M18 16 C20 22 23 25 29 27", {
        stroke: "#ffffff",
        strokeWidth: 4,
        fill: "",
        strokeLineCap: "round",
      }),
    );
  } else if (platform === "facebook") {
    marks.push(
      new fabric.Text("f", {
        left: 23,
        top: 22,
        fontFamily: "Arial",
        fontSize: 34,
        fontWeight: "900",
        fill: "#ffffff",
        originX: "center",
        originY: "center",
      }),
    );
  } else {
    marks.push(
      new fabric.Line([14, 13, 31, 31], {
        stroke: "#ffffff",
        strokeWidth: 4,
        strokeLineCap: "round",
      }),
      new fabric.Line([31, 13, 14, 31], {
        stroke: "#ffffff",
        strokeWidth: 4,
        strokeLineCap: "round",
      }),
    );
  }

  const logo = new fabric.Group(marks, {
    left: 100,
    top: 100,
  });
  logo.set("id", nextId("social-logo"));
  logo.set("name", `${config.label} logo`);
  logo.set("meta", { social: true, socialId, platform, role: "logo" });
  return logo;
}

function createSocialObjects(platform: SocialPlatform, username: string, layout: SocialLayout) {
  const socialId = nextId("social");
  const handle = normalizedSocialText(platform, username);
  const iconSize = 44;
  const gap = 12;
  const logo = makeSocialLogo(platform, socialId);
  const text = new fabric.IText(handle, {
    left: 156,
    top: 122,
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "700",
    fill: "#111111",
    originX: "left",
    originY: "center",
  });
  text.set("id", nextId("social-text"));
  text.set("name", `${SOCIAL_PLATFORMS[platform].label} username`);
  text.set("meta", { social: true, socialId, platform, role: "text", layout });

  const textWidth = Math.max(80, text.width ?? 80);
  if (layout === "horizontal") {
    logo.set({ left: 100, top: 100 });
    text.set({ left: 100 + iconSize + gap, top: 100 + iconSize / 2, originY: "center" });
  } else {
    const centerX = Math.max(iconSize, textWidth) / 2;
    const logoY = layout === "logo-top" ? 100 : 146;
    const textY = layout === "logo-top" ? 154 : 100;
    logo.set({ left: 100 + centerX - iconSize / 2, top: logoY });
    text.set({ left: 100 + centerX - textWidth / 2, top: textY, originY: "top" });
  }
  return { logo, text, handle, socialId };
}

export function createSocialGroup(
  platform: SocialPlatform,
  username: string,
  layout: SocialLayout,
  options: fabric.GroupProps = {},
) {
  const { logo, text, handle } = createSocialObjects(platform, username, layout);
  logo.set({ left: 0, top: 0 });
  text.set({ left: 56, top: 22 });
  const group = new fabric.Group([logo, text], {
    left: 100,
    top: 100,
    ...options,
  });
  group.set("id", nextId("social"));
  group.set("name", `${SOCIAL_PLATFORMS[platform].label} social`);
  group.set("meta", { social: true, platform, username: handle, layout });
  return group;
}

export function addSocial(
  canvas: fabric.Canvas,
  platform: SocialPlatform,
  username: string,
  layout: SocialLayout,
) {
  const { logo, text } = createSocialObjects(platform, username, layout);
  canvas.add(logo, text);
  const selection = new fabric.ActiveSelection([logo, text], { canvas });
  canvas.setActiveObject(selection);
  canvas.requestRenderAll();
}

export function updateSocialGroup(
  canvas: fabric.Canvas,
  group: fabric.FabricObject,
  username: string,
  layout: SocialLayout,
) {
  const meta = (group.get("meta") ?? {}) as { platform?: SocialPlatform };
  const platform = meta.platform ?? "instagram";
  const replacement = createSocialGroup(platform, username, layout, {
    left: group.left,
    top: group.top,
    angle: group.angle,
    scaleX: group.scaleX,
    scaleY: group.scaleY,
    opacity: group.opacity,
  });
  replacement.set("id", group.get("id") || nextId("social"));
  canvas.remove(group);
  canvas.add(replacement);
  canvas.setActiveObject(replacement);
  canvas.requestRenderAll();
  return replacement;
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

function withNativeView<T>(canvas: fabric.Canvas, width: number, height: number, render: () => T): T {
  const previousWidth = canvas.getWidth();
  const previousHeight = canvas.getHeight();
  const previousViewport = canvas.viewportTransform ? [...canvas.viewportTransform] : undefined;
  try {
    canvas.setDimensions({ width, height });
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.requestRenderAll();
    return render();
  } finally {
    canvas.setDimensions({ width: previousWidth, height: previousHeight });
    if (previousViewport) canvas.setViewportTransform(previousViewport);
    canvas.requestRenderAll();
  }
}

export function exportPNG(
  canvas: fabric.Canvas,
  multiplier = 2,
  width = canvas.getWidth(),
  height = canvas.getHeight(),
): string {
  return withNativeView(canvas, width, height, () =>
    canvas.toDataURL({
      format: "png",
      multiplier,
      quality: 1,
      left: 0,
      top: 0,
      width,
      height,
    }),
  );
}

export function exportJPG(
  canvas: fabric.Canvas,
  multiplier = 2,
  width = canvas.getWidth(),
  height = canvas.getHeight(),
): string {
  return withNativeView(canvas, width, height, () =>
    canvas.toDataURL({
      format: "jpeg",
      multiplier,
      quality: 0.95,
      left: 0,
      top: 0,
      width,
      height,
    }),
  );
}

export function exportSVG(
  canvas: fabric.Canvas,
  width = canvas.getWidth(),
  height = canvas.getHeight(),
): string {
  return withNativeView(canvas, width, height, () => canvas.toSVG());
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
    (FabricObject.customProperties as string[]).push("id", "name", "meta");
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
      const objects = json?.objects;
      if (!Array.isArray(objects) || objects.length === 0) {
        offscreen.requestRenderAll();
        resolve();
        return;
      }
      const result = offscreen.loadFromJSON(json);
      const finish = () => {
        offscreen.requestRenderAll();
        resolve();
      };
      if (result && typeof (result as PromiseLike<unknown>).then === "function") {
        Promise.resolve(result).then(finish).catch(finish);
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

  try {
    const disposed = offscreen.dispose();
    if (disposed && typeof (disposed as PromiseLike<unknown>).then === "function") {
      await disposed.catch(() => undefined);
    }
  } catch {
    // Ignore cleanup races after the PDF data has already been produced.
  }

  pdf.save(`${title || "design"}.pdf`);
}
