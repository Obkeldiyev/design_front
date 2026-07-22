/**
 * Built-in website templates.
 * Each template is a pre-built block configuration ready to load into the website builder.
 */
import type { Block, WebsiteTheme } from "@/lib/website-blocks";
import { generateId } from "@/lib/uuid";

export type WebsiteTemplate = {
  id: string;
  title: string;
  category: string;
  description: string;
  previewColor: string;   // accent color for preview card
  blocks: Omit<Block, "id">[];
  theme: Partial<WebsiteTheme>;
};

// ── helper: create a block without an id (ids assigned at use time) ──────────
function b(type: Block["type"], content: Record<string, any>): Omit<Block, "id"> {
  return { type, content, order: 0, visible: true };
}

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [

  // ── 1. SaaS Landing Page ─────────────────────────────────────────────────
  {
    id: "saas-landing",
    title: "SaaS Landing",
    category: "Technology",
    description: "Clean hero + features + pricing + CTA. Perfect for software products.",
    previewColor: "#6366f1",
    theme: { primaryColor: "#6366f1", backgroundColor: "#ffffff", textColor: "#0f172a", fontFamily: "Inter" },
    blocks: [
      b("navbar", { logo: "YourApp", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Blog", href: "#" }], ctaText: "Start Free Trial", ctaLink: "#", backgroundColor: "#ffffff", textColor: "#0f172a", sticky: true }),
      b("hero", { title: "The Fastest Way to Ship Your Product", subtitle: "All-in-one platform for developers. Deploy in seconds, scale instantly, sleep well.", buttonText: "Start Free — No Credit Card", buttonLink: "#", secondaryButtonText: "Watch Demo", secondaryButtonLink: "#", backgroundColor: "#0f172a", textColor: "#ffffff", layout: "center" }),
      b("stats", { items: [{ value: "50K+", label: "Developers" }, { value: "99.9%", label: "Uptime" }, { value: "200ms", label: "Avg Response" }, { value: "150+", label: "Countries" }], backgroundColor: "#6366f1", textColor: "#ffffff" }),
      b("features", { title: "Everything you need to ship fast", subtitle: "Powerful tools built for modern development teams", columns: 3, backgroundColor: "#f8fafc", items: [{ icon: "⚡", title: "Instant Deploy", description: "Push to git and go live in under 30 seconds." }, { icon: "🔒", title: "Built-in Security", description: "SSL, DDoS protection, and secrets management." }, { icon: "📊", title: "Real-time Analytics", description: "Monitor traffic, errors, and performance live." }, { icon: "🔧", title: "CLI & API", description: "Full programmatic control for power users." }, { icon: "🌍", title: "Global CDN", description: "Serve from 200+ edge locations worldwide." }, { icon: "💬", title: "24/7 Support", description: "Our engineers are always here when you need them." }] }),
      b("pricing", { title: "Simple, honest pricing", subtitle: "Scale as you grow. Cancel anytime.", backgroundColor: "#ffffff", plans: [{ name: "Hobby", price: "$0", period: "/mo", description: "For side projects", features: ["3 projects", "Shared infrastructure", "Community support"], buttonText: "Get Started Free", featured: false }, { name: "Pro", price: "$19", period: "/mo", description: "For professional teams", features: ["Unlimited projects", "Dedicated resources", "Priority support", "Custom domains", "Advanced analytics"], buttonText: "Start Free Trial", featured: true }, { name: "Enterprise", price: "Custom", period: "", description: "For large organisations", features: ["Everything in Pro", "SLA guarantee", "SSO & SAML", "Custom contracts", "Dedicated account manager"], buttonText: "Contact Sales", featured: false }] }),
      b("cta", { title: "Ready to deploy your first project?", subtitle: "Join 50,000 developers already building with us.", buttonText: "Start for Free", buttonLink: "#", secondaryButtonText: "Talk to Sales", secondaryButtonLink: "#", backgroundColor: "#6366f1", textColor: "#ffffff" }),
      b("footer", { logo: "YourApp", tagline: "Shipping software faster, together.", columns: [{ title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }] }, { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }] }, { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Security", href: "#" }] }], copyright: `© ${new Date().getFullYear()} YourApp. All rights reserved.`, backgroundColor: "#0f172a", textColor: "#94a3b8" }),
    ],
  },

  // ── 2. Restaurant / Cafe ─────────────────────────────────────────────────
  {
    id: "restaurant",
    title: "Restaurant",
    category: "Food & Drink",
    description: "Warm hero, menu highlights, testimonials, and contact info.",
    previewColor: "#f59e0b",
    theme: { primaryColor: "#f59e0b", backgroundColor: "#1c0a00", textColor: "#fef3c7", fontFamily: "Georgia" },
    blocks: [
      b("navbar", { logo: "La Bella", links: [{ label: "Menu", href: "#menu" }, { label: "About", href: "#about" }, { label: "Reservations", href: "#contact" }], ctaText: "Reserve a Table", ctaLink: "#contact", backgroundColor: "#1c0a00", textColor: "#f59e0b", sticky: true }),
      b("hero", { title: "Authentic Italian\nCuisine", subtitle: "Farm-to-table ingredients. Recipes passed down for generations. An experience you won't forget.", buttonText: "Reserve a Table", buttonLink: "#contact", secondaryButtonText: "View Menu", secondaryButtonLink: "#menu", backgroundColor: "#1c0a00", textColor: "#fef3c7", layout: "left" }),
      b("stats", { items: [{ value: "15+", label: "Years Open" }, { value: "4.9★", label: "Avg Rating" }, { value: "120", label: "Seats" }, { value: "50+", label: "Menu Items" }], backgroundColor: "#78350f", textColor: "#fef3c7" }),
      b("features", { title: "Why guests keep coming back", subtitle: "", columns: 3, backgroundColor: "#1c1409", items: [{ icon: "🍝", title: "House-made Pasta", description: "Freshly made every morning using our 100-year-old family recipe." }, { icon: "🍷", title: "Curated Wine List", description: "Over 80 Italian wines selected by our sommelier." }, { icon: "🌿", title: "Seasonal Ingredients", description: "We source locally and change our menu with the seasons." }] }),
      b("testimonials", { title: "What our guests say", subtitle: "", backgroundColor: "#13080a", items: [{ author: "James R.", role: "Food Critic", text: "The best carbonara outside of Rome. Period.", rating: 5 }, { author: "Sofia M.", role: "Regular Guest", text: "We celebrate every anniversary here. It never disappoints.", rating: 5 }, { author: "Marco T.", role: "Chef", text: "The tiramisu alone is worth the trip.", rating: 5 }] }),
      b("contact", { title: "Reserve Your Table", subtitle: "Call us or fill out the form and we'll confirm within the hour.", buttonText: "Send Reservation Request", backgroundColor: "#1c0a00", email: "reservations@labella.com", phone: "+1 (555) 700-8899", address: "42 Via Roma, Little Italy, New York", fields: [{ type: "text", name: "name", label: "Your Name", placeholder: "John Doe", required: true }, { type: "email", name: "email", label: "Email", placeholder: "john@example.com", required: true }, { type: "text", name: "guests", label: "Number of guests", placeholder: "2", required: true }, { type: "textarea", name: "message", label: "Special requests", placeholder: "Allergies, occasions...", required: false }] }),
      b("footer", { logo: "La Bella Cucina", tagline: "Authentic Italian cuisine since 2009.", columns: [{ title: "Hours", links: [{ label: "Mon–Fri: 12pm–10pm", href: "#" }, { label: "Sat–Sun: 11am–11pm", href: "#" }] }, { title: "Find Us", links: [{ label: "42 Via Roma, Little Italy", href: "#" }, { label: "New York, NY 10013", href: "#" }] }], copyright: `© ${new Date().getFullYear()} La Bella Cucina.`, backgroundColor: "#0d0500", textColor: "#92400e" }),
    ],
  },

  // ── 3. Portfolio / Agency ────────────────────────────────────────────────
  {
    id: "portfolio",
    title: "Portfolio / Agency",
    category: "Creative",
    description: "Bold hero, gallery showcase, team, and contact.",
    previewColor: "#ef4444",
    theme: { primaryColor: "#ef4444", backgroundColor: "#fafafa", textColor: "#18181b", fontFamily: "Inter" },
    blocks: [
      b("navbar", { logo: "Studio", links: [{ label: "Work", href: "#work" }, { label: "Team", href: "#team" }, { label: "Contact", href: "#contact" }], ctaText: "Start a Project", ctaLink: "#contact", backgroundColor: "#ffffff", textColor: "#18181b", sticky: true }),
      b("hero", { title: "We Design\nExperiences That Matter", subtitle: "A creative studio helping brands tell their stories through design, strategy, and technology.", buttonText: "View Our Work", buttonLink: "#work", secondaryButtonText: "Get in Touch", secondaryButtonLink: "#contact", backgroundColor: "#fafafa", textColor: "#18181b", layout: "center" }),
      b("stats", { items: [{ value: "300+", label: "Projects" }, { value: "50+", label: "Clients" }, { value: "15", label: "Awards" }, { value: "10", label: "Team Members" }], backgroundColor: "#18181b", textColor: "#ffffff" }),
      b("gallery", { title: "Selected Work", subtitle: "Projects we're proud of", columns: 3, gap: "medium", backgroundColor: "#ffffff", items: [{ image: "", caption: "Brand Identity — TechCorp", link: "#" }, { image: "", caption: "Web Design — Startup Labs", link: "#" }, { image: "", caption: "Packaging — Organic Co.", link: "#" }, { image: "", caption: "Mobile App — FitTrack", link: "#" }, { image: "", caption: "Marketing Campaign — Retail Brand", link: "#" }, { image: "", caption: "Website Redesign — E-commerce", link: "#" }] }),
      b("team", { title: "Meet the Team", subtitle: "Designers, developers, and strategists who make it happen", backgroundColor: "#f8fafc", columns: 4, members: [{ name: "Emma Stone", role: "Creative Director", image: "", bio: "15 years shaping brands", twitter: "", linkedin: "" }, { name: "David Lee", role: "Lead Designer", image: "", bio: "Award-winning visual designer", twitter: "", linkedin: "" }, { name: "Rachel Kim", role: "Developer", image: "", bio: "Full-stack engineer", twitter: "", linkedin: "" }, { name: "Tom Rivera", role: "Strategist", image: "", bio: "Brand and business strategy", twitter: "", linkedin: "" }] }),
      b("contact", { title: "Let's Create Something", subtitle: "Tell us about your project and we'll get back to you within 24 hours.", buttonText: "Send Message", backgroundColor: "#ffffff", email: "hello@studio.co", phone: "+1 (555) 000-1234", address: "", fields: [{ type: "text", name: "name", label: "Name", placeholder: "Your Name", required: true }, { type: "email", name: "email", label: "Email", placeholder: "you@company.com", required: true }, { type: "textarea", name: "message", label: "Project Details", placeholder: "Tell us about your project...", required: true }] }),
      b("footer", { logo: "Studio", tagline: "Making the web beautiful, one pixel at a time.", columns: [{ title: "Services", links: [{ label: "Branding", href: "#" }, { label: "Web Design", href: "#" }, { label: "Development", href: "#" }] }, { title: "Connect", links: [{ label: "Instagram", href: "#" }, { label: "Dribbble", href: "#" }, { label: "LinkedIn", href: "#" }] }], copyright: `© ${new Date().getFullYear()} Studio.`, backgroundColor: "#18181b", textColor: "#a1a1aa" }),
    ],
  },

];

export const WEBSITE_TEMPLATE_CATEGORIES = [
  "All",
  ...Array.from(new Set(WEBSITE_TEMPLATES.map((t) => t.category))),
];

/** Instantiate a template — assigns fresh IDs to all blocks */
export function instantiateTemplate(template: WebsiteTemplate): Block[] {
  return template.blocks.map((block, i) => ({
    ...block,
    id: generateId(),
    order: i,
  }));
}
