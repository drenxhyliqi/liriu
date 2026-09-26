"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Signpost } from "lucide-react";
import { productIcons } from "@/components/sections/product-icons";
import { ProductMedia } from "@/components/sections/product-media";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CategorySidebar } from "@/components/sections/category-sidebar";
import { productGroups, products } from "@/lib/data/products";

export function ProductsGrid() {
  const searchParams = useSearchParams();
  const activeGroup = searchParams.get("category");
  const activeGroupData =
    productGroups.find((g) => g.slug === activeGroup) ?? null;

  const visibleProducts = activeGroupData
    ? products.filter((product) => product.groupSlug === activeGroupData.slug)
    : products;

  return (
    <div className="lg:flex lg:items-start lg:gap-10">
      <CategorySidebar activeGroupSlug={activeGroupData?.slug ?? null} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-4 border border-line bg-surface px-6 py-5">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {activeGroupData ? activeGroupData.name : "Të Gjitha Produktet"}
          </h2>
        </div>

        <div className="mt-5">
          <Breadcrumb
            items={[
              {
                label: "Produktet",
                href: activeGroupData ? "/products" : undefined,
              },
              ...(activeGroupData ? [{ label: activeGroupData.name }] : []),
            ]}
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-8 sm:gap-y-12 xl:grid-cols-3">
          {visibleProducts.map((product) => {
            const Icon = productIcons[product.slug] ?? Signpost;
            const group = productGroups.find(
              (g) => g.slug === product.groupSlug,
            );

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group block"
              >
                <ProductMedia
                  image={product.image}
                  fit={product.image?.fit}
                  Icon={Icon}
                  iconClassName="h-16 w-16"
                >
                  <ArrowUpRight
                    aria-hidden
                    className="absolute right-4 top-4 h-5 w-5 -translate-x-1 translate-y-1 text-red opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </ProductMedia>

                <div className="mt-3 sm:mt-5">
                  {group && !activeGroupData && (
                    <p className="mb-1.5 text-[10px] font-medium uppercase sm:text-xs tracking-[0.1em] text-red">
                      {group.name}
                    </p>
                  )}
                  <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-red sm:text-[22px]">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 max-w-[38ch] text-[12px] leading-relaxed text-muted sm:mt-2.5 sm:text-[15px]">
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
