import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, Signpost } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AddToCartButton } from "@/components/sections/add-to-cart-button";
import { CardGrid, type GridCard } from "@/components/sections/card-grid";
import { CategorySidebar } from "@/components/sections/category-sidebar";
import { productIcons } from "@/components/sections/product-icons";
import { ProductMedia } from "@/components/sections/product-media";
import { CatalogTitleBar, ProductsCta } from "@/components/sections/products-cta";
import { type Catalog, getCatalog } from "@/lib/catalog";
import type { CatalogCategory, CatalogProduct } from "@/types/catalog";

// Categories with at least this many products underneath get a search box.
const SEARCH_THRESHOLD = 10;

type Resolved =
  | { catalog: Catalog; category: CatalogCategory; product?: undefined }
  | { catalog: Catalog; product: CatalogProduct; category?: undefined };

async function resolve(slugs: string[]): Promise<Resolved> {
  // Categories and products share one slug namespace, so every page lives at
  // /products/[slug]. Older nested links (/products/a/b/c) redirect to the last segment.
  if (slugs.length > 1) permanentRedirect(`/products/${slugs[slugs.length - 1]}`);
  const slug = decodeURIComponent(slugs[0]);
  const catalog = await getCatalog();
  const category = catalog.category(slug);
  if (category) return { catalog, category };
  const product = catalog.product(slug);
  if (product) return { catalog, product };
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/products/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await resolve(slug);
  const item = found.category ?? found.product;
  return {
    title: `${item.name} | NSH LIRIU`,
    description: item.description || undefined,
  };
}

export default async function CatalogPage({ params }: PageProps<"/products/[...slug]">) {
  const { slug } = await params;
  const found = await resolve(slug);
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 py-16 md:px-10 md:py-24">
        {found.category ? (
          <CategoryView catalog={found.catalog} category={found.category} />
        ) : (
          <ProductView catalog={found.catalog} product={found.product} />
        )}
      </section>
      <ProductsCta />
    </main>
  );
}

function crumbs(catalog: Catalog, category: CatalogCategory, linkLast: boolean) {
  const chain = catalog.path(category);
  return [
    { label: "Produktet", href: "/products" },
    ...chain.map((c, i) => ({
      label: c.name,
      href: i < chain.length - 1 || linkLast ? `/products/${c.slug}` : undefined,
    })),
  ];
}

function Sidebar({ catalog, category }: { catalog: Catalog; category: CatalogCategory }) {
  const [root, second] = catalog.path(category);
  return (
    <CategorySidebar
      key={root.slug}
      tree={catalog.tree()}
      activeGroupSlug={root.slug}
      activeProductSlug={second?.slug}
    />
  );
}

function productCard(product: CatalogProduct, owner: CatalogCategory, tag?: string): GridCard {
  return {
    key: product.slug,
    href: `/products/${product.slug}`,
    name: product.name,
    keywords: product.keywords,
    image: product.imageUrl ? { src: product.imageUrl, fit: product.imageFit } : null,
    tag,
    cart: { productSlug: product.slug, groupName: owner.name },
  };
}

function CategoryView({ catalog, category }: { catalog: Catalog; category: CatalogCategory }) {
  const chain = catalog.path(category);
  const isRoot = chain.length === 1;
  const iconKey = (chain[1] ?? chain[0]).slug;

  const cards: GridCard[] = [
    ...catalog.children(category.id).map((child) => ({
      key: `c-${child.slug}`,
      href: `/products/${child.slug}`,
      name: child.name,
      image: child.imageUrl ? { src: child.imageUrl, fit: child.imageFit } : null,
      description: isRoot ? child.description : undefined,
    })),
    ...catalog.productsIn(category.id).map((p) => productCard(p, category)),
  ];
  const under = catalog.productsUnder(category);
  const searchPool = under.map(({ product, category: owner }) => productCard(product, owner, owner.name));

  const siblings = catalog.children(category.parentId).filter((c) => c.id !== category.id);
  const parent = chain.length > 1 ? chain[chain.length - 2] : null;

  return (
    <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
      <Sidebar catalog={catalog} category={category} />

      <div className="min-w-0 flex-1">
        <CatalogTitleBar title={category.name} as="h1" />
        <div className="mt-5">
          <Breadcrumb items={crumbs(catalog, category, false)} />
        </div>
        {category.description && (
          <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-muted">
            {category.description}
          </p>
        )}

        {cards.length > 0 ? (
          <CardGrid
            cards={cards}
            iconKey={iconKey}
            searchable={under.length >= SEARCH_THRESHOLD}
            searchPool={searchPool}
          />
        ) : (
          <div className="mt-10 border border-line p-8 md:p-12">
            <p className="font-display text-lg font-medium text-ink">Produktet po përgatiten.</p>
            <p className="mt-3 max-w-xl leading-relaxed text-muted">
              Na kontaktoni drejtpërdrejt për produktet e disponueshme në këtë kategori.
            </p>
          </div>
        )}

        {siblings.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {parent ? `Kategori të tjera në ${parent.name}` : "Kategori të tjera"}
            </p>
            <div className="flex flex-wrap gap-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/products/${s.slug}`}
                  className="border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:border-ink"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductView({ catalog, product }: { catalog: Catalog; product: CatalogProduct }) {
  const home = catalog.primaryCategory(product);
  const chain = home ? catalog.path(home) : [];
  const Icon = productIcons[(chain[1] ?? chain[0])?.slug ?? ""] ?? Signpost;
  const related = home
    ? catalog
        .productsIn(home.id)
        .filter((p) => p.id !== product.id)
        .slice(0, 6)
        .map((p) => productCard(p, home))
    : [];

  return (
    <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
      {home ? (
        <Sidebar catalog={catalog} category={home} />
      ) : (
        <CategorySidebar tree={catalog.tree()} activeGroupSlug={null} />
      )}

      <div className="min-w-0 flex-1">
        {home && (
          <Link
            href={`/products/${home.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            {home.name}
          </Link>
        )}

        <div className="mt-5">
          <Breadcrumb
            items={[
              ...(home ? crumbs(catalog, home, true) : [{ label: "Produktet", href: "/products" }]),
              { label: product.name },
            ]}
          />
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl">
          {product.name}
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <ProductMedia
            src={product.imageUrl}
            alt={product.name}
            fit={product.imageFit}
            Icon={Icon}
            iconClassName="h-24 w-24"
            className="lg:col-span-7"
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
          />

          <div className="lg:col-span-5">
            {home && <p className="text-xs font-medium uppercase tracking-[0.1em] text-red">{home.name}</p>}
            {product.description && (
              <p className="mt-4 max-w-md whitespace-pre-line text-base leading-relaxed text-muted">
                {product.description}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <AddToCartButton
                productSlug={product.slug}
                image={product.imageUrl ? { src: product.imageUrl, alt: product.name } : undefined}
                name={product.name}
                groupName={home?.name ?? ""}
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

        {related.length > 0 && home && (
          <div className="mt-16 border-t border-line pt-10">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Më shumë në {home.name}</p>
            <CardGrid cards={related} iconKey={(chain[1] ?? chain[0]).slug} />
          </div>
        )}
      </div>
    </div>
  );
}
