"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Signpost, X } from "lucide-react";
import { AddToCartButton } from "@/components/sections/add-to-cart-button";
import { ProductMedia } from "@/components/sections/product-media";
import { productIcons } from "@/components/sections/product-icons";
import type { ImageFit } from "@/types/catalog";

export interface GridCard {
  key: string;
  href: string;
  name: string;
  image?: { src: string; fit: ImageFit } | null;
  /** Shown under the name - used for category cards at the top levels. */
  description?: string | null;
  /** Small label above the name (e.g. the sub-category in search results). */
  tag?: string;
  /** Extra searchable words, not displayed. */
  keywords?: string;
  /** Present only for real products; sub-categories are plain links. */
  cart?: { productSlug: string; groupName: string };
}

const PAGE_SIZE = 12;

// Case- and accent-insensitive so "kembesor" finds "Këmbësorë".
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function CardGrid({
  cards,
  iconKey,
  searchable,
  searchPool,
  alwaysShowTags,
}: {
  cards: GridCard[];
  iconKey: string;
  /** Show a search box. */
  searchable?: boolean;
  /** When set, searching looks through these cards instead of `cards`. */
  searchPool?: GridCard[];
  /** Show each card's tag even when not searching. */
  alwaysShowTags?: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [visible, setVisible] = React.useState(PAGE_SIZE);
  const Icon = productIcons[iconKey] ?? Signpost;

  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  const searching = tokens.length > 0;
  const source = searching ? (searchPool ?? cards) : cards;
  const shown = searching
    ? source.filter((card) => {
        const haystack = normalize(`${card.name} ${card.tag ?? ""} ${card.keywords ?? ""}`);
        return tokens.every((token) => haystack.includes(token));
      })
    : source;
  const remaining = shown.length - visible;

  return (
    <>
      {searchable && (
        <div className="mt-8">
          <label htmlFor="sign-search" className="sr-only">
            Kërko produkt
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              id="sign-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Kërko produkt ose shenjë..."
              autoComplete="off"
              className="h-12 w-full border border-line bg-paper pl-11 pr-11 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setVisible(PAGE_SIZE);
                }}
                aria-label="Pastro kërkimin"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-ink"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            )}
          </div>
          {searching && (
            <p className="mt-3 text-sm text-muted" aria-live="polite">
              {shown.length} {shown.length === 1 ? "rezultat" : "rezultate"}
            </p>
          )}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="mt-10 border border-line p-8 md:p-12">
          <p className="font-display text-lg font-medium text-ink">Asnjë produkt nuk u gjet.</p>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            Provoni një fjalë tjetër, ose na kontaktoni për produktin që ju nevojitet.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-8 sm:gap-y-12 xl:grid-cols-3">
          {shown.slice(0, visible).map((card) => (
            <div key={card.key} className="min-w-0">
              <Link href={card.href} className="group block">
                <ProductMedia
                  src={card.image?.src}
                  alt={card.name}
                  fit={card.image?.fit ?? "contain"}
                  Icon={Icon}
                  iconClassName="h-14 w-14"
                >
                  <ArrowUpRight
                    aria-hidden
                    className="absolute right-4 top-4 h-5 w-5 -translate-x-1 translate-y-1 text-red opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </ProductMedia>
              </Link>
              <div className="mt-3 flex items-start justify-between gap-2 sm:mt-5 sm:gap-3">
                <Link href={card.href} className="group min-w-0">
                  {card.tag && (searching || alwaysShowTags) && (
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-red sm:text-xs">
                      {card.tag}
                    </p>
                  )}
                  <h3
                    title={card.name}
                    className="line-clamp-3 font-display text-[13px] font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-red sm:line-clamp-2 sm:text-lg"
                  >
                    {card.name}
                  </h3>
                  {card.description && (
                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted sm:mt-2 sm:text-[14px]">
                      {card.description}
                    </p>
                  )}
                </Link>
                {card.cart && (
                  <AddToCartButton
                    variant="compact"
                    productSlug={card.cart.productSlug}
                    image={card.image ? { src: card.image.src, alt: card.name } : undefined}
                    name={card.name}
                    groupName={card.cart.groupName}
                    className="shrink-0"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <div className="mt-10 flex justify-center sm:mt-12">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center justify-center border border-ink px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-red hover:bg-red hover:text-paper"
          >
            Shfaq më Shumë ({remaining})
          </button>
        </div>
      )}
    </>
  );
}
