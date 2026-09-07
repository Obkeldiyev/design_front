/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  Save,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Plus,
  Palette,
  Settings2,
  GripVertical,
  ExternalLink,
  Globe,
  CheckCircle,
  Redo2,
  Undo2,
  Image as ImageIcon,
} from "lucide-react";

// Lazy-load BlockRenderer — it contains canvas/DOM-heavy code that breaks SSR
import { lazy, Suspense } from "react";
const BlockRenderer = lazy(() =>
  import("@/components/website-builder/BlockRenderer").then((m) => ({ default: m.BlockRenderer })),
);
const BlockSettings = lazy(() =>
  import("@/components/website-builder/BlockSettings").then((m) => ({ default: m.BlockSettings })),
);
import type { Block, BlockType, WebsiteTheme } from "@/lib/website-blocks";
import { BLOCK_META, DEFAULT_THEME, createBlock } from "@/lib/website-blocks";
import { generateId } from "@/lib/uuid";
import { toast } from "sonner";
import { WebsiteAPI } from "@/lib/api/resources";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/websites/$id/edit")({
  head: () => ({ meta: [{ title: "Website Builder — card24" }] }),
  component: WebsiteBuilderPage,
});

// Client-only wrapper — prevents SSR for drag-drop and canvas code
function WebsiteBuilderPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05070f]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#05070f]">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <WebsiteBuilder />
    </Suspense>
  );
}

type Viewport = "desktop" | "tablet" | "mobile";
type PanelTab = "blocks" | "theme" | "assets";
type WebsiteSnapshot = { title: string; blocks: Block[]; theme: WebsiteTheme };

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

