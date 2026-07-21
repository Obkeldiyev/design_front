import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";
import { useEffect, useRef } from "react";
import type { Business } from "@/lib/api/types";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";

export const businessSchema = z.object({
  name: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "lowercase, digits and hyphens"),
  industry: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  address: z.string().optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  logoUrl: z.string().optional(),
});

export type BusinessFormData = z.infer<typeof businessSchema>;

export function BusinessForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel,
}: {
  defaultValues?: Partial<Business>;
  onSubmit: (data: BusinessFormData) => void | Promise<unknown>;
  loading?: boolean;
  submitLabel?: string;
}) {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      industry: defaultValues?.industry ?? "",
      description: defaultValues?.description ?? "",
      phone: defaultValues?.phone ?? "",
      email: defaultValues?.email ?? "",
      address: defaultValues?.address ?? "",
      website: defaultValues?.website ?? "",
      logoUrl: defaultValues?.logoUrl ?? "",
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const name = watch("name");
  const logoUrl = watch("logoUrl");
  const slugVal = watch("slug");

  useEffect(() => {
    if (!defaultValues?.slug && name && !slugVal) {
      setValue("slug", slugify(name));
    }
  }, [name, defaultValues?.slug, setValue, slugVal]);

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setValue("logoUrl", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("businesses.form.name")}</Label>
          <Input {...register("name")} placeholder={t("businesses.form.name_placeholder")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t("businesses.form.slug")}</Label>
          <Input {...register("slug")} placeholder={t("businesses.form.slug_placeholder")} />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("businesses.form.industry")}</Label>
          <Input {...register("industry")} placeholder={t("businesses.form.industry_placeholder")} />
        </div>

        {/* Logo field with file upload */}
        <div className="space-y-2">
          <Label>{t("businesses.form.logo")}</Label>
          <div className="flex items-center gap-2">
            {/* Preview */}
            {logoUrl ? (
              <div className="relative flex-shrink-0">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-10 w-10 rounded-lg object-contain border border-border bg-muted"
                />
                <button
                  type="button"
                  onClick={() => { setValue("logoUrl", ""); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ) : null}
            {/* URL input */}
            <Input
              {...register("logoUrl")}
              placeholder={t("businesses.form.logo_placeholder")}
              className="flex-1 text-sm"
            />
            {/* File upload button */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted hover:bg-accent text-sm font-medium transition-colors"
              title={t("businesses.form.logo_upload")}
            >
              <Upload className="h-3.5 w-3.5" />
              {t("businesses.form.logo_upload")}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoFile}
            />
          </div>
          {errors.logoUrl && <p className="text-xs text-destructive">{errors.logoUrl.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("businesses.form.description")}</Label>
        <Textarea rows={3} {...register("description")} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("businesses.form.phone")}</Label>
          <Input {...register("phone")} placeholder={t("businesses.form.phone_placeholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("businesses.form.email")}</Label>
          <Input {...register("email")} placeholder={t("businesses.form.email_placeholder")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t("businesses.form.website")}</Label>
          <Input {...register("website")} placeholder={t("businesses.form.website_placeholder")} />
          {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t("businesses.form.address")}</Label>
          <Input {...register("address")} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? t("businesses.form.saving")
            : (submitLabel ?? t("businesses.form.save"))}
        </Button>
      </div>
    </form>
  );
}
