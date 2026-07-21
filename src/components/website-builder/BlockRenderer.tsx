import React, { useRef, useState } from "react";
import type { Block, WebsiteTheme } from "@/lib/website-blocks";

interface BlockRendererProps {
  block: Block;
  theme: WebsiteTheme;
  editable?: boolean;
  onUpdate?: (content: Record<string, any>) => void;
}

// ── Inline editable text ──────────────────────────────────────────────────────
function EditText({
  value, onSave, className = "", tag = "span",
  placeholder = "Click to edit…", editable = false,
}: {
  value: string; onSave: (v: string) => void; className?: string;
  tag?: string; placeholder?: string; editable?: boolean;
}) {
  const Tag = tag as any;
  if (!editable) return <Tag className={className}>{value}</Tag>;
  return (
    <Tag contentEditable suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={(e: React.FocusEvent<HTMLElement>) => onSave(e.currentTarget.textContent || "")}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
      className={[className, "outline-none cursor-text rounded-sm",
        "focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-0",
        "empty:before:content-[attr(data-placeholder)] empty:before:opacity-30 empty:before:italic empty:before:pointer-events-none",
      ].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}

// ── Image upload helper ───────────────────────────────────────────────────────
function ImageUpload({ src, onUpload, editable, className = "", alt = "" }: {
  src: string; onUpload: (dataUrl: string) => void;
  editable?: boolean; className?: string; alt?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  if (!editable) {
    return src
      ? <img src={src} alt={alt} className={className} />
      : <div className={`${className} bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-sm font-medium`}>Image</div>;
  }
  return (
    <div className={`${className} relative group/img cursor-pointer`} onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
      {src
        ? <img src={src} alt={alt} className="w-full h-full object-cover" />
        : <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1">
            <span className="text-3xl">📷</span>
            <span className="text-xs font-medium">Click to upload</span>
          </div>
      }
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-inherit">
        <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full">📷 Change image</span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Draggable item wrapper with delete button ─────────────────────────────────
function DraggableItem({ index, total, editable, onMove, onDelete, children }: {
  index: number; total: number; editable?: boolean;
  onMove: (from: number, to: number) => void;
  onDelete: (i: number) => void;
  children: React.ReactNode;
}) {
  const [dragOver, setDragOver] = useState(false);
  if (!editable) return <>{children}</>;
  return (
    <div
      className={`relative group/item ${dragOver ? "ring-2 ring-violet-400 ring-offset-1 rounded-xl" : ""}`}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(index)); e.stopPropagation(); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault(); e.stopPropagation(); setDragOver(false);
        const from = parseInt(e.dataTransfer.getData("text/plain"));
        if (!isNaN(from) && from !== index) onMove(from, index);
      }}
    >
      {children}
      {/* Item toolbar */}
      <div className="absolute top-1 right-1 z-20 hidden group-hover/item:flex items-center gap-0.5 bg-gray-900/80 text-white rounded-lg px-1 py-0.5 shadow-lg"
        onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        <span className="cursor-grab px-1 text-gray-400 hover:text-white text-xs" title="Drag to reorder">⠿</span>
        <button onClick={() => onDelete(index)} className="px-1 text-red-400 hover:text-red-300 text-xs" title="Delete">✕</button>
      </div>
    </div>
  );
}

// ── helper: move item in array ─────────────────────────────────────────────────
function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function NavbarBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const setLinks = (links: any[]) => upd({ links });
  return (
    <nav style={{ backgroundColor: c.backgroundColor || "#fff", color: c.textColor || "#111827" }}
      className="w-full px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {c.logoUrl
          ? <ImageUpload src={c.logoUrl} onUpload={(v) => upd({ logoUrl: v })} editable={editable} className="h-9 w-auto object-contain" alt="Logo" />
          : <EditText value={c.logo || "Brand"} onSave={(v) => upd({ logo: v })} tag="span" editable={editable} className="text-xl font-bold" />
        }
        {/* In edit mode, show an upload button alongside the text logo */}
        {editable && !c.logoUrl && (
          <label className="cursor-pointer text-xs opacity-50 hover:opacity-100 border border-dashed border-current rounded px-1.5 py-0.5"
            onClick={(e) => e.stopPropagation()}>
            📷
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; if (!f) return;
              const r = new FileReader(); r.onload = (ev) => upd({ logoUrl: ev.target?.result as string }); r.readAsDataURL(f);
            }} />
          </label>
        )}
        {editable && c.logoUrl && (
          <button onClick={(e) => { e.stopPropagation(); upd({ logoUrl: "" }); }} className="text-xs opacity-50 hover:opacity-100 text-red-500" title="Remove image">✕</button>
        )}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {(c.links || []).map((link: any, i: number) => (
          <DraggableItem key={i} index={i} total={(c.links||[]).length} editable={editable}
            onMove={(f, t) => setLinks(moveItem(c.links, f, t))}
            onDelete={(idx) => setLinks(c.links.filter((_:any, li:number) => li !== idx))}>
            <EditText value={link.label} onSave={(v) => { const l=[...c.links]; l[i]={...l[i],label:v}; setLinks(l); }}
              editable={editable} className="text-sm font-medium hover:opacity-70 transition-opacity" />
          </DraggableItem>
        ))}
        {editable && <button onClick={(e) => { e.stopPropagation(); setLinks([...(c.links||[]),{label:"New Link",href:"#"}]); }}
          className="text-xs px-2 py-1 border border-dashed border-current rounded opacity-50 hover:opacity-100">+ Link</button>}
        {c.ctaText && <span style={{ backgroundColor: theme.primaryColor }} className="px-4 py-2 rounded text-sm font-semibold text-white">
          <EditText value={c.ctaText} onSave={(v) => upd({ ctaText: v })} editable={editable} className="text-sm font-semibold text-white" />
        </span>}
      </div>
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function HeroBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const bgStyle: React.CSSProperties = c.backgroundImage
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,${c.overlayOpacity??0.5}),rgba(0,0,0,${c.overlayOpacity??0.5})),url(${c.backgroundImage})`, backgroundSize:"cover", backgroundPosition:"center", color: c.textColor||"#fff" }
    : { backgroundColor: c.backgroundColor||"#0f172a", color: c.textColor||"#fff" };
  const alignClass = c.layout==="left" ? "items-start text-left" : c.layout==="right" ? "items-end text-right" : "items-center text-center";
  return (
    <section style={bgStyle} className="relative w-full min-h-[520px] flex flex-col justify-center px-8 py-20">
      {editable && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-1 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full hover:bg-black/70 transition-colors"
            onClick={(e) => e.stopPropagation()}>
            📷 {c.backgroundImage ? "Change BG" : "Add BG image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; if (!f) return;
              const r = new FileReader(); r.onload = (ev) => upd({ backgroundImage: ev.target?.result as string }); r.readAsDataURL(f);
            }} />
          </label>
          {c.backgroundImage && (
            <button onClick={(e) => { e.stopPropagation(); upd({ backgroundImage: "" }); }}
              className="flex items-center gap-1 bg-red-500/70 text-white text-xs px-2 py-1.5 rounded-full hover:bg-red-600/80">
              ✕ Remove BG
            </button>
          )}
        </div>
      )}
      {(c.logoUrl || c.logoText || editable) && (
        <div className="absolute top-6 left-8 flex items-center gap-2">
          {c.logoUrl
            ? <ImageUpload src={c.logoUrl} onUpload={(v) => upd({ logoUrl: v })} editable={editable} className="h-12 w-auto object-contain" alt="Logo" />
            : <EditText value={c.logoText || ""} onSave={(v) => upd({ logoText: v })} editable={editable} tag="span" className="text-lg font-bold opacity-90" placeholder="Logo text" />
          }
          {editable && !c.logoUrl && (
            <label className="cursor-pointer text-xs opacity-50 hover:opacity-100 border border-dashed border-white rounded px-1.5 py-0.5 text-white"
              onClick={(e) => e.stopPropagation()}>
              📷
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (!f) return;
                const r = new FileReader(); r.onload = (ev) => upd({ logoUrl: ev.target?.result as string }); r.readAsDataURL(f);
              }} />
            </label>
          )}
          {editable && c.logoUrl && (
            <button onClick={(e) => { e.stopPropagation(); upd({ logoUrl: "" }); }} className="text-xs text-white/50 hover:text-red-400">✕</button>
          )}
        </div>
      )}
      <div className={`flex flex-col gap-5 max-w-3xl mx-auto w-full ${alignClass}`}>
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
          <EditText value={c.title||""} onSave={(v)=>upd({title:v})} tag="span" editable={editable} placeholder="Your headline…" />
        </h1>
        <p className="text-xl opacity-80 max-w-xl">
          <EditText value={c.subtitle||""} onSave={(v)=>upd({subtitle:v})} tag="span" editable={editable} placeholder="Your subtitle…" />
        </p>
        <div className="flex gap-3 flex-wrap mt-2" style={{justifyContent: c.layout==="center"?"center":c.layout==="right"?"flex-end":"flex-start"}}>
          {c.buttonText && <span style={{backgroundColor:theme.primaryColor}} className="px-7 py-3 rounded-lg font-semibold text-white shadow inline-block">
            <EditText value={c.buttonText} onSave={(v)=>upd({buttonText:v})} editable={editable} className="font-semibold text-white" placeholder="Button" />
          </span>}
          {c.secondaryButtonText && <span className="px-7 py-3 rounded-lg font-semibold border-2 border-white/60 text-white inline-block">
            <EditText value={c.secondaryButtonText} onSave={(v)=>upd({secondaryButtonText:v})} editable={editable} className="font-semibold text-white" placeholder="Secondary" />
          </span>}
        </div>
      </div>
    </section>
  );
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
function FeaturesBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const cols = c.columns===2?"grid-cols-2":c.columns===4?"grid-cols-4":"grid-cols-3";
  const setItems = (items: any[]) => upd({ items });
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#fff" }} className="w-full py-20 px-8">
      <div className="max-w-6xl mx-auto">
        {(c.title||editable) && <h2 className="text-4xl font-bold text-center text-gray-900 mb-3"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="Section title" /></h2>}
        {(c.subtitle||editable) && <p className="text-lg text-center text-gray-500 mb-14"><EditText value={c.subtitle||""} onSave={(v)=>upd({subtitle:v})} editable={editable} placeholder="Subtitle" /></p>}
        <div className={`grid ${cols} gap-8`}>
          {(c.items||[]).map((item: any, i: number) => (
            <DraggableItem key={i} index={i} total={(c.items||[]).length} editable={editable}
              onMove={(f,t)=>setItems(moveItem(c.items,f,t))}
              onDelete={(idx)=>setItems(c.items.filter((_:any,fi:number)=>fi!==idx))}>
              <div className="flex flex-col items-start gap-3 p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <EditText value={item.icon||"⚡"} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],icon:v};setItems(it);}} editable={editable} className="text-3xl" placeholder="⚡" />
                <EditText value={item.title||""} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],title:v};setItems(it);}} editable={editable} tag="h3" className="text-lg font-semibold text-gray-900" placeholder="Feature title" />
                <EditText value={item.description||""} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],description:v};setItems(it);}} editable={editable} tag="p" className="text-sm text-gray-500 leading-relaxed" placeholder="Description…" />
              </div>
            </DraggableItem>
          ))}
          {editable && <button onClick={(e)=>{e.stopPropagation();setItems([...(c.items||[]),{icon:"⚡",title:"New Feature",description:""}]);}}
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors">
            <span className="text-2xl">+</span><span className="text-sm font-medium">Add feature</span>
          </button>}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function TestimonialsBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const setItems = (items: any[]) => upd({ items });
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#f8fafc" }} className="w-full py-20 px-8">
      <div className="max-w-6xl mx-auto">
        {(c.title||editable) && <h2 className="text-4xl font-bold text-center text-gray-900 mb-3"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="Title" /></h2>}
        {(c.subtitle||editable) && <p className="text-lg text-center text-gray-500 mb-14"><EditText value={c.subtitle||""} onSave={(v)=>upd({subtitle:v})} editable={editable} placeholder="Subtitle" /></p>}
        <div className="grid grid-cols-3 gap-6">
          {(c.items||[]).map((item: any, i: number) => (
            <DraggableItem key={i} index={i} total={(c.items||[]).length} editable={editable}
              onMove={(f,t)=>setItems(moveItem(c.items,f,t))}
              onDelete={(idx)=>setItems(c.items.filter((_:any,fi:number)=>fi!==idx))}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {item.rating && <div className="flex gap-0.5 mb-3">{Array.from({length:5}).map((_,si)=><span key={si} className={si<item.rating?"text-yellow-400":"text-gray-200"}>★</span>)}</div>}
                <EditText value={item.text||""} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],text:v};setItems(it);}} editable={editable} tag="p" className="text-gray-700 italic mb-4 leading-relaxed" placeholder="Review text…" />
                <div className="flex items-center gap-3">
                  <ImageUpload src={item.avatar||""} onUpload={(v)=>{const it=[...c.items];it[i]={...it[i],avatar:v};setItems(it);}} editable={editable}
                    className="w-10 h-10 rounded-full object-cover" alt={item.author} />
                  <div>
                    <EditText value={item.author||""} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],author:v};setItems(it);}} editable={editable} tag="p" className="font-semibold text-sm text-gray-900" placeholder="Name" />
                    <EditText value={item.role||""} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],role:v};setItems(it);}} editable={editable} tag="p" className="text-xs text-gray-500" placeholder="Role" />
                  </div>
                </div>
              </div>
            </DraggableItem>
          ))}
          {editable && <button onClick={(e)=>{e.stopPropagation();setItems([...(c.items||[]),{author:"New Person",role:"Role",text:"Great!",rating:5,avatar:""}]);}}
            className="flex items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors">
            <span className="text-sm font-medium">+ Add review</span>
          </button>}
        </div>
      </div>
    </section>
  );
}

// ── TEXT ──────────────────────────────────────────────────────────────────────
function TextBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const maxW = c.maxWidth==="2xl"?"max-w-2xl":c.maxWidth==="4xl"?"max-w-4xl":"max-w-3xl";
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#fff" }} className="w-full py-16 px-8">
      <div className={`${maxW} mx-auto`} style={{ textAlign: c.align||"left" }}>
        {(c.title||editable) && <h2 className="text-3xl font-bold text-gray-900 mb-6"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="Title" /></h2>}
        <EditText value={c.text||""} onSave={(v)=>upd({text:v})} tag="div" editable={editable} placeholder="Start typing your content here…" className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap" />
      </div>
    </section>
  );
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function StatsBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const setItems = (items: any[]) => upd({ items });
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#0f172a", color: c.textColor||"#fff" }} className="w-full py-20 px-8">
      <div className="max-w-5xl mx-auto">
        {(c.title||editable) && <h2 className="text-3xl font-bold text-center mb-12"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="Title" /></h2>}
        <div className="grid grid-cols-4 gap-8">
          {(c.items||[]).map((item: any, i: number) => (
            <DraggableItem key={i} index={i} total={(c.items||[]).length} editable={editable}
              onMove={(f,t)=>setItems(moveItem(c.items,f,t))}
              onDelete={(idx)=>setItems(c.items.filter((_:any,fi:number)=>fi!==idx))}>
              <div className="text-center">
                <div style={{color:theme.primaryColor}} className="text-5xl font-extrabold mb-2">
                  <EditText value={item.value||""} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],value:v};setItems(it);}} editable={editable} tag="span" className="text-5xl font-extrabold" placeholder="0" />
                </div>
                <EditText value={item.label||""} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],label:v};setItems(it);}} editable={editable} tag="div" className="text-sm opacity-70 uppercase tracking-wider" placeholder="Label" />
              </div>
            </DraggableItem>
          ))}
          {editable && <button onClick={(e)=>{e.stopPropagation();setItems([...(c.items||[]),{value:"0",label:"Metric"}]);}}
            className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/20 text-white/40 hover:border-violet-400 hover:text-violet-300 transition-colors">
            <span className="text-sm">+ Add stat</span>
          </button>}
        </div>
      </div>
    </section>
  );
}

// ── GALLERY ───────────────────────────────────────────────────────────────────
function GalleryBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const cols = c.columns===2?"grid-cols-2":c.columns===4?"grid-cols-4":"grid-cols-3";
  const gap = c.gap==="small"?"gap-2":c.gap==="large"?"gap-6":"gap-4";
  const setItems = (items: any[]) => upd({ items });
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#fff" }} className="w-full py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {(c.title||editable) && <h2 className="text-4xl font-bold text-center text-gray-900 mb-3"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="Gallery title" /></h2>}
        {(c.subtitle||editable) && <p className="text-center text-gray-500 mb-10"><EditText value={c.subtitle||""} onSave={(v)=>upd({subtitle:v})} editable={editable} placeholder="Subtitle" /></p>}
        <div className={`grid ${cols} ${gap}`}>
          {(c.items||[]).map((item: any, i: number) => (
            <DraggableItem key={i} index={i} total={(c.items||[]).length} editable={editable}
              onMove={(f,t)=>setItems(moveItem(c.items,f,t))}
              onDelete={(idx)=>setItems(c.items.filter((_:any,fi:number)=>fi!==idx))}>
              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <ImageUpload src={item.image||""} onUpload={(v)=>{const it=[...c.items];it[i]={...it[i],image:v};setItems(it);}} editable={editable} className="w-full h-full object-cover rounded-xl" alt={item.caption} />
                {item.caption && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <EditText value={item.caption||""} onSave={(v)=>{const it=[...c.items];it[i]={...it[i],caption:v};setItems(it);}} editable={editable} tag="span" className="text-white text-sm font-medium" placeholder="Caption" />
                </div>}
              </div>
            </DraggableItem>
          ))}
          {editable && <button onClick={(e)=>{e.stopPropagation();setItems([...(c.items||[]),{image:"",caption:`Image ${(c.items||[]).length+1}`,link:""}]);}}
            className="flex flex-col items-center justify-center gap-2 rounded-xl aspect-square border-2 border-dashed border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors">
            <span className="text-3xl">📷</span><span className="text-sm font-medium">Add image</span>
          </button>}
        </div>
      </div>
    </section>
  );
}

// ── TEAM ──────────────────────────────────────────────────────────────────────
function TeamBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const cols = c.columns===3?"grid-cols-3":c.columns===2?"grid-cols-2":"grid-cols-4";
  const setMembers = (members: any[]) => upd({ members });
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#fff" }} className="w-full py-20 px-8">
      <div className="max-w-6xl mx-auto">
        {(c.title||editable) && <h2 className="text-4xl font-bold text-center text-gray-900 mb-3"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="Meet the Team" /></h2>}
        {(c.subtitle||editable) && <p className="text-center text-gray-500 mb-14"><EditText value={c.subtitle||""} onSave={(v)=>upd({subtitle:v})} editable={editable} placeholder="Subtitle" /></p>}
        <div className={`grid ${cols} gap-8`}>
          {(c.members||[]).map((m: any, i: number) => (
            <DraggableItem key={i} index={i} total={(c.members||[]).length} editable={editable}
              onMove={(f,t)=>setMembers(moveItem(c.members,f,t))}
              onDelete={(idx)=>setMembers(c.members.filter((_:any,fi:number)=>fi!==idx))}>
              <div className="text-center">
                <ImageUpload src={m.image||""} onUpload={(v)=>{const ms=[...c.members];ms[i]={...ms[i],image:v};setMembers(ms);}} editable={editable}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4" alt={m.name} />
                <EditText value={m.name||""} onSave={(v)=>{const ms=[...c.members];ms[i]={...ms[i],name:v};setMembers(ms);}} editable={editable} tag="h3" className="font-semibold text-gray-900" placeholder="Name" />
                <EditText value={m.role||""} onSave={(v)=>{const ms=[...c.members];ms[i]={...ms[i],role:v};setMembers(ms);}} editable={editable} tag="p" className="text-sm text-gray-500 mb-2" placeholder="Role" />
                <EditText value={m.bio||""} onSave={(v)=>{const ms=[...c.members];ms[i]={...ms[i],bio:v};setMembers(ms);}} editable={editable} tag="p" className="text-xs text-gray-400 leading-relaxed" placeholder="Short bio…" />
              </div>
            </DraggableItem>
          ))}
          {editable && <button onClick={(e)=>{e.stopPropagation();setMembers([...(c.members||[]),{name:"New Member",role:"Role",image:"",bio:""}]);}}
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors">
            <span className="text-2xl">👤</span><span className="text-sm font-medium">Add member</span>
          </button>}
        </div>
      </div>
    </section>
  );
}

// ── PRICING ───────────────────────────────────────────────────────────────────
function PricingBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const setPlans = (plans: any[]) => upd({ plans });
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#fff" }} className="w-full py-20 px-8">
      <div className="max-w-5xl mx-auto">
        {(c.title||editable) && <h2 className="text-4xl font-bold text-center text-gray-900 mb-3"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="Pricing" /></h2>}
        {(c.subtitle||editable) && <p className="text-center text-gray-500 mb-14"><EditText value={c.subtitle||""} onSave={(v)=>upd({subtitle:v})} editable={editable} placeholder="Subtitle" /></p>}
        <div className="grid grid-cols-3 gap-6">
          {(c.plans||[]).map((plan: any, i: number) => (
            <DraggableItem key={i} index={i} total={(c.plans||[]).length} editable={editable}
              onMove={(f,t)=>setPlans(moveItem(c.plans,f,t))}
              onDelete={(idx)=>setPlans(c.plans.filter((_:any,fi:number)=>fi!==idx))}>
              <div className={`rounded-2xl p-8 flex flex-col gap-4 ${plan.featured?"shadow-xl border-2 scale-105":"border border-gray-200 shadow-sm"}`} style={plan.featured?{borderColor:theme.primaryColor}:{}}>
                {plan.featured && <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white w-fit" style={{backgroundColor:theme.primaryColor}}>Most Popular</span>}
                <div>
                  <EditText value={plan.name||""} onSave={(v)=>{const ps=[...c.plans];ps[i]={...ps[i],name:v};setPlans(ps);}} editable={editable} tag="h3" className="text-xl font-bold text-gray-900" placeholder="Plan name" />
                  <EditText value={plan.description||""} onSave={(v)=>{const ps=[...c.plans];ps[i]={...ps[i],description:v};setPlans(ps);}} editable={editable} tag="p" className="text-sm text-gray-500 mt-1" placeholder="Description" />
                </div>
                <div className="flex items-baseline gap-1">
                  <EditText value={plan.price||""} onSave={(v)=>{const ps=[...c.plans];ps[i]={...ps[i],price:v};setPlans(ps);}} editable={editable} tag="span" className="text-4xl font-extrabold text-gray-900" placeholder="$0" />
                  <EditText value={plan.period||""} onSave={(v)=>{const ps=[...c.plans];ps[i]={...ps[i],period:v};setPlans(ps);}} editable={editable} tag="span" className="text-gray-500" placeholder="/mo" />
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {(plan.features||[]).map((f: string, fi: number) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-gray-600">
                      <span style={{color:theme.primaryColor}}>✓</span>
                      <EditText value={f||""} onSave={(v)=>{const ps=[...c.plans];const feats=[...ps[i].features];feats[fi]=v;ps[i]={...ps[i],features:feats};setPlans(ps);}} editable={editable} tag="span" className="flex-1" placeholder="Feature" />
                      {editable && <button onClick={(e)=>{e.stopPropagation();const ps=[...c.plans];ps[i]={...ps[i],features:plan.features.filter((_:any,ffi:number)=>ffi!==fi)};setPlans(ps);}} className="text-red-400 hover:text-red-600 text-xs">✕</button>}
                    </li>
                  ))}
                  {editable && <button onClick={(e)=>{e.stopPropagation();const ps=[...c.plans];ps[i]={...ps[i],features:[...(ps[i].features||[]),"New feature"]};setPlans(ps);}} className="text-xs text-violet-500 hover:underline mt-1 text-left">+ Add feature</button>}
                </ul>
                <a href="#" style={plan.featured?{backgroundColor:theme.primaryColor}:{}} className={`mt-auto text-center py-3 px-6 rounded-lg font-semibold hover:opacity-90 ${plan.featured?"text-white":"border-2 border-gray-300 text-gray-700"}`}>
                  <EditText value={plan.buttonText||"Get Started"} onSave={(v)=>{const ps=[...c.plans];ps[i]={...ps[i],buttonText:v};setPlans(ps);}} editable={editable} tag="span" className="font-semibold" />
                </a>
              </div>
            </DraggableItem>
          ))}
          {editable && <button onClick={(e)=>{e.stopPropagation();setPlans([...(c.plans||[]),{name:"New Plan",price:"$0",period:"/mo",description:"",features:["Feature 1"],buttonText:"Get Started",featured:false}]);}}
            className="flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors">
            <span className="text-3xl">$</span><span className="text-sm font-medium">Add plan</span>
          </button>}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CtaBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#6366f1", color: c.textColor||"#fff" }} className="w-full py-20 px-8 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-4xl font-bold w-full"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="CTA title" /></h2>
        {(c.subtitle||editable) && <p className="text-lg opacity-80 w-full"><EditText value={c.subtitle||""} onSave={(v)=>upd({subtitle:v})} editable={editable} placeholder="Subtitle" /></p>}
        <div className="flex gap-3 flex-wrap justify-center">
          {c.buttonText && <span className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold shadow inline-block">
            <EditText value={c.buttonText} onSave={(v)=>upd({buttonText:v})} editable={editable} className="text-gray-900 font-semibold" placeholder="Button" />
          </span>}
          {c.secondaryButtonText && <span className="px-8 py-3 border-2 border-white/60 rounded-lg font-semibold inline-block">
            <EditText value={c.secondaryButtonText} onSave={(v)=>upd({secondaryButtonText:v})} editable={editable} className="font-semibold" placeholder="Secondary" />
          </span>}
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function ContactBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const setFields = (fields: any[]) => upd({ fields });
  return (
    <section style={{ backgroundColor: c.backgroundColor || "#fff" }} className="w-full py-20 px-8">
      <div className="max-w-2xl mx-auto">
        {(c.title || editable) && (
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-3">
            <EditText value={c.title || ""} onSave={(v) => upd({ title: v })} editable={editable} placeholder="Get in Touch" />
          </h2>
        )}
        {(c.subtitle || editable) && (
          <p className="text-center text-gray-500 mb-10">
            <EditText value={c.subtitle || ""} onSave={(v) => upd({ subtitle: v })} editable={editable} placeholder="We'd love to hear from you…" />
          </p>
        )}
        <div className="space-y-4">
          {(c.fields || []).map((field: any, i: number) => (
            <DraggableItem key={i} index={i} total={(c.fields || []).length} editable={editable}
              onMove={(f, t) => setFields(moveItem(c.fields, f, t))}
              onDelete={(idx) => setFields(c.fields.filter((_: any, fi: number) => fi !== idx))}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <EditText
                    value={field.label || ""}
                    onSave={(v) => { const fs = [...c.fields]; fs[i] = { ...fs[i], label: v }; setFields(fs); }}
                    editable={editable} tag="label"
                    className="block text-sm font-medium text-gray-700"
                    placeholder="Field label"
                  />
                  {editable && (
                    <select
                      value={field.type || "text"}
                      onChange={(e) => { e.stopPropagation(); const fs = [...c.fields]; fs[i] = { ...fs[i], type: e.target.value }; setFields(fs); }}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs border border-gray-200 rounded px-1 py-0.5 ml-2 bg-white text-gray-600"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="textarea">Textarea</option>
                    </select>
                  )}
                </div>
                {field.type === "textarea"
                  ? <textarea
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
                      onFocus={(e) => e.stopPropagation()}
                    />
                  : <input
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      onFocus={(e) => e.stopPropagation()}
                    />
                }
              </div>
            </DraggableItem>
          ))}
          {editable && (
            <button
              onClick={(e) => { e.stopPropagation(); setFields([...(c.fields || []), { type: "text", name: `field_${Date.now()}`, label: "New Field", placeholder: "Enter value…", required: false }]); }}
              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors"
            >
              + Add field
            </button>
          )}
          <button
            style={{ backgroundColor: theme.primaryColor }}
            className="w-full py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity mt-2"
            onClick={(e) => editable && e.stopPropagation()}
          >
            <EditText value={c.buttonText || "Send Message"} onSave={(v) => upd({ buttonText: v })} editable={editable} tag="span" className="font-semibold text-white" placeholder="Send Message" />
          </button>
        </div>
        {/* Contact info editable */}
        {(c.email || c.phone || c.address || editable) && (
          <div className="mt-8 space-y-2 text-center text-sm text-gray-500">
            {(c.email || editable) && (
              <div className="flex items-center justify-center gap-2">
                <span>✉</span>
                <EditText value={c.email || ""} onSave={(v) => upd({ email: v })} editable={editable} tag="span" className="text-gray-500" placeholder="your@email.com" />
              </div>
            )}
            {(c.phone || editable) && (
              <div className="flex items-center justify-center gap-2">
                <span>📞</span>
                <EditText value={c.phone || ""} onSave={(v) => upd({ phone: v })} editable={editable} tag="span" className="text-gray-500" placeholder="+1 (555) 000-0000" />
              </div>
            )}
            {(c.address || editable) && (
              <div className="flex items-center justify-center gap-2">
                <span>📍</span>
                <EditText value={c.address || ""} onSave={(v) => upd({ address: v })} editable={editable} tag="span" className="text-gray-500" placeholder="123 Main St, City" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ── VIDEO ─────────────────────────────────────────────────────────────────────
function VideoBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  return (
    <section style={{ backgroundColor: c.backgroundColor||"#0f172a" }} className="w-full py-16 px-8">
      <div className="max-w-4xl mx-auto">
        {(c.title||editable) && <h2 className="text-3xl font-bold text-center text-white mb-8"><EditText value={c.title||""} onSave={(v)=>upd({title:v})} editable={editable} placeholder="Video title" /></h2>}
        <div className="rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: c.aspectRatio||"16/9" }}>
          {c.videoUrl ? <iframe src={c.videoUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 text-6xl">▶</div>}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER — fully editable ───────────────────────────────────────────────────
function FooterBlock({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const c = block.content;
  const upd = (p: any) => onUpdate?.({ ...c, ...p });
  const setCols = (columns: any[]) => upd({ columns });
  return (
    <footer style={{ backgroundColor: c.backgroundColor||"#0f172a", color: c.textColor||"#94a3b8" }} className="w-full px-8 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12" style={{ gridTemplateColumns: `2fr ${(c.columns||[]).map(()=>"1fr").join(" ")}` }}>
          {/* Brand column */}
          <div>
            {c.logoUrl
              ? <ImageUpload src={c.logoUrl} onUpload={(v)=>upd({logoUrl:v})} editable={editable} className="h-10 w-auto object-contain mb-3" alt="Logo" />
              : <EditText value={c.logo||"Brand"} onSave={(v)=>upd({logo:v})} editable={editable} tag="span" className="text-xl font-bold text-white block mb-3" placeholder="Brand" />}
            <EditText value={c.tagline||""} onSave={(v)=>upd({tagline:v})} editable={editable} tag="p" className="text-sm leading-relaxed opacity-70" placeholder="Your tagline…" />
          </div>
          {/* Link columns */}
          {(c.columns||[]).map((col: any, ci: number) => (
            <DraggableItem key={ci} index={ci} total={(c.columns||[]).length} editable={editable}
              onMove={(f,t)=>setCols(moveItem(c.columns,f,t))}
              onDelete={(idx)=>setCols(c.columns.filter((_:any,i:number)=>i!==idx))}>
              <div>
                <EditText value={col.title||""} onSave={(v)=>{const cols=[...c.columns];cols[ci]={...cols[ci],title:v};setCols(cols);}} editable={editable} tag="h4" className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" placeholder="Column title" />
                <ul className="space-y-2">
                  {(col.links||[]).map((link: any, li: number) => (
                    <li key={li} className="flex items-center gap-1 group/link">
                      <EditText value={link.label||""} onSave={(v)=>{const cols=[...c.columns];const links=[...cols[ci].links];links[li]={...links[li],label:v};cols[ci]={...cols[ci],links};setCols(cols);}} editable={editable} tag="a" className="text-sm hover:text-white transition-colors" placeholder="Link label" />
                      {editable && <button onClick={(e)=>{e.stopPropagation();const cols=[...c.columns];cols[ci]={...cols[ci],links:col.links.filter((_:any,i:number)=>i!==li)};setCols(cols);}} className="opacity-0 group-hover/link:opacity-100 text-red-400 hover:text-red-300 text-xs ml-1">✕</button>}
                    </li>
                  ))}
                  {editable && <li><button onClick={(e)=>{e.stopPropagation();const cols=[...c.columns];cols[ci]={...cols[ci],links:[...(col.links||[]),{label:"New link",href:"#"}]};setCols(cols);}} className="text-xs text-violet-400 hover:underline">+ Add link</button></li>}
                </ul>
              </div>
            </DraggableItem>
          ))}
          {editable && <button onClick={(e)=>{e.stopPropagation();setCols([...(c.columns||[]),{title:"New Column",links:[{label:"Link",href:"#"}]}]);}}
            className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-xl text-white/30 hover:border-violet-400 hover:text-violet-300 transition-colors text-sm p-4">
            + Add column
          </button>}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-sm opacity-50 text-center">
          <EditText value={c.copyright||""} onSave={(v)=>upd({copyright:v})} editable={editable} tag="span" placeholder={`© ${new Date().getFullYear()} Brand. All rights reserved.`} />
        </div>
      </div>
    </footer>
  );
}

// ── Main switch ───────────────────────────────────────────────────────────────
export function BlockRenderer({ block, theme, editable, onUpdate }: BlockRendererProps) {
  const props = { block, theme, editable, onUpdate };
  switch (block.type) {
    case "navbar":        return <NavbarBlock {...props} />;
    case "hero":          return <HeroBlock {...props} />;
    case "features":      return <FeaturesBlock {...props} />;
    case "testimonials":  return <TestimonialsBlock {...props} />;
    case "text":          return <TextBlock {...props} />;
    case "stats":         return <StatsBlock {...props} />;
    case "gallery":       return <GalleryBlock {...props} />;
    case "team":          return <TeamBlock {...props} />;
    case "pricing":       return <PricingBlock {...props} />;
    case "cta":           return <CtaBlock {...props} />;
    case "contact":       return <ContactBlock {...props} />;
    case "video":         return <VideoBlock {...props} />;
    case "footer":        return <FooterBlock {...props} />;
    default: return <section className="w-full py-12 px-8 bg-gray-50 text-center text-gray-400">Unknown block: {block.type}</section>;
  }
}
