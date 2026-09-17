import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { requireAdmin } from "@/lib/admin/auth";
import {
  describeRuntimeEnv,
  hasServiceRoleKey,
  SERVICE_ROLE_HELP,
} from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <AdminShell email={user.email}>
      {!hasServiceRoleKey() && (
        <AdminNotice
          title="Read-only mode: saving products will fail."
          detail={`${SERVICE_ROLE_HELP} ${describeRuntimeEnv()}`}
        />
      )}
      {children}
    </AdminShell>
  );
}
