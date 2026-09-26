"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Lightbulb,
  Milestone,
  type LucideIcon,
  Signpost,
  TrafficCone,
} from "lucide-react";
import { getProductsByGroup, productGroups } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const groupIcons: Record<string, LucideIcon> = {
  "vertical-signage": Signpost,
  illuminated: Lightbulb,
  "road-safety": TrafficCone,
  "street-furniture": Milestone,
};

interface CategorySidebarProps {
  /** `null` = "Të Gjitha" (all products) is active. */
  activeGroupSlug: string | null;
  /** The product currently being viewed, if on a product detail page - highlighted in its group's expanded list. */
  activeProductSlug?: string;
}

export function CategorySidebar({ activeGroupSlug, activeProductSlug }: CategorySidebarProps) {
  // Whichever group is currently active starts expanded, so a product page
  // shows you where it sits in the tree.
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    () => new Set(activeGroupSlug ? [activeGroupSlug] : []),
  );

  function toggleGroup(slug: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  return (
    <aside className="mb-8 shrink-0 lg:mb-0 lg:w-72">
      <div className="border border-line bg-paper shadow-sm">
        <nav aria-label="Kategoritë e produkteve">
          <Link
            href="/products"
            className={cn(
              "flex w-full items-center justify-between border-b border-line px-5 py-4 text-left text-[15px] font-medium text-ink transition-colors hover:bg-surface",
              activeGroupSlug === null && "bg-surface",
            )}
          >
            Të Gjitha
            <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted" />
          </Link>

          {productGroups.map((group) => {
            const Icon = groupIcons[group.slug] ?? Signpost;
            const active = activeGroupSlug === group.slug;
            const expanded = expandedGroups.has(group.slug);
            const groupProducts = getProductsByGroup(group.slug);

            return (
              <div key={group.slug} className="border-b border-line last:border-b-0">
                <div className={cn("flex items-center transition-colors", active && "bg-surface")}>
                  <Link
                    href={`/products?category=${group.slug}`}
                            className="flex flex-1 items-center gap-3 py-4 pl-5 pr-2 text-left hover:bg-surface"
                  >
                    <Icon
                      aria-hidden
                      strokeWidth={1.5}
                      className={cn("h-5 w-5 shrink-0", active ? "text-red" : "text-ink/60")}
                    />
                    <span className={cn("flex-1 text-[15px]", active ? "font-medium text-ink" : "text-ink/85")}>
                      {group.name}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.slug)}
                    aria-label={expanded ? `Fshih nënkategoritë e ${group.name}` : `Shfaq nënkategoritë e ${group.name}`}
                    aria-expanded={expanded}
                    className="px-4 py-4 text-muted transition-colors hover:text-ink"
                  >
                    <ChevronRight
                      aria-hidden
                      className={cn("h-4 w-4 shrink-0 transition-transform", expanded && "rotate-90")}
                    />
                  </button>
                </div>

                {expanded && (
                  <div className="border-t border-line bg-surface/60 py-1">
                    {groupProducts.map((product) => {
                      const productActive = activeProductSlug === product.slug;
                      return (
                        <Link
                          key={product.slug}
                          href={`/products/${product.slug}`}
                                        className={cn(
                            "flex items-center justify-between py-2.5 pl-12 pr-5 text-[14px] transition-colors hover:text-red",
                            productActive ? "font-medium text-red" : "text-ink/75",
                          )}
                        >
                          {product.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
