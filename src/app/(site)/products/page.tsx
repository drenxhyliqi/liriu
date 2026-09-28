import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CardGrid } from "@/components/sections/card-grid";
import { CategorySidebar } from "@/components/sections/category-sidebar";
import { CatalogTitleBar, ProductsCta } from "@/components/sections/products-cta";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Produktet | NSH LIRIU",
  description:
    "Sinjalistikë vertikale, sinjalistikë e ndriçuar, siguri rrugore dhe mobilje rrugore - produktet dhe materialet që LIRIU furnizon dhe instalon.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  // Old links used ?category=<slug>.
  const { category } = await searchParams;
  if (typeof category === "string" && category) redirect(`/products/${category}`);

  const catalog = await getCatalog();
  const roots = catalog.roots();
  const cards = roots.flatMap((root) =>
    catalog.children(root.id).map((c) => ({
      key: c.slug,
      href: `/products/${c.slug}`,
      name: c.name,
      image: c.imageUrl ? { src: c.imageUrl, fit: c.imageFit } : null,
      description: c.description,
      tag: root.name,
    })),
  );
  const searchPool = roots.flatMap((root) =>
    catalog.productsUnder(root).map(({ product, category: owner }) => ({
      key: product.slug,
      href: `/products/${product.slug}`,
      name: product.name,
      keywords: product.keywords,
      image: product.imageUrl ? { src: product.imageUrl, fit: product.imageFit } : null,
      tag: owner.name,
      cart: { productSlug: product.slug, groupName: owner.name },
    })),
  );

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="h-px w-8 bg-red" />
            Produktet
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.08}
              staggerFrom="first"
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            >
              Materiale dhe pajisje për rrugë më të sigurta.
            </VerticalCutReveal>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Nga sinjalistika vertikale te mobilja rrugore - furnizojmë dhe instalojmë materialet që përdorim edhe
            vetë në projektet tona.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl lg:flex lg:items-start lg:gap-10">
          <CategorySidebar tree={catalog.tree()} activeGroupSlug={null} />
          <div className="min-w-0 flex-1">
            <CatalogTitleBar title="Të Gjitha Produktet" />
            <div className="mt-5">
              <Breadcrumb items={[{ label: "Produktet" }]} />
            </div>
            {cards.length > 0 ? (
              <CardGrid cards={cards} iconKey="" searchable searchPool={searchPool} alwaysShowTags />
            ) : (
              <p className="mt-10 border border-line p-8 text-muted">Katalogu po përditësohet.</p>
            )}
          </div>
        </div>
      </section>

      <ProductsCta />
    </main>
  );
}
