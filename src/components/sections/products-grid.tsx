"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  Compass,
  Fence,
  Lightbulb,
  MapPin,
  Milestone,
  type LucideIcon,
  Route,
  Signpost,
  SquareParking,
  TrafficCone,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CategorySidebar } from "@/components/sections/category-sidebar";
import { productGroups, products } from "@/lib/data/products";

const productIcons: Record<string, LucideIcon> = {
  "traffic-signs": AlertTriangle,
  "information-signs": Signpost,
  "street-name-plates": MapPin,
  "poles-brackets": Milestone,
  "signage-portals": Route,
  "led-signage": Lightbulb,
  "traffic-cones": TrafficCone,
  delineators: Compass,
  barriers: Fence,
  "traffic-mirrors": Route,
  "parking-solutions": SquareParking,
};

const gridBackground = {
  backgroundImage:
    "linear-gradient(to right, rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.05) 1px, transparent 1px)",
  backgroundSize: "26px 26px",
};

export function ProductsGrid() {
  const searchParams = useSearchParams();
  const activeGroup = searchParams.get("category");
  const activeGroupData = productGroups.find((g) => g.slug === activeGroup) ?? null;

  const visibleProducts = activeGroupData
    ? products.filter((product) => product.groupSlug === activeGroupData.slug)
    : products;

  return (
    <div className="lg:flex lg:items-start lg:gap-10">
      <CategorySidebar activeGroupSlug={activeGroupData?.slug ?? null} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-4 border border-line bg-surface px-6 py-5">
          <span className="inline-flex items-center gap-2 border border-line bg-paper px-4 py-2 text-[13px] font-medium uppercase tracking-[0.06em] text-ink">
            Oferta Jonë
            <ChevronDown aria-hidden className="h-3.5 w-3.5 text-muted" />
          </span>
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {activeGroupData ? activeGroupData.name : "Të Gjitha Produktet"}
          </h2>
        </div>

        <div className="mt-5">
          <Breadcrumb
            items={[
              { label: "Produktet", href: activeGroupData ? "/products" : undefined },
              ...(activeGroupData ? [{ label: activeGroupData.name }] : []),
            ]}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => {
            const Icon = productIcons[product.slug] ?? Signpost;
            const group = productGroups.find((g) => g.slug === product.groupSlug);

            return (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group block">
                <div
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-line bg-paper shadow-sm"
                  style={gridBackground}
                >
                  <Icon aria-hidden className="h-16 w-16 text-ink/15" strokeWidth={1} />
                  <ArrowUpRight
                    aria-hidden
                    className="absolute right-4 top-4 h-5 w-5 -translate-x-1 translate-y-1 text-red opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>

                <div className="mt-5">
                  {group && !activeGroupData && (
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.1em] text-red">
                      {group.name}
                    </p>
                  )}
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-red sm:text-[22px]">
                    {product.name}
                  </h3>
                  <p className="mt-2.5 max-w-[38ch] text-[15px] leading-relaxed text-muted">
                    {product.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
