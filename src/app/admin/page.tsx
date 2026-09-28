import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BellDot,
  FolderPlus,
  FolderTree,
  Inbox,
  Package,
  PackagePlus,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import {
  Avatar,
  btnPrimary,
  btnSecondary,
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
  ThumbStack,
} from "@/components/admin/ui";
import { formatDate, itemCount, timeAgo } from "@/lib/admin/format";
import { adminApi, requireAdmin } from "@/lib/admin/session";
import type { Stats } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Paneli" };

function StatCard({
  href,
  label,
  value,
  sub,
  icon: Icon,
  alert,
}: {
  href: string;
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  alert?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(10,10,10,0.03)] transition-[border-color,box-shadow] hover:border-ink/25 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        <span className={cn("flex h-8 w-8 items-center justify-center", alert ? "bg-red/10 text-red" : "bg-ink/[0.05] text-ink/60")}>
          <Icon aria-hidden className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-3 font-display text-[34px] font-semibold leading-none tracking-tight text-ink tabular-nums">{value}</p>
      <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted">
        {alert && <span aria-hidden className="h-1.5 w-1.5 bg-red" />}
        {sub}
      </p>
      <ArrowUpRight
        aria-hidden
        className="absolute bottom-5 right-5 h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}

function QuickLink({ href, icon: Icon, label, hint }: { href: string; icon: React.ElementType; label: string; hint: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ink/[0.03]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-paper text-ink/70 group-hover:text-ink">
        <Icon aria-hidden className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        <span className="block truncate text-[12px] text-muted">{hint}</span>
      </span>
      <ArrowRight aria-hidden className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const [admin, stats] = await Promise.all([requireAdmin(), adminApi<Stats>("/stats")]);
  const firstName = (admin.fullName || "").split(" ")[0];
  const needsAttention = stats.newOrders + stats.unreadMessages > 0;

  const attention = [
    stats.newOrders > 0 && `${stats.newOrders} ${stats.newOrders === 1 ? "porosi e re" : "porosi të reja"}`,
    stats.unreadMessages > 0 &&
      `${stats.unreadMessages} ${stats.unreadMessages === 1 ? "mesazh i palexuar" : "mesazhe të palexuara"}`,
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        meta={<span>{formatDate(new Date().toISOString())}</span>}
        title={firstName ? `Mirë se erdhe, ${firstName}` : "Mirë se erdhe"}
        description="Këtu shihni çfarë kërkon vëmendje dhe gjendjen e katalogut."
        actions={
          <>
            <Link href="/admin/kategorite/re" className={btnSecondary}>
              <FolderPlus aria-hidden className="h-4 w-4" />
              Kategori e re
            </Link>
            <Link href="/admin/produktet/re" className={btnPrimary}>
              <PackagePlus aria-hidden className="h-4 w-4" />
              Produkt i ri
            </Link>
          </>
        }
      />

      {needsAttention && (
        <div className="mb-6 flex flex-col gap-3 border border-red/20 bg-red/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <BellDot aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-red" strokeWidth={1.8} />
            <div>
              <p className="text-[14px] font-semibold text-ink">Keni {attention.join(" dhe ")}</p>
              <p className="mt-0.5 text-[13px] text-muted">Klientët presin përgjigje - kontaktojini sa më shpejt.</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2 pl-8 sm:pl-0">
            {stats.newOrders > 0 && (
              <Link href="/admin/porosite?status=new" className={btnPrimary}>
                Shiko porositë
              </Link>
            )}
            {stats.unreadMessages > 0 && (
              <Link href="/admin/mesazhet?filtri=palexuara" className={btnSecondary}>
                Lexo mesazhet
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          href="/admin/porosite?status=new"
          label="Porosi të reja"
          value={stats.newOrders}
          sub={`${stats.openOrders} të hapura · ${stats.totalOrders} gjithsej`}
          icon={ShoppingCart}
          alert={stats.newOrders > 0}
        />
        <StatCard
          href="/admin/mesazhet?filtri=palexuara"
          label="Të palexuara"
          value={stats.unreadMessages}
          sub={`${stats.totalMessages} mesazhe gjithsej`}
          icon={Inbox}
          alert={stats.unreadMessages > 0}
        />
        <StatCard href="/admin/produktet" label="Produkte" value={stats.products} sub="Në katalog" icon={Package} />
        <StatCard href="/admin/kategorite" label="Kategori" value={stats.categories} sub="Në të gjitha nivelet" icon={FolderTree} />
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <Panel
          title="Porositë e fundit"
          description="Kërkesat më të reja për ofertë"
          flush
          className="xl:col-span-2"
          actions={
            <Link href="/admin/porosite" className="inline-flex items-center gap-1 text-[13px] font-medium text-muted hover:text-ink">
              Të gjitha <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {stats.recentOrders.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="Ende asnjë porosi">
              Kur një klient dërgon shportën nga faqja, kërkesa shfaqet këtu.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {stats.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/porosite/${order.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-ink/[0.02] sm:gap-4"
                  >
                    <Avatar name={order.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-ink">{order.name}</p>
                      <p className="truncate text-[12px] text-muted">
                        #{order.id} · {itemCount(order.items)} copë · {timeAgo(order.createdAt)}
                      </p>
                    </div>
                    <span className="hidden sm:block">
                      <ThumbStack images={order.items.map((i) => i.imageUrl)} total={order.items.length} size={30} />
                    </span>
                    <StatusBadge status={order.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel
            title="Mesazhet e fundit"
            flush
            actions={
              <Link href="/admin/mesazhet" className="inline-flex items-center gap-1 text-[13px] font-medium text-muted hover:text-ink">
                Të gjitha <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </Link>
            }
          >
            {stats.recentMessages.length === 0 ? (
              <EmptyState icon={Inbox} title="Ende asnjë mesazh">
                Mesazhet nga faqja e kontaktit shfaqen këtu.
              </EmptyState>
            ) : (
              <ul className="divide-y divide-line">
                {stats.recentMessages.map((m) => (
                  <li key={m.id}>
                    <Link href={`/admin/mesazhet/${m.id}`} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-ink/[0.02]">
                      <span className="relative">
                        <Avatar name={m.name} size="sm" />
                        {!m.isRead && <span aria-hidden className="absolute -right-0.5 -top-0.5 h-2 w-2 bg-red ring-2 ring-paper" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className={cn("truncate text-[14px] text-ink", !m.isRead && "font-semibold")}>{m.name}</p>
                          <span className="shrink-0 text-[11px] text-muted">{timeAgo(m.createdAt)}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[13px] text-muted">{m.message}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Veprime të shpejta" flush>
            <div className="divide-y divide-line">
              <QuickLink href="/admin/produktet/re" icon={PackagePlus} label="Shto produkt" hint="Me imazh, kategori dhe përshkrim" />
              <QuickLink href="/admin/kategorite" icon={FolderTree} label="Organizo katalogun" hint="Kategoritë dhe nënkategoritë" />
              <QuickLink href="/admin/profili" icon={UserRound} label="Profili juaj" hint="Emri, email-i dhe fjalëkalimi" />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
