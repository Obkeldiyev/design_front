import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { CARD_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/card-templates";
import { TemplatePreview } from "@/components/editor/TemplatePreview";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Card Templates — Cardify" },
      { name: "description", content: "Browse professional business card templates by industry." },
    ],
  }),
  component: Templates,
});

function Templates() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? CARD_TEMPLATES
      : CARD_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Cardify
          </Link>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </a>
            <Link to="/register">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background py-16 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            <Sparkles className="h-3 w-3 text-amber-500" />
            {CARD_TEMPLATES.length} professional templates, free to use
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Business Card Templates
          </h1>
          <p className="text-lg text-muted-foreground">
            Pick a template, personalise it in our editor, and download in seconds.
            No design skills needed.
          </p>
          <Link to="/register" className="mt-6 inline-block">
            <Button size="lg" className="gap-2">
              Start designing free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <Link
              key={template.id}
              to="/register"
              className="group block rounded-2xl border border-border overflow-hidden bg-card hover:shadow-xl hover:border-primary/40 transition-all duration-200"
            >
              {/* Preview */}
              <div className="relative overflow-hidden">
                <TemplatePreview
                  template={template}
                  displayWidth={420}
                  className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {/* Hover CTA overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="flex items-center gap-2 bg-white text-black text-sm font-bold px-5 py-2 rounded-full shadow-lg">
                    Use this template <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                {template.isPremium && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    <Sparkles className="h-3 w-3" /> Pro
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{template.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {template.category}
                    <span className="mx-1.5 text-border">·</span>
                    {template.width} × {template.height}px
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  template.isPremium
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                }`}>
                  {template.isPremium ? "Pro" : "Free"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to make your own?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sign up free and get access to all templates plus our full drag-and-drop editor.
          </p>
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Create free account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-10 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Cardify. All rights reserved.
      </footer>
    </div>
  );
}
