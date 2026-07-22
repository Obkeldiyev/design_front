import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Eye, Monitor, Smartphone, Tablet,
  Save, ChevronUp, ChevronDown, Trash2, Copy,
  Plus, Palette, Settings2, GripVertical, ExternalLink, Globe,
  CheckCircle,
} from "lucide-react";

// Lazy-load BlockRenderer — it contains canvas/DOM-heavy code that breaks SSR
import { lazy, Suspense } from "react";
const BlockRenderer = lazy(() =>
  import("@/components/website-builder/BlockRenderer").then((m) => ({ default: m.BlockRenderer }))
);
const BlockSettings = lazy(() =>
  import("@/components/website-builder/BlockSettings").then((m) => ({ default: m.BlockSettings }))
);
const ThemeSettings = lazy(() =>
  import("@/components/website-builder/BlockSettings").then((m) => ({ default: m.ThemeSettings }))
);
import type { Block, BlockType, WebsiteTheme } from "@/lib/website-blocks";
import { BLOCK_META, DEFAULT_THEME, createBlock } from "@/lib/website-blocks";
import { generateId } from "@/lib/uuid";
import { toast } from "sonner";
import { WebsiteAPI } from "@/lib/api/resources";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/websites/$id/edit")({
  head: () => ({ meta: [{ title: "Website Builder — Cardify" }] }),
  component: WebsiteBuilderPage,
});

// Client-only wrapper — prevents SSR for drag-drop and canvas code
function WebsiteBuilderPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
      <WebsiteBuilder />
    </Suspense>
  );
}

