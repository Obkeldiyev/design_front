import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WebsiteAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import {
  Plus, Globe, ExternalLink, Pencil, Trash2,
  Clock, CheckCircle2, FileText, Ban,
} from "lucide-react";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/websites/")({
  head: () => ({ meta: [{ title: "Websites — Cardify" }] }),
  component: WebsitesIndex,
});

function siteUrl(subdomain?: string | null, customDomain?: string | null) {
  if (customDomain) return `https://${customDomain}`;
  if (subdomain) return `${window.location.origin}/site/${subdomain}`;
  return null;
}

function WebsitesIndex() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["websites"],
    queryFn: WebsiteAPI.list,
    staleTime: 0,
    refetchOnMount: true,
  });

  const remove = useMutation({
    mutationFn: (id: string) => WebsiteAPI.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["websites"] }); toast.success("Deleted"); },
    onError: (e) => toast.error(apiError(e)),
  });

  const STATUS: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    PUBLISHED: { label: t("common.published"), icon: <CheckCircle2 className="h-3 w-3" />, cls: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" },
    DRAFT:     { label: t("common.draft"),     icon: <FileText className="h-3 w-3" />,     cls: "bg-muted text-muted-foreground" },
    DISABLED:  { label: t("common.disabled"),  icon: <Ban className="h-3 w-3" />,           cls: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" },
  };

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("websites.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("websites.subtitle")}</p>
        </div>
        <Link to="/websites/new">
          <Button size="lg"><Plus className="mr-2 h-4 w-4" />{t("websites.new")}</Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse space-y-3">
              <div className="h-5 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="h-8 bg-muted rounded mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {t("websites.error")}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && data?.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center">
          <Globe className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <h2 className="mt-4 text-xl font-semibold">{t("websites.empty_title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">{t("websites.empty_subtitle")}</p>
          <Link to="/websites/new" className="mt-5 inline-block">
            <Button size="lg"><Plus className="mr-2 h-4 w-4" />{t("websites.create")}</Button>
          </Link>
        </div>
      )}

      {/* Grid */}
      {data && data.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((w) => {
            const status = STATUS[w.status] ?? STATUS.DRAFT;
            const liveUrl = siteUrl(w.subdomain, w.customDomain);
            return (
              <div key={w.id} className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/40" />
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate text-base">{w.title}</h3>
                      {w.updatedAt && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(w.updatedAt), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${status.cls}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {liveUrl ? (
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline truncate">
                      <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{liveUrl.replace(/^https?:\/\//, "")}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">{t("websites.no_subdomain")}</p>
                  )}

                  <div className="flex gap-2 mt-auto pt-2">
                    <Link to="/websites/$id/edit" params={{ id: w.id }} className="flex-1">
                      <Button size="sm" className="w-full gap-1.5">
                        <Pencil className="h-3.5 w-3.5" />{t("websites.edit")}
                      </Button>
                    </Link>
                    {liveUrl && (
                      <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <ExternalLink className="h-3.5 w-3.5" />{t("websites.view")}
                        </Button>
                      </a>
                    )}
                    <Button size="sm" variant="ghost"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => { if (confirm(`Delete "${w.title}"?`)) remove.mutate(w.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add new */}
          <Link to="/websites/new"
            className="rounded-2xl border-2 border-dashed border-border hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-2 min-h-[180px] group">
            <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{t("websites.new")}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
