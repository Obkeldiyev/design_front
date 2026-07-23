/**
 * TemplatePreview — renders a CardTemplate as a scaled SVG thumbnail.
 * Approximates the Fabric canvas look without loading the full Fabric library.
 */
import type { CardTemplate } from "@/lib/card-templates";

interface Props {
  template: CardTemplate;
  /** Display width in pixels (height is auto-computed from aspect ratio) */
  displayWidth?: number;
  className?: string;
}

type FabricObj = Record<string, any>;

function escapeXml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderObject(obj: FabricObj, key: number): string {
  const op = obj.opacity !== undefined ? obj.opacity : 1;
  const opAttr = op < 1 ? ` opacity="${op}"` : "";
  const t = obj.type?.toLowerCase?.() ?? "";

  switch (t) {
    case "rect": {
      const rx = obj.rx ?? 0;
      return `<rect x="${obj.left}" y="${obj.top}" width="${obj.width}" height="${obj.height}" rx="${rx}" ry="${rx}" fill="${escapeXml(obj.fill ?? "#000")}"`
        + opAttr + `/>`;
    }

    case "circle": {
      const cx = (obj.left ?? 0) + (obj.radius ?? 0);
      const cy = (obj.top ?? 0) + (obj.radius ?? 0);
      return `<circle cx="${cx}" cy="${cy}" r="${obj.radius}" fill="${escapeXml(obj.fill ?? "#000")}"` + opAttr + `/>`;
    }

    case "line": {
      const x1 = (obj.left ?? 0) + (obj.x1 ?? 0);
      const y1 = (obj.top ?? 0) + (obj.y1 ?? 0);
      const x2 = (obj.left ?? 0) + (obj.x2 ?? 0);
      const y2 = (obj.top ?? 0) + (obj.y2 ?? 0);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${escapeXml(obj.stroke ?? "#000")}" stroke-width="${obj.strokeWidth ?? 1}"` + opAttr + `/>`;
    }

    case "i-text":
    case "textbox":
    case "text": {
      const fill = escapeXml(obj.fill ?? "#000");
      const fontSize = obj.fontSize ?? 20;
      const fontFamily = escapeXml(obj.fontFamily ?? "Inter, sans-serif");
      const fontWeight = obj.fontWeight ? ` font-weight="${obj.fontWeight}"` : "";
      const fontStyle = obj.fontStyle === "italic" ? ` font-style="italic"` : "";
      const lines: string[] = String(obj.text ?? "").split("\n");
      const lineHeight = obj.lineHeight ?? 1.2;
      const lineEm = lineHeight;

      if (lines.length === 1) {
        return `<text x="${obj.left}" y="${(obj.top ?? 0) + fontSize}" font-size="${fontSize}" font-family="${fontFamily}"${fontWeight}${fontStyle} fill="${fill}"` + opAttr + `>${escapeXml(lines[0])}</text>`;
      }
      const tspans = lines
        .map((line, i) =>
          `<tspan x="${obj.left}" dy="${i === 0 ? "0" : `${lineEm}em`}">${escapeXml(line)}</tspan>`
        )
        .join("");
      return `<text x="${obj.left}" y="${(obj.top ?? 0) + fontSize}" font-size="${fontSize}" font-family="${fontFamily}"${fontWeight}${fontStyle} fill="${fill}"` + opAttr + `>${tspans}</text>`;
    }

    default:
      return "";
  }
}

export function TemplatePreview({ template, displayWidth = 320, className = "" }: Props) {
  const { doc, width, height } = template;
  const displayHeight = Math.round(displayWidth * (height / width));

  const page = doc.pages[0];
  const objects: FabricObj[] = Array.isArray((page?.fabric as any)?.objects)
    ? (page.fabric as any).objects
    : [];

  const bg = doc.canvas.background || "#ffffff";
  const objectsSvg = objects.map((obj, i) => renderObject(obj, i)).join("\n    ");

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${displayWidth}" height="${displayHeight}">
  <rect width="${width}" height="${height}" fill="${escapeXml(bg)}"/>
  ${objectsSvg}
</svg>`;

  return (
    <div
      className={className}
      style={{ width: displayWidth, height: displayHeight }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
