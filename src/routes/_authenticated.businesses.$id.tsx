import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BusinessAPI } from "@/lib/api/resources";
import { BusinessForm } from "@/components/forms/BusinessForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/businesses/$id")({
  head: () => ({ meta: [{ title: "Edit business — Cardify" }] }),
  component: EditBusiness,
});

function EditBusiness() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const business = useQuery({
    queryKey: ["business", id],
    queryFn: () => BusinessAPI.get(id),
  });

  const update = useMutation({
    mutationFn: (data: Parameters<typeof BusinessAPI.update>[1]) => BusinessAPI.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["businesses"] });
      qc.invalidateQueries({ queryKey: ["business", id] });
      toast.success(t("businesses.saved"));
    },
    onError: (e) => toast.error(apiError(e)),
  });

  const remove = useMutation({
    mutationFn: () => BusinessAPI.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["businesses"] });
      toast.success(t("businesses.deleted"));
      navigate({ to: "/businesses" });
    },
    onError: (e) => toast.error(apiError(e)),
  });

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <Link to="/businesses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("businesses.back")}
      </Link>

      {business.isLoading && <div className="mt-6 text-muted-foreground">{t("businesses.loading")}</div>}

      {business.data && (
        <>
          <h1 className="mt-4 font-display text-3xl font-bold">{business.data.name}</h1>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <BusinessForm
              defaultValues={business.data}
              onSubmit={(d) => update.mutateAsync(d)}
              loading={update.isPending}
              submitLabel={t("businesses.form.save")}
            />
          </div>

          {/* Danger zone */}
          <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <h3 className="font-semibold text-destructive">{t("businesses.danger_zone")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("businesses.danger_desc")}</p>
            {!confirming ? (
              <Button variant="destructive" className="mt-4" onClick={() => setConfirming(true)}>
                <Trash2 className="mr-1 h-4 w-4" /> {t("businesses.delete_btn")}
              </Button>
            ) : (
              <div className="mt-4 flex gap-2">
                <Button variant="destructive" onClick={() => remove.mutate()} disabled={remove.isPending}>
                  {t("businesses.delete_confirm")}
                </Button>
                <Button variant="outline" onClick={() => setConfirming(false)}>
                  {t("businesses.cancel")}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
