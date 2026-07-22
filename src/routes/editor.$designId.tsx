import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DesignAPI } from "@/lib/api/resources";
import { useEditorStore } from "@/store/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, lazy, Suspense } from "react";

// Lazy-load editor components so they are NEVER rendered server-side
// Fabric.js requires window/document — SSR will crash without this
const FabricCanvas = lazy(() =>
  import("@/components/editor/FabricCanvas").then((m) => ({ default: m.FabricCanvas }))
);
const LayersPanel = lazy(() =>
  import("@/components/editor/LayersPanel").then((m) => ({ default: m.LayersPanel }))
);
import {
  ArrowLeft,
  Type,
  Square,
  Circle,
  Triangle,
  Minus,
  Image as ImageIcon,
  QrCode,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Download,
  ZoomIn,
  ZoomOut,
  Plus,
  Save,
} from "lucide-react";
import type * as fabricTypes from "fabric";
import * as fabric from "fabric";
import {
  addCircle,
  addEllipse,
  addImageFromUrl,
  addLine,
  addQR,
  addRect,
  addRoundedRect,
  addStar,
  addText,
  addTriangle,
  bringForward,
  deleteSelected,
  downloadDataUrl,
  duplicateSelected,
  exportJPG,
  exportPDF,
  exportPNG,
  exportSVG,
  sendBackward,
} from "@/lib/editor/tools";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/editor/$designId")({
  head: () => ({ meta: [{ title: "Editor — Cardify" }] }),
  component: EditorPage,
});

// Client-only wrapper — prevents SSR for the entire editor
// (Fabric.js, drag-and-drop, and canvas all require browser APIs)
function EditorPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm">Loading editor…</span>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <Editor />
    </Suspense>
  );
}

