/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * editor.$designId.tsx
 *
 * Full-featured design editor page.
 * Layout: fixed header → three-column body (left toolbar | scrollable canvas | right panel)
 *
 * Canvas is rendered at NATIVE size and scaled via CSS transform in FabricCanvas.
 * This file owns zoom state, keyboard shortcuts, save, export, and all UI panels.
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DesignAPI } from "@/lib/api/resources";
import { useEditorStore } from "@/store/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import type * as fabricTypes from "fabric";
import * as fabric from "fabric";
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
  Redo2,
  Undo2,
} from "lucide-react";
import {
  addCircle,
  addEllipse,
  addImageFromUrl,
  addLine,
  addQR,
  addRect,
  addRoundedRect,
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
import { apiError, tokenStore } from "@/lib/api/client";
import { CARD_TEMPLATES } from "@/lib/card-templates";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Lazy-load canvas + layers — Fabric.js requires browser APIs, must never run on SSR
const FabricCanvas = lazy(() =>
  import("@/components/editor/FabricCanvas").then((m) => ({ default: m.FabricCanvas })),
);
const LayersPanel = lazy(() =>
  import("@/components/editor/LayersPanel").then((m) => ({ default: m.LayersPanel })),
);

export const Route = createFileRoute("/editor/$designId")({
  head: () => ({ meta: [{ title: "Editor — card24" }] }),
  component: EditorPage,
});

// ── Legacy template migration ─────────────────────────────────────────────

const LEGACY_TEMPLATE_MATCHES: Array<{ marker: string; templateId: string }> = [
  { marker: "ALEX MORGAN", templateId: "c1" },
  { marker: "SARAH CHEN", templateId: "c2" },
  { marker: "DR. EMILY NGO", templateId: "c3" },
  { marker: "La Bella Cucina", templateId: "c4" },
  { marker: "NINA TORRES", templateId: "c5" },
];

function cloneDoc<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function textContent(doc: unknown) {
  const pages = (doc as any)?.pages;
  if (!Array.isArray(pages)) return "";
  return pages
    .flatMap((p) => (Array.isArray(p?.fabric?.objects) ? p.fabric.objects : []))
    .map((o) => String(o?.text ?? ""))
    .join("\n");
}

function repairLegacyTemplateDoc(doc: any) {
  const content = textContent(doc);
  const match = LEGACY_TEMPLATE_MATCHES.find((item) => content.includes(item.marker));
  const tpl = match ? CARD_TEMPLATES.find((item) => item.id === match.templateId) : null;
  return tpl ? cloneDoc(tpl.doc) : doc;
}

// ── Client-only wrapper (prevents Fabric SSR crash) ───────────────────────

function EditorPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <Editor />
    </Suspense>
  );
}

// ── Main Editor component ────────────────────────────────────────────────

