import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Search, ShoppingCart } from "lucide-react";
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
  qs,
  StatusBadge,
  Tabs,
  tdClass,
  thClass,
  ThumbStack,
} from "@/components/admin/ui";
import { formatDateTime, itemCount, orderStatusLabels, timeAgo } from "@/lib/admin/format";
import { adminApi } from "@/lib/admin/session";
import type { Order, OrderStatus, Page, Stats } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Porositë" };

const statuses = Object.keys(orderStatusLabels) as OrderStatus[];

export default async function OrdersPage({ searchParams }: PageProps<"/admin/porosite">) {
  const params = await searchParams;
  const rawStatus = first(params.status);
  const status = statuses.includes(rawStatus as OrderStatus) ? (rawStatus as OrderStatus) : undefined;
  const q = first(params.q)?.trim() ?? "";
  const page = pageParam(params.page);

  const [data, stats] = await Promise.all([
    adminApi<Page<Order>>(`/orders${qs({ status, q, page, pageSize: 20 })}`),
    adminApi<Stats>("/stats"),
  ]);

  const tabs = [
    { key: "all", label: "Të gjitha", href: `/admin/porosite${qs({ q })}` },
    ...statuses.map((s) => ({
      key: s,
      label: orderStatusLabels[s],
      href: `/admin/porosite${qs({ status: s, q })}`,
      count: s === "new" ? stats.newOrders : undefined,
    })),
  ];
  const filtered = Boolean(q || status);

  return (
    <>
      <PageHeader
        title="Porositë"
        description={`Kërkesat për ofertë nga shporta e faqes · ${stats.openOrders} të hapura nga ${stats.totalOrders}`}
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs tabs={tabs} active={status ?? "all"} />
        <form role="search" className="relative w-full lg:max-w-xs">
          {status && <input type="hidden" name="status" value={status} />}
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Kërko emër, email ose telefon"
            aria-label="Kërko porositë"
            className={`${inputClass} pl-9`}
          />
        </form>
      </div>

      <Panel flush>
        {data.items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title={filtered ? "Asnjë porosi nuk përputhet" : "Ende asnjë porosi"}
            action={
              filtered ? (
                <Link href="/admin/porosite" className={btnSecondary}>
                  Hiq filtrat
                </Link>
              ) : undefined
            }
          >
            {filtered ? "Provoni një status ose kërkim tjetër." : "Kur një klient dërgon shportën nga faqja, kërkesa shfaqet këtu."}
          </EmptyState>
        ) : (
          <>
            <table className="hidden w-full md:table">
              <thead className="border-b border-line bg-surface/60">
                <tr>
                  <th className={thClass}>Klienti</th>
                  <th className={thClass}>Produktet</th>
                  <th className={thClass}>Statusi</th>
                  <th className={`${thClass} text-right`}>Dërguar</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((o) => (
                  <tr key={o.id} className="group relative transition-colors hover:bg-ink/[0.02]">
                    <td className={tdClass}>
                      <Link href={`/admin/porosite/${o.id}`} className="flex items-center gap-3 after:absolute after:inset-0">
                        <Avatar name={o.name} />
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium text-ink">{o.name}</span>
                          <span className="block truncate text-[12px] text-muted">{o.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <ThumbStack images={o.items.map((i) => i.imageUrl)} total={o.items.length} />
                        <span className="text-[13px] text-muted whitespace-nowrap">
                          <span className="font-medium text-ink">{itemCount(o.items)}</span> copë
                        </span>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <span className="block text-[13px] text-ink" title={formatDateTime(o.createdAt)}>
                        {timeAgo(o.createdAt)}
                      </span>
                      <span className="block text-[12px] text-muted">#{o.id}</span>
                    </td>
                    <td className="pr-4">
                      <ChevronRight aria-hidden className="h-4 w-4 text-muted/50 transition-colors group-hover:text-ink" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="divide-y divide-line md:hidden">
              {data.items.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/porosite/${o.id}`} className="flex flex-col gap-3 px-4 py-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={o.name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-ink">{o.name}</p>
                        <p className="truncate text-[12px] text-muted">
                          #{o.id} · {timeAgo(o.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="flex items-center gap-3 pl-12">
                      <ThumbStack images={o.items.map((i) => i.imageUrl)} total={o.items.length} size={28} />
                      <span className="text-[12px] text-muted">{itemCount(o.items)} copë</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          href={(p) => `/admin/porosite${qs({ status, q, page: p })}`}
        />
      </Panel>
    </>
  );
}
