export type BlockType =
  | "hero"
  | "features"
  | "testimonials"
  | "contact"
  | "cta"
  | "text"
  | "gallery"
  | "team"
  | "pricing"
  | "navbar"
  | "footer"
  | "video"
  | "stats";

export interface Block {
  id: string;
  type: BlockType;
  order: number;
  content: Record<string, any>;
  visible: boolean;
}

export interface WebsiteTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  borderRadius: string;
}

export interface WebsiteData {
  title: string;
  slug: string;
  blocks: Block[];
  theme: WebsiteTheme;
}

export const DEFAULT_THEME: WebsiteTheme = {
  primaryColor: "#6366f1",
  secondaryColor: "#f59e0b",
  fontFamily: "Inter",
  textColor: "#111827",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
};

// Human-readable block labels and icons (emoji for simplicity)
export const BLOCK_META: Record<BlockType, { label: string; icon: string; description: string }> = {
  navbar:      { label: "Navigation",    icon: "≡",   description: "Site header & nav links" },
  hero:        { label: "Hero",          icon: "★",   description: "Big headline section" },
  features:    { label: "Features",      icon: "⚡",   description: "Feature grid or list" },
  text:        { label: "Text",          icon: "T",   description: "Rich text paragraph" },
  stats:       { label: "Stats",         icon: "#",   description: "Numbers & metrics" },
  testimonials:{ label: "Testimonials",  icon: "❝",   description: "Customer reviews" },
  gallery:     { label: "Gallery",       icon: "▦",   description: "Image grid" },
  team:        { label: "Team",          icon: "👤",   description: "Team members" },
  pricing:     { label: "Pricing",       icon: "$",   description: "Pricing plans" },
  cta:         { label: "Call to Action","icon": "→",  description: "Conversion banner" },
  contact:     { label: "Contact",       icon: "✉",   description: "Contact form" },
  video:       { label: "Video",         icon: "▶",   description: "Embed a video" },
  footer:      { label: "Footer",        icon: "—",   description: "Site footer" },
};

