import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Trash2, GripVertical } from "lucide-react";
import { useEditorStore } from "@/store/editor";
import type * as fabric from "fabric";

/**
 * Get a stable ID from a Fabric object.
 * If the object has no id yet, we assign one directly so the ID
 * is stable across multiple calls.
 */
function getObjId(obj: any): string {
  if (typeof obj.id === "string" && obj.id) return obj.id;
  // Assign a permanent fallback so every subsequent call returns the same value
  const fallback = `__layer_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  obj.id = fallback;
  return fallback;
}

interface LayerItem {
  id: string;
  name: string;
  visible: boolean;
}

export function LayersPanel({ canvas }: { canvas: fabric.Canvas | null }) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggingIdRef = useRef<string | null>(null);

  // Always-current canvas ref — updated every render before any callback runs
  const canvasRef = useRef<fabric.Canvas | null>(null);
  canvasRef.current = canvas;

  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setSelected = useEditorStore((s) => s.setSelected);
  const markDirty = useEditorStore((s) => s.markDirty);

  // ── sync layers ───────────────────────────────────────────────────────────
  const doSync = useCallback(() => {
    const c = canvasRef.current;
    if (!c) { setLayers([]); return; }
    const objs = c.getObjects() as any[];
    const items: LayerItem[] = objs.map((obj) => ({
      id: getObjId(obj),                          // stable ID, assigned if missing
      name: obj.name || obj.type || "layer",
      visible: obj.visible !== false,
    }));
    setLayers([...items].reverse());              // top of stack → top of list
  }, []); // stable — reads via canvasRef

  // Keep a ref to the latest doSync so the event handler closure never goes stale
  const doSyncRef = useRef(doSync);
  useEffect(() => { doSyncRef.current = doSync; }, [doSync]);

  useEffect(() => {
    if (!canvas) { setLayers([]); return; }

    doSyncRef.current();

    const handler = () => doSyncRef.current();
    const EVENTS = [
      "object:added", "object:removed", "object:modified",
      "selection:created", "selection:updated", "selection:cleared",
    ] as const;

    EVENTS.forEach((ev) => canvas.on(ev, handler));
    return () => EVENTS.forEach((ev) => canvas.off(ev, handler));
  }, [canvas]);

  // ── find object by the stable id ──────────────────────────────────────────
  const findObj = useCallback((id: string) => {
    const c = canvasRef.current;
    if (!c) return null;
    return (c.getObjects() as any[]).find((o) => {
      // getObjId will read existing .id — never generates a new one here
      // because we assigned it during syncLayers
      return (typeof o.id === "string" && o.id === id);
    }) ?? null;
  }, []);

  // ── actions ───────────────────────────────────────────────────────────────
  const toggleVisibility = useCallback((id: string) => {
    const c = canvasRef.current;
    if (!c) return;
    const obj = findObj(id);
    if (!obj) return;
    obj.visible = !obj.visible;
    obj.set("visible", obj.visible);
    c.requestRenderAll();
    markDirty();
    doSyncRef.current();
  }, [findObj, markDirty]);

  const deleteLayer = useCallback((id: string) => {
    const c = canvasRef.current;
    if (!c) return;
    const obj = findObj(id);
    if (!obj) return;
    c.remove(obj);
    c.discardActiveObject();
    setSelected([]);
    c.requestRenderAll();
    markDirty();
    // "object:removed" event triggers doSync automatically
  }, [findObj, markDirty, setSelected]);

  const selectLayer = useCallback((id: string) => {
    const c = canvasRef.current;
    if (!c) return;
    const obj = findObj(id);
    if (!obj) return;
    setSelected([id]);
    c.discardActiveObject();
    c.setActiveObject(obj);
    c.requestRenderAll();
  }, [findObj, setSelected]);

  // ── drag-and-drop ─────────────────────────────────────────────────────────
  const handleGripDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    draggingIdRef.current = id;
    // fade the parent row
    const row = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-layer-row]");
    if (row) row.style.opacity = "0.4";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggingIdRef.current && draggingIdRef.current !== id) setDragOverId(id);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) {
      setDragOverId(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);

    // Read ID from ref first, fall back to dataTransfer
    const fromId = draggingIdRef.current || e.dataTransfer.getData("text/plain");
    draggingIdRef.current = null;

    if (!fromId || fromId === targetId) return;

    const c = canvasRef.current;
    if (!c) return;

    const objs = c.getObjects() as any[];
    const fromObj = objs.find((o) => o.id === fromId);
    const targetObj = objs.find((o) => o.id === targetId);
    if (!fromObj || !targetObj) return;

    const targetIdx = objs.indexOf(targetObj);
    c.moveObjectTo(fromObj, targetIdx);
    c.requestRenderAll();
    markDirty();
    doSyncRef.current();
  }, [markDirty]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    draggingIdRef.current = null;
    setDragOverId(null);
    const row = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-layer-row]");
    if (row) row.style.opacity = "";
  }, []);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      <div className="px-4 py-2.5 border-b border-border flex-shrink-0">
        <h3 className="font-semibold text-sm">Layers</h3>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {layers.length === 0 ? (
          <p className="p-4 text-center text-xs text-muted-foreground">No layers yet</p>
        ) : (
          <div className="p-1.5 space-y-0.5">
            {layers.map((layer) => {
              const isSelected = selectedIds.includes(layer.id);
              const isDragOver = dragOverId === layer.id;

              return (
                <div
                  key={layer.id}
                  data-layer-row={layer.id}
                  onClick={() => selectLayer(layer.id)}
                  onDragOver={(e) => handleDragOver(e, layer.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, layer.id)}
                  onDragEnd={handleDragEnd}
                  style={{ userSelect: "none" }}
                  className={[
                    "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs cursor-pointer",
                    isSelected
                      ? "bg-primary/15 border border-primary/50"
                      : "border border-transparent hover:bg-muted/60",
                    isDragOver ? "outline outline-2 outline-primary" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {/* Grip handle — the only draggable element */}
                  <span
                    draggable
                    onDragStart={(e) => { e.stopPropagation(); handleGripDragStart(e, layer.id); }}
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-grab active:cursor-grabbing flex-shrink-0 p-0.5 rounded hover:bg-muted/80"
                  >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </span>

                  {/* Name */}
                  <span className="flex-1 truncate font-medium">{layer.name}</span>

                  {/* Visibility */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id); }}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted flex-shrink-0"
                    title={layer.visible ? "Hide" : "Show"}
                  >
                    {layer.visible
                      ? <Eye className="h-3.5 w-3.5 pointer-events-none" />
                      : <EyeOff className="h-3.5 w-3.5 opacity-40 pointer-events-none" />}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                    className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:bg-destructive/15 hover:text-destructive flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5 pointer-events-none" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
