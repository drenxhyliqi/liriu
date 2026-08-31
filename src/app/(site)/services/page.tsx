import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Shërbimet | NSH LIRIU",
  description:
    "Sinjalistikë horizontale dhe vertikale, inxhinieri trafiku, ndërtim & instalim, konsulencë e mbikëqyrje, ekspertizë aksidentesh dhe sinjalistikë e ndriçuar - Suharekë, Kosovë.",
};

export default function ServicesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="h-px w-8 bg-red" />
            Shërbimet
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.08}
              staggerFrom="first"
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            >
              Shtatë fusha ekspertize, një ekip i vetëm.
            </VerticalCutReveal>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Nga sinjalistika deri te inxhinieria e trafikut - çdo shërbim
            mbulon një pjesë të infrastrukturës rrugore, të ofruar nga
            planifikimi deri te mbikëqyrja finale.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10">
        <ul className="mx-auto max-w-7xl border-t border-line">
          {services.map((service) => (
            <li key={service.slug} className="border-b border-line">
              <Link
                href={`/services/${service.slug}`}
                className="group flex items-center gap-6 py-8 transition-colors hover:bg-surface md:py-10"
              >
                <span className="w-12 shrink-0 font-display text-sm text-red md:w-16 md:text-base">
                  {service.number}
                </span>
                <span className="flex-1 font-display text-2xl font-medium tracking-tight text-ink transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl md:text-4xl">
                  {service.name}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-6 w-6 shrink-0 -translate-x-2 text-red opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Nuk e gjetët atë që kërkonit?
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Na kontaktoni drejtpërdrejt - do t&apos;ju ndihmojmë të gjejmë
              zgjidhjen e duhur për projektin tuaj.
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