export const BLOCK_TEMPLATES: Record<BlockType, Partial<Block>> = {
  navbar: {
    type: "navbar",
    content: {
      logo: "Brand",
      logoUrl: "",
      links: [
        { label: "Home", href: "#" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Contact", href: "#contact" },
      ],
      ctaText: "Get Started",
      ctaLink: "#",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      sticky: true,
    },
  },
  hero: {
    type: "hero",
    content: {
      title: "Build Something Amazing",
      subtitle: "The fastest way to launch your online presence. No code required.",
      buttonText: "Get Started Free",
      buttonLink: "#",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "#",
      backgroundImage: "",
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
      layout: "center", // center | left | right
      logoUrl: "",
      logoText: "Brand",
      overlayOpacity: 0.5,
    },
  },
  features: {
    type: "features",
    content: {
      title: "Everything you need",
      subtitle: "Powerful features to help you grow",
      layout: "grid", // grid | list | alternating
      columns: 3,
      backgroundColor: "#ffffff",
      items: [
        { icon: "⚡", title: "Fast & Reliable", description: "Built for performance from the ground up." },
        { icon: "🎨", title: "Beautiful Design", description: "Stunning templates that convert visitors." },
        { icon: "🔒", title: "Secure by Default", description: "Enterprise-grade security out of the box." },
        { icon: "📱", title: "Mobile First", description: "Looks perfect on every device." },
        { icon: "🔧", title: "Easy to Use", description: "No technical knowledge required." },
        { icon: "📊", title: "Analytics", description: "Track what matters with built-in insights." },
      ],
    },
  },
  testimonials: {
    type: "testimonials",
    content: {
      title: "Loved by Thousands",
      subtitle: "Don't just take our word for it",
      backgroundColor: "#f8fafc",
      items: [
        { author: "Sarah Chen", role: "CEO at TechCorp", text: "This tool completely transformed how we build our web presence. Highly recommended!", avatar: "", rating: 5 },
        { author: "Marcus Johnson", role: "Founder, StartupXYZ", text: "We launched our landing page in under an hour. The results have been incredible.", avatar: "", rating: 5 },
        { author: "Elena Rodriguez", role: "Marketing Director", text: "The best website builder I've ever used. Simple, powerful, and beautiful.", avatar: "", rating: 5 },
      ],
    },
  },
  contact: {
    type: "contact",
    content: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      buttonText: "Send Message",
      backgroundColor: "#ffffff",
      fields: [
        { type: "text", name: "name", label: "Full Name", placeholder: "John Doe", required: true },
        { type: "email", name: "email", label: "Email", placeholder: "john@example.com", required: true },
        { type: "textarea", name: "message", label: "Message", placeholder: "Your message...", required: true },
      ],
      email: "",
      phone: "",
      address: "",
    },
  },
  cta: {
    type: "cta",
    content: {
      title: "Ready to get started?",
      subtitle: "Join thousands of businesses already using our platform.",
      buttonText: "Start Free Trial",
      buttonLink: "#",
      secondaryButtonText: "Talk to Sales",
      secondaryButtonLink: "#",
      backgroundColor: "#6366f1",
      textColor: "#ffffff",
    },
  },
  text: {
    type: "text",
    content: {
      title: "",
      text: "Start typing your content here. This section supports rich text formatting to help you tell your story.",
      align: "left",
      fontSize: "base",
      backgroundColor: "#ffffff",
      maxWidth: "3xl",
    },
  },
  gallery: {
    type: "gallery",
    content: {
      title: "Our Work",
      subtitle: "",
      columns: 3,
      gap: "medium",
      backgroundColor: "#ffffff",
      items: [
        { image: "", caption: "Project Alpha", link: "" },
        { image: "", caption: "Project Beta", link: "" },
        { image: "", caption: "Project Gamma", link: "" },
        { image: "", caption: "Project Delta", link: "" },
        { image: "", caption: "Project Epsilon", link: "" },
        { image: "", caption: "Project Zeta", link: "" },
      ],
    },
  },
  team: {
    type: "team",
    content: {
      title: "Meet the Team",
      subtitle: "The people behind our success",
      backgroundColor: "#ffffff",
      columns: 4,
      members: [
        { name: "Alice Johnson", role: "CEO & Co-Founder", image: "", bio: "Visionary leader with 15 years of experience.", twitter: "", linkedin: "" },
        { name: "Bob Smith", role: "CTO", image: "", bio: "Full-stack engineer who loves building great products.", twitter: "", linkedin: "" },
        { name: "Carol Williams", role: "Head of Design", image: "", bio: "Creating beautiful experiences that users love.", twitter: "", linkedin: "" },
        { name: "David Lee", role: "Head of Growth", image: "", bio: "Data-driven marketer scaling amazing products.", twitter: "", linkedin: "" },
      ],
    },
  },
  pricing: {
    type: "pricing",
    content: {
      title: "Simple, Transparent Pricing",
      subtitle: "No hidden fees. Cancel anytime.",
      backgroundColor: "#ffffff",
      plans: [
        { name: "Starter", price: "$9", period: "/mo", description: "Perfect for individuals", features: ["5 pages", "Custom domain", "Basic analytics", "Email support"], buttonText: "Get Started", featured: false },
        { name: "Pro", price: "$29", period: "/mo", description: "For growing businesses", features: ["Unlimited pages", "Custom domain", "Advanced analytics", "Priority support", "Team collaboration"], buttonText: "Start Free Trial", featured: true },
        { name: "Enterprise", price: "$99", period: "/mo", description: "For large teams", features: ["Everything in Pro", "White-label", "Dedicated support", "Custom integrations", "SLA guarantee"], buttonText: "Contact Sales", featured: false },
      ],
    },
  },
  stats: {
    type: "stats",
    content: {
      title: "",
      subtitle: "",
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
      items: [
        { value: "10K+", label: "Happy Customers" },
        { value: "99.9%", label: "Uptime" },
        { value: "4.9★", label: "Average Rating" },
        { value: "50+", label: "Countries" },
      ],
    },
  },
  video: {
    type: "video",
    content: {
      title: "See it in Action",
      subtitle: "",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      backgroundColor: "#0f172a",
      aspectRatio: "16/9",
    },
  },
  footer: {
    type: "footer",
    content: {
      logo: "Brand",
      tagline: "Building the web, one block at a time.",
      columns: [
        { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }] },
        { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }] },
        { title: "Support", links: [{ label: "Docs", href: "#" }, { label: "Help Center", href: "#" }, { label: "Contact", href: "#" }] },
      ],
      copyright: `© ${new Date().getFullYear()} Brand. All rights reserved.`,
      backgroundColor: "#0f172a",
      textColor: "#94a3b8",
    },
  },
};

export function createBlock(type: BlockType): Block {
  const template = BLOCK_TEMPLATES[type];
  return {
    id: crypto.randomUUID(),
    type,
    order: 0,
    content: { ...(template.content || {}) },
    visible: true,
  };
}