function Editor() {
  const { designId } = Route.useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<fabricTypes.Canvas | null>(null);
  const [canvasInstance, setCanvasInstance] = useState<fabricTypes.Canvas | null>(null);
  const canvasScrollRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // for CSS bg
  const [title, setTitle] = useState("");
  const [qrData, setQrData] = useState("https://cardify.app");

  const doc = useEditorStore((s) => s.doc);
  const setDoc = useEditorStore((s) => s.setDoc);
  const resetDoc = useEditorStore((s) => s.resetDoc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const removePage = useEditorStore((s) => s.removePage);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const markSaving = useEditorStore((s) => s.markSaving);
  const markSaved = useEditorStore((s) => s.markSaved);
  const markError = useEditorStore((s) => s.markError);
  const markDirty = useEditorStore((s) => s.markDirty);

  const query = useQuery({
    queryKey: ["design", designId],
    queryFn: () => DesignAPI.get(designId),
    staleTime: 0,           // always fetch fresh when opening editor
    refetchOnMount: true,
  });

  // Clear stale doc and reset sync tracker when designId changes
  useEffect(() => {
    resetDoc();
    lastSyncedDesignId.current = null; // ← allow reload when same design reopened
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designId]);

  // Load design data into store
  const lastSyncedDesignId = useRef<string | null>(null);
  useEffect(() => {
    if (!query.data) return;
    if (lastSyncedDesignId.current === query.data.id) return;
    lastSyncedDesignId.current = query.data.id;
    setTitle(query.data.title);
    setDoc(query.data.data); // setDoc now auto-calculates correct zoom
  }, [query.data, setDoc]);

  const save = useMutation({
    mutationFn: async () => {
      const canvas = canvasRef.current;
      if (!canvas || !doc || !activePageId) return;
      markSaving();
      // Persist current page fabric state into doc
      const json = (canvas as unknown as { toJSON: (keys?: string[]) => unknown }).toJSON(["id", "meta"]);
      const updatedPages = doc.pages.map((p) =>
        p.id === activePageId ? { ...p, fabric: json } : p,
      );
      const updatedDoc = { ...doc, pages: updatedPages };
      return DesignAPI.update(designId, {
        title,
        data: updatedDoc,
      });
    },
    onSuccess: () => {
      markSaved();
      toast.success("Saved");
    },
    onError: (e) => {
      markError();
      toast.error(apiError(e));
    },
  });

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Use canvasInstance (state) as fallback — more reliable after async load
      const canvas = canvasRef.current ?? canvasInstance;
      if (!canvas) return;

      // Don't fire shortcuts when user is typing in a real input/textarea
      const target = e.target as HTMLElement;
      const tag = target.tagName.toUpperCase();
      // Allow shortcuts when focused on the canvas element itself
      const isCanvasEl = tag === "CANVAS";
      if (!isCanvasEl && (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable)) return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Delete / Backspace — delete selected (not while editing IText)
      if ((e.key === "Delete" || e.key === "Backspace") && !ctrl) {
        const active = canvas.getActiveObject();
        if (!active) return;
        // Skip if an IText is currently being edited
        if ((active as any).isEditing) return;
        e.preventDefault();
        deleteSelected(canvas);
        markDirty();
        return;
      }

      // Ctrl+Z — undo (Fabric doesn't have built-in undo, just re-render)
      if (ctrl && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        // Fabric v6+ doesn't have native undo — we just deselect for now
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        return;
      }

      // Ctrl+D — duplicate
      if (ctrl && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateSelected(canvas);
        markDirty();
        return;
      }

      // Ctrl+S — save
      if (ctrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save.mutate();
        return;
      }

      // Ctrl+A — select all
      if (ctrl && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const objs = canvas.getObjects();
        if (objs.length > 0) {
          const sel = new fabric.ActiveSelection(objs as fabricTypes.FabricObject[], { canvas });
          canvas.setActiveObject(sel);
          canvas.requestRenderAll();
        }
        return;
      }

      // Ctrl+C — duplicate (copy+paste simulation)
      if (ctrl && e.key.toLowerCase() === "c") {
        // Store for paste — handled by Ctrl+V
        return;
      }

      // Escape — deselect
      if (e.key === "Escape") {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        return;
      }

      // Arrow keys — nudge selected
      const moveKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (moveKeys.includes(e.key)) {
        const obj = canvas.getActiveObject();
        if (!obj || (obj as any).isEditing) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const props: Partial<{ left: number; top: number }> = {};
        if (e.key === "ArrowLeft")  props.left  = (obj.left  ?? 0) - step;
        if (e.key === "ArrowRight") props.left  = (obj.left  ?? 0) + step;
        if (e.key === "ArrowUp")    props.top   = (obj.top   ?? 0) - step;
        if (e.key === "ArrowDown")  props.top   = (obj.top   ?? 0) + step;
        obj.set(props);
        obj.setCoords();
        canvas.requestRenderAll();
        markDirty();
        return;
      }

      // [ ] — layer order
      if (e.key === "[") { e.preventDefault(); sendBackward(canvas); markDirty(); return; }
      if (e.key === "]") { e.preventDefault(); bringForward(canvas); markDirty(); return; }

      // Ctrl+= / Ctrl++ — zoom in
      if (ctrl && (e.key === "=" || e.key === "+")) {
        e.preventDefault(); setZoom(Math.min(zoom + 0.1, 4)); return;
      }
      // Ctrl+- — zoom out
      if (ctrl && e.key === "-") {
        e.preventDefault(); setZoom(Math.max(zoom - 0.1, 0.1)); return;
      }
      // Ctrl+0 — fit zoom
      if (ctrl && e.key === "0") {
        e.preventDefault();
        if (doc) {
          const availW = Math.max(200, window.innerWidth - 256 - 288 - 80);
          const availH = Math.max(200, window.innerHeight - 56 - 80);
          setZoom(Math.max(0.2, parseFloat(Math.min(availW / doc.canvas.width, availH / doc.canvas.height, 1).toFixed(2))));
        }
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, doc, markDirty, setZoom, canvasInstance]);

  // Center scroll after zoom/doc changes
  useEffect(() => {
    const el = canvasScrollRef.current;
    if (!el) return;
    const center = () => {
      const excess = el.scrollWidth - el.clientWidth;
      if (excess > 0) el.scrollLeft = Math.round(excess / 2);
    };
    // Run immediately and again after layout settles
    center();
    const t = setTimeout(center, 100);
    return () => clearTimeout(t);
  }, [zoom, doc?.canvas.width, doc?.canvas.height, doc?.id]);

  useEffect(() => {
    if (saveStatus !== "dirty") return;
    const t = setTimeout(() => save.mutate(), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveStatus]);

  // When switching page, snapshot the prior fabric state into doc
  const handlePageSwitch = (newId: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !doc || !activePageId) {
      setActivePage(newId);
      return;
    }
    const json = (canvas as unknown as { toJSON: (keys?: string[]) => unknown }).toJSON(["id", "meta"]);
    const pages = doc.pages.map((p) => (p.id === activePageId ? { ...p, fabric: json } : p));
    setDoc({ ...doc, pages });
    setActivePage(newId);
  };

  // Upload a local image file to the backend and insert into canvas
  const handleFileInput = async (file?: File) => {
    const f = file;
    if (!f) return;
    try {
      const fd = new FormData();
      fd.append("file", f);
      const base = (import.meta.env.VITE_API_URL as string) || "http://localhost:9000";
      const res = await fetch(`${base}/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data?.url && canvasRef.current) {
        // full absolute URL
        const url = base.replace(/\/$/, "") + data.url;
        addImageFromUrl(canvasRef.current, url);
        markDirty();
      }
    } catch (e) {
      console.error("Upload failed", e);
      toast.error("Upload failed");
    }
  };

  const handleExport = (format: "png" | "jpg" | "svg" | "pdf") => {
    const c = canvasRef.current;
    if (!c) return;
    if (format === "pdf") {
      if (!doc) return;
      // Save current page state first
      const json = (c as unknown as { toJSON: (keys?: string[]) => unknown }).toJSON(["id", "meta"]);
      const updatedPages = doc.pages.map((p) =>
        p.id === activePageId ? { ...p, fabric: json as Record<string, unknown> } : p,
      );
      toast.promise(
        exportPDF(updatedPages, doc.canvas.width, doc.canvas.height, title),
        { loading: "Generating PDF…", success: "PDF downloaded", error: "PDF export failed" },
      );
      return;
    }
    if (format === "svg") {
      const blob = new Blob([exportSVG(c)], { type: "image/svg+xml" });
      downloadDataUrl(URL.createObjectURL(blob), `${title || "design"}.svg`);
      return;
    }
    const url = exportPNG(c, 2);
    downloadDataUrl(url, `${title || "design"}.${format}`);
  };

  if (query.isLoading || !doc) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  // Ensure color input stays valid when `doc.canvas.background` contains
  // complex CSS (gradients or images). Fall back to a safe hex for the color
  // picker while preserving the actual background value in `doc`.
  const canvasBg = doc.canvas.background || "";
  const isSimpleColor = /^(#|rgb|rgba|hsl|hsla|var\(|transparent)/i.test(canvasBg);
  const colorInputValue = isSimpleColor ? canvasBg : "#ffffff";

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-3">
        <div className="flex items-center gap-2">
          <Link
            to="/designs"
            className="rounded p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              markDirty();
            }}
            className="h-8 w-64 border-transparent bg-transparent text-base font-medium focus-visible:border-border"
          />
          <span className="text-xs text-muted-foreground">
            {saveStatus === "saved" && "All changes saved"}
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "dirty" && "Unsaved changes"}
            {saveStatus === "error" && "Save failed"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setZoom(zoom - 0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-xs tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={() => setZoom(zoom + 0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-6 w-px bg-border" />
          <Button variant="outline" size="sm" onClick={() => save.mutate()}>
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm"><Download className="mr-1 h-4 w-4" /> Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("png")}>PNG (2x)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("jpg")}>JPG (2x)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("svg")}>SVG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF (all pages)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div style={{ display: "flex", flex: "1 1 0", minHeight: 0, overflow: "hidden" }}>
        {/* Left toolbar */}
        <aside className="flex w-64 flex-col gap-4 border-r border-border bg-card p-3 overflow-y-auto flex-shrink-0">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Add element
            </div>
            <div className="grid grid-cols-3 gap-2">
              <ToolBtn icon={Type} label="Text" onClick={() => canvasRef.current && addText(canvasRef.current)} />
              <ToolBtn icon={Square} label="Rect" onClick={() => canvasRef.current && addRect(canvasRef.current)} />
              <ToolBtn icon={Circle} label="Circle" onClick={() => canvasRef.current && addCircle(canvasRef.current)} />
              <ToolBtn icon={Triangle} label="Tri" onClick={() => canvasRef.current && addTriangle(canvasRef.current)} />
              <ToolBtn icon={Minus} label="Line" onClick={() => canvasRef.current && addLine(canvasRef.current)} />
              <ToolBtn icon={Plus} label="Ellipse" onClick={() => canvasRef.current && addEllipse(canvasRef.current)} />
              <ToolBtn icon={ArrowLeft} label="Star" onClick={() => canvasRef.current && addStar(canvasRef.current)} />
              <ToolBtn icon={ImageIcon} label="Image" onClick={() => {
                const url = prompt("Image URL (or use Cloud upload later):");
                if (url && canvasRef.current) addImageFromUrl(canvasRef.current, url);
              }} />
              <ToolBtn icon={ImageIcon} label="Upload" onClick={() => fileInputRef.current?.click()} />
            </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileInput(f);
                  e.currentTarget.value = "";
                }}
              />
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              QR code
            </div>
            <div className="space-y-2">
              <Input
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                placeholder="URL or text"
                className="h-8 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => canvasRef.current && addQR(canvasRef.current, qrData)}
              >
                <QrCode className="mr-1 h-4 w-4" /> Insert QR
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selection
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ToolBtn icon={Copy} label="Duplicate" onClick={() => canvasRef.current && duplicateSelected(canvasRef.current)} />
              <ToolBtn icon={Trash2} label="Delete" onClick={() => canvasRef.current && deleteSelected(canvasRef.current)} />
              <ToolBtn icon={ChevronUp} label="Forward" onClick={() => canvasRef.current && bringForward(canvasRef.current)} />
              <ToolBtn icon={ChevronDown} label="Back" onClick={() => canvasRef.current && sendBackward(canvasRef.current)} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pages
              </div>
              <button
                onClick={addPage}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              {doc.pages.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-md border px-2 py-1.5 text-sm transition ${
                    activePageId === p.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <button onClick={() => handlePageSwitch(p.id)} className="flex-1 text-left">
                    {p.name || `Page ${i + 1}`}
                  </button>
                  {doc.pages.length > 1 && (
                    <button
                      onClick={() => removePage(p.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Canvas area */}
        <div
          ref={canvasScrollRef}
          style={{ flex: 1, minWidth: 0, overflow: "auto", background: "#0f0f1a" }}
        >
          <div style={{
            padding: "40px",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            minHeight: "100%",
          }}>
            <div style={{ flexShrink: 0 }}>
              <FabricCanvas onReady={(c) => { canvasRef.current = c; setCanvasInstance(c); }} />
            </div>
          </div>
        </div>

        {/* Right layers panel */}
        <div className="w-72 flex flex-col bg-card border-l border-border flex-shrink-0 overflow-y-auto">
          <LayersPanel canvas={canvasInstance} />
          
          <div className="border-t border-border p-3 space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Canvas
              </div>
              <div className="mt-3 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorInputValue}
                      onChange={(e) => {
                        const bg = e.target.value;
                        // 1. Update doc state (triggers FabricCanvas background effect)
                        setDoc({ ...doc, canvas: { ...doc.canvas, background: bg } });
                        // 2. Also apply directly to live canvas immediately
                        const c = canvasRef.current;
                        if (c) {
                          c.backgroundColor = bg;
                          c.requestRenderAll();
                        }
                        markDirty();
                      }}
                      className="h-9 w-9 rounded cursor-pointer border border-border p-0.5"
                    />
                    <Input
                      value={colorInputValue}
                      onChange={(e) => {
                        const bg = e.target.value;
                        if (!/^#[0-9a-fA-F]{0,6}$/.test(bg)) return;
                        setDoc({ ...doc, canvas: { ...doc.canvas, background: bg } });
                        const c = canvasRef.current;
                        if (c && /^#[0-9a-fA-F]{6}$/.test(bg)) {
                          c.backgroundColor = bg;
                          c.requestRenderAll();
                        }
                        markDirty();
                      }}
                      className="h-9 font-mono text-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Width</label>
                    <Input
                      type="number"
                      value={doc.canvas.width}
                      onChange={(e) => {
                        setDoc({ ...doc, canvas: { ...doc.canvas, width: +e.target.value || 0 } });
                        markDirty();
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Height</label>
                    <Input
                      type="number"
                      value={doc.canvas.height}
                      onChange={(e) => {
                        setDoc({ ...doc, canvas: { ...doc.canvas, height: +e.target.value || 0 } });
                        markDirty();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Type;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 rounded-md border border-border bg-background py-2 text-xs hover:border-primary hover:bg-primary/5"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
