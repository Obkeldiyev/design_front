import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QRAPI } from "@/lib/api/resources";
import { apiError } from "@/lib/api/client";
import { Copy, Download, ExternalLink, Plus, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/qr/")({
  head: () => ({ meta: [{ title: "QR Codes - card24" }] }),
  component: QrIndex,
});

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(value),
  );
}

function QrIndex() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["qrCodes"],
    queryFn: QRAPI.list,
  });

  const remove = useMutation({
    mutationFn: (id: string) => QRAPI.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["qrCodes"] });
      toast.success(t("qr.deleted"));
    },
    onError: (error) => toast.error(apiError(error)),
  });

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("qr.copied"));
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 md:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-normal">{t("qr.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("qr.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link to="/qr/new">
            <Plus className="h-4 w-4" />
            {t("qr.new")}
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="mt-12 text-sm text-muted-foreground">{t("common.loading")}</div>
      )}

      {isError && (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {t("qr.error")}
        </div>
      )}

      {!isLoading && !isError && data.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-border p-8 text-center md:p-12">
          <QrCode className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl font-semibold">{t("qr.empty_title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {t("qr.empty_subtitle")}
          </p>
          <Link to="/qr/new" className="mt-5 inline-block">
            <Button>
              <Plus className="h-4 w-4" />
              {t("qr.try")}
            </Button>
          </Link>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((qr) => {
            const encoded = String(qr.data?.encoded ?? qr.data?.destination ?? "");
            return (
              <article
                key={qr.id}
                className="rounded-lg border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-lg font-semibold">
                      {qr.title ?? qr.slug}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t(`qr.types.${qr.type}`)}{" "}
                      {qr.updatedAt ? `- ${formatDate(qr.updatedAt)}` : ""}
                    </p>
                  </div>
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    {qr.scanCount ?? 0} {t("qr.scans")}
                  </span>
                </div>

                <div className="mt-4 rounded-md bg-muted/45 px-3 py-2 font-mono text-xs text-muted-foreground">
                  <p className="truncate">{encoded}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(encoded)}>
                    <Copy className="h-3.5 w-3.5" /> {t("qr.copy")}
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={encoded} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" /> {t("qr.open")}
                    </a>
                  </Button>
                  <Link to="/qr/new">
                    <Button variant="secondary" size="sm">
                      <Download className="h-3.5 w-3.5" /> {t("qr.duplicate")}
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("qr.delete_title")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("qr.delete_desc")}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => remove.mutate(qr.id)}
                        >
                          {t("qr.delete_confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
