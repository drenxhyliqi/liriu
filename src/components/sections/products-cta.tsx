import Link from "next/link";

export function ProductsCta() {
  return (
    <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Kërkoni një produkt specifik?
          </h2>
          <p className="mt-3 max-w-md text-muted">
            Na kontaktoni me kërkesën tuaj - do t&apos;ju përgatisim një ofertë të përshtatur për projektin tuaj.
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
  );
}

export function CatalogTitleBar({ title, as: Tag = "h2" }: { title: string; as?: "h1" | "h2" }) {
  return (
    <div className="border border-line bg-surface px-6 py-5">
      <Tag className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</Tag>
    </div>
  );
}
