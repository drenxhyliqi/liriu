import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { AddToCartButton } from "@/components/sections/add-to-cart-button";
import { CategorySidebar } from "@/components/sections/category-sidebar";
import {
  getProductBySlug,
  getVariantsByProduct,
  productGroups,
  products,
} from "@/lib/data/products";

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
  const Icon = productIcons[product.slug] ?? Signpost;
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
              <span className="inline-flex items-center gap-2 border border-line bg-paper px-4 py-2 text-[13px] font-medium uppercase tracking-[0.06em] text-ink">
                Oferta Jonë
                <ChevronDown aria-hidden className="h-3.5 w-3.5 text-muted" />
              </span>
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
              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {variants.map((variant) => (
                  <div key={variant.slug}>
                    <Link href={`/products/${product.slug}/${variant.slug}`} className="group block">
                      <div
                        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-line bg-paper shadow-sm"
                        style={gridBackground}
                      >
                        <Icon aria-hidden className="h-14 w-14 text-ink/15" strokeWidth={1} />
                        <ArrowUpRight
                          aria-hidden
                          className="absolute right-4 top-4 h-5 w-5 -translate-x-1 translate-y-1 text-red opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                        />
                      </div>
                    </Link>
                    <div className="mt-5 flex items-start justify-between gap-3">
                      <Link href={`/products/${product.slug}/${variant.slug}`} className="group min-w-0">
                        <h3 className="truncate font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-red">
                          {variant.name}
                        </h3>
                      </Link>
                      <AddToCartButton
                        variant="compact"
                        productSlug={product.slug}
                        variantSlug={variant.slug}
                        name={variant.name}
                        groupName={product.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