function WebsiteBuilder() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const [title, setTitle] = useState("My Website");
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [theme, setTheme] = useState<WebsiteTheme>(DEFAULT_THEME);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [panelTab, setPanelTab] = useState<PanelTab>("blocks");
  const [preview, setPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const historyTimerRef = useRef<number | null>(null);
  const isRestoringHistoryRef = useRef(false);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;
  const selectedBlockIndex = selectedBlock
    ? blocks.findIndex((b) => b.id === selectedBlock.id)
    : -1;

  const serializeSnapshot = useCallback(
    (snapshot?: WebsiteSnapshot) => JSON.stringify(snapshot ?? { title, blocks, theme }),
    [blocks, theme, title],
  );

  const updateHistoryState = useCallback(() => {
    setHistoryState({
      canUndo: historyIndexRef.current > 0,
      canRedo:
        historyIndexRef.current >= 0 && historyIndexRef.current < historyRef.current.length - 1,
    });
  }, []);

  const resetHistory = useCallback(
    (snapshot: WebsiteSnapshot) => {
      historyRef.current = [serializeSnapshot(snapshot)];
      historyIndexRef.current = 0;
      updateHistoryState();
    },
    [serializeSnapshot, updateHistoryState],
  );

  const pushHistory = useCallback(() => {
    if (isRestoringHistoryRef.current) return;
    const snapshot = serializeSnapshot();
    const current = historyRef.current[historyIndexRef.current];
    if (current === snapshot) return;

    const next = historyRef.current.slice(0, historyIndexRef.current + 1);
    next.push(snapshot);
    historyRef.current = next.slice(-80);
    historyIndexRef.current = historyRef.current.length - 1;
    updateHistoryState();
  }, [serializeSnapshot, updateHistoryState]);

  const restoreHistory = useCallback(
    (direction: "undo" | "redo") => {
      const nextIndex =
        direction === "undo" ? historyIndexRef.current - 1 : historyIndexRef.current + 1;
      const snapshot = historyRef.current[nextIndex];
      if (!snapshot) return;

      const parsed = JSON.parse(snapshot) as WebsiteSnapshot;
      isRestoringHistoryRef.current = true;
      setTitle(parsed.title);
      setBlocks(parsed.blocks);
      setTheme(parsed.theme);
      setSelectedBlockId((current) =>
        current && parsed.blocks.some((block) => block.id === current) ? current : null,
      );
      setSaveStatus("idle");
      historyIndexRef.current = nextIndex;
      updateHistoryState();
      window.setTimeout(() => {
        isRestoringHistoryRef.current = false;
      }, 0);
    },
    [updateHistoryState],
  );

  // ── Data loading ──────────────────────────────────────────────────────────
  // Track the updatedAt of the last server data we loaded so we can detect
  // when the server has newer data (e.g. after re-entering the editor).
  const loadedDataKey = useRef<string>("");

  const websiteQuery = useQuery({
    queryKey: ["website", id],
    queryFn: () => WebsiteAPI.get(id),
    enabled: !!id && id !== "new",
    staleTime: 0, // always fetch fresh on mount
    refetchOnWindowFocus: false,
  });

  // Hydrate whenever we get server data that is different from what we loaded last
  useEffect(() => {
    const w = websiteQuery.data;
    if (!w) return;

    // Use updatedAt + id as the unique key for this server snapshot
    const key = `${w.id}:${w.updatedAt ?? ""}`;
    if (loadedDataKey.current === key) return; // same data — skip
    loadedDataKey.current = key;

    const cfg = w.config as any;
    const nextTitle = w.title || "My Website";
    const nextBlocks = Array.isArray(cfg?.blocks) ? cfg.blocks : [];
    const nextTheme = cfg?.theme ? { ...DEFAULT_THEME, ...cfg.theme } : DEFAULT_THEME;

    setTitle(nextTitle);
    setSubdomain(w.subdomain ?? null);
    setBlocks(nextBlocks);
    setTheme(nextTheme);
    resetHistory({ title: nextTitle, blocks: nextBlocks, theme: nextTheme });
    setSaveStatus("idle");
  }, [resetHistory, websiteQuery.data]);

  // Reset loaded key when id changes so new website always hydrates
  useEffect(() => {
    loadedDataKey.current = "";
  }, [id]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const liveUrl = subdomain ? `${origin}/site/${subdomain}` : null;

  // ── Save ──────────────────────────────────────────────────────────────────
  const save = useMutation({
    mutationFn: () =>
      WebsiteAPI.update(id, {
        title,
        subdomain: subdomain || undefined,
        config: { blocks, theme },
      }),
    onMutate: () => setSaveStatus("saving"),
    onSuccess: (updated) => {
      // Update query cache with the fresh data from the server
      // This ensures next time we open the editor we get the saved version
      qc.setQueryData(["website", id], updated);
      // Update loadedDataKey so we don't re-hydrate from this response
      const key = `${updated.id}:${updated.updatedAt ?? ""}`;
      loadedDataKey.current = key;
      // Also refresh the list
      qc.invalidateQueries({ queryKey: ["websites"] });
      setSaveStatus("saved");
      toast.success("Saved!");
      setTimeout(() => setSaveStatus("idle"), 3000);
    },
    onError: (err: any) => {
      setSaveStatus("idle");
      toast.error(err?.message ?? "Failed to save");
    },
  });

  useEffect(() => {
    if (isRestoringHistoryRef.current) return;
    if (historyTimerRef.current) window.clearTimeout(historyTimerRef.current);
    historyTimerRef.current = window.setTimeout(pushHistory, 180);
    return () => {
      if (historyTimerRef.current) window.clearTimeout(historyTimerRef.current);
    };
  }, [blocks, pushHistory, theme, title]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;

      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        restoreHistory("undo");
      }
      if (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey)) {
        e.preventDefault();
        restoreHistory("redo");
      }
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        save.mutate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [restoreHistory, save]);

  // ── Block operations ──────────────────────────────────────────────────────
  const insertBlock = useCallback((type: BlockType, index = Number.POSITIVE_INFINITY) => {
    const b = createBlock(type);
    setBlocks((prev) => {
      const next = [...prev];
      const at = Math.max(0, Math.min(index, next.length));
      next.splice(at, 0, b);
      return next.map((block, i) => ({ ...block, order: i }));
    });
    setSelectedBlockId(b.id);
    setPanelTab("blocks");
    setTimeout(() => {
      document
        .getElementById(`block-${b.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  const addBlock = useCallback((type: BlockType) => insertBlock(type), [insertBlock]);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setSelectedBlockId((cur) => (cur === blockId ? null : cur));
  }, []);

  const duplicateBlock = useCallback((blockId: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      if (idx === -1) return prev;
      const newBlock: Block = {
        ...prev[idx],
        id: generateId(),
        content: { ...prev[idx].content },
        order: idx + 1,
      };
      const next = [...prev];
      next.splice(idx + 1, 0, newBlock);
      setSelectedBlockId(newBlock.id);
      return next.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  const moveBlock = useCallback((blockId: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      if (idx === -1) return prev;
      if (direction === "up" && idx === 0) return prev;
      if (direction === "down" && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  const updateBlock = useCallback((blockId: string, content: Record<string, any>) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, content } : b)));
  }, []);

  const toggleVisibility = useCallback((blockId: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, visible: !b.visible } : b)));
  }, []);

  // ── Drag and drop ─────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", blockId);
    e.dataTransfer.setData("application/card24-block-id", blockId);
    setDraggedBlockId(blockId);
  };

  const handlePaletteDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/card24-new-block", type);
    e.dataTransfer.setData("text/plain", `new:${type}`);
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedBlockId !== blockId) setDragOverBlockId(blockId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const fromId =
      e.dataTransfer.getData("application/card24-block-id") ||
      e.dataTransfer.getData("text/plain") ||
      draggedBlockId;
    setDraggedBlockId(null);
    setDragOverBlockId(null);
    if (!fromId || fromId === targetId) return;
    setBlocks((prev) => {
      const fromIdx = prev.findIndex((b) => b.id === fromId);
      const toIdx = prev.findIndex((b) => b.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next.map((b, i) => ({ ...b, order: i }));
    });
  };

  const handleDropAtIndex = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const newType = e.dataTransfer.getData("application/card24-new-block") as BlockType;
    if (newType && BLOCK_META[newType]) {
      insertBlock(newType, index);
      setDraggedBlockId(null);
      setDragOverBlockId(null);
      return;
    }

    const fromId =
      e.dataTransfer.getData("application/card24-block-id") ||
      e.dataTransfer.getData("text/plain") ||
      draggedBlockId;
    setDraggedBlockId(null);
    setDragOverBlockId(null);
    if (!fromId) return;

    setBlocks((prev) => {
      const fromIdx = prev.findIndex((b) => b.id === fromId);
      if (fromIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      const at = Math.max(0, Math.min(index > fromIdx ? index - 1 : index, next.length));
      next.splice(at, 0, moved);
      return next.map((b, i) => ({ ...b, order: i }));
    });
  };

  const addFeatureWithIcon = (icon: string) => {
    if (selectedBlock?.type === "features") {
      const content = selectedBlock.content;
      updateBlock(selectedBlock.id, {
        ...content,
        items: [...(content.items || []), { icon, title: "New feature", description: "" }],
      });
      return;
    }

    const block = createBlock("features");
    block.content = {
      ...block.content,
      items: [{ icon, title: "New feature", description: "" }],
    };
    setBlocks((prev) => {
      const at = selectedBlockIndex >= 0 ? selectedBlockIndex + 1 : prev.length;
      const next = [...prev];
      next.splice(at, 0, block);
      return next.map((b, i) => ({ ...b, order: i }));
    });
    setSelectedBlockId(block.id);
    setPanelTab("blocks");
  };

  const visibleBlocks = blocks.filter((b) => b.visible || !preview);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (websiteQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05070f]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm">Loading website…</span>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex h-screen flex-col bg-[#05070f] text-slate-100"
      style={{ fontFamily: theme.fontFamily }}
    >
      {/* Header */}
      <header className="z-20 flex h-14 flex-shrink-0 items-center justify-between border-b border-sky-300/10 bg-[#070b18]/95 px-4 shadow-[0_12px_40px_rgba(2,8,28,0.35)]">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/websites"
            className="flex-shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 w-44 border-transparent bg-white/5 text-base font-medium text-white focus-visible:border-sky-300/30"
          />
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-primary hover:underline max-w-[180px] truncate"
            >
              <Globe className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{liveUrl.replace(/^https?:\/\//, "")}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          )}
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              className={`rounded-md p-1.5 transition-colors ${viewport === v ? "bg-primary text-primary-foreground shadow shadow-primary/20" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}
              title={v}
            >
              {v === "desktop" ? (
                <Monitor className="h-4 w-4" />
              ) : v === "tablet" ? (
                <Tablet className="h-4 w-4" />
              ) : (
                <Smartphone className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => restoreHistory("undo")}
            disabled={!historyState.canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => restoreHistory("redo")}
            disabled={!historyState.canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <button
            onClick={() => setPreview(!preview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${preview ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            <Eye className="h-3.5 w-3.5" />
            {preview ? "Editing" : "Preview"}
          </button>
          <Button
            size="sm"
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="gap-1.5"
          >
            {saveStatus === "saved" ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" /> Saved
              </>
            ) : save.isPending ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                Saving…
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Save
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Center canvas */}
        <div
          className="flex-1 overflow-auto bg-[#05070f]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 72% 18%, rgba(47,107,255,0.20), transparent 35%), linear-gradient(rgba(148,178,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,178,255,0.04) 1px, transparent 1px)",
            backgroundSize: "auto, 44px 44px, 44px 44px",
          }}
          onClick={() => !preview && setSelectedBlockId(null)}
        >
          <div
            className="mx-auto transition-all duration-300 shadow-xl"
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              maxWidth: "100%",
              minHeight: "100%",
              backgroundColor: theme.backgroundColor,
            }}
          >
            {blocks.length === 0 && !preview ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
                <div className="text-6xl">+</div>
                <p className="text-lg font-medium">Add your first section from the right rail</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {(["navbar", "hero", "features"] as BlockType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:border-primary hover:bg-primary/15"
                    >
                      + {BLOCK_META[type].label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {!preview && <DropZone index={0} onDropAtIndex={handleDropAtIndex} />}
                {(preview ? visibleBlocks : blocks).map((block, idx) => (
                  <div key={block.id}>
                    <VisualBlock
                      block={block}
                      theme={theme}
                      isSelected={selectedBlockId === block.id}
                      isHovered={hoveredBlockId === block.id}
                      isDragging={draggedBlockId === block.id}
                      isDragOver={dragOverBlockId === block.id}
                      preview={preview}
                      isFirst={idx === 0}
                      isLast={idx === (preview ? visibleBlocks : blocks).length - 1}
                      onSelect={() => {
                        setSelectedBlockId(block.id);
                        setPanelTab("blocks");
                      }}
                      onHover={(on) => setHoveredBlockId(on ? block.id : null)}
                      onUpdate={(content) => updateBlock(block.id, content)}
                      onDelete={() => deleteBlock(block.id)}
                      onDuplicate={() => duplicateBlock(block.id)}
                      onMoveUp={() => moveBlock(block.id, "up")}
                      onMoveDown={() => moveBlock(block.id, "down")}
                      onToggleVisibility={() => toggleVisibility(block.id)}
                      onDragStart={(e) => handleDragStart(e, block.id)}
                      onDragOver={(e) => handleDragOver(e, block.id)}
                      onDrop={(e) => handleDrop(e, block.id)}
                    />
                    {!preview && <DropZone index={idx + 1} onDropAtIndex={handleDropAtIndex} />}
                  </div>
                ))}
                {/* Add section button at the bottom */}
                {!preview && (
                  <div className="flex justify-center py-6">
                    <button
                      onClick={() => {
                        addBlock("hero");
                        setPanelTab("blocks");
                      }}
                      className="flex items-center gap-2 rounded-full border border-dashed border-sky-300/30 bg-[#070b18]/90 px-4 py-2 text-sm text-slate-300 shadow-lg transition-colors hover:border-primary hover:text-primary"
                    >
                      <Plus className="h-4 w-4" /> Add section
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — settings */}
        {!preview && (
          <aside className="z-10 flex w-80 flex-shrink-0 flex-col overflow-hidden border-l border-sky-300/10 bg-[#070b18]">
            <div className="flex flex-shrink-0 items-center gap-2 border-b border-white/10 px-4 py-3">
              <Settings2 className="h-4 w-4 text-sky-300" />
              <span className="text-sm font-semibold">
                {selectedBlock
                  ? `${BLOCK_META[selectedBlock.type]?.label ?? selectedBlock.type} Settings`
                  : "Site Settings"}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <BlockSettings
                block={selectedBlock}
                theme={theme}
                onUpdate={(content) => selectedBlock && updateBlock(selectedBlock.id, content)}
                onThemeUpdate={setTheme}
              />
            </div>
          </aside>
        )}

        {/* Right rail — compact blocks, theme, assets, and layers */}
        {!preview && (
          <aside className="flex w-20 flex-shrink-0 flex-col border-l border-sky-300/10 bg-[#05070f] text-slate-100">
            <div className="grid gap-1 border-b border-white/10 p-2">
              {[
                { id: "blocks" as PanelTab, icon: Plus, label: "Blocks" },
                { id: "theme" as PanelTab, icon: Palette, label: "Theme" },
                { id: "assets" as PanelTab, icon: ImageIcon, label: "Assets" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setPanelTab(item.id);
                    if (item.id === "theme") setSelectedBlockId(null);
                  }}
                  title={item.label}
                  className={`grid h-11 place-items-center rounded-lg transition ${
                    panelTab === item.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {panelTab === "blocks" && (
                <div className="grid gap-1.5">
                  {(Object.keys(BLOCK_META) as BlockType[]).map((type) => {
                    const meta = BLOCK_META[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addBlock(type)}
                        draggable
                        onDragStart={(e) => handlePaletteDragStart(e, type)}
                        className="grid h-11 place-items-center rounded-lg border border-white/10 bg-white/5 text-lg hover:border-primary hover:bg-primary/15"
                        title={`Add ${meta.label}`}
                      >
                        {meta.icon}
                      </button>
                    );
                  })}
                </div>
              )}

              {panelTab === "theme" && (
                <div className="grid gap-2">
                  {[theme.primaryColor, theme.secondaryColor, theme.backgroundColor].map(
                    (color, index) => (
                      <button
                        key={`${color}-${index}`}
                        type="button"
                        onClick={() => setSelectedBlockId(null)}
                        className="h-10 rounded-lg border border-white/10"
                        style={{ backgroundColor: color }}
                        title="Edit site theme in settings"
                      />
                    ),
                  )}
                </div>
              )}

              {panelTab === "assets" && (
                <div className="grid gap-1.5">
                  {["⚡", "✓", "★", "→", "☎", "✉", "#", "$", "▶", "＋"].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => addFeatureWithIcon(icon)}
                      className="grid h-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-base hover:border-primary hover:bg-primary/15"
                      title="Add icon feature"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1 border-t border-white/10 p-2">
              {blocks.slice(0, 8).map((block) => (
                <button
                  key={block.id}
                  type="button"
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onDragOver={(e) => handleDragOver(e, block.id)}
                  onDragEnd={() => {
                    setDraggedBlockId(null);
                    setDragOverBlockId(null);
                  }}
                  onDrop={(e) => handleDrop(e, block.id)}
                  onClick={() => {
                    setSelectedBlockId(block.id);
                    setPanelTab("blocks");
                  }}
                  className={`grid h-8 w-full place-items-center rounded-md text-sm transition ${
                    selectedBlockId === block.id
                      ? "bg-primary/20 text-primary"
                      : "text-slate-500 hover:bg-white/10 hover:text-white"
                  }`}
                  title={BLOCK_META[block.type]?.label ?? block.type}
                >
                  {BLOCK_META[block.type]?.icon ?? "•"}
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

// ── VisualBlock ───────────────────────────────────────────────────────────────

interface VisualBlockProps {
  block: Block;
  theme: WebsiteTheme;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  preview: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onHover: (on: boolean) => void;
  onUpdate: (content: Record<string, any>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

function VisualBlock({
  block,
  theme,
  isSelected,
  isHovered,
  isDragging,
  isDragOver,
  preview,
  isFirst,
  isLast,
  onSelect,
  onHover,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onDragStart,
  onDragOver,
  onDrop,
}: VisualBlockProps) {
  const showOverlay = !preview && (isSelected || isHovered);

  if (!block.visible && preview) return null;

  return (
    <div
      id={`block-${block.id}`}
      className={[
        "relative group/block",
        isDragging ? "opacity-30" : "",
        !block.visible && !preview ? "opacity-50" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={(e) => {
        if (!preview) {
          e.stopPropagation();
          onHover(true);
        }
      }}
      onMouseLeave={(e) => {
        if (!preview) {
          e.stopPropagation();
          onHover(false);
        }
      }}
      onClick={(e) => {
        if (!preview) {
          e.stopPropagation();
          onSelect();
        }
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Hover/select border */}
      {showOverlay && (
        <div
          className={`absolute inset-0 pointer-events-none z-10 ${
            isSelected ? "ring-2 ring-primary ring-inset" : "ring-1 ring-primary/40 ring-inset"
          }`}
        />
      )}

      {/* Drop indicator */}
      {isDragOver && !isDragging && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-20" />
      )}

      {/* Floating toolbar — always visible in edit mode */}
      {!preview && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 bg-gray-900/90 text-white rounded-b-lg px-1 py-1 shadow-lg pointer-events-auto opacity-0 group-hover/block:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div
            draggable
            onDragStart={onDragStart}
            className="p-1 rounded cursor-grab hover:bg-white/20 transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>

          <span className="text-xs font-semibold px-1 opacity-80 select-none">
            {BLOCK_META[block.type]?.label ?? block.type}
          </span>

          <div className="w-px h-4 bg-white/30 mx-0.5" />

          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 rounded hover:bg-white/20 disabled:opacity-30"
            title="Move up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1 rounded hover:bg-white/20 disabled:opacity-30"
            title="Move down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <div className="w-px h-4 bg-white/30 mx-0.5" />

          <button onClick={onDuplicate} className="p-1 rounded hover:bg-white/20" title="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onToggleVisibility}
            className="p-1 rounded hover:bg-white/20"
            title={block.visible ? "Hide" : "Show"}
          >
            <Eye className={`h-3.5 w-3.5 ${!block.visible ? "opacity-40" : ""}`} />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-red-400/80" title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Block content — editable when selected */}
      <BlockRenderer
        block={block}
        theme={theme}
        editable={isSelected && !preview}
        onUpdate={onUpdate}
      />
    </div>
  );
}

function DropZone({
  index,
  onDropAtIndex,
}: {
  index: number;
  onDropAtIndex: (event: React.DragEvent, index: number) => void;
}) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={[
        "relative flex h-3 items-center justify-center transition-all",
        active ? "h-12 bg-primary/5" : "hover:h-8",
      ].join(" ")}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(event) => {
        setActive(false);
        onDropAtIndex(event, index);
      }}
    >
      <div
        className={[
          "h-px w-full transition-all",
          active ? "h-0.5 bg-primary" : "bg-transparent",
        ].join(" ")}
      />
      {active && (
        <span className="absolute rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
          Drop section here
        </span>
      )}
    </div>
  );
}
