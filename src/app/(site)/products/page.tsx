import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ProductsGrid } from "@/components/sections/products-grid";

export const metadata: Metadata = {
  title: "Produktet | NSH LIRIU",
  description:
    "Sinjalistikë vertikale, sinjalistikë e ndriçuar, siguri rrugore dhe mobilje rrugore - produktet dhe materialet që LIRIU furnizon dhe instalon.",
};

export default function ProductsPage() {
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
            Nga sinjalistika vertikale te mobilja rrugore - furnizojmë dhe
            instalojmë materialet që përdorim edhe vetë në projektet tona.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={null}>
            <ProductsGrid />
          </Suspense>
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
