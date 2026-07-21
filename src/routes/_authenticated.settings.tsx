import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAPI } from "@/lib/api/resources";
import { toast } from "sonner";
import { apiError } from "@/lib/api/client";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Cardify" }] }),
  component: Settings,
});

function Settings() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await UserAPI.update({ firstName, lastName, avatarUrl });
      await refreshUser();
      toast.success(t("settings.save"));
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6 md:p-10">
      <h1 className="font-display text-3xl font-bold">{t("settings.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("settings.subtitle")}</p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>{t("settings.first_name")}</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("settings.last_name")}</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>{t("settings.email")}</Label>
          <Input value={user?.email ?? ""} disabled />
        </div>
        <div className="space-y-2">
          <Label>{t("settings.avatar_url")}</Label>
          <Input value={avatarUrl ?? ""} onChange={(e) => setAvatarUrl(e.target.value)} />
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={saving}>
            {saving ? t("settings.saving") : t("settings.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
