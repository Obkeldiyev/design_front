import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BusinessAPI } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/businesses/")({
  head: () => ({ meta: [{ title: "Businesses — Cardify" }] }),
  component: BusinessesList,
});

function BusinessesList() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["businesses"],
    queryFn: BusinessAPI.list,
  });

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("businesses.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("businesses.subtitle")}</p>
        </div>
        <Link to="/businesses/new">
          <Button><Plus className="mr-1 h-4 w-4" />{t("businesses.new")}</Button>
        </Link>
      </div>

      {isLoading && <div className="mt-12 text-sm text-muted-foreground">{t("businesses.loading")}</div>}
      {isError && (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {t("businesses.error")}
        </div>
      )}
      {data && data.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <h2 className="font-display text-lg font-semibold">{t("businesses.empty_title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("businesses.empty_subtitle")}</p>
          <Link to="/businesses/new" className="mt-4 inline-block">
            <Button><Plus className="mr-1 h-4 w-4" />{t("businesses.create")}</Button>
          </Link>
        </div>
      )}
      {data && data.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((b) => (
            <Link key={b.id} to="/businesses/$id" params={{ id: b.id }}
              className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary font-display text-lg">
                  {b.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{b.name}</div>
                  <div className="truncate text-sm text-muted-foreground">/{b.slug}</div>
                </div>
              </div>
              {b.description && (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {b.industry && <span className="rounded-full bg-muted px-2 py-0.5">{b.industry}</span>}
                {b.phone && <span className="rounded-full bg-muted px-2 py-0.5">{b.phone}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
