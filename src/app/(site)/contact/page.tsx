import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/contact-form";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { company } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontakt | NSH LIRIU",
  description:
    "Na kontaktoni për një konsultim rreth projektit tuaj të radhës në sinjalistikë rrugore, inxhinieri trafiku ose infrastrukturë - Suharekë, Kosovë.",
};

const gridBackground = {
  backgroundImage:
    "linear-gradient(to right, rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.06) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
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
            <div className="relative aspect-[4/5] overflow-hidden border border-line p-8" style={gridBackground}>
              <span aria-hidden className="absolute left-4 top-4 font-mono text-xs text-ink/25">+</span>
              <span aria-hidden className="absolute right-4 top-4 font-mono text-xs text-ink/25">+</span>
              <span aria-hidden className="absolute bottom-4 left-4 font-mono text-xs text-ink/25">+</span>
              <span aria-hidden className="absolute bottom-4 right-4 font-mono text-xs text-ink/25">+</span>

              <div className="relative flex h-full flex-col justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Lokacioni</p>

                <div className="flex flex-col items-start">
                  <span aria-hidden className="mb-4 h-3 w-3 shrink-0 bg-red" />
                  <p className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink md:text-3xl">
                    {company.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
