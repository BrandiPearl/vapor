import { AdminNav } from "@/components/admin/AdminNav";
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
    <div className="min-h-screen bg-[#f3f4f2] text-foreground">
      <AdminNav email={user.email} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {!hasServiceRoleKey() && (
          <AdminNotice
            title="Read-only mode: saving products will fail."
            detail={`${SERVICE_ROLE_HELP} ${describeRuntimeEnv()}`}
          />
        )}
        {children}
      </div>
    </div>
  );
}
