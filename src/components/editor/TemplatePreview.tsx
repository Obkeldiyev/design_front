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
  const left = Number(obj.left ?? 0);
  const top = Number(obj.top ?? 0);
  const scaleX = Number(obj.scaleX ?? 1);
  const scaleY = Number(obj.scaleY ?? 1);
  const angle = Number(obj.angle ?? 0);
  const transform = [
    `translate(${left} ${top})`,
    angle ? `rotate(${angle})` : "",
    scaleX !== 1 || scaleY !== 1 ? `scale(${scaleX} ${scaleY})` : "",
  ].filter(Boolean).join(" ");
  const transformAttr = transform ? ` transform="${transform}"` : "";
  const strokeAttr = obj.stroke ? ` stroke="${escapeXml(obj.stroke)}" stroke-width="${obj.strokeWidth ?? 1}"` : "";

  function originOffset(width = 0, height = 0) {
    const x = obj.originX === "center" ? -width / 2 : obj.originX === "right" ? -width : 0;
    const y = obj.originY === "center" ? -height / 2 : obj.originY === "bottom" ? -height : 0;
    return { x, y };
  }

  switch (t) {
    case "rect": {
      const rx = obj.rx ?? 0;
      const width = Number(obj.width ?? 0);
      const height = Number(obj.height ?? 0);
      const pos = originOffset(width, height);
      return `<rect x="${pos.x}" y="${pos.y}" width="${width}" height="${height}" rx="${rx}" ry="${rx}" fill="${escapeXml(obj.fill ?? "#000")}"${strokeAttr}${opAttr}${transformAttr}/>`;
    }

    case "circle": {
      const radius = Number(obj.radius ?? 0);
      const pos = originOffset(radius * 2, radius * 2);
      return `<circle cx="${pos.x + radius}" cy="${pos.y + radius}" r="${radius}" fill="${escapeXml(obj.fill ?? "#000")}"${strokeAttr}${opAttr}${transformAttr}/>`;
    }

    case "line": {
      return `<line x1="${obj.x1 ?? 0}" y1="${obj.y1 ?? 0}" x2="${obj.x2 ?? 0}" y2="${obj.y2 ?? 0}" stroke="${escapeXml(obj.stroke ?? "#000")}" stroke-width="${obj.strokeWidth ?? 1}"${opAttr}${transformAttr}/>`;
    }

    case "i-text":
    case "textbox":
    case "text": {
      const fill = escapeXml(obj.fill ?? "#000");
      const fontSize = obj.fontSize ?? 20;
      const fontFamily = escapeXml(obj.fontFamily ?? "Inter, sans-serif");
      const fontWeight = obj.fontWeight ? ` font-weight="${obj.fontWeight}"` : "";
      const fontStyle = obj.fontStyle === "italic" ? ` font-style="italic"` : "";
      const textAnchor = obj.originX === "center" || obj.textAlign === "center" ? ` text-anchor="middle"` : obj.originX === "right" || obj.textAlign === "right" ? ` text-anchor="end"` : "";
      const lines: string[] = String(obj.text ?? "").split("\n");
      const lineHeight = obj.lineHeight ?? 1.2;
      const lineEm = lineHeight;

      if (lines.length === 1) {
        return `<text x="0" y="${fontSize}" font-size="${fontSize}" font-family="${fontFamily}"${fontWeight}${fontStyle}${textAnchor} fill="${fill}"${opAttr}${transformAttr}>${escapeXml(lines[0])}</text>`;
      }
      const tspans = lines
        .map((line, i) =>
          `<tspan x="0" dy="${i === 0 ? "0" : `${lineEm}em`}">${escapeXml(line)}</tspan>`
        )
        .join("");
      return `<text x="0" y="${fontSize}" font-size="${fontSize}" font-family="${fontFamily}"${fontWeight}${fontStyle}${textAnchor} fill="${fill}"${opAttr}${transformAttr}>${tspans}</text>`;
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
