import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminApi, requireAdmin } from "@/lib/admin/session";
import type { Stats } from "@/lib/admin/types";

export const metadata: Metadata = {
  title: { template: "%s | Paneli · NSH LIRIU", default: "Paneli · NSH LIRIU" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const [admin, stats] = await Promise.all([requireAdmin(), adminApi<Stats>("/stats")]);
  return (
    <AdminShell admin={admin} newOrders={stats.newOrders} unreadMessages={stats.unreadMessages}>
      {children}
    </AdminShell>
  );
}
