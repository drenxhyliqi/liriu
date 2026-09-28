import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { initials, orderStatusLabels, orderStatusStyles } from "@/lib/admin/format";
import type { OrderStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------ tokens
// Black is the primary action colour in the dashboard; red is reserved for
// things that need attention (new items, badges) and for destructive actions,
// so the two never compete.

const btnBase =
  "inline-flex h-9 shrink-0 items-center justify-center gap-2 px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50";
export const btnPrimary = `${btnBase} bg-ink text-paper hover:bg-ink/85`;
export const btnSecondary = `${btnBase} border border-line bg-paper text-ink hover:border-ink/30 hover:bg-surface`;
export const btnGhost = `${btnBase} text-muted hover:bg-ink/[0.05] hover:text-ink`;
export const btnDanger = `${btnBase} border border-red/25 bg-paper text-red hover:border-red hover:bg-red hover:text-paper`;
export const btnDangerSolid = `${btnBase} bg-red text-paper hover:bg-red-ink`;

export const inputClass =
  "block h-10 w-full border border-line bg-paper px-3 text-[14px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 hover:border-ink/25 focus:border-ink focus:ring-4 focus:ring-ink/[0.06] disabled:opacity-60 [&[type=search]::-webkit-search-cancel-button]:hidden";
export const textareaClass = inputClass.replace("h-10", "min-h-24 py-2.5 leading-relaxed");
export const labelClass = "mb-1.5 block text-[13px] font-medium text-ink";
export const hintClass = "mt-1.5 text-[12px] leading-relaxed text-muted";

export const thClass = "h-10 px-4 text-left text-[12px] font-medium text-muted first:pl-5 last:pr-5";
export const tdClass = "px-4 py-3 align-middle first:pl-5 last:pr-5";

// ------------------------------------------------------------------ layout

export function PageHeader({
  title,
  description,
  back,
  actions,
  meta,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Shown on small screens only - the top bar breadcrumbs cover desktop. */
  back?: { href: string; label: string };
  actions?: React.ReactNode;
  /** Small line above the title (status, id...). */
  meta?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-3 inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-ink lg:hidden"
          >
            <ChevronLeft aria-hidden className="h-4 w-4" />
            {back.label}
          </Link>
        )}
        {meta && <div className="mb-2 flex flex-wrap items-center gap-2 text-[13px] text-muted">{meta}</div>}
        <h1 className="font-display text-[22px] font-semibold leading-tight tracking-tight text-ink sm:text-[26px]">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  className,
  children,
  flush,
  footer,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  /** No inner padding - for tables and lists that run edge to edge. */
  flush?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <section className={cn("border border-line bg-paper shadow-[0_1px_2px_rgba(10,10,10,0.03)]", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={flush ? undefined : "p-5"}>{children}</div>
      {footer && <div className="border-t border-line bg-surface/50 px-5 py-3">{footer}</div>}
    </section>
  );
}

/** A labelled row of values inside a panel (e.g. customer details). */
export function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-[14px]">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 text-right text-ink">{children}</dd>
    </div>
  );
}

// ------------------------------------------------------------------ data display

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const style = orderStatusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 px-2 text-[12px] font-medium whitespace-nowrap",
        style.pill,
        className,
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5", style.dot)} />
      {orderStatusLabels[status]}
    </span>
  );
}

export function Pill({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "red" | "ink" }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center px-2 text-[12px] font-medium whitespace-nowrap",
        tone === "red" && "bg-red/10 text-red",
        tone === "ink" && "bg-ink text-paper",
        tone === "muted" && "bg-ink/[0.05] text-muted",
      )}
    >
      {children}
    </span>
  );
}

/** Visible/hidden indicator for catalog items. */
export function VisibilityDot({ active }: { active: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap", active ? "text-ink" : "text-muted")}>
      <span aria-hidden className={cn("h-1.5 w-1.5", active ? "bg-ink" : "bg-muted/50")} />
      {active ? "I dukshëm" : "I fshehur"}
    </span>
  );
}

export function Avatar({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center bg-ink/[0.06] font-display font-semibold text-ink",
        size === "sm" && "h-7 w-7 text-[11px]",
        size === "md" && "h-9 w-9 text-[12px]",
        size === "lg" && "h-14 w-14 text-[18px]",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function Thumb({
  src,
  fit = "contain",
  size = 40,
  className,
}: {
  src: string | null | undefined;
  fit?: "cover" | "contain";
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative flex shrink-0 items-center justify-center overflow-hidden border border-line bg-paper", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={`${size * 2}px`}
          className={fit === "contain" ? "object-contain p-[3px]" : "object-cover"}
        />
      ) : (
        <Package aria-hidden className="h-1/2 w-1/2 text-ink/15" strokeWidth={1.25} />
      )}
    </span>
  );
}

/** First few product thumbnails - "which products are in this order". */
export function ThumbStack({ images, total, size = 32 }: { images: (string | null)[]; total: number; size?: number }) {
  const shown = images.slice(0, 3);
  const extra = total - shown.length;
  return (
    <span className="flex items-center gap-1">
      {shown.map((src, i) => (
        <Thumb key={i} src={src} size={size} />
      ))}
      {extra > 0 && (
        <span
          className="flex shrink-0 items-center justify-center border border-line bg-surface text-[11px] font-medium text-muted"
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {Icon && (
        <span className="mb-4 flex h-11 w-11 items-center justify-center border border-line bg-surface">
          <Icon aria-hidden className="h-5 w-5 text-muted" strokeWidth={1.6} />
        </span>
      )}
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      {children && <div className="mt-1.5 max-w-sm text-[14px] leading-relaxed text-muted">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ------------------------------------------------------------------ navigation

export function Tabs({
  tabs,
  active,
}: {
  tabs: { href: string; label: string; count?: number; key: string }[];
  active: string;
}) {
  return (
    <nav aria-label="Filtro" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
      <div className="inline-flex min-w-max gap-1 border border-line bg-paper p-1">
        {tabs.map((tab) => {
          const current = tab.key === active;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "flex h-8 items-center gap-2 px-3 text-[13px] transition-colors",
                current ? "bg-ink font-medium text-paper" : "text-muted hover:bg-ink/[0.05] hover:text-ink",
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    "flex h-[18px] min-w-[18px] items-center justify-center px-1 text-[11px] font-semibold",
                    current ? "bg-paper/20 text-paper" : "bg-red text-paper",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  href,
}: {
  page: number;
  pageSize: number;
  total: number;
  href: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const box = "flex h-8 w-8 items-center justify-center border border-line";
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3 text-[13px] text-muted">
      <span>
        <span className="font-medium text-ink">
          {from}–{to}
        </span>{" "}
        nga {total}
      </span>
      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link href={href(page - 1)} className={cn(box, "bg-paper text-ink hover:bg-surface")} aria-label="Faqja e mëparshme">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span className={cn(box, "text-muted/40")}>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
        <span className="min-w-14 text-center tabular-nums">
          {page} / {pages}
        </span>
        {page < pages ? (
          <Link href={href(page + 1)} className={cn(box, "bg-paper text-ink hover:bg-surface")} aria-label="Faqja tjetër">
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className={cn(box, "text-muted/40")}>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ query helpers

/** Builds a query string, dropping empty values. */
export function qs(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "" && !(key === "page" && value === 1)) {
      search.set(key, String(value));
    }
  }
  const out = search.toString();
  return out ? `?${out}` : "";
}

export function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function pageParam(value: string | string[] | undefined) {
  const n = Number(first(value));
  return Number.isInteger(n) && n > 0 ? n : 1;
}
