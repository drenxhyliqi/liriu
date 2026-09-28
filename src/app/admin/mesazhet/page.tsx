import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Search } from "lucide-react";
import {
  Avatar,
  btnSecondary,
  EmptyState,
  first,
  inputClass,
  pageParam,
  PageHeader,
  Pagination,
  Panel,
  Pill,
  qs,
  Tabs,
} from "@/components/admin/ui";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import { adminApi } from "@/lib/admin/session";
import type { ContactMessage, Page, Stats } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mesazhet" };

export default async function MessagesPage({ searchParams }: PageProps<"/admin/mesazhet">) {
  const params = await searchParams;
  const unread = first(params.filtri) === "palexuara";
  const q = first(params.q)?.trim() ?? "";
  const page = pageParam(params.page);

  const [data, stats] = await Promise.all([
    adminApi<Page<ContactMessage>>(`/contact${qs({ unread: unread ? "true" : undefined, q, page, pageSize: 20 })}`),
    adminApi<Stats>("/stats"),
  ]);
  const filtri = unread ? "palexuara" : undefined;
  const filtered = Boolean(q || unread);

  return (
    <>
      <PageHeader
        title="Mesazhet"
        description={`Mesazhet nga formulari i kontaktit · ${stats.unreadMessages} të palexuara nga ${stats.totalMessages}`}
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          active={unread ? "unread" : "all"}
          tabs={[
            { key: "all", label: "Të gjitha", href: `/admin/mesazhet${qs({ q })}` },
            {
              key: "unread",
              label: "Të palexuara",
              href: `/admin/mesazhet${qs({ filtri: "palexuara", q })}`,
              count: stats.unreadMessages,
            },
          ]}
        />
        <form role="search" className="relative w-full lg:max-w-xs">
          {filtri && <input type="hidden" name="filtri" value={filtri} />}
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Kërko emër, email ose tekst"
            aria-label="Kërko mesazhet"
            className={`${inputClass} pl-9`}
          />
        </form>
      </div>

      <Panel flush>
        {data.items.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={filtered ? "Asnjë mesazh nuk përputhet" : unread ? "Të gjitha u lexuan" : "Ende asnjë mesazh"}
            action={
              filtered ? (
                <Link href="/admin/mesazhet" className={btnSecondary}>
                  Shiko të gjitha
                </Link>
              ) : undefined
            }
          >
            {filtered ? "Provoni një kërkim tjetër." : "Mesazhet nga faqja e kontaktit shfaqen këtu."}
          </EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {data.items.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/admin/mesazhet/${m.id}`}
                  className={cn(
                    "relative flex items-start gap-3 px-4 py-4 transition-colors hover:bg-ink/[0.02] sm:gap-4 sm:px-5",
                    !m.isRead && "bg-red/[0.025]",
                  )}
                >
                  {!m.isRead && <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-red" />}
                  <Avatar name={m.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="min-w-0 truncate text-[14px] text-ink">
                        <span className={cn(!m.isRead && "font-semibold")}>{m.name}</span>
                        <span className="ml-2 hidden text-[13px] text-muted sm:inline">{m.email}</span>
                      </p>
                      <span className="shrink-0 text-[12px] text-muted" title={formatDateTime(m.createdAt)}>
                        {timeAgo(m.createdAt)}
                      </span>
                    </div>
                    <p className={cn("mt-1 line-clamp-2 text-[13px] leading-relaxed", m.isRead ? "text-muted" : "text-ink/80")}>
                      {m.message}
                    </p>
                    {m.projectType && (
                      <div className="mt-2">
                        <Pill>{m.projectType}</Pill>
                      </div>
                    )}
                  </div>
                  {!m.isRead && <span className="sr-only">(i palexuar)</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          href={(p) => `/admin/mesazhet${qs({ filtri, q, page: p })}`}
        />
      </Panel>
    </>
  );
}
