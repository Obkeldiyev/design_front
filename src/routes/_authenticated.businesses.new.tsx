import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessAPI } from "@/lib/api/resources";
import { BusinessForm } from "@/components/forms/BusinessForm";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/businesses/new")({
  head: () => ({ meta: [{ title: "New business — Cardify" }] }),
  component: NewBusiness,
});

function NewBusiness() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: BusinessAPI.create,
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: ["businesses"] });
      toast.success(t("businesses.created"));
      navigate({ to: "/businesses/$id", params: { id: b.id } });
    },
    onError: (e) => toast.error(apiError(e)),
  });

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <Link to="/businesses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("businesses.back")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">{t("businesses.new_title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("businesses.new_subtitle")}</p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <BusinessForm
          onSubmit={(d) => create.mutateAsync(d)}
          loading={create.isPending}
          submitLabel={t("businesses.form.create")}
        />
      </div>
    </div>
  );
}
