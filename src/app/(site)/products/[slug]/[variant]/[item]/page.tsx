import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Signpost } from "lucide-react";
import { AddToCartButton } from "@/components/sections/add-to-cart-button";
import { CategorySidebar } from "@/components/sections/category-sidebar";
import { productIcons } from "@/components/sections/product-icons";
import { ProductMedia } from "@/components/sections/product-media";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  getItem,
  getProductBySlug,
  getVariant,
  productGroups,
  productVariants,
} from "@/lib/data/products";

export function generateStaticParams() {
  return productVariants.flatMap((variant) =>
    (variant.items ?? []).map((item) => ({
      slug: variant.productSlug,
      variant: variant.slug,
      item: item.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]/[variant]/[item]">): Promise<Metadata> {
  const { slug, variant, item } = await params;
  const found = getItem(slug, variant, item);

  return { title: found ? `${found.name} | NSH LIRIU` : "Produkti | NSH LIRIU" };
}

export default async function ProductItemPage({
  params,
}: PageProps<"/products/[slug]/[variant]/[item]">) {
  const { slug, variant: variantSlug, item: itemSlug } = await params;
  const product = getProductBySlug(slug);
  const variant = product ? getVariant(slug, variantSlug) : undefined;
  const item = variant ? getItem(slug, variantSlug, itemSlug) : undefined;

  if (!product || !variant || !item) notFound();

  const group = productGroups.find((g) => g.slug === product.groupSlug);
  const Icon = productIcons[product.slug] ?? Signpost;

  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
          <CategorySidebar activeGroupSlug={group?.slug ?? null} activeProductSlug={product.slug} />

          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.slug}/${variant.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
              {variant.name}
            </Link>

            <div className="mt-5">
              <Breadcrumb
                items={[
                  { label: "Produktet", href: "/products" },
                  ...(group ? [{ label: group.name, href: `/products?category=${group.slug}` }] : []),
                  { label: product.name, href: `/products/${product.slug}` },
                  { label: variant.name, href: `/products/${product.slug}/${variant.slug}` },
                  { label: item.name },
                ]}
              />
            </div>

            <h1 className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl">
              {item.name}
            </h1>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
              <ProductMedia
                image={item.image}
                fit="contain"
                Icon={Icon}
                iconClassName="h-24 w-24"
                className="lg:col-span-7"
                priority
              />

              <div className="lg:col-span-5">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-red">{variant.name}</p>
                {item.description && (
                  <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{item.description}</p>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <AddToCartButton
                    productSlug={product.slug}
                    variantSlug={variant.slug}
                    signSlug={item.slug}
                    image={{ src: item.image.src, alt: item.image.alt }}
                    name={item.name}
                    groupName={variant.name}
                  />
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center border border-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-red hover:bg-red hover:text-paper"
                  >
                    Kërko Ofertë
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
