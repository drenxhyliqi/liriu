import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/sections/contact-form";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { company } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontakt | NSH LIRIU",
  description:
    "Na kontaktoni për një konsultim rreth projektit tuaj të radhës në sinjalistikë rrugore, inxhinieri trafiku ose infrastrukturë - Suharekë, Kosovë.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="h-px w-8 bg-red" />
            Kontakt
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.08}
              staggerFrom="first"
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            >
              Le ta fillojmë projektin.
            </VerticalCutReveal>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Na tregoni pak për projektin tuaj - sinjalistikë, inxhinieri
            trafiku apo infrastrukturë - dhe do t&apos;ju përgjigjemi sa më
            shpejt të jetë e mundur.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-line">
              <iframe
                title={`Lokacioni i ${company.name} në hartë`}
                src={company.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />

              <div className="pointer-events-none absolute left-0 top-0 bg-paper px-4 py-2.5">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Lokacioni</p>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-line bg-paper px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 bg-red" />
                  <p className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                    {company.location}
                  </p>
                </div>
                <Link
                  href={company.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pointer-events-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-red"
                >
                  Hap
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 -translate-y-px transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
