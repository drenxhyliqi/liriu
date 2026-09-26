import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Signpost } from "lucide-react";
import { ProductMedia } from "@/components/sections/product-media";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { productIcons } from "@/components/sections/product-icons";
import { CardGrid } from "@/components/sections/card-grid";
import { AddToCartButton } from "@/components/sections/add-to-cart-button";
import { CategorySidebar } from "@/components/sections/category-sidebar";
import {
  getProductBySlug,
  getVariant,
  getVariantsByProduct,
  productGroups,
  productVariants,
} from "@/lib/data/products";

export function generateStaticParams() {
  return productVariants.map((variant) => ({
    slug: variant.productSlug,
    variant: variant.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]/[variant]">): Promise<Metadata> {
  const { slug, variant: variantSlug } = await params;
  const variant = getVariant(slug, variantSlug);

  return {
    title: variant ? `${variant.name} | NSH LIRIU` : "Produkti | NSH LIRIU",
  };
}

export default async function ProductVariantPage({
  params,
}: PageProps<"/products/[slug]/[variant]">) {
  const { slug, variant: variantSlug } = await params;
  const product = getProductBySlug(slug);
  const variant = product ? getVariant(slug, variantSlug) : undefined;

  if (!product || !variant) notFound();

  const group = productGroups.find((g) => g.slug === product.groupSlug);
  const Icon = productIcons[product.slug] ?? Signpost;

  if (variant.items) {
    const others = getVariantsByProduct(product.slug).filter((v) => v.slug !== variant.slug);
    return (
      <main className="flex flex-1 flex-col">
        <section className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
            <CategorySidebar activeGroupSlug={group?.slug ?? null} activeProductSlug={product.slug} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-4 border border-line bg-surface px-6 py-5">
                <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  {variant.name}
                </h1>
              </div>

              <div className="mt-5">
                <Breadcrumb
                  items={[
                    { label: "Produktet", href: "/products" },
                    ...(group ? [{ label: group.name, href: `/products?category=${group.slug}` }] : []),
                    { label: product.name, href: `/products/${product.slug}` },
                    { label: variant.name },
                  ]}
                />
              </div>

              {variant.description && (
                <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-muted">{variant.description}</p>
              )}

              {variant.items.length > 0 ? (
                <CardGrid
                  iconKey={product.slug}
                  searchable
                  cards={variant.items.map((item) => ({
                    key: item.slug,
                    href: `/products/${product.slug}/${variant.slug}/${item.slug}`,
                    name: item.name,
                    keywords: item.keywords,
                    image: item.image,
                    cart: {
                      productSlug: product.slug,
                      variantSlug: variant.slug,
                      signSlug: item.slug,
                      groupName: variant.name,
                    },
                  }))}
                />
              ) : (
                <div className="mt-10 border border-line p-8 md:p-12">
                  <p className="font-display text-lg font-medium text-ink">Produktet po përgatiten.</p>
                  <p className="mt-3 max-w-xl leading-relaxed text-muted">
                    Na kontaktoni drejtpërdrejt për shenjat e disponueshme në këtë kategori.
                  </p>
                </div>
              )}

              {others.length > 0 && (
                <div className="mt-16 border-t border-line pt-10">
                  <p className="mb-6 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                    Nënkategori të Tjera në {product.name}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {others.map((other) => (
                      <Link
                        key={other.slug}
                        href={`/products/${product.slug}/${other.slug}`}
                        className="border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:border-ink"
                      >
                        {other.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  const siblingVariants = getVariantsByProduct(product.slug).filter((v) => v.slug !== variant.slug);

  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
          <CategorySidebar activeGroupSlug={group?.slug ?? null} activeProductSlug={product.slug} />

          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
              {product.name}
            </Link>

            <div className="mt-5">
              <Breadcrumb
                items={[
                  { label: "Produktet", href: "/products" },
                  ...(group ? [{ label: group.name, href: `/products?category=${group.slug}` }] : []),
                  { label: product.name, href: `/products/${product.slug}` },
                  { label: variant.name },
                ]}
              />
            </div>

            <h1 className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl">
              {variant.name}
            </h1>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
              <ProductMedia
                image={variant.image}
                fit="contain"
                Icon={Icon}
                iconClassName="h-24 w-24"
                className="lg:col-span-7"
                priority
              />

              <div className="lg:col-span-5">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-red">{product.name}</p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                  {variant.description ?? product.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <AddToCartButton
                    productSlug={product.slug}
                    variantSlug={variant.slug}
                    image={variant.image && { src: variant.image.src, alt: variant.image.alt }}
                    name={variant.name}
                    groupName={product.name}
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

            {siblingVariants.length > 0 && (
              <div className="mt-16 border-t border-line pt-10">
                <p className="mb-6 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  Dizajne të Tjera në {product.name}
                </p>
                <div className="flex flex-wrap gap-3">
                  {siblingVariants.map((sibling) => (
                    <Link
                      key={sibling.slug}
                      href={`/products/${product.slug}/${sibling.slug}`}
                      className="border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:border-ink"
                    >
                      {sibling.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Kërkoni një produkt specifik?
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Na kontaktoni me kërkesën tuaj - do t&apos;ju përgatisim një
              ofertë të përshtatur për projektin tuaj.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center bg-red px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
          >
            Na Kontaktoni
          </Link>
        </div>
      </section>
    </main>
  );
}
