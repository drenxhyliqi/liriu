import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardGrid } from "@/components/sections/card-grid";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CategorySidebar } from "@/components/sections/category-sidebar";
import {
  getProductBySlug,
  getVariantsByProduct,
  productGroups,
  products,
} from "@/lib/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return {
    title: product ? `${product.name} | NSH LIRIU` : "Produkti | NSH LIRIU",
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const group = productGroups.find((g) => g.slug === product.groupSlug);
  const variants = getVariantsByProduct(product.slug);
  const hasSigns = variants.some((variant) => variant.items?.length);
  const otherProducts = group
    ? products.filter((p) => p.groupSlug === group.slug && p.slug !== product.slug)
    : [];

  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
          <CategorySidebar activeGroupSlug={group?.slug ?? null} activeProductSlug={product.slug} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-4 border border-line bg-surface px-6 py-5">
              <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                {product.name}
              </h1>
            </div>

            <div className="mt-5">
              <Breadcrumb
                items={[
                  { label: "Produktet", href: "/products" },
                  ...(group ? [{ label: group.name, href: `/products?category=${group.slug}` }] : []),
                  { label: product.name },
                ]}
              />
            </div>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              {product.description}
            </p>

            {variants.length > 0 ? (
              <CardGrid
                iconKey={product.slug}
                searchable={hasSigns}
                searchPool={variants.flatMap((variant) =>
                  (variant.items ?? []).map((item) => ({
                    key: `${variant.slug}:${item.slug}`,
                    href: `/products/${product.slug}/${variant.slug}/${item.slug}`,
                    name: item.name,
                    keywords: item.keywords,
                    image: item.image,
                    tag: variant.name,
                    cart: {
                      productSlug: product.slug,
                      variantSlug: variant.slug,
                      signSlug: item.slug,
                      groupName: variant.name,
                    },
                  })),
                )}
                cards={variants.map((variant) => ({
                  key: variant.slug,
                  href: `/products/${product.slug}/${variant.slug}`,
                  name: variant.name,
                  image: variant.image,
                  cart: variant.items
                    ? undefined
                    : { productSlug: product.slug, variantSlug: variant.slug, groupName: product.name },
                }))}
              />
            ) : (
              <div className="mt-10 border border-line p-8 md:p-12">
                <p className="font-display text-lg font-medium text-ink">
                  Dizajnet specifike po përgatiten.
                </p>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">
                  Na kontaktoni drejtpërdrejt për variantet e disponueshme të
                  këtij produkti.
                </p>
              </div>
            )}

            {otherProducts.length > 0 && (
              <div className="mt-16 border-t border-line pt-10">
                <p className="mb-6 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  Produkte të Tjera në {group?.name}
                </p>
                <div className="flex flex-wrap gap-3">
                  {otherProducts.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/products/${other.slug}`}
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
