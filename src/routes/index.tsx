/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import card24Logo from "@/assets/card24-logo.jpg";
import { useAuthStore } from "@/store/auth";

declare global {
  interface Window {
    THREE?: any;
  }
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "card24 — Create. Share. Be You." },
      {
        name: "description",
        content:
          "Card24 — create digital business cards, printable cards, QR codes and personal websites. Create. Share. Be You.",
      },
      { name: "theme-color", content: "#05070f" },
    ],
  }),
  component: Landing,
});

const qrCells = new Set([
  0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 13, 19, 21, 24, 26, 28, 30, 32, 34, 36, 39, 45, 47, 50, 52, 54,
  56, 58, 60, 62, 65, 71, 73, 76, 78, 80, 82, 84, 86, 88, 91, 97, 99, 101, 103, 105, 107, 109, 111,
  113, 115, 117, 119, 121, 123, 125, 127, 130, 132, 134, 136, 138, 140, 142, 144, 146, 149, 155,
  157, 160, 162, 164, 166, 168,
]);

const features = [
  ["card", "Business Card Editor", "Drag, edit text, change colors, round corners, export."],
  ["site", "Website Builder", "Build a clean site section by section."],
  ["qr", "QR Generator", "Create QR codes for cards, websites, contact info, or links."],
  ["analytics", "Analytics", "Track scans, views, and activity."],
];

const steps = [
  ["01", "Pick a template", "Start from ready-made card, site, and QR designs."],
  ["02", "Customize your brand", "Swap colors, fonts, images, icons, and layout live."],
  ["03", "Publish or export", "Go live in one click, or export print-ready PDF and PNG files."],
  ["04", "Share by link or QR", "One link or scan connects people to everything about you."],
];