function Editor() {
  const { designId } = Route.useParams();
  const navigate = useNavigate();

  // Fabric canvas ref — set by FabricCanvas.onReady
  const canvasRef = useRef<fabricTypes.Canvas | null>(null);
  const [canvasInstance, setCanvasInstance] = useState<fabricTypes.Canvas | null>(null);

  // Scroll container for the canvas area
  const canvasScrollRef = useRef<HTMLDivElement | null>(null);
  // Hidden file input for image upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [qrData, setQrData] = useState("https://card24.uz");
  const [activeObject, setActiveObject] = useState<fabricTypes.FabricObject | null>(null);
  const [objectVersion, setObjectVersion] = useState(0);
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

  // Store selectors
  const doc = useEditorStore((s) => s.doc);
  const designKey = useEditorStore((s) => s.designKey);
  const setDoc = useEditorStore((s) => s.setDoc);
  const resetDoc = useEditorStore((s) => s.resetDoc);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const removePage = useEditorStore((s) => s.removePage);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const markSaving = useEditorStore((s) => s.markSaving);
  const markSaved = useEditorStore((s) => s.markSaved);
  const markError = useEditorStore((s) => s.markError);
  const markDirty = useEditorStore((s) => s.markDirty);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isRestoringHistoryRef = useRef(false);
  const historyTimerRef = useRef<number | null>(null);

  // ── Data fetch ─────────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: ["design", designId],
    queryFn: () => DesignAPI.get(designId),
    staleTime: 0,
    refetchOnMount: true,
  });

  // Reset stale doc when designId changes
  const lastSyncedId = useRef<string | null>(null);
  useEffect(() => {
    resetDoc();
    lastSyncedId.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designId]);

  // Load design into store
  useEffect(() => {
    if (!query.data) return;
    if (lastSyncedId.current === query.data.id) return;
    lastSyncedId.current = query.data.id;

    setTitle(query.data.title);

    const w = query.data.data?.canvas?.width ?? 1050;
    const h = query.data.data?.canvas?.height ?? 600;

    // Initial zoom: fit canvas into available viewport
    // Left panel=256, right panel=288, padding=80, header=56
    const availW = window.innerWidth - 256 - 288 - 80;
    const availH = window.innerHeight - 56 - 80;
    if (availW > 50 && availH > 50) {
      // Cap at 1.0 — never upscale beyond native size
      const fz = Math.max(0.15, Math.min(availW / w, availH / h, 1.0));
      useEditorStore.setState({ zoom: parseFloat(fz.toFixed(2)) });
    }

    const repairedDoc = query.data.data;
    setDoc(repairedDoc);
  }, [query.data, setDoc]);

  // ── Active object tracking ───────────────────────────────────────────────
  const refreshActiveObject = () => {
    const c = canvasRef.current;
    setActiveObject((c?.getActiveObject() as fabricTypes.FabricObject | undefined) ?? null);
    setObjectVersion((v) => v + 1);
  };

  const updateHistoryState = useCallback(() => {
    setHistoryState({
      canUndo: historyIndexRef.current > 0,
      canRedo:
        historyIndexRef.current >= 0 && historyIndexRef.current < historyRef.current.length - 1,
    });
  }, []);

  const getCanvasSnapshot = useCallback(() => {
    const c = canvasRef.current ?? canvasInstance;
    if (!c) return null;
    const json = (c as unknown as { toJSON: (keys?: string[]) => unknown }).toJSON([
      "id",
      "meta",
      "name",
    ]);
    return JSON.stringify(json);
  }, [canvasInstance]);

  const pushHistory = useCallback(() => {
    if (isRestoringHistoryRef.current) return;
    const snapshot = getCanvasSnapshot();
    if (!snapshot) return;

    const current = historyRef.current[historyIndexRef.current];
    if (current === snapshot) return;

    const next = historyRef.current.slice(0, historyIndexRef.current + 1);
    next.push(snapshot);
    historyRef.current = next.slice(-80);
    historyIndexRef.current = historyRef.current.length - 1;
    updateHistoryState();
  }, [getCanvasSnapshot, updateHistoryState]);

  const scheduleHistoryPush = useCallback(() => {
    if (historyTimerRef.current) window.clearTimeout(historyTimerRef.current);
    historyTimerRef.current = window.setTimeout(pushHistory, 120);
  }, [pushHistory]);

  const resetHistory = useCallback(() => {
    const snapshot = getCanvasSnapshot();
    historyRef.current = snapshot ? [snapshot] : [];
    historyIndexRef.current = snapshot ? 0 : -1;
    updateHistoryState();
  }, [getCanvasSnapshot, updateHistoryState]);

  const restoreHistory = useCallback(
    async (direction: "undo" | "redo") => {
      const c = canvasRef.current ?? canvasInstance;
      if (!c) return;
      const nextIndex =
        direction === "undo" ? historyIndexRef.current - 1 : historyIndexRef.current + 1;
      const snapshot = historyRef.current[nextIndex];
      if (!snapshot) return;

      isRestoringHistoryRef.current = true;
      c.discardActiveObject();
      const parsed = JSON.parse(snapshot);
      const result = c.loadFromJSON(parsed);
      const finish = () => {
        historyIndexRef.current = nextIndex;
        c.requestRenderAll();
        refreshActiveObject();
        updateHistoryState();
        markDirty();
        isRestoringHistoryRef.current = false;
      };

      if (result && typeof (result as Promise<unknown>).then === "function") {
        await (result as Promise<unknown>).catch(() => undefined);
      }
      finish();
    },
    [canvasInstance, markDirty, updateHistoryState],
  );

  const undo = useCallback(() => restoreHistory("undo"), [restoreHistory]);
  const redo = useCallback(() => restoreHistory("redo"), [restoreHistory]);

  // Listen to canvas selection / modification events
  useEffect(() => {
    const c = canvasInstance;
    if (!c) return;
    const EVENTS = [
      "selection:created",
      "selection:updated",
      "selection:cleared",
      "object:modified",
      "object:moving",
      "object:scaling",
      "object:rotating",
    ] as const;
    const refresh = () => refreshActiveObject();
    EVENTS.forEach((ev) => c.on(ev, refresh));
    refresh();
    return () => EVENTS.forEach((ev) => c.off(ev, refresh));
  }, [canvasInstance]);

  useEffect(() => {
    const c = canvasInstance;
    if (!c) return;
    const events = ["object:added", "object:removed", "object:modified", "text:changed"] as const;
    const handler = () => scheduleHistoryPush();
    events.forEach((event) => c.on(event, handler));
    const timer = window.setTimeout(resetHistory, 250);
    return () => {
      events.forEach((event) => c.off(event, handler));
      window.clearTimeout(timer);
      if (historyTimerRef.current) window.clearTimeout(historyTimerRef.current);
    };
  }, [canvasInstance, activePageId, designKey, resetHistory, scheduleHistoryPush]);

  // Also refresh when selectedIds changes (e.g., reorder from layers panel)
  useEffect(() => {
    refreshActiveObject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join("|")]);

  // ── Save mutation ────────────────────────────────────────────────────────
  const save = useMutation({
    mutationFn: async () => {
      const c = canvasRef.current;
      if (!c || !doc || !activePageId) return;
      markSaving();
      const json = (c as unknown as { toJSON: (keys?: string[]) => unknown }).toJSON([
        "id",
        "meta",
      ]);
      const updatedPages = doc.pages.map((p) =>
        p.id === activePageId ? { ...p, fabric: json } : p,
      );
      const updatedDoc = { ...doc, pages: updatedPages };
      return DesignAPI.update(designId, { title, data: updatedDoc });
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

  // Auto-save 1.5 s after last dirty mark
  useEffect(() => {
    if (saveStatus !== "dirty") return;
    const t = setTimeout(() => save.mutate(), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveStatus]);

  // Clipboard ref for Ctrl+C / Ctrl+V
  const clipboardRef = useRef<fabricTypes.FabricObject | null>(null);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const c = canvasRef.current ?? canvasInstance;
      if (!c) return;

      const target = e.target as HTMLElement;
      const tag = target.tagName.toUpperCase();
      const isCanvas = tag === "CANVAS";
      if (!isCanvas && (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable)) return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Delete / Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && !ctrl) {
        const active = c.getActiveObject();
        if (!active || (active as any).isEditing) return;
        e.preventDefault();
        deleteSelected(c);
        markDirty();
        return;
      }

      // Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z
      if (ctrl && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if (
        (ctrl && e.key.toLowerCase() === "y") ||
        (ctrl && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl+C — copy selected object to clipboard
      if (ctrl && e.key.toLowerCase() === "c") {
        const active = c.getActiveObject();
        if (!active) return;
        e.preventDefault();
        active.clone().then((cloned: fabricTypes.FabricObject) => {
          clipboardRef.current = cloned;
        });
        return;
      }

      // Ctrl+V — paste from clipboard
      if (ctrl && e.key.toLowerCase() === "v") {
        if (!clipboardRef.current) return;
        e.preventDefault();
        clipboardRef.current.clone().then((cloned: fabricTypes.FabricObject) => {
          c.discardActiveObject();
          cloned.set({
            left: (cloned.left ?? 0) + 20,
            top: (cloned.top ?? 0) + 20,
          });
          (cloned as any).id = `obj-${Date.now()}`;
          c.add(cloned);
          c.setActiveObject(cloned);
          c.requestRenderAll();
          markDirty();
          // Update clipboard offset for repeated pastes
          clipboardRef.current = cloned;
        });
        return;
      }

      // Ctrl+D — duplicate
      if (ctrl && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateSelected(c);
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
        const objs = c.getObjects();
        if (objs.length > 0) {
          const sel = new fabric.ActiveSelection(objs as fabricTypes.FabricObject[], { canvas: c });
          c.setActiveObject(sel);
          c.requestRenderAll();
        }
        return;
      }

      // Escape — deselect
      if (e.key === "Escape") {
        c.discardActiveObject();
        c.requestRenderAll();
        return;
      }

      // Arrow keys — nudge
      const moveKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (moveKeys.includes(e.key)) {
        const obj = c.getActiveObject();
        if (!obj || (obj as any).isEditing) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft") obj.set({ left: (obj.left ?? 0) - step });
        if (e.key === "ArrowRight") obj.set({ left: (obj.left ?? 0) + step });
        if (e.key === "ArrowUp") obj.set({ top: (obj.top ?? 0) - step });
        if (e.key === "ArrowDown") obj.set({ top: (obj.top ?? 0) + step });
        obj.setCoords();
        c.requestRenderAll();
        markDirty();
        return;
      }

      if (e.key === "[") {
        e.preventDefault();
        sendBackward(c);
        markDirty();
        return;
      }
      if (e.key === "]") {
        e.preventDefault();
        bringForward(c);
        markDirty();
        return;
      }

      if (ctrl && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        setZoom(Math.min(zoom + 0.1, 4));
        return;
      }
      if (ctrl && e.key === "-") {
        e.preventDefault();
        setZoom(Math.max(zoom - 0.1, 0.1));
        return;
      }
      if (ctrl && e.key === "0") {
        e.preventDefault();
        if (doc) {
          const aw = Math.max(200, window.innerWidth - 256 - 288 - 80);
          const ah = Math.max(200, window.innerHeight - 56 - 80);
          setZoom(
            Math.max(
              0.15,
              parseFloat(Math.min(aw / doc.canvas.width, ah / doc.canvas.height, 1).toFixed(2)),
            ),
          );
        }
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, doc, markDirty, setZoom, canvasInstance, undo, redo]);

  useEffect(() => {
    const el = canvasScrollRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const direction = e.deltaY > 0 ? -0.08 : 0.08;
      setZoom(Math.max(0.1, Math.min(4, zoom + direction)));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [setZoom, zoom]);

  // ── Center scroll after zoom / page / doc changes ───────────────────────
  useEffect(() => {
    const el = canvasScrollRef.current;
    if (!el) return;
    const center = () => {
      const excess = el.scrollWidth - el.clientWidth;
      if (excess > 0) el.scrollLeft = Math.round(excess / 2);
    };
    center();
    const t1 = setTimeout(center, 50);
    const t2 = setTimeout(center, 200);
    const t3 = setTimeout(center, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [zoom, doc?.canvas.width, doc?.canvas.height, activePageId]);

  // ── Page switch — snapshot current fabric state first ───────────────────
  const handlePageSwitch = (newId: string) => {
    const c = canvasRef.current;
    if (!c || !doc || !activePageId) {
      setActivePage(newId);
      return;
    }
    const json = (c as unknown as { toJSON: (keys?: string[]) => unknown }).toJSON(["id", "meta"]);
    const pages = doc.pages.map((p) => (p.id === activePageId ? { ...p, fabric: json } : p));
    setDoc({ ...doc, pages });
    setActivePage(newId);
  };

  // ── Image upload ─────────────────────────────────────────────────────────
  const handleFileInput = async (file?: File) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const base = (import.meta.env.VITE_API_URL as string) || "http://localhost:9000";
      const res = await fetch(`${base}/upload`, {
        method: "POST",
        body: fd,
        headers: tokenStore.access ? { Authorization: `Bearer ${tokenStore.access}` } : undefined,
      });
      const data = await res.json();
      if (data?.url && canvasRef.current) {
        const url = base.replace(/\/$/, "") + data.url;
        addImageFromUrl(canvasRef.current, url);
        markDirty();
      }
    } catch {
      toast.error("Upload failed");
    }
  };

  // ── Export ───────────────────────────────────────────────────────────────
  const handleExport = (format: "png" | "jpg" | "svg" | "pdf") => {
    const c = canvasRef.current;
    if (!c) return;

    if (format === "pdf") {
      if (!doc) return;
      const json = (c as unknown as { toJSON: (keys?: string[]) => unknown }).toJSON([
        "id",
        "meta",
      ]);
      const updatedPages = doc.pages.map((p) =>
        p.id === activePageId ? { ...p, fabric: json as Record<string, unknown> } : p,
      );
      toast.promise(
        exportPDF(
          updatedPages as Array<{ fabric: Record<string, unknown> }>,
          doc.canvas.width,
          doc.canvas.height,
          title,
        ),
        { loading: "Generating PDF…", success: "PDF downloaded", error: "PDF export failed" },
      );
      return;
    }

    if (format === "svg") {
      const blob = new Blob([exportSVG(c)], { type: "image/svg+xml" });
      downloadDataUrl(URL.createObjectURL(blob), `${title || "design"}.svg`);
      return;
    }

    const url =
      format === "jpg"
        ? exportJPG(c, 2, doc?.canvas.width, doc?.canvas.height)
        : exportPNG(c, 2, doc?.canvas.width, doc?.canvas.height);
    downloadDataUrl(url, `${title || "design"}.${format}`);
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (query.isLoading || !doc) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#05070f] text-slate-400">
        Loading editor…
      </div>
    );
  }

  // Safe color for the <input type="color"> — gradients / images are not valid there
  const canvasBg = doc.canvas.background || "";
  const isSimpleColor = /^(#|rgb|rgba|hsl|hsla|var\(|transparent)/i.test(canvasBg);
  const colorInputVal = isSimpleColor ? canvasBg : "#ffffff";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col bg-[#05070f] text-slate-100">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header
        className="flex h-14 flex-shrink-0 items-center justify-between border-b border-sky-300/10 bg-[#070b18]/95 px-3 shadow-[0_12px_40px_rgba(2,8,28,0.35)]"
        style={{ position: "relative", zIndex: 20 }}
      >
        <div className="flex items-center gap-2">
          <Link
            to="/designs"
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Back to designs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              markDirty();
            }}
            className="h-8 w-64 border-transparent bg-white/5 text-base font-medium text-white focus-visible:border-sky-300/30"
            aria-label="Design title"
          />
          <span className="text-xs text-slate-400">
            {saveStatus === "saved" && "All changes saved"}
            {saveStatus === "saving" && "Saving…"}
            {saveStatus === "dirty" && "Unsaved changes"}
            {saveStatus === "error" && "Save failed"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!historyState.canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!historyState.canRedo}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-6 w-px bg-white/10" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(zoom - 0.1)}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(zoom + 0.1)}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-6 w-px bg-white/10" />
          <Button variant="outline" size="sm" onClick={() => save.mutate()}>
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Download className="mr-1 h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("png")}>PNG (2×)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("jpg")}>JPG (2×)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("svg")}>SVG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                PDF (all pages)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ── Body: left toolbar | canvas | right panel ─────────────────────── */}
      <div style={{ display: "flex", flex: "1 1 0", minHeight: 0, overflow: "hidden" }}>
        {/* Left toolbar ─────────────────────────────────────────────────── */}
        <aside
          className="flex w-64 flex-shrink-0 flex-col gap-4 overflow-y-auto border-r border-sky-300/10 bg-[#070b18] p-3"
          style={{ position: "relative", zIndex: 10 }}
        >
          {/* Add element */}
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Add element
            </p>
            <div className="grid grid-cols-3 gap-2">
              <ToolBtn
                icon={Type}
                label="Text"
                onClick={() => canvasRef.current && addText(canvasRef.current)}
              />
              <ToolBtn
                icon={Square}
                label="Rect"
                onClick={() => canvasRef.current && addRect(canvasRef.current)}
              />
              <ToolBtn
                icon={Square}
                label="Round"
                onClick={() => canvasRef.current && addRoundedRect(canvasRef.current)}
              />
              <ToolBtn
                icon={Circle}
                label="Circle"
                onClick={() => canvasRef.current && addCircle(canvasRef.current)}
              />
              <ToolBtn
                icon={Triangle}
                label="Tri"
                onClick={() => canvasRef.current && addTriangle(canvasRef.current)}
              />
              <ToolBtn
                icon={Minus}
                label="Line"
                onClick={() => canvasRef.current && addLine(canvasRef.current)}
              />
              <ToolBtn
                icon={Plus}
                label="Ellipse"
                onClick={() => canvasRef.current && addEllipse(canvasRef.current)}
              />
              <ToolBtn
                icon={ImageIcon}
                label="Image"
                onClick={() => {
                  const url = prompt("Image URL:");
                  if (url && canvasRef.current) addImageFromUrl(canvasRef.current, url);
                }}
              />
              <ToolBtn
                icon={ImageIcon}
                label="Upload"
                onClick={() => fileInputRef.current?.click()}
              />
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
          </section>

          {/* QR code */}
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              QR code
            </p>
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
          </section>

          {/* Selection actions */}
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selection
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ToolBtn
                icon={Copy}
                label="Duplicate"
                onClick={() => canvasRef.current && duplicateSelected(canvasRef.current)}
              />
              <ToolBtn
                icon={Trash2}
                label="Delete"
                onClick={() => canvasRef.current && deleteSelected(canvasRef.current)}
              />
              <ToolBtn
                icon={ChevronUp}
                label="Forward"
                onClick={() => canvasRef.current && bringForward(canvasRef.current)}
              />
              <ToolBtn
                icon={ChevronDown}
                label="Back"
                onClick={() => canvasRef.current && sendBackward(canvasRef.current)}
              />
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shortcuts
            </p>
            <div className="mt-2 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
              <span>Undo / Redo</span>
              <kbd className="font-mono">Ctrl Z / Y</kbd>
              <span>Copy / Paste</span>
              <kbd className="font-mono">Ctrl C / V</kbd>
              <span>Duplicate</span>
              <kbd className="font-mono">Ctrl D</kbd>
              <span>Nudge</span>
              <kbd className="font-mono">Arrows</kbd>
              <span>Big nudge</span>
              <kbd className="font-mono">Shift + Arrows</kbd>
              <span>Save</span>
              <kbd className="font-mono">Ctrl S</kbd>
            </div>
          </section>
        </aside>

        {/* Canvas area ──────────────────────────────────────────────────── */}
        {/*
          overflow:auto  → scroll bars appear when canvas is bigger than container
          minWidth on the inner div = nativeW * zoom + 80  → correct scroll range
        */}
        <div
          ref={canvasScrollRef}
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "auto",
            background:
              "radial-gradient(circle at 72% 18%, rgba(47,107,255,0.20), transparent 35%), linear-gradient(rgba(148,178,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,178,255,0.04) 1px, transparent 1px), #05070f",
            backgroundSize: "auto, 44px 44px, 44px 44px, auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
              width: "100%",
              minHeight: "100%",
              padding: "40px",
              boxSizing: "border-box",
            }}
          >
            <div className="relative">
              <FabricCanvas
                onReady={(c) => {
                  canvasRef.current = c;
                  setCanvasInstance(c);
                }}
              />
              <RectCornerOverlay
                canvas={canvasInstance}
                object={activeObject}
                zoom={zoom}
                onDirty={() => {
                  markDirty();
                  refreshActiveObject();
                }}
              />
            </div>
            <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-xl border border-sky-300/10 bg-[#070b18]/90 p-2 shadow-[0_18px_50px_rgba(2,8,28,0.35)]">
              {doc.pages.map((p, i) => {
                const label = i === 0 ? "Front" : i === 1 ? "Back" : p.name || `Page ${i + 1}`;
                return (
                  <div
                    key={p.id}
                    className={`group flex min-w-28 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition ${
                      activePageId === p.id
                        ? "border-primary bg-primary/15 text-white"
                        : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-sky-300/40 hover:text-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handlePageSwitch(p.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block font-semibold">{label}</span>
                      <span className="mt-0.5 block text-[10px] text-slate-500">
                        {doc.canvas.width} x {doc.canvas.height}
                      </span>
                    </button>
                    {doc.pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePage(p.id)}
                        className="rounded p-1 text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"
                        aria-label={`Remove ${label}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={addPage}
                className="flex min-w-28 items-center justify-center gap-2 rounded-lg border border-dashed border-sky-300/30 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-primary hover:bg-primary/10 hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add page
              </button>
            </div>
          </div>
        </div>

        {/* Right panel: layers + object inspector + canvas settings ────── */}
        <div
          className="flex w-72 flex-shrink-0 flex-col overflow-y-auto border-l border-sky-300/10 bg-[#070b18]"
          style={{ position: "relative", zIndex: 10 }}
        >
          {/* Layers panel */}
          <LayersPanel canvas={canvasInstance} />

          {/* Object inspector + canvas settings */}
          <div className="space-y-3 border-t border-white/10 p-3">
            <ObjectInspector
              canvas={canvasInstance}
              object={activeObject}
              onDirty={() => {
                markDirty();
                refreshActiveObject();
              }}
            />

            {/* Canvas settings */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Canvas
              </p>
              <div className="mt-3 space-y-3">
                {/* Background */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorInputVal}
                      onChange={(e) => {
                        const bg = e.target.value;
                        setDoc({ ...doc, canvas: { ...doc.canvas, background: bg } });
                        const c = canvasRef.current;
                        if (c) {
                          c.backgroundColor = bg;
                          c.requestRenderAll();
                        }
                        markDirty();
                      }}
                      className="h-9 w-9 cursor-pointer rounded border border-border p-0.5"
                    />
                    <Input
                      value={colorInputVal}
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

                {/* Width / Height */}
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

                {/* Corner radius (0–60 px slider) */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Corner Radius</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={1}
                      value={doc.canvas.borderRadius ?? 0}
                      onChange={(e) => {
                        setDoc({
                          ...doc,
                          canvas: { ...doc.canvas, borderRadius: +e.target.value },
                        });
                        markDirty();
                      }}
                      className="h-2 flex-1 cursor-pointer accent-primary"
                    />
                    <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                      {doc.canvas.borderRadius ?? 0}px
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ObjectInspector ──────────────────────────────────────────────────────

function ObjectInspector({
  canvas,
  object,
  onDirty,
}: {
  canvas: fabricTypes.Canvas | null;
  object: fabricTypes.FabricObject | null;
  onDirty: () => void;
}) {
  if (!canvas || !object || object.type === "activeSelection") {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-xs text-slate-400">
        Select one element to edit its properties.
      </div>
    );
  }

  const anyObj = object as any;
  const objectType = String(object.type ?? "object").toLowerCase();
  const isText = ["i-text", "textbox", "text"].includes(objectType);
  const canFill = !["image", "group", "activeSelection"].includes(objectType);
  const canStroke = !["image", "activeSelection"].includes(objectType);
  const baseW = Math.max(1, Number(object.width ?? 1));
  const baseH = Math.max(1, Number(object.height ?? 1));
  const visualW = Math.round(baseW * Number(object.scaleX ?? 1));
  const visualH = Math.round(baseH * Number(object.scaleY ?? 1));
  const maxRadius = Math.max(0, Math.round(Math.min(visualW, visualH) / 2));

  const safeHex = (v: unknown, fallback: string) =>
    typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;

  const apply = (props: Record<string, unknown>) => {
    object.set(props);
    object.setCoords();
    canvas.requestRenderAll();
    onDirty();
  };

  const setNum = (key: string, raw: string) => {
    const v = Number(raw);
    if (Number.isFinite(v)) apply({ [key]: v });
  };

  const setVisualSize = (key: "width" | "height", raw: string) => {
    const v = Number(raw);
    if (!Number.isFinite(v) || v <= 0) return;
    if (key === "width") apply({ scaleX: v / baseW });
    if (key === "height") apply({ scaleY: v / baseH });
  };

  return (
    <div className="space-y-3 border-b border-white/10 pb-3">
      {/* Type badge */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Element
        </p>
        <div className="mt-2 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs font-medium text-slate-200">
          {objectType}
        </div>
      </div>

      {/* Text content */}
      {isText && (
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Text</label>
          <Input
            value={String(anyObj.text ?? "")}
            onChange={(e) => apply({ text: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
      )}

      {/* Position + Size */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">X</label>
          <Input
            type="number"
            value={Math.round(object.left ?? 0)}
            onChange={(e) => setNum("left", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Y</label>
          <Input
            type="number"
            value={Math.round(object.top ?? 0)}
            onChange={(e) => setNum("top", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Width</label>
          <Input
            type="number"
            value={visualW}
            onChange={(e) => setVisualSize("width", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Height</label>
          <Input
            type="number"
            value={visualH}
            onChange={(e) => setVisualSize("height", e.target.value)}
          />
        </div>
      </div>

      {/* Rotation + Opacity */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Rotate</label>
          <Input
            type="number"
            value={Math.round(object.angle ?? 0)}
            onChange={(e) => setNum("angle", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Opacity %</label>
          <Input
            type="number"
            min={0}
            max={100}
            value={Math.round(Number(object.opacity ?? 1) * 100)}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v)) apply({ opacity: Math.max(0, Math.min(100, v)) / 100 });
            }}
          />
        </div>
      </div>

      {/* Fill */}
      {canFill && (
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Fill</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={safeHex(object.get("fill"), "#111111")}
              onChange={(e) => apply({ fill: e.target.value })}
              className="h-9 w-9 cursor-pointer rounded border border-white/10 bg-white/5 p-0.5"
            />
            <Input
              value={String(object.get("fill") ?? "")}
              onChange={(e) => apply({ fill: e.target.value })}
              className="h-9 font-mono text-sm"
            />
          </div>
        </div>
      )}

      {/* Stroke */}
      {canStroke && (
        <div className="grid grid-cols-[1fr_72px] gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Stroke</label>
            <Input
              value={String(object.get("stroke") ?? "")}
              onChange={(e) => apply({ stroke: e.target.value || undefined })}
              className="h-9 font-mono text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Size</label>
            <Input
              type="number"
              value={Number(object.get("strokeWidth") ?? 0)}
              onChange={(e) => setNum("strokeWidth", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Corner radius — rect only */}
      {objectType === "rect" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs text-muted-foreground">Corner Radius</label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(Number(anyObj.rx ?? 0))}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={Math.max(maxRadius, 80)}
              step={1}
              value={Number(anyObj.rx ?? 0)}
              onChange={(e) => {
                const v = Math.min(maxRadius, Number(e.target.value));
                apply({ rx: v, ry: v });
              }}
              className="flex-1 h-2 cursor-pointer accent-primary"
            />
            <Input
              type="number"
              min={0}
              max={500}
              value={Math.round(Number(anyObj.rx ?? 0))}
              onChange={(e) => {
                const v = Math.max(0, Number(e.target.value));
                apply({ rx: Math.min(maxRadius, v), ry: Math.min(maxRadius, v) });
              }}
              className="h-9 w-16 text-sm"
            />
          </div>
          <div className="grid grid-cols-4 gap-1">
            {Array.from(new Set([0, 8, 16, 24, 32, maxRadius])).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => apply({ rx: value, ry: value })}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-400 hover:border-primary hover:text-white"
              >
                {value === maxRadius ? "Pill" : value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Font (text only) */}
      {isText && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Font size</label>
            <Input
              type="number"
              value={Number(anyObj.fontSize ?? 16)}
              onChange={(e) => setNum("fontSize", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Weight</label>
            <Input
              value={String(anyObj.fontWeight ?? "400")}
              onChange={(e) => apply({ fontWeight: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function RectCornerOverlay({
  canvas,
  object,
  zoom,
  onDirty,
}: {
  canvas: fabricTypes.Canvas | null;
  object: fabricTypes.FabricObject | null;
  zoom: number;
  onDirty: () => void;
}) {
  if (!canvas || !object || String(object.type ?? "").toLowerCase() !== "rect") return null;

  const anyObj = object as any;
  const rect = object.getBoundingRect();
  const visualW = Math.max(1, rect.width);
  const visualH = Math.max(1, rect.height);
  const maxRadius = Math.max(0, Math.round(Math.min(visualW, visualH) / 2));
  const radius = Math.min(maxRadius, Math.round(Number(anyObj.rx ?? 0)));
  const left = Math.round((rect.left + rect.width) * zoom + 12);
  const top = Math.max(8, Math.round(rect.top * zoom - 10));

  const applyRadius = (value: number) => {
    const next = Math.max(0, Math.min(maxRadius, value));
    object.set({ rx: next, ry: next });
    object.setCoords();
    canvas.requestRenderAll();
    onDirty();
  };

  return (
    <div
      className="absolute z-20 w-44 rounded-lg border border-sky-300/20 bg-[#070b18] p-2 text-slate-100 shadow-[0_20px_50px_rgba(2,8,28,0.45)]"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">Corners</span>
        <span className="tabular-nums text-muted-foreground">{radius}px</span>
      </div>
      <input
        type="range"
        min={0}
        max={Math.max(maxRadius, 1)}
        value={radius}
        onChange={(e) => applyRadius(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-primary"
      />
      <div className="mt-2 grid grid-cols-4 gap-1">
        {[0, 8, 16, maxRadius].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => applyRadius(value)}
            className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1 text-[11px] text-slate-400 hover:border-primary hover:text-white"
          >
            {value === maxRadius ? "Pill" : value}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── ToolBtn ──────────────────────────────────────────────────────────────

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
      className="flex flex-col items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs text-slate-300 transition hover:border-primary hover:bg-primary/15 hover:text-white"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
