import { readSiteSettings } from "@/lib/settings-server";
import { updateSettingsAction } from "@/lib/admin/settings-actions";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { AdminNotice } from "@/components/admin/AdminNotice";

export default async function AdminSettingsPage() {
  const { settings, error } = await readSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand">
          Store settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Minimum order, shipping, contact details, and the announcement banner.
          Changes go live without a redeploy.
        </p>
      </div>

      {error && (
        <AdminNotice
          tone="error"
          title="Showing defaults — saved settings could not be read."
          detail={error}
        />
      )}

      <SettingsForm settings={settings} action={updateSettingsAction} />
    </div>
  );
}
