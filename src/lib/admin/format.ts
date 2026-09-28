import type { OrderStatus } from "@/lib/admin/types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "E re",
  contacted: "Kontaktuar",
  quoted: "Ofertë e dërguar",
  closed: "Mbyllur",
};

/** Pill background/text and the matching status dot. */
export const orderStatusStyles: Record<OrderStatus, { pill: string; dot: string }> = {
  new: { pill: "bg-red/10 text-red", dot: "bg-red" },
  contacted: { pill: "bg-ink/[0.06] text-ink", dot: "bg-ink/50" },
  quoted: { pill: "bg-ink text-paper", dot: "bg-paper" },
  closed: { pill: "bg-surface text-muted ring-1 ring-inset ring-line", dot: "bg-muted/60" },
};

export const orderStatusHints: Record<OrderStatus, string> = {
  new: "Ende pa u kontaktuar",
  contacted: "Klienti u kontaktua",
  quoted: "Oferta iu dërgua klientit",
  closed: "Përfunduar ose anuluar",
};

export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// Assembled from parts rather than formatted with the "sq" locale: locale
// data differs between Node and browsers, and a server/client mismatch
// breaks hydration. en-GB parts + a fixed pattern render identically everywhere.
const parts = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/Belgrade",
});

export function formatDate(iso: string) {
  const p = Object.fromEntries(parts.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.day}.${p.month}.${p.year}`;
}

export function formatDateTime(iso: string) {
  const p = Object.fromEntries(parts.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.day}.${p.month}.${p.year}, ${p.hour}:${p.minute}`;
}

export function timeAgo(iso: string) {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "tani";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min më parë`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} orë më parë`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} ditë më parë`;
  return formatDate(iso);
}

export function itemCount(items: { quantity: number }[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