type Viewport = "desktop" | "tablet" | "mobile";
type PanelTab = "blocks" | "theme";

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

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  // ── Data loading ──────────────────────────────────────────────────────────
  // Track the updatedAt of the last server data we loaded so we can detect
  // when the server has newer data (e.g. after re-entering the editor).
  const loadedDataKey = useRef<string>("");

  const websiteQuery = useQuery({
    queryKey: ["website", id],
    queryFn: () => WebsiteAPI.get(id),
    enabled: !!id && id !== "new",
    staleTime: 0,            // always fetch fresh on mount
    refetchOnWindowFocus: false,
  });

  // Hydrate whenever we get server data that is different from what we loaded last
  useEffect(() => {
    const w = websiteQuery.data;
    if (!w) return;

    // Use updatedAt + id as the unique key for this server snapshot
    const key = `${w.id}:${w.updatedAt ?? ""}`;
    if (loadedDataKey.current === key) return;  // same data — skip
    loadedDataKey.current = key;

    setTitle(w.title || "My Website");
    setSubdomain(w.subdomain ?? null);
    const cfg = w.config as any;
    setBlocks(Array.isArray(cfg?.blocks) ? cfg.blocks : []);
    setTheme(cfg?.theme ? { ...DEFAULT_THEME, ...cfg.theme } : DEFAULT_THEME);
    setSaveStatus("idle");
  }, [websiteQuery.data]);

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

  // ── Block operations ──────────────────────────────────────────────────────
  const addBlock = useCallback((type: BlockType) => {
    const b = createBlock(type);
    b.order = blocks.length;
    setBlocks((prev) => [...prev, b]);
    setSelectedBlockId(b.id);
    setTimeout(() => {
      document.getElementById(`block-${b.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, [blocks.length]);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setSelectedBlockId((cur) => cur === blockId ? null : cur);
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
    setBlocks((prev) => prev.map((b) => b.id === blockId ? { ...b, content } : b));
  }, []);

  const toggleVisibility = useCallback((blockId: string) => {
    setBlocks((prev) => prev.map((b) => b.id === blockId ? { ...b, visible: !b.visible } : b));
  }, []);

  // ── Drag and drop ─────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", blockId);
    setDraggedBlockId(blockId);
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedBlockId !== blockId) setDragOverBlockId(blockId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData("text/plain") || draggedBlockId;
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

  const visibleBlocks = blocks.filter((b) => b.visible || !preview);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (websiteQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm">Loading website…</span>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col bg-background" style={{ fontFamily: theme.fontFamily }}>
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 flex-shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/websites" className="rounded p-1.5 text-muted-foreground hover:bg-muted flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 w-44 border-transparent bg-transparent text-base font-medium focus-visible:border-border"
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
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              className={`p-1.5 rounded-md transition-colors ${viewport === v ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title={v}
            >
              {v === "desktop" ? <Monitor className="h-4 w-4" /> : v === "tablet" ? <Tablet className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
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
              <><CheckCircle className="h-3.5 w-3.5" /> Saved</>
            ) : save.isPending ? (
              <><div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Saving…</>
            ) : (
              <><Save className="h-3.5 w-3.5" /> Save</>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        {!preview && (
          <aside className="w-56 border-r border-border bg-card flex flex-col flex-shrink-0 z-10">
            <div className="flex border-b border-border">
              <button
                onClick={() => setPanelTab("blocks")}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${panelTab === "blocks" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Plus className="h-3.5 w-3.5" /> Blocks
              </button>
              <button
                onClick={() => setPanelTab("theme")}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${panelTab === "theme" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Palette className="h-3.5 w-3.5" /> Theme
              </button>
            </div>

            {panelTab === "blocks" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="p-3 border-b border-border">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Add Section</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(BLOCK_META) as BlockType[]).map((type) => {
                      const meta = BLOCK_META[type];
                      return (
                        <button
                          key={type}
                          onClick={() => addBlock(type)}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors text-center"
                        >
                          <span className="text-lg leading-none">{meta.icon}</span>
                          <span className="text-xs font-medium leading-tight">{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground px-1 mb-1.5">Layers</p>
                  {blocks.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No sections yet</p>
                  ) : (
                    <div className="space-y-1">
                      {blocks.map((block) => (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, block.id)}
                          onDragOver={(e) => handleDragOver(e, block.id)}
                          onDragEnd={() => { setDraggedBlockId(null); setDragOverBlockId(null); }}
                          onDrop={(e) => handleDrop(e, block.id)}
                          onClick={() => setSelectedBlockId(block.id)}
                          className={[
                            "flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-all",
                            selectedBlockId === block.id ? "bg-primary/10 border border-primary text-primary" : "hover:bg-muted/60 border border-transparent",
                            draggedBlockId === block.id ? "opacity-40" : "",
                            dragOverBlockId === block.id ? "border-t-2 border-t-primary" : "",
                          ].join(" ")}
                        >
                          <GripVertical className="h-3 w-3 text-muted-foreground flex-shrink-0 cursor-grab" />
                          <span className="flex-1 truncate font-medium capitalize">{BLOCK_META[block.type]?.label ?? block.type}</span>
                          {!block.visible && <span className="text-muted-foreground text-xs opacity-50">●</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {panelTab === "theme" && (
              <div className="flex-1 overflow-y-auto">
                <ThemeSettings theme={theme} onUpdate={setTheme} />
              </div>
            )}
          </aside>
        )}

        {/* Center canvas */}
        <div
          className="flex-1 overflow-auto bg-[#e8e8e8]"
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
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
                <div className="text-6xl">⬅</div>
                <p className="text-lg font-medium">Add your first section from the left panel</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {(["navbar", "hero", "features"] as BlockType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      + {BLOCK_META[type].label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {(preview ? visibleBlocks : blocks).map((block, idx) => (
                  <VisualBlock
                    key={block.id}
                    block={block}
                    theme={theme}
                    isSelected={selectedBlockId === block.id}
                    isHovered={hoveredBlockId === block.id}
                    isDragging={draggedBlockId === block.id}
                    isDragOver={dragOverBlockId === block.id}
                    preview={preview}
                    isFirst={idx === 0}
                    isLast={idx === (preview ? visibleBlocks : blocks).length - 1}
                    onSelect={() => { setSelectedBlockId(block.id); setPanelTab("blocks"); }}
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
                ))}
                {/* Add section button at the bottom */}
                {!preview && (
                  <div className="flex justify-center py-6">
                    <button
                      onClick={() => { addBlock("hero"); setPanelTab("blocks"); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-white/80"
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
          <aside className="w-72 border-l border-border bg-card flex flex-col flex-shrink-0 overflow-hidden z-10">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {selectedBlock ? `${BLOCK_META[selectedBlock.type]?.label ?? selectedBlock.type} Settings` : "Site Settings"}
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
  block, theme, isSelected, isHovered, isDragging, isDragOver, preview,
  isFirst, isLast, onSelect, onHover, onUpdate, onDelete, onDuplicate,
  onMoveUp, onMoveDown, onToggleVisibility, onDragStart, onDragOver, onDrop,
}: VisualBlockProps) {
  const showOverlay = !preview && (isSelected || isHovered);

  if (!block.visible && preview) return null;

  return (
    <div
      id={`block-${block.id}`}
      className={[
        "relative",
        isDragging ? "opacity-30" : "",
        !block.visible && !preview ? "opacity-50" : "",
      ].filter(Boolean).join(" ")}
      onMouseEnter={(e) => { if (!preview) { e.stopPropagation(); onHover(true); } }}
      onMouseLeave={(e) => { if (!preview) { e.stopPropagation(); onHover(false); } }}
      onClick={(e) => { if (!preview) { e.stopPropagation(); onSelect(); } }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Hover/select border */}
      {showOverlay && (
        <div className={`absolute inset-0 pointer-events-none z-10 ${
          isSelected
            ? "ring-2 ring-primary ring-inset"
            : "ring-1 ring-primary/40 ring-inset"
        }`} />
      )}

      {/* Drop indicator */}
      {isDragOver && !isDragging && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-20" />
      )}

      {/* Floating toolbar */}
      {showOverlay && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 bg-primary text-primary-foreground rounded-b-lg px-1 py-1 shadow-lg pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => onHover(true)}
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

          <button onClick={onMoveUp} disabled={isFirst} className="p-1 rounded hover:bg-white/20 disabled:opacity-30" title="Move up">
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="p-1 rounded hover:bg-white/20 disabled:opacity-30" title="Move down">
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
