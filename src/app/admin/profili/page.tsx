import type { Metadata } from "next";
import { PasswordForm, ProfileForm } from "@/components/admin/account-forms";
import { Avatar, PageHeader, Panel, Pill } from "@/components/admin/ui";
import { formatDate, formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Profili" };

export default async function ProfilePage() {
  const admin = await requireAdmin();
  const name = admin.fullName || admin.email;
  return (
    <>
      <PageHeader title="Profili" description="Të dhënat e llogarisë suaj dhe siguria." />

      <div className="mb-6 flex flex-col gap-4 border border-line bg-paper p-5 sm:flex-row sm:items-center">
        <Avatar name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-[17px] font-semibold text-ink">
            {name}
            {admin.role === "owner" ? <Pill tone="red">Pronar</Pill> : <Pill>Administrator</Pill>}
          </p>
          <p className="truncate text-[14px] text-muted">{admin.email}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-[13px] sm:text-right">
          <dt className="text-muted">Anëtar që nga</dt>
          <dd className="text-ink">{formatDate(admin.createdAt)}</dd>
          <dt className="text-muted">Kyçja e fundit</dt>
          <dd className="text-ink">{admin.lastLoginAt ? formatDateTime(admin.lastLoginAt) : "–"}</dd>
        </dl>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <Panel title="Të dhënat personale" description="Emri shfaqet në panel; email-i përdoret për kyçje.">
          <ProfileForm admin={admin} />
        </Panel>
        <Panel title="Fjalëkalimi" description="Ndryshojeni rregullisht dhe mos e ndani me të tjerët.">
          <PasswordForm />
        </Panel>
      </div>
    </>
  );
}
