import { create } from "zustand";
import type { CanvasDoc } from "@/lib/api/types";
import { generateId } from "@/lib/uuid";

export type SaveStatus = "saved" | "saving" | "dirty" | "error";

type EditorState = {
  doc: CanvasDoc | null;
  activePageId: string | null;
  zoom: number;
  saveStatus: SaveStatus;
  selectedIds: string[];
  resetDoc: () => void;
  setDoc: (doc: CanvasDoc) => void;
  setActivePage: (id: string) => void;
  addPage: () => void;
  removePage: (id: string) => void;
  setZoom: (z: number) => void;
  markDirty: () => void;
  markSaving: () => void;
  markSaved: () => void;
  markError: () => void;
  setSelected: (ids: string[]) => void;
  reorderObject: (id: string, direction: "up" | "down" | "top" | "bottom") => void;
  getObjectIndex: (id: string) => number;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  doc: null,
  activePageId: null,
  // Default zoom fits a 1050px canvas in a typical ~700px center area
  zoom: typeof window !== "undefined"
    ? parseFloat(Math.max(0.2, Math.min((window.innerWidth - 256 - 288 - 80) / 1050, 0.95)).toFixed(2))
    : 0.6,
  saveStatus: "saved",
  selectedIds: [],
  resetDoc: () => set({ doc: null, activePageId: null, saveStatus: "saved", selectedIds: [] }),
  setDoc: (doc) => {
    let zoom = 0.6; // safe default
    if (typeof window !== "undefined") {
      const w = doc?.canvas?.width  ?? 1050;
      const h = doc?.canvas?.height ?? 600;
      // editor left=256, right=288, padding=80, header=56
      const availW = window.innerWidth  - 256 - 288 - 80;
      const availH = window.innerHeight - 56  - 80;
      if (availW > 0 && availH > 0) {
        zoom = Math.min(availW / w, availH / h, 0.95);
        zoom = Math.max(0.2, parseFloat(zoom.toFixed(2)));
      }
    }
    set({ doc, activePageId: doc.pages[0]?.id ?? null, saveStatus: "saved", zoom });
  },
  setActivePage: (id) => set({ activePageId: id }),
  addPage: () => {
    const doc = get().doc;
    if (!doc) return;
    const uuid = generateId();
    const newPage = {
      id: uuid,
      name: `Page ${doc.pages.length + 1}`,
      fabric: { version: "7", objects: [] },
    };
    set({
      doc: { ...doc, pages: [...doc.pages, newPage] },
      activePageId: newPage.id,
      saveStatus: "dirty",
    });
  },
  removePage: (id) => {
    const doc = get().doc;
    if (!doc || doc.pages.length <= 1) return;
    const pages = doc.pages.filter((p) => p.id !== id);
    set({
      doc: { ...doc, pages },
      activePageId:
        get().activePageId === id ? (pages[0]?.id ?? null) : get().activePageId,
      saveStatus: "dirty",
    });
  },
  setZoom: (z) => set({ zoom: Math.max(0.1, Math.min(4, z)) }),
  markDirty: () => set({ saveStatus: "dirty" }),
  markSaving: () => set({ saveStatus: "saving" }),
  markSaved: () => set({ saveStatus: "saved" }),
  markError: () => set({ saveStatus: "error" }),
  setSelected: (ids) => set({ selectedIds: ids }),
  reorderObject: (id, direction) => {
    const doc = get().doc;
    const activePageId = get().activePageId;
    if (!doc || !activePageId) return;
    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page || !Array.isArray(page.fabric?.objects)) return;
    
    const objects = [...page.fabric.objects];
    const idx = objects.findIndex((o) => o.id === id);
    if (idx === -1) return;
    
    let newIdx = idx;
    if (direction === "up" && idx < objects.length - 1) newIdx = idx + 1;
    else if (direction === "down" && idx > 0) newIdx = idx - 1;
    else if (direction === "top") newIdx = objects.length - 1;
    else if (direction === "bottom") newIdx = 0;
    
    if (newIdx === idx) return;
    
    const moved = objects.splice(idx, 1)[0];
    objects.splice(newIdx, 0, moved);
    
    const newPage = { ...page, fabric: { ...page.fabric, objects } };
    const pages = doc.pages.map((p) => (p.id === activePageId ? newPage : p));
    set({ doc: { ...doc, pages }, saveStatus: "dirty" });
  },
  getObjectIndex: (id) => {
    const doc = get().doc;
    const activePageId = get().activePageId;
    if (!doc || !activePageId) return -1;
    const page = doc.pages.find((p) => p.id === activePageId);
    if (!page || !Array.isArray(page.fabric?.objects)) return -1;
    return page.fabric.objects.findIndex((o) => o.id === id);
  },
}));
