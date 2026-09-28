"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full border border-line bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";
const labelClass = "mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-muted";

export function OrderRequest() {
  const { items, totalQuantity, removeItem, updateQuantity, clear } = useCart();
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          note: String(data.get("note") ?? ""),
          items: items.map((item) => ({
            productSlug: item.productSlug,
            name: item.name,
            groupName: item.groupName,
            quantity: item.quantity,
          })),
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Diçka shkoi keq. Provoni përsëri.");

      clear();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Diçka shkoi keq. Provoni përsëri.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line p-8 md:p-12">
        <p className="font-display text-xl font-semibold text-ink">Kërkesa u dërgua.</p>
        <p className="mt-3 max-w-md leading-relaxed text-muted">
          Faleminderit. Do t&apos;ju kontaktojmë sa më shpejt të jetë e mundur
          me një ofertë për produktet e kërkuara.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center border border-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-red hover:bg-red hover:text-paper"
        >
          Vazhdo Blerjen
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border border-line p-8 md:p-12">
        <p className="font-display text-xl font-semibold text-ink">Porosia juaj është bosh.</p>
        <p className="mt-3 max-w-md leading-relaxed text-muted">
          Shtoni produkte nga katalogu për të vazhduar me kërkesën për ofertë.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center bg-red px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
        >
          Shiko Produktet
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Artikujt ({totalQuantity})
        </p>
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.key} className="flex items-start gap-4 border-b border-line py-4">
              <div className="relative h-20 w-20 shrink-0 border border-line bg-paper">
                        {item.image ? (
                          <Image
                            src={item.image.src}
                            alt={item.image.alt}
                            fill
                            sizes="80px"
                            className="object-contain p-1.5"
                          />
                        ) : null}
                      </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.06em] text-red">{item.groupName}</p>
                <p className="mt-1 text-[15px] font-medium text-ink">{item.name}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, -1)}
                    aria-label="Zvogëlo sasinë"
                    className="flex h-7 w-7 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-[14px] text-ink">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, 1)}
                    aria-label="Shto sasinë"
                    className="flex h-7 w-7 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.key)}
                aria-label={`Hiq ${item.name}`}
                className="ml-auto mt-1 text-muted transition-colors hover:text-red"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-7">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-muted">Të Dhënat Tuaja</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Emri i Plotë *
              </label>
              <input id="name" name="name" type="text" required className={inputClass} placeholder="Emri Mbiemri" />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email *
              </label>
              <input id="email" name="email" type="email" required className={inputClass} placeholder="emri@shembull.com" />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Telefoni
            </label>
            <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+383 ..." />
          </div>

          <div>
            <label htmlFor="note" className={labelClass}>
              Shënim
            </label>
            <textarea id="note" name="note" rows={4} className={inputClass} placeholder="Sasi, afate, ose detaje shtesë..." />
          </div>

          {error && <p className="text-sm text-red">{error}</p>}

          <div className="flex flex-col items-start gap-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex w-fit items-center justify-center bg-red px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink disabled:opacity-60"
            >
              {status === "submitting" ? "Duke dërguar..." : "Dërgo Kërkesën"}
            </button>
            <p className="text-xs text-muted">Do t&apos;ju kontaktojmë për konfirmim.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
