import * as fabric from "fabric";
import QRCode from "qrcode";

export type SocialPlatform = "instagram" | "telegram" | "whatsapp" | "facebook" | "x";
export type SocialLayout = "horizontal" | "logo-top" | "text-top";

export const SOCIAL_PLATFORMS: Record<
  SocialPlatform,
  { label: string; color: string; textPrefix: string; path: string }
> = {
  instagram: {
    label: "Instagram",
    color: "#e1306c",
    textPrefix: "@",
    path: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  },
  telegram: {
    label: "Telegram",
    color: "#229ed9",
    textPrefix: "@",
    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
  whatsapp: {
    label: "WhatsApp",
    color: "#25d366",
    textPrefix: "+",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  },
  facebook: {
    label: "Facebook",
    color: "#1877f2",
    textPrefix: "@",
    path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  },
  x: {
    label: "X",
    color: "#ffffff",
    textPrefix: "@",
    path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  },
};

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

function sharp<T extends fabric.FabricObject>(object: T): T {
  object.set({ objectCaching: false, noScaleCache: false });
  return object;
}

export function addText(canvas: fabric.Canvas) {
  const t = sharp(new fabric.IText("Your text", {
    left: 80,
    top: 80,
    fontFamily: "Inter",
    fontSize: 36,
    fill: "#111111",
  }));
  (t as fabric.Object).set("id", nextId("text"));
  (t as fabric.Object).set("name", "Text");
  canvas.add(t);
  canvas.setActiveObject(t);
  canvas.requestRenderAll();
}

export function addRect(canvas: fabric.Canvas) {
  const r = sharp(new fabric.Rect({
    left: 100,
    top: 100,
    width: 180,
    height: 120,
    fill: "#6b8afd",
    rx: 16,
    ry: 16,
  }));
  (r as fabric.Object).set("id", nextId("rect"));
  (r as fabric.Object).set("name", "Rectangle");
  canvas.add(r);
  canvas.setActiveObject(r);
  canvas.requestRenderAll();
}

export function addCircle(canvas: fabric.Canvas) {
  const c = sharp(new fabric.Circle({
    left: 120,
    top: 120,
    radius: 60,
    fill: "#f59e0b",
  }));
  (c as fabric.Object).set("id", nextId("circle"));
  (c as fabric.Object).set("name", "Circle");
  canvas.add(c);
  canvas.setActiveObject(c);
  canvas.requestRenderAll();
}

export function addTriangle(canvas: fabric.Canvas) {
  const t = sharp(new fabric.Triangle({
    left: 140,
    top: 140,
    width: 120,
    height: 120,
    fill: "#10b981",
  }));
  (t as fabric.Object).set("id", nextId("tri"));
  (t as fabric.Object).set("name", "Triangle");
  canvas.add(t);
  canvas.setActiveObject(t);
  canvas.requestRenderAll();
}

export function addEllipse(canvas: fabric.Canvas) {
  const e = sharp(new fabric.Ellipse({
    left: 120,
    top: 120,
    rx: 90,
    ry: 60,
    fill: "#f97316",
  }));
  (e as fabric.Object).set("id", nextId("ellipse"));
  (e as fabric.Object).set("name", "Ellipse");
  canvas.add(e);
  canvas.setActiveObject(e);
  canvas.requestRenderAll();
}

export function addRoundedRect(canvas: fabric.Canvas) {
  const r = sharp(new fabric.Rect({
    left: 120,
    top: 120,
    width: 220,
    height: 140,
    fill: "#8b5cf6",
    rx: 24,
    ry: 24,
  }));
  (r as fabric.Object).set("id", nextId("rounded-rect"));
  (r as fabric.Object).set("name", "Rounded rectangle");
  canvas.add(r);
  canvas.setActiveObject(r);
  canvas.requestRenderAll();
}

export function addStar(canvas: fabric.Canvas) {
  const s = sharp(new fabric.Polygon(
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
  ));
  (s as fabric.Object).set("id", nextId("star"));
  (s as fabric.Object).set("name", "Star");
  canvas.add(s);
  canvas.setActiveObject(s);
  canvas.requestRenderAll();
}

export function addLine(canvas: fabric.Canvas) {
  const l = sharp(new fabric.Line([50, 100, 350, 100], {
    stroke: "#111111",
    strokeWidth: 3,
  }));
  (l as fabric.Object).set("id", nextId("line"));
  (l as fabric.Object).set("name", "Line");
  canvas.add(l);
  canvas.setActiveObject(l);
  canvas.requestRenderAll();
}

export async function addImageFromUrl(canvas: fabric.Canvas, url: string) {
  const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
  sharp(img);
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
        sharp(img);
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
  sharp(img);
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
  const logo = sharp(new fabric.Path(config.path, {
    left: 100,
    top: 100,
    fill: config.color,
    scaleX: 44 / 24,
    scaleY: 44 / 24,
    originX: "left",
    originY: "top",
  }));
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
  const text = sharp(new fabric.IText(handle, {
    left: 156,
    top: 122,
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "700",
    fill: "#ffffff",
    originX: "left",
    originY: "center",
  }));
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
  const group = sharp(new fabric.Group([logo, text], {
    left: 100,
    top: 100,
    ...options,
  }));
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
  canvas.setActiveObject(text);
  text.enterEditing();
  text.selectAll();
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
