import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { slugify } from "@/lib/slug";
import type { Business } from "@/lib/api/types";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Eye, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";

const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

const businessSchema = z.object({
  name: z.string().trim().min(1, "Enter a business name."),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a public URL slug.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  industry: z.string().trim().optional(),
  description: z.string().trim().max(600, "Keep the description under 600 characters.").optional(),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, "This phone number is incomplete.")
    .or(z.literal(""))
    .optional(),
  email: z.string().trim().email("Enter a valid email address.").or(z.literal("")).optional(),
  address: z.string().trim().optional(),
  website: z
    .string()
    .trim()
    .url("Enter a valid website URL beginning with https://.")
    .startsWith("https://", "Enter a valid website URL beginning with https://.")
    .or(z.literal(""))
    .optional(),
  logoUrl: z.string().trim().optional(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

type StepId = "basic" | "contact" | "preview";

const STEPS: StepId[] = ["basic", "contact", "preview"];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-destructive">{message}</p>;
}

function HelperText({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-5 text-muted-foreground">{children}</p>;
}

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
  const [step, setStep] = useState<StepId>("basic");

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    mode: "onBlur",
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty },
  } = form;
  const values = watch();
  const slugVal = watch("slug");

  useEffect(() => {
    if (!defaultValues?.slug && values.name && !slugVal) {
      setValue("slug", slugify(values.name), { shouldDirty: true });
    }
  }, [values.name, defaultValues?.slug, setValue, slugVal]);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const currentIndex = STEPS.indexOf(step);
  const progress = ((currentIndex + 1) / STEPS.length) * 100;

  const goNext = async () => {
    const fieldsByStep: Record<StepId, Array<keyof BusinessFormData>> = {
      basic: ["name", "slug", "industry", "description", "logoUrl"],
      contact: ["phone", "email", "website", "address"],
      preview: [],
    };
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep(STEPS[Math.min(currentIndex + 1, STEPS.length - 1)]);
  };

  const handleLogoFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("businesses.form.errors.file_type"));
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("businesses.form.errors.file_size"));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setValue("logoUrl", ev.target?.result as string, { shouldDirty: true });
    reader.readAsDataURL(file);
  };

  const submit = handleSubmit(onSubmit);

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">{t(`businesses.form.steps.${step}`)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("businesses.form.progress", { current: currentIndex + 1, total: STEPS.length })}
            </p>
          </div>
          <div className="flex gap-2">
            {STEPS.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => setStep(item)}
                className={`grid h-8 w-8 place-items-center rounded-md border text-xs font-semibold transition ${
                  step === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : index < currentIndex
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                      : "border-border bg-background text-muted-foreground"
                }`}
                aria-label={t(`businesses.form.steps.${item}`)}
              >
                {index < currentIndex ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </button>
            ))}
          </div>
        </div>
        <Progress className="mt-4" value={progress} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          {step === "basic" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {t("businesses.form.name")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...register("name")}
                    placeholder={t("businesses.form.name_placeholder")}
                    autoComplete="organization"
                  />
                  <HelperText>{t("businesses.form.help.name")}</HelperText>
                  <FieldError message={errors.name?.message} />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("businesses.form.slug")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...register("slug")}
                    placeholder={t("businesses.form.slug_placeholder")}
                  />
                  <HelperText>{t("businesses.form.help.slug")}</HelperText>
                  <FieldError message={errors.slug?.message} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {t("businesses.form.industry")}{" "}
                    <span className="text-muted-foreground">({t("common.optional")})</span>
                  </Label>
                  <Input
                    {...register("industry")}
                    placeholder={t("businesses.form.industry_placeholder")}
                  />
                  <HelperText>{t("businesses.form.help.industry")}</HelperText>
                </div>

                <div className="space-y-2">
                  <Label>
                    {t("businesses.form.logo")}{" "}
                    <span className="text-muted-foreground">({t("common.optional")})</span>
                  </Label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {values.logoUrl ? (
                      <div className="relative flex-shrink-0">
                        <img
                          src={values.logoUrl}
                          alt={t("businesses.form.logo")}
                          className="h-12 w-12 rounded-md border border-border bg-muted object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setValue("logoUrl", "", { shouldDirty: true });
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-destructive text-white transition hover:bg-destructive/85"
                          aria-label={t("businesses.form.logo_remove")}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null}
                    <Input
                      {...register("logoUrl")}
                      placeholder={t("businesses.form.logo_placeholder")}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" /> {t("businesses.form.logo_upload")}
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={handleLogoFile}
                    />
                  </div>
                  <HelperText>{t("businesses.form.help.logo")}</HelperText>
                  <FieldError message={errors.logoUrl?.message} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  {t("businesses.form.description")}{" "}
                  <span className="text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Textarea
                  rows={4}
                  {...register("description")}
                  placeholder={t("businesses.form.description_placeholder")}
                />
                <HelperText>{t("businesses.form.help.description")}</HelperText>
                <FieldError message={errors.description?.message} />
              </div>
            </>
          )}

          {step === "contact" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  {t("businesses.form.phone")}{" "}
                  <span className="text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Input
                  {...register("phone")}
                  placeholder={t("businesses.form.phone_placeholder")}
                  autoComplete="tel"
                />
                <HelperText>{t("businesses.form.help.phone")}</HelperText>
                <FieldError message={errors.phone?.message} />
              </div>
              <div className="space-y-2">
                <Label>
                  {t("businesses.form.email")}{" "}
                  <span className="text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Input
                  {...register("email")}
                  placeholder={t("businesses.form.email_placeholder")}
                  autoComplete="email"
                />
                <HelperText>{t("businesses.form.help.email")}</HelperText>
                <FieldError message={errors.email?.message} />
              </div>
              <div className="space-y-2">
                <Label>
                  {t("businesses.form.website")}{" "}
                  <span className="text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Input
                  {...register("website")}
                  placeholder={t("businesses.form.website_placeholder")}
                  autoComplete="url"
                />
                <HelperText>{t("businesses.form.help.website")}</HelperText>
                <FieldError message={errors.website?.message} />
              </div>
              <div className="space-y-2">
                <Label>
                  {t("businesses.form.address")}{" "}
                  <span className="text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Input
                  {...register("address")}
                  placeholder={t("businesses.form.address_placeholder")}
                />
                <HelperText>{t("businesses.form.help.address")}</HelperText>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="rounded-lg border border-border bg-muted/30 p-5">
              <div className="flex items-start gap-3">
                <Eye className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {t("businesses.form.preview_title")}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {t("businesses.form.preview_desc")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={currentIndex === 0 || loading}
              onClick={() => setStep(STEPS[Math.max(currentIndex - 1, 0)])}
            >
              {t("common.back")}
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="secondary" disabled={loading} onClick={submit}>
                <Save className="h-4 w-4" /> {t("businesses.form.save_draft")}
              </Button>
              {step !== "preview" ? (
                <Button type="button" onClick={goNext} disabled={loading}>
                  {t("common.next")}
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading
                    ? t("businesses.form.saving")
                    : (submitLabel ?? t("businesses.form.save"))}
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold">{t("businesses.form.live_preview")}</h3>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-md bg-primary/10 text-primary">
                {values.logoUrl ? (
                  <img
                    src={values.logoUrl}
                    alt=""
                    className="h-full w-full rounded-md object-contain"
                  />
                ) : (
                  <BriefcaseFallback name={values.name} />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {values.name || t("businesses.form.preview_name")}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {values.industry || t("businesses.form.preview_industry")}
                </p>
              </div>
            </div>
            {values.description && (
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">
                {values.description}
              </p>
            )}
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              {values.phone && <p>{values.phone}</p>}
              {values.email && <p>{values.email}</p>}
              {values.website && <p>{values.website}</p>}
              {values.address && <p>{values.address}</p>}
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {t("businesses.form.privacy_note")}
          </p>
        </aside>
      </div>
    </form>
  );
}

function BriefcaseFallback({ name }: { name?: string }) {
  return (
    <span className="font-display text-lg font-semibold">
      {name?.trim()?.[0]?.toUpperCase() ?? "C"}
    </span>
  );
}
