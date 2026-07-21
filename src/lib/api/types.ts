export type Role = { id: string; name: string };

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  role?: Role | null;
  language?: "en" | "ru" | "uz" | null;
  theme?: "light" | "dark" | null;
};

export type Business = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string | null;
  industry?: string | null;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  website?: string | null;
  socialLinks?: Record<string, string> | null;
  createdAt?: string;
  updatedAt?: string;
};

export type DesignType =
  | "BUSINESS_CARD"
  | "DIGITAL_CARD"
  | "WEBSITE_TEMPLATE"
  | "QR_CODE"
  | "MARKETING_ASSET";

export type DesignStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type CanvasDoc = {
  version: 1;
  canvas: { width: number; height: number; background: string };
  pages: Array<{
    id: string;
    name: string;
    fabric: unknown; // fabric.toJSON output
  }>;
};

export type Design = {
  id: string;
  businessId?: string | null;
  title: string;
  slug: string;
  type: DesignType;
  status: DesignStatus;
  data: CanvasDoc;
  isTemplate?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Website = {
  id: string;
  businessId?: string | null;
  title: string;
  subdomain?: string | null;
  customDomain?: string | null;
  status: "DRAFT" | "PUBLISHED" | "DISABLED";
  config?: Record<string, unknown> | null;
  seo?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
};

export type QRType =
  | "WEBSITE"
  | "TELEGRAM"
  | "WHATSAPP"
  | "PHONE"
  | "EMAIL"
  | "VCARD"
  | "LOCATION"
  | "CUSTOM";

export type QRCodeRecord = {
  id: string;
  businessId?: string | null;
  title?: string | null;
  slug: string;
  type: QRType;
  data: Record<string, unknown>;
  scanCount: number;
};