function Landing() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const init = useAuthStore((s) => s.init);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!initialized) init();
  }, [init, initialized]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanupEditor = initEditorPreview();
    let cleanupHero: (() => void) | undefined;

    const startHero = () => {
      cleanupHero = initHeroScene();
    };

    if (window.THREE) {
      startHero();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.async = true;
      script.dataset.card24Three = "true";
      script.onload = startHero;
      script.onerror = () => document.body.classList.add("no-webgl");
      document.head.appendChild(script);
    }

    return () => {
      cleanupEditor();
      cleanupHero?.();
      document.body.classList.remove("no-webgl");
    };
  }, []);

  const startLabel = user ? "Open dashboard" : "Start creating";

  return (
    <div className="card24-landing" id="top">
      <LandingStyles />

      <nav className={`landing-nav ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
        <div className="landing-wrap nav-inner">
          <a className="brand" href="#top" aria-label="card24 home">
            <LogoChip />
          </a>
          <ul className="nav-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#how">How it works</a>
            </li>
            <li>
              <a href="#editor">Editor</a>
            </li>
          </ul>
          <div className="nav-actions">
            {!user && (
              <Link
                className="landing-btn landing-btn-ghost landing-btn-sm"
                to="/login"
                search={{ next: "/dashboard" }}
              >
                Log in
              </Link>
            )}
            <StartLink className="landing-btn landing-btn-primary landing-btn-sm" user={user}>
              {startLabel}
            </StartLink>
            <button
              className="nav-burger"
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <div className="mobile-menu">
          {["features", "how", "editor"].map((id) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {id === "how" ? "How it works" : id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
          {!user && (
            <Link to="/login" search={{ next: "/dashboard" }} onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
          )}
          <StartLink className="landing-btn landing-btn-primary" user={user}>
            {startLabel}
          </StartLink>
        </div>
      </nav>

      <header className="hero" id="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <canvas id="hero3d" aria-hidden="true" />
        <div className="hero-fallback" aria-hidden="true">
          <BusinessCardMock />
        </div>

        <div className="landing-wrap">
          <div className="hero-copy">
            <span className="badge">
              <i />
              Create. Share. Be You.
            </span>
            <h1>
              Your business identity, <span className="grad-text">ready in minutes.</span>
            </h1>
            <p className="hero-sub">
              Design business cards, launch a personal website, generate QR codes, and share
              everything from one simple workspace.
            </p>
            <div className="hero-ctas">
              <StartLink className="landing-btn landing-btn-primary" user={user}>
                {startLabel}
                <ArrowIcon />
              </StartLink>
              <Link className="landing-btn landing-btn-ghost" to="/templates">
                View templates
              </Link>
            </div>
            <div className="hero-hints">
              <span>Print-ready exports</span>
              <i />
              <span>QR analytics</span>
              <i />
              <span>Free templates</span>
            </div>
          </div>
        </div>
        <a className="scroll-cue" href="#features" aria-label="Scroll down">
          <span />
        </a>
      </header>

      <main>
        <section className="landing-section" id="features">
          <div className="landing-wrap">
            <SectionHead
              eyebrow="Features"
              title={
                <>
                  Everything your identity needs, <span className="grad-text">in one place</span>
                </>
              }
              text="From the first impression to the follow-up, Card24 keeps every touchpoint connected."
            />
            <div className="features-grid">
              {features.map(([icon, title, text], index) => (
                <article
                  key={title}
                  className="feature-card"
                  data-reveal
                  style={{ "--d": `${0.05 + index * 0.1}s` } as CSSProperties}
                >
                  <div className="feature-icon">
                    <FeatureIcon name={icon} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section" id="how">
          <div className="landing-wrap">
            <SectionHead
              eyebrow="How it works"
              title={
                <>
                  Live in <span className="grad-text">four simple steps</span>
                </>
              }
              text="No design experience required. Start from a template and publish when you're ready."
            />
            <ol className="steps">
              {steps.map(([num, title, text], index) => (
                <li
                  key={num}
                  className="step"
                  data-reveal
                  style={{ "--d": `${0.05 + index * 0.1}s` } as CSSProperties}
                >
                  <span className="step-dot">{num}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="landing-section" id="editor">
          <div className="landing-wrap">
            <SectionHead
              eyebrow="The editor"
              title={
                <>
                  Design that feels <span className="grad-text">like play</span>
                </>
              }
              text="A canvas built for speed: drag, type, recolor, round corners, and watch every update apply live."
            />
            <div className="editor-stage" data-reveal>
              <EditorPreview />
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-wrap" data-reveal>
            <h2>
              Build your <span className="grad-text">digital identity</span> today.
            </h2>
            <p>Start with a card, website, or QR code and keep everything connected.</p>
            <DashboardLink className="landing-btn landing-btn-primary" user={user}>
              {user ? "Open dashboard" : "Log in and open dashboard"}
              <ArrowIcon />
            </DashboardLink>
            <div className="note">Free to start · No credit card required</div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-wrap footer-inner">
          <div className="footer-brand">
            <LogoChip large />
            <span className="footer-tag">Create. Share. Be You.</span>
          </div>
          <nav className="footer-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#editor">Editor</a>
            <Link to="/pricing">Pricing</Link>
            <Link to="/templates">Templates</Link>
          </nav>
          <div className="footer-copy">© 2026 card24. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function StartLink({
  user,
  className,
  children,
}: {
  user: unknown;
  className: string;
  children: ReactNode;
}) {
  return user ? (
    <Link className={className} to="/dashboard">
      {children}
    </Link>
  ) : (
    <Link className={className} to="/register">
      {children}
    </Link>
  );
}

function DashboardLink({
  user,
  className,
  children,
}: {
  user: unknown;
  className: string;
  children: ReactNode;
}) {
  return user ? (
    <Link className={className} to="/dashboard">
      {children}
    </Link>
  ) : (
    <Link className={className} to="/login" search={{ next: "/dashboard" }}>
      {children}
    </Link>
  );
}

function LogoChip({ large = false }: { large?: boolean }) {
  return (
    <span className="logo-chip">
      <img src={card24Logo} alt="card24" className={large ? "large" : ""} />
    </span>
  );
}

function SectionHead({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: ReactNode;
  text: string;
}) {
  return (
    <div className="section-head" data-reveal>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureIcon({ name }: { name: string }) {
  if (name === "site") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="2.5"
          y="4.5"
          width="19"
          height="15"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path d="M2.5 9h19M14 12.5h5M14 15h5M14 17.5h3.5" stroke="currentColor" strokeWidth="1.7" />
        <rect
          x="5.5"
          y="12"
          width="5.5"
          height="4.5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }
  if (name === "qr") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M14.8 14.8h2v2h-2zM18.6 14.8h2v2h-2zM14.8 18.6h2v2h-2zM18.6 18.6h2v2h-2z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === "analytics") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3.5 20.5h17M7 20.5v-5.5M11.5 20.5v-9M16 20.5V7.5M5 9.5L9 6l3.5 2.5L17.5 4M14.9 4h2.6v2.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2.5"
        y="5"
        width="13.5"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M14.8 16l4.2-4.2 2.2 2.2-4.2 4.2-3 .7.8-2.9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QrGrid({ id }: { id?: string }) {
  return (
    <div className="card-qr" id={id}>
      {Array.from({ length: 169 }).map((_, index) => (
        <i key={index} className={qrCells.has(index) ? "on" : ""} />
      ))}
    </div>
  );
}

function BusinessCardMock({ editor = false }: { editor?: boolean }) {
  return (
    <div className="business-card">
      <div className="card-brand">
        <i />
        card24
      </div>
      <div className="card-person">
        <div className="card-avatar">AM</div>
        <div>
          <div className="card-name" id={editor ? "edName" : undefined}>
            Alex Morgan
          </div>
          <div className="card-role">Product Designer</div>
        </div>
      </div>
      <div className="card-line l1" />
      <div className="card-line l2" />
      <div className="card-link">card24.co/alex</div>
      <QrGrid id={editor ? "edQr" : undefined} />
      <div className="card-qr-cap">SCAN TO CONNECT</div>
    </div>
  );
}

function EditorPreview() {
  return (
    <div className="editor-window" id="edWin">
      <div className="editor-topbar">
        <div className="editor-dots">
          <i />
          <i />
          <i />
        </div>
        <div className="editor-tab">
          <span>business-card-01 · Card24 Studio</span>
        </div>
        <div className="editor-actions">
          <button className="editor-btn" type="button">
            Export
          </button>
          <button className="editor-btn primary" id="edShare" type="button">
            Share
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-toolbar">
          {["select", "text", "image", "shape", "qr", "layers"].map((tool, index) => (
            <button
              key={tool}
              className={`editor-tool ${index === 0 ? "active" : ""}`}
              type="button"
              data-tool={tool}
              title={tool}
            >
              {tool.slice(0, 1).toUpperCase()}
            </button>
          ))}
        </div>
        <div className="editor-canvas">
          <div className="editor-selection" id="edSel">
            {["tl", "tr", "bl", "br", "t", "b", "l", "r"].map((handle) => (
              <span key={handle} className={`editor-h h-${handle}`} />
            ))}
            <span className="editor-label">Business card · 85 × 55 mm</span>
            <BusinessCardMock editor />
          </div>
        </div>
        <aside className="editor-props">
          <div className="editor-prop">
            <div className="editor-prop-label">Accent</div>
            <div className="editor-swatches">
              {["#2f6bff", "#38d7ff", "#8b5cf6", "#2dd4bf", "#e8ecff"].map((color, index) => (
                <button
                  key={color}
                  className={`editor-swatch ${index === 0 ? "active" : ""}`}
                  data-color={color}
                  style={{ "--c": color } as CSSProperties}
                  type="button"
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          <div className="editor-prop">
            <div className="editor-prop-label">Font</div>
            <div className="editor-pill">Inter · SemiBold</div>
          </div>
          <div className="editor-prop">
            <div className="editor-prop-label">Corner radius</div>
            <div className="editor-slider-row">
              <input
                className="editor-range"
                id="edRange"
                type="range"
                min="0"
                max="32"
                defaultValue="24"
                step="1"
                style={{ "--p": "75%" } as CSSProperties}
              />
              <span className="editor-slider-val" id="edVal">
                24px
              </span>
            </div>
          </div>
        </aside>
      </div>
      <div className="editor-status">
        <span>
          <b>●</b> Autosaved — just now
        </span>
        <span>100%</span>
      </div>
      <div className="editor-cursor" id="edCur">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 2 L19 13 L13 14 L16.5 20.5 L13.6 21.9 L10.2 15.5 L5.5 20 Z"
            fill="#fff"
            stroke="#0b1226"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="editor-toast" id="edToast">
        Link copied — card24.co/alex
      </div>
    </div>
  );
}

function initEditorPreview() {
  const win = document.getElementById("edWin");
  if (!win) return () => undefined;
  const cursor = document.getElementById("edCur");
  const tools = Array.from(document.querySelectorAll<HTMLElement>(".editor-tool"));
  const swatches = Array.from(document.querySelectorAll<HTMLElement>(".editor-swatch"));
  const range = document.getElementById("edRange") as HTMLInputElement | null;
  const val = document.getElementById("edVal");
  const selection = document.getElementById("edSel");
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".business-card"));
  const name = document.getElementById("edName");
  const share = document.getElementById("edShare");
  const toast = document.getElementById("edToast");
  let timer = 0;
  let stopped = false;
  let running = false;

  const setRadius = (raw: number) => {
    const value = Math.max(0, Math.min(32, Math.round(raw)));
    if (range) {
      range.value = String(value);
      range.style.setProperty("--p", `${(value / 32) * 100}%`);
    }
    if (val) val.textContent = `${value}px`;
    selection?.style.setProperty("--edr", `${value}px`);
  };
  const setAccent = (index: number) => {
    swatches.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
    const color = swatches[index]?.dataset.color ?? "#2f6bff";
    cards.forEach((card) => card.style.setProperty("--acc", color));
  };
  const showToast = () => {
    toast?.classList.add("show");
    window.setTimeout(() => toast?.classList.remove("show"), 2100);
  };
  const moveCursor = (target?: Element | null) => {
    if (!cursor || !target) return;
    const r = target.getBoundingClientRect();
    const w = win.getBoundingClientRect();
    cursor.style.left = `${r.left - w.left + r.width * 0.72}px`;
    cursor.style.top = `${r.top - w.top + r.height * 0.7}px`;
    cursor.classList.remove("click");
    void cursor.offsetWidth;
    cursor.classList.add("click");
  };

  swatches.forEach((item, index) => item.addEventListener("click", () => setAccent(index)));
  range?.addEventListener("input", () => setRadius(Number(range.value)));
  share?.addEventListener("click", showToast);

  const loop = async () => {
    if (running || stopped) return;
    running = true;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    while (!stopped) {
      await sleep(900);
      moveCursor(tools[1]);
      tools.forEach((item) => item.classList.toggle("active", item.dataset.tool === "text"));
      name?.classList.add("text-glow");
      await sleep(1300);
      moveCursor(swatches[1]);
      setAccent(1);
      await sleep(1400);
      moveCursor(range);
      setRadius(9);
      await sleep(1500);
      moveCursor(share);
      showToast();
      await sleep(2200);
      name?.classList.remove("text-glow");
      setAccent(0);
      setRadius(24);
      tools.forEach((item) => item.classList.toggle("active", item.dataset.tool === "select"));
    }
    running = false;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) void loop();
      else window.clearTimeout(timer);
    },
    { threshold: 0.3 },
  );
  observer.observe(win);
  win.addEventListener("pointerdown", () => {
    stopped = true;
    window.clearTimeout(timer);
  });

  return () => {
    stopped = true;
    window.clearTimeout(timer);
    observer.disconnect();
  };
}

function initHeroScene() {
  const THREE = window.THREE;
  const canvas = document.getElementById("hero3d") as HTMLCanvasElement | null;
  const hero = document.getElementById("hero");
  if (!THREE || !canvas || !hero) return undefined;

  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.4);
    const world = new THREE.Group();
    scene.add(world);

    const card = new THREE.Group();
    world.add(card);
    const shape = roundedShape(3.4, 2.14, 0.24, THREE);
    const body = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.02,
        bevelSegments: 3,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x1a4aa5,
        metalness: 0.45,
        roughness: 0.3,
        clearcoat: 0.9,
        emissive: 0x123a86,
        emissiveIntensity: 0.5,
      }),
    );
    card.add(body);

    const texture = new THREE.CanvasTexture(drawCardTexture());
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.14),
      new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        emissive: 0xffffff,
        emissiveIntensity: 0.25,
      }),
    );
    face.position.z = 0.09;
    card.add(face);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(drawGlowTexture(256)),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.scale.set(7.2, 4.8, 1);
    glow.position.set(0.3, 0.1, -1.6);
    world.add(glow);

    const frosted = new THREE.Mesh(
      new THREE.BoxGeometry(3.36, 2.1, 0.04),
      new THREE.MeshPhysicalMaterial({
        color: 0x9db9ff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.3,
        metalness: 0.35,
        depthWrite: false,
      }),
    );
    frosted.position.set(-0.8, 0.52, -0.9);
    frosted.rotation.set(-0.03, -0.42, 0.1);
    world.add(frosted);

    const panelMat = new THREE.MeshBasicMaterial({
      color: 0x0a1024,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
    });
    const panels = [
      {
        mesh: new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), panelMat),
        x: -2.15,
        y: 1.5,
        z: -2,
        ry: 0.42,
      },
      {
        mesh: new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.15), panelMat.clone()),
        x: 2.3,
        y: -1.35,
        z: -1.1,
        ry: -0.38,
      },
      {
        mesh: new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1), panelMat.clone()),
        x: 2.45,
        y: 1.45,
        z: -1.6,
        ry: -0.42,
      },
    ];
    panels.forEach((panel) => {
      panel.mesh.position.set(panel.x, panel.y, panel.z);
      panel.mesh.rotation.y = panel.ry;
      world.add(panel.mesh);
    });

    scene.add(new THREE.AmbientLight(0x2c4470, 0.9));
    const key = new THREE.PointLight(0xffffff, 0.55);
    key.position.set(1.6, 2.4, 4.5);
    scene.add(key);
    const blue = new THREE.PointLight(0x2f6bff, 1.2);
    blue.position.set(-3.6, 0.8, 3.2);
    scene.add(blue);
    const cyan = new THREE.PointLight(0x38d7ff, 0.8);
    cyan.position.set(3.4, -2.4, 2.4);
    scene.add(cyan);

    let mx = 0;
    let my = 0;
    let smx = 0;
    let smy = 0;
    let frame = 0;
    const clock = new THREE.Clock();

    const layout = () => {
      const w = hero.clientWidth || 1;
      const h = hero.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (camera.aspect < 0.95) {
        world.scale.setScalar(0.58);
        world.position.set(0, -1.2, 0);
      } else if (camera.aspect < 1.5) {
        world.scale.setScalar(0.82);
        world.position.set(0.45, -0.85, 0);
      } else {
        world.scale.setScalar(1.02);
        world.position.set(1.55, 0, 0);
      }
    };
    const onMove = (event: MouseEvent) => {
      mx = (event.clientX / window.innerWidth) * 2 - 1;
      my = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const t = clock.elapsedTime;
      smx += (mx - smx) * 0.06;
      smy += (my - smy) * 0.06;
      card.position.y = Math.sin(t * 0.85) * 0.1;
      card.rotation.x = 0.06 + Math.sin(t * 0.7) * 0.02 - smy * 0.16;
      card.rotation.y = -0.26 + Math.sin(t * 0.5) * 0.045 + smx * 0.3;
      card.rotation.z = Math.sin(t * 0.9) * 0.02;
      frosted.position.y = 0.52 + Math.sin(t * 0.7 + 1.4) * 0.13;
      glow.material.opacity = 0.45 + Math.sin(t * 1.3) * 0.1;
      panels.forEach((panel) => {
        panel.mesh.position.y = panel.y + Math.sin(t * 0.9 + panel.x) * 0.07;
        panel.mesh.rotation.y = panel.ry + smx * 0.12;
        panel.mesh.rotation.x = -smy * 0.07;
      });
      camera.position.x = smx * 0.35;
      camera.position.y = -smy * 0.22;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("mousemove", onMove, { passive: true });
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", layout);
      window.removeEventListener("mousemove", onMove);
      renderer.dispose();
    };
  } catch {
    document.body.classList.add("no-webgl");
    return undefined;
  }
}

function roundedShape(width: number, height: number, radius: number, THREE: any) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function drawCardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 646;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#1a4487");
  gradient.addColorStop(0.5, "#0f2a5c");
  gradient.addColorStop(1, "#081430");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,.92)";
  ctx.font = "700 54px Inter, Arial";
  ctx.fillText("Alex Morgan", 300, 230);
  ctx.fillStyle = "#a8c4ff";
  ctx.font = "500 31px Inter, Arial";
  ctx.fillText("Product Designer", 300, 285);
  ctx.fillStyle = "#38d7ff";
  ctx.beginPath();
  ctx.arc(198, 245, 82, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "700 48px Inter, Arial";
  ctx.textAlign = "center";
  ctx.fillText("AM", 198, 262);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(232,240,255,.85)";
  drawRoundRect(ctx, 134, 378, 340, 22, 11);
  ctx.fill();
  ctx.fillStyle = "rgba(232,240,255,.5)";
  drawRoundRect(ctx, 134, 428, 250, 22, 11);
  ctx.fill();
  ctx.fillStyle = "rgba(190,215,255,.95)";
  ctx.font = "600 25px Inter, Arial";
  ctx.fillText("card24.co/alex", 134, 552);
  ctx.fillStyle = "#f4f8ff";
  drawRoundRect(ctx, 690, 202, 230, 230, 22);
  ctx.fill();
  ctx.fillStyle = "#0d2145";
  qrCells.forEach((index) => {
    const x = index % 13;
    const y = Math.floor(index / 13);
    ctx.fillRect(718 + x * 13.4, 230 + y * 13.4, 10, 10);
  });
  return canvas;
}

function drawGlowTexture(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(64,124,255,.55)");
  gradient.addColorStop(0.45, "rgba(64,124,255,.16)");
  gradient.addColorStop(1, "rgba(64,124,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function LandingStyles() {
  return (
    <style>{`
.card24-landing{--bg:#05070f;--bg2:#070b18;--panel:#0a0f22;--line:rgba(148,178,255,.11);--txt:#eef2ff;--muted:#93a5c9;--blue:#2f6bff;--cyan:#38d7ff;background:var(--bg);color:var(--txt);font-family:Inter,Arial,sans-serif;min-height:100vh;overflow-x:hidden}
.card24-landing *{box-sizing:border-box}.card24-landing a{color:inherit;text-decoration:none}.landing-wrap{max-width:1200px;margin:0 auto;padding:0 24px}.grad-text{background:linear-gradient(92deg,#38d7ff 0%,#5477ff 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.landing-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;font-size:1rem;padding:15px 28px;border-radius:14px;cursor:pointer;border:0;transition:transform .3s,box-shadow .3s,background .3s,border-color .3s}.landing-btn svg{transition:transform .3s}.landing-btn-primary{color:#fff;background:linear-gradient(135deg,#3576ff,#2456e6);box-shadow:0 10px 34px rgba(47,107,255,.42),inset 0 1px 0 rgba(255,255,255,.25)}.landing-btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 46px rgba(47,107,255,.58),inset 0 1px 0 rgba(255,255,255,.25)}.landing-btn-primary:hover svg{transform:translateX(3px)}.landing-btn-ghost{color:var(--txt);background:rgba(148,178,255,.07);border:1px solid rgba(148,178,255,.22)}.landing-btn-ghost:hover{transform:translateY(-2px);border-color:rgba(148,178,255,.5);background:rgba(148,178,255,.12)}.landing-btn-sm{padding:10px 20px;font-size:.9rem;border-radius:11px}
.landing-nav{position:fixed;inset:0 0 auto 0;z-index:50;padding:18px 0;transition:padding .35s,background .35s;animation:navIn .8s .15s both}@keyframes navIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}.landing-nav.scrolled{padding:10px 0;background:rgba(5,8,18,.74);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{display:flex;align-items:center}.logo-chip{display:flex;align-items:center;background:#fbfcff;border-radius:9px;padding:5px 10px;box-shadow:0 4px 18px rgba(0,20,60,.55)}.logo-chip img{height:30px;width:auto;border-radius:6px}.logo-chip img.large{height:38px}.nav-links{display:flex;gap:30px;list-style:none;margin:0;padding:0}.nav-links a{color:var(--muted);font-weight:500;font-size:.95rem;transition:color .25s}.nav-links a:hover{color:#fff}.nav-actions{display:flex;gap:12px;align-items:center}.nav-burger{display:none;flex-direction:column;gap:5px;background:rgba(148,178,255,.08);border:1px solid var(--line);border-radius:10px;padding:11px;cursor:pointer}.nav-burger span{width:18px;height:2px;background:#cdd9f5;border-radius:2px;transition:.3s}.landing-nav.menu-open .nav-burger span:nth-child(1){transform:translateY(7px) rotate(45deg)}.landing-nav.menu-open .nav-burger span:nth-child(2){opacity:0}.landing-nav.menu-open .nav-burger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}.mobile-menu{position:fixed;top:66px;left:14px;right:14px;z-index:49;background:rgba(8,12,26,.97);border:1px solid var(--line);border-radius:16px;padding:10px;display:none;box-shadow:0 24px 60px rgba(0,0,0,.55)}.landing-nav.menu-open .mobile-menu{display:block}.mobile-menu a{display:block;padding:13px 16px;border-radius:10px;color:#cdd9f5;font-weight:500}.mobile-menu a:hover{background:rgba(148,178,255,.08)}.mobile-menu .landing-btn{width:100%;margin-top:8px}
.hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;overflow:hidden}.hero-bg{position:absolute;inset:0;background:radial-gradient(1100px 700px at 76% 18%,rgba(47,107,255,.17),transparent 62%),radial-gradient(800px 600px at 12% 85%,rgba(56,215,255,.07),transparent 60%),linear-gradient(180deg,#060a16 0%,#04060f 100%)}.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(148,178,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(148,178,255,.055) 1px,transparent 1px);background-size:54px 54px;mask-image:radial-gradient(ellipse 75% 62% at 66% 42%,#000 15%,transparent 72%)}#hero3d{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1}body.no-webgl #hero3d{display:none}.hero-copy{position:relative;z-index:2;max-width:600px;margin-left:-20px}.hero-copy>*{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}.hero-copy>*:nth-child(1){animation-delay:.15s}.hero-copy>*:nth-child(2){animation-delay:.28s}.hero-copy>*:nth-child(3){animation-delay:.4s}.hero-copy>*:nth-child(4){animation-delay:.52s}.hero-copy>*:nth-child(5){animation-delay:.64s}@keyframes rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}.badge{display:inline-flex;align-items:center;gap:9px;padding:8px 16px;border-radius:999px;background:rgba(56,215,255,.08);border:1px solid rgba(56,215,255,.25);font-weight:600;font-size:.8rem;color:#9fdcff;letter-spacing:.04em}.badge i{width:7px;height:7px;border-radius:50%;background:#38d7ff;box-shadow:0 0 10px #38d7ff;animation:blink 2.4s infinite}@keyframes blink{50%{opacity:.35}}.hero h1{font-size:clamp(2.5rem,5.6vw,4.2rem);line-height:1.06;font-weight:700;letter-spacing:0;margin:24px 0 20px;max-width:620px}.hero-sub{font-size:clamp(1.02rem,1.4vw,1.2rem);color:var(--muted);line-height:1.65;max-width:540px}.hero-ctas{display:flex;gap:14px;margin:34px 0 24px;flex-wrap:wrap}.hero-hints{display:flex;gap:12px;align-items:center;color:#7c8fb8;font-size:.86rem;flex-wrap:wrap}.hero-hints i{width:3px;height:3px;border-radius:50%;background:#5c6c92}.scroll-cue{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:3;width:26px;height:42px;border:1.5px solid rgba(148,178,255,.35);border-radius:14px;display:flex;justify-content:center}.scroll-cue span{width:4px;height:9px;border-radius:2px;background:#8fa3c8;margin-top:7px;animation:wheel 1.8s infinite}@keyframes wheel{0%{transform:translateY(0);opacity:1}70%{transform:translateY(14px);opacity:0}100%{opacity:0}}
.hero-fallback{display:none}body.no-webgl .hero-fallback{display:block;position:absolute;right:8%;top:50%;transform:translateY(-50%) rotate(-7deg);z-index:1}.business-card{--acc:#2f6bff;position:relative;width:340px;aspect-ratio:85/55;border-radius:var(--edr,18px);background:linear-gradient(135deg,#173a72 0%,#0d2450 55%,#081430 100%);box-shadow:0 18px 50px rgba(2,10,40,.55),inset 0 1px 0 rgba(255,255,255,.14);transition:border-radius .25s ease;overflow:hidden}.business-card::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(220px 160px at 22% 18%,rgba(90,170,255,.25),transparent 70%)}.card-brand{position:absolute;top:14px;right:16px;display:flex;align-items:center;gap:6px;font-weight:700;font-size:.66rem;color:rgba(255,255,255,.85);transition:opacity .3s}.card-brand i{display:block;width:15px;height:10px;border-radius:3.5px;background:linear-gradient(135deg,#38d7ff,var(--acc));box-shadow:6px 3px 0 -2px rgba(255,255,255,.25)}.card-person{position:absolute;top:38px;left:20px;display:flex;gap:12px;align-items:center}.card-avatar{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#38d7ff,var(--acc));display:grid;place-items:center;font-weight:700;color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.12)}.card-name{font-weight:700;font-size:1.02rem;color:#fff}.card-name.text-glow{animation:textGlow 1s ease-in-out infinite alternate}@keyframes textGlow{from{text-shadow:0 0 0 rgba(56,215,255,0)}to{text-shadow:0 0 14px rgba(56,215,255,.95)}}.card-role{font-weight:500;font-size:.72rem;color:#a8c4ff;margin-top:2px}.card-line{position:absolute;left:20px;height:7px;border-radius:4px;background:rgba(230,240,255,.85)}.card-line.l1{top:118px;width:150px}.card-line.l2{top:135px;width:110px;opacity:.55}.card-link{position:absolute;bottom:13px;left:20px;font-weight:600;font-size:.68rem;color:#6fa0ff;display:flex;align-items:center;gap:6px}.card-link::before{content:'';width:6px;height:6px;border-radius:50%;background:#38d7ff}.card-qr{position:absolute;right:16px;top:50%;transform:translateY(-50%);width:78px;height:78px;background:#f4f8ff;border-radius:9px;padding:7px;display:grid;grid-template-columns:repeat(13,1fr);grid-template-rows:repeat(13,1fr);box-shadow:0 6px 18px rgba(2,10,40,.4)}.card-qr i{border-radius:1px}.card-qr i.on{background:#0d2145}.card-qr-cap{position:absolute;right:4px;top:calc(50% + 47px);font-weight:600;font-size:.5rem;letter-spacing:.14em;color:rgba(170,200,255,.7)}
.landing-section{padding:110px 0;border-top:1px solid rgba(148,178,255,.07)}.eyebrow{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;color:#38d7ff}.eyebrow::before,.section-head .eyebrow::after{content:'';width:22px;height:1.5px;background:linear-gradient(90deg,#38d7ff,transparent)}.section-head .eyebrow::after{background:linear-gradient(270deg,#38d7ff,transparent)}.section-head{max-width:660px;margin:0 auto 56px;text-align:center}.section-head h2{font-size:clamp(1.9rem,3.6vw,2.7rem);line-height:1.15;font-weight:700;letter-spacing:0;margin:16px 0 14px}.section-head p{color:var(--muted);line-height:1.65;font-size:1.02rem}[data-reveal]{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.6,.2,1),transform .8s cubic-bezier(.2,.6,.2,1);transition-delay:var(--d,0s)}[data-reveal].in{opacity:1;transform:none}.features-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}.feature-card{position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(20,30,60,.55),rgba(10,16,34,.55));border:1px solid var(--line);border-radius:20px;padding:26px;transition:transform .35s,border-color .35s,box-shadow .35s}.feature-card:hover{transform:translateY(-6px);border-color:rgba(56,215,255,.4);box-shadow:0 18px 44px rgba(10,30,80,.45)}.feature-card h3{font-weight:700;font-size:1.12rem;margin:18px 0 8px}.feature-card p{color:var(--muted);font-size:.95rem;line-height:1.6}.feature-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;color:#38d7ff;background:linear-gradient(160deg,rgba(56,215,255,.16),rgba(47,107,255,.1));border:1px solid rgba(56,215,255,.22);box-shadow:0 6px 20px rgba(47,107,255,.18)}
.steps{list-style:none;display:grid;grid-template-columns:repeat(4,1fr);gap:22px;position:relative;margin:0;padding:0}.steps::before{content:'';position:absolute;top:28px;left:9%;right:9%;height:2px;background:linear-gradient(90deg,rgba(56,215,255,0),rgba(56,215,255,.35) 20%,rgba(47,107,255,.35) 80%,rgba(47,107,255,0))}.step{position:relative}.step-dot{position:relative;z-index:1;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-weight:700;color:#9fdcff;background:linear-gradient(145deg,#132a56,#0a1226);border:1.5px solid rgba(56,215,255,.35);box-shadow:0 0 24px rgba(47,107,255,.28);margin-bottom:18px}.step h3{font-weight:700;font-size:1.08rem;margin-bottom:8px}.step p{color:var(--muted);font-size:.92rem;line-height:1.6}
.editor-stage{position:relative;margin-top:54px}.editor-stage::before{content:'';position:absolute;inset:-50px -90px;background:radial-gradient(620px 360px at 50% 45%,rgba(47,107,255,.15),transparent 70%);pointer-events:none}.editor-window{position:relative;border-radius:16px;border:1px solid rgba(148,178,255,.16);background:#0a0f22;box-shadow:0 40px 100px rgba(2,8,28,.75);overflow:hidden}.editor-topbar{display:flex;align-items:center;gap:14px;padding:10px 14px;border-bottom:1px solid var(--line);background:rgba(10,16,34,.7)}.editor-dots{display:flex;gap:7px}.editor-dots i{width:11px;height:11px;border-radius:50%}.editor-dots i:nth-child(1){background:#ff5f57}.editor-dots i:nth-child(2){background:#febc2e}.editor-dots i:nth-child(3){background:#28c840}.editor-tab{flex:1;display:flex;justify-content:center}.editor-tab span{background:rgba(148,178,255,.08);border:1px solid var(--line);padding:6px 16px;border-radius:8px;font-weight:500;font-size:.78rem;color:#a9bcdc}.editor-actions{display:flex;gap:8px}.editor-btn{font-weight:600;font-size:.78rem;padding:8px 16px;border-radius:9px;border:1px solid rgba(148,178,255,.25);background:rgba(148,178,255,.07);color:#dfe8ff;cursor:pointer}.editor-btn.primary{background:linear-gradient(135deg,#3576ff,#2456e6);border-color:transparent;box-shadow:0 4px 16px rgba(47,107,255,.4)}.editor-body{display:flex;height:540px}.editor-toolbar{width:58px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 0;border-right:1px solid var(--line)}.editor-tool{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;background:transparent;border:0;color:#8fa3c8;cursor:pointer;font-weight:700}.editor-tool:hover{background:rgba(148,178,255,.1);color:#dfe8ff}.editor-tool.active{background:rgba(56,215,255,.12);color:#38d7ff;box-shadow:inset 0 0 0 1.5px rgba(56,215,255,.45)}.editor-canvas{flex:1;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background-color:#0a0f22;background-image:radial-gradient(rgba(148,178,255,.13) 1px,transparent 1.6px),radial-gradient(420px 300px at 50% 42%,rgba(47,107,255,.12),transparent 70%);background-size:20px 20px,100% 100%}.editor-selection{--edr:18px;position:relative;padding:14px;border-radius:calc(var(--edr) + 14px);box-shadow:0 0 0 1.5px rgba(56,215,255,.9),0 0 26px rgba(56,215,255,.22);transition:border-radius .25s ease}.editor-selection .business-card{width:min(320px,68vw)}
.editor-h{position:absolute;width:9px;height:9px;background:#fff;border:1.5px solid #38d7ff;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.4)}.h-tl{top:-5px;left:-5px}.h-tr{top:-5px;right:-5px}.h-bl{bottom:-5px;left:-5px}.h-br{bottom:-5px;right:-5px}.h-t{top:-5px;left:50%;transform:translateX(-50%)}.h-b{bottom:-5px;left:50%;transform:translateX(-50%)}.h-l{left:-5px;top:50%;transform:translateY(-50%)}.h-r{right:-5px;top:50%;transform:translateY(-50%)}.editor-label{position:absolute;top:-38px;left:0;background:#0c1428;border:1px solid rgba(56,215,255,.4);color:#bcd6ff;font-weight:600;font-size:.72rem;padding:5px 10px;border-radius:7px;white-space:nowrap}.editor-props{width:238px;border-left:1px solid var(--line);padding:16px;display:flex;flex-direction:column;gap:18px;overflow-y:auto}.editor-prop-label{font-weight:700;font-size:.66rem;text-transform:uppercase;letter-spacing:.12em;color:#7488b5;margin-bottom:9px}.editor-swatches{display:flex;gap:10px}.editor-swatch{width:26px;height:26px;border-radius:50%;background:var(--c);border:0;cursor:pointer;box-shadow:inset 0 0 0 2px rgba(0,0,0,.25)}.editor-swatch.active{box-shadow:0 0 0 2px #0a0f22,0 0 0 4px var(--c)}.editor-pill{background:rgba(148,178,255,.07);border:1px solid var(--line);border-radius:9px;padding:9px 12px;font-weight:600;font-size:.8rem;color:#dfe8ff}.editor-range{appearance:none;width:100%;height:20px;background:transparent;cursor:pointer}.editor-range::-webkit-slider-runnable-track{height:6px;border-radius:3px;background:linear-gradient(90deg,#38d7ff,#2f6bff var(--p,75%),rgba(148,178,255,.16) var(--p,75%))}.editor-range::-webkit-slider-thumb{appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;border:2px solid #2f6bff;margin-top:-5px;box-shadow:0 2px 8px rgba(0,20,60,.5)}.editor-slider-row{display:flex;align-items:center;gap:10px}.editor-slider-val{font-weight:600;font-size:.74rem;color:#9fdcff;min-width:34px;text-align:right}.editor-status{display:flex;justify-content:space-between;padding:7px 16px;border-top:1px solid var(--line);font-weight:500;font-size:.72rem;color:#7488b5}.editor-status b{color:#2fe08a;font-weight:600}.editor-cursor{position:absolute;left:42%;top:42%;width:22px;height:22px;z-index:5;pointer-events:none;filter:drop-shadow(0 3px 6px rgba(0,0,0,.5));transition:left .8s cubic-bezier(.5,.1,.15,1),top .8s cubic-bezier(.5,.1,.15,1)}.editor-cursor.click{animation:curClick .35s ease}@keyframes curClick{40%{transform:scale(.7)}}.editor-toast{position:absolute;right:18px;bottom:44px;background:#0d1c38;border:1px solid rgba(56,215,255,.45);color:#d9e8ff;font-weight:600;font-size:.82rem;padding:10px 14px;border-radius:10px;opacity:0;transform:translateY(10px);transition:.35s;z-index:6;box-shadow:0 12px 30px rgba(2,10,40,.6)}.editor-toast.show{opacity:1;transform:none}
.landing-cta{position:relative;padding:150px 0;text-align:center;overflow:hidden;background:radial-gradient(720px 440px at 50% 62%,rgba(47,107,255,.17),transparent 70%)}.landing-cta::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(148,178,255,.09) 1px,transparent 1.4px);background-size:26px 26px;mask-image:radial-gradient(ellipse 60% 55% at 50% 55%,#000 20%,transparent 75%)}.landing-cta .landing-wrap{position:relative}.landing-cta h2{font-size:clamp(2.2rem,4.6vw,3.4rem);line-height:1.1;font-weight:700}.landing-cta p{margin:18px auto 36px;max-width:540px;color:var(--muted);line-height:1.65}.landing-cta .note{margin-top:18px;font-size:.85rem;color:#7488b5}.landing-footer{border-top:1px solid var(--line);padding:38px 0}.footer-inner{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.footer-brand{display:flex;align-items:center;gap:14px}.footer-tag{color:#7488b5;font-size:.85rem}.footer-links{display:flex;gap:24px;flex-wrap:wrap}.footer-links a{color:var(--muted);font-size:.9rem;transition:color .25s}.footer-links a:hover{color:#fff}.footer-copy{color:#5c6c92;font-size:.82rem}
@media(max-width:1150px),(max-aspect-ratio:79/50){.hero{align-items:flex-start}.hero-copy{max-width:660px;margin:0 auto;text-align:center;padding-top:clamp(96px,14vh,150px)}.hero-sub{margin:0 auto}.hero-ctas,.hero-hints{justify-content:center}body.no-webgl .hero-fallback{left:50%;right:auto;top:auto;bottom:5%;transform:translateX(-50%) rotate(-5deg)}}
@media(max-width:1080px){.features-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:940px){.steps{grid-template-columns:1fr 1fr;gap:28px}.steps::before{display:none}.editor-body{height:470px}.editor-props{display:none}}@media(max-width:860px){.nav-links{display:none}.nav-burger{display:flex}}@media(max-width:620px){.features-grid,.steps{grid-template-columns:1fr}.editor-body{height:440px}.editor-toolbar{display:none}.editor-label{font-size:.62rem;top:-32px}.nav-actions .landing-btn-ghost{display:none}}@media(prefers-reduced-motion:reduce){[data-reveal]{transition:none;opacity:1;transform:none}.hero-copy>*{animation:none}}
`}</style>
  );
}
