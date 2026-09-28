import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NewUserForm, UserRow } from "@/components/admin/account-forms";
import { PageHeader, Panel } from "@/components/admin/ui";
import { adminApi, requireAdmin } from "@/lib/admin/session";
import type { AdminUser } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Përdoruesit" };

export default async function UsersPage() {
  const me = await requireAdmin();
  if (me.role !== "owner") redirect("/admin");
  const users = await adminApi<AdminUser[]>("/users");
  const active = users.filter((u) => u.isActive).length;

  return (
    <>
      <PageHeader
        title="Përdoruesit"
        description={`Kush ka qasje në panel · ${active} ${active === 1 ? "llogari aktive" : "llogari aktive"} nga ${users.length}`}
      />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <Panel title="Llogaritë" flush className="xl:col-span-2">
          <div className="hidden items-center gap-3 border-b border-line bg-surface/60 px-5 py-2.5 text-[12px] font-medium text-muted sm:flex">
            <span className="flex-1 pl-12">Përdoruesi</span>
            <span className="w-32">Roli</span>
            <span className="hidden w-36 md:block">Aktiviteti</span>
            <span className="w-8" />
          </div>
          <ul className="divide-y divide-line">
            {users.map((u) => (
              <UserRow key={u.id} user={u} isSelf={u.id === me.id} />
            ))}
          </ul>
        </Panel>
        <Panel title="Shto përdorues" description="Krijoni një llogari për një anëtar të ekipit.">
          <NewUserForm />
        </Panel>
      </div>
    </>
  );
}
