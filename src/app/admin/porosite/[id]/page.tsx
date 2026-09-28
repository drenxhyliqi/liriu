import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail, MessageSquareQuote, Phone } from "lucide-react";
import { CopyButton } from "@/components/admin/copy-button";
import { OrderManage } from "@/components/admin/order-manage";
import { Avatar, btnPrimary, btnSecondary, PageHeader, Panel, StatusBadge, Thumb } from "@/components/admin/ui";
import { formatDateTime, itemCount, timeAgo } from "@/lib/admin/format";
import { adminApi } from "@/lib/admin/session";
import type { Order } from "@/lib/admin/types";
import { ApiError } from "@/lib/api/client";

async function getOrder(id: string) {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await adminApi<Order>(`/orders/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps<"/admin/porosite/[id]">): Promise<Metadata> {
  return { title: `Porosia #${(await params).id}` };
}

export default async function OrderPage({ params }: PageProps<"/admin/porosite/[id]">) {
  const order = await getOrder((await params).id);
  const subject = encodeURIComponent(`Oferta për kërkesën tuaj #${order.id} - NSH LIRIU`);
  const phoneHref = order.phone ? `tel:${order.phone.replace(/\s+/g, "")}` : null;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/porosite", label: "Porositë" }}
        meta={
          <>
            <StatusBadge status={order.status} />
            <span>
              Dërguar {timeAgo(order.createdAt)} · {formatDateTime(order.createdAt)}
            </span>
          </>
        }
        title={`Porosia #${order.id}`}
        actions={
          <>
            {phoneHref && (
              <a href={phoneHref} className={btnSecondary}>
                <Phone aria-hidden className="h-4 w-4" />
                Telefono
              </a>
            )}
            <a href={`mailto:${order.email}?subject=${subject}`} className={btnPrimary}>
              <Mail aria-hidden className="h-4 w-4" />
              Përgjigju me email
            </a>
          </>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <Panel
            title="Produktet e kërkuara"
            description={`${order.items.length} ${order.items.length === 1 ? "produkt" : "produkte"} · ${itemCount(order.items)} copë gjithsej`}
            flush
          >
            <ul className="divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <Thumb src={item.imageUrl} size={64} />
                  <div className="min-w-0 flex-1">
                    {item.groupName && <p className="truncate text-[12px] text-muted">{item.groupName}</p>}
                    <p className="text-[14px] font-medium leading-snug text-ink">{item.name}</p>
                    {item.productSlug && (
                      <Link
                        href={`/products/${item.productSlug}`}
                        target="_blank"
                        className="mt-1 inline-flex items-center gap-0.5 text-[12px] text-muted underline-offset-2 hover:text-ink hover:underline"
                      >
                        Hap në faqe <ArrowUpRight aria-hidden className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-[20px] font-semibold tabular-nums text-ink">×{item.quantity}</p>
                    <p className="text-[11px] text-muted">copë</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-line bg-surface/60 px-5 py-3 text-[13px]">
              <span className="text-muted">Gjithsej</span>
              <span className="font-semibold tabular-nums text-ink">{itemCount(order.items)} copë</span>
            </div>
          </Panel>

          {order.note && (
            <Panel title="Shënimi i klientit">
              <div className="flex gap-3">
                <MessageSquareQuote aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-muted" strokeWidth={1.6} />
                <p className="whitespace-pre-line text-[14px] leading-relaxed text-ink">{order.note}</p>
              </div>
            </Panel>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Klienti">
            <div className="flex items-center gap-3">
              <Avatar name={order.name} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-ink">{order.name}</p>
                <p className="text-[12px] text-muted">Kërkesë për ofertë</p>
              </div>
            </div>
            <dl className="mt-4 divide-y divide-line border-t border-line">
              <div className="flex items-center gap-2 py-2.5">
                <Mail aria-hidden className="h-4 w-4 shrink-0 text-muted" />
                <a href={`mailto:${order.email}`} className="min-w-0 flex-1 truncate text-[14px] text-ink hover:underline">
                  {order.email}
                </a>
                <CopyButton value={order.email} label="Kopjo email-in" />
              </div>
              <div className="flex items-center gap-2 py-2.5">
                <Phone aria-hidden className="h-4 w-4 shrink-0 text-muted" />
                {order.phone && phoneHref ? (
                  <>
                    <a href={phoneHref} className="min-w-0 flex-1 truncate text-[14px] text-ink hover:underline">
                      {order.phone}
                    </a>
                    <CopyButton value={order.phone} label="Kopjo numrin" />
                  </>
                ) : (
                  <span className="text-[14px] text-muted">Pa numër telefoni</span>
                )}
              </div>
            </dl>
          </Panel>

          <OrderManage order={order} />
        </div>
      </div>
    </>
  );
}
