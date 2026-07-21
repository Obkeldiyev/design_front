import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DesignAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Trash2, Pencil, Clock } from "lucide-react";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/designs/")({
  head: () => ({ meta: [{ title: "Designs — Cardify" }] }),
  component: DesignsList,
});

const TYPE_LABELS: Record<string, string> = {
  BUSINESS_CARD: "Business Card",
  DIGITAL_CARD: "Digital Card",
  MARKETING_ASSET: "Marketing",
  WEBSITE_TEMPLATE: "Website",
  QR_CODE: "QR Code",
};

function DesignsList() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["designs"],
    queryFn: DesignAPI.list,
  });

  const remove = useMutation({
    mutationFn: (id: string) => DesignAPI.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["designs"] });
      toast.success("Design deleted");
    },
    onError: (e) => toast.error(apiError(e)),
  });

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("designs.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("designs.subtitle")}</p>
        </div>
        <Link to="/designs/new">
          <Button size="lg"><Plus className="mr-2 h-4 w-4" /> {t("designs.new")}</Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
              <div className="aspect-[7/4] bg-muted" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {t("designs.error")}
        </div>
      )}

      {data && data.length === 0 && (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-border p-16 text-center">
          <Layers className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">{t("designs.empty_title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
            {t("designs.empty_subtitle")}
          </p>
          <Link to="/designs/new" className="mt-5 inline-block">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" /> {t("designs.create_first")}
            </Button>
          </Link>
        </div>
      )}

      {/* Designs grid */}
      {data && data.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((d) => {
            const bg = d.data?.canvas?.background ?? "#f3f4f6";
            const isSimple = /^(#|rgb|rgba|hsl|hsla|transparent)/i.test(bg);
            // Render a CSS preview of the canvas background
            return (
              <div key={d.id} className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <Link
                  to="/editor/$designId"
                  params={{ designId: d.id }}
                  className="block relative"
                >
                  <div
                    className="aspect-[7/4] w-full flex items-end p-3"
                    style={
                      isSimple
                        ? { background: bg }
                        : { backgroundImage: bg, backgroundSize: "cover" }
                    }
                  >
                    {/* Edit overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full shadow">
                        <Pencil className="h-3.5 w-3.5" /> Open editor
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Footer */}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{d.title}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {TYPE_LABELS[d.type] ?? d.type}
                      </span>
                      {d.updatedAt && (
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(d.updatedAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm(`Delete "${d.title}"?`)) remove.mutate(d.id);
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive ml-2 flex-shrink-0"
                    title="Delete design"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* New design card */}
          <Link to="/designs/new"
            className="rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/3 transition-colors flex flex-col items-center justify-center gap-2 aspect-auto min-h-[180px] group">
            <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {t("designs.new")}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
