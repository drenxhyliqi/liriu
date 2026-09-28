import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone, Tag } from "lucide-react";
import { CopyButton } from "@/components/admin/copy-button";
import { MarkReadOnView, MessageActions } from "@/components/admin/message-actions";
import { Avatar, btnPrimary, btnSecondary, PageHeader, Panel } from "@/components/admin/ui";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import { adminApi } from "@/lib/admin/session";
import type { ContactMessage } from "@/lib/admin/types";
import { ApiError } from "@/lib/api/client";

export const metadata: Metadata = { title: "Mesazhi" };

async function getMessage(id: string) {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await adminApi<ContactMessage>(`/contact/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export default async function MessagePage({ params }: PageProps<"/admin/mesazhet/[id]">) {
  const message = await getMessage((await params).id);
  const subject = encodeURIComponent(`Re: Mesazhi juaj për NSH LIRIU`);
  const phoneHref = message.phone ? `tel:${message.phone.replace(/\s+/g, "")}` : null;

  return (
    <>
      <MarkReadOnView id={message.id} isRead={message.isRead} />
      <PageHeader
        back={{ href: "/admin/mesazhet", label: "Mesazhet" }}
        meta={<span>{formatDateTime(message.createdAt)}</span>}
        title={`Mesazh nga ${message.name}`}
        actions={
          <>
            {phoneHref && (
              <a href={phoneHref} className={btnSecondary}>
                <Phone aria-hidden className="h-4 w-4" />
                Telefono
              </a>
            )}
            <a href={`mailto:${message.email}?subject=${subject}`} className={btnPrimary}>
              <Mail aria-hidden className="h-4 w-4" />
              Përgjigju
            </a>
          </>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <Panel flush className="xl:col-span-2">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <Avatar name={message.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-ink">{message.name}</p>
              <p className="truncate text-[13px] text-muted">{message.email}</p>
            </div>
            <span className="shrink-0 text-[12px] text-muted">{timeAgo(message.createdAt)}</span>
          </div>
          {message.projectType && (
            <div className="flex items-center gap-2 border-b border-line bg-surface/50 px-5 py-2.5 text-[13px]">
              <Tag aria-hidden className="h-3.5 w-3.5 text-muted" />
              <span className="text-muted">Lloji i projektit:</span>
              <span className="font-medium text-ink">{message.projectType}</span>
            </div>
          )}
          <p className="whitespace-pre-line px-5 py-6 text-[15px] leading-[1.7] text-ink">{message.message}</p>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Kontakti">
            <dl className="divide-y divide-line">
              <div className="flex items-center gap-2 pb-2.5">
                <Mail aria-hidden className="h-4 w-4 shrink-0 text-muted" />
                <a href={`mailto:${message.email}`} className="min-w-0 flex-1 truncate text-[14px] text-ink hover:underline">
                  {message.email}
                </a>
                <CopyButton value={message.email} label="Kopjo email-in" />
              </div>
              <div className="flex items-center gap-2 pt-2.5">
                <Phone aria-hidden className="h-4 w-4 shrink-0 text-muted" />
                {message.phone && phoneHref ? (
                  <>
                    <a href={phoneHref} className="min-w-0 flex-1 truncate text-[14px] text-ink hover:underline">
                      {message.phone}
                    </a>
                    <CopyButton value={message.phone} label="Kopjo numrin" />
                  </>
                ) : (
                  <span className="text-[14px] text-muted">Pa numër telefoni</span>
                )}
              </div>
            </dl>
          </Panel>
          <Panel title="Veprime">
            <MessageActions id={message.id} isRead={message.isRead} />
          </Panel>
        </div>
      </div>
    </>
  );
}
