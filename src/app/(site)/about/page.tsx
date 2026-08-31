import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { company } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Rreth Nesh | NSH LIRIU",
  description:
    "Që nga 2012, NSH LIRIU është zgjeruar nga inxhinieria e trafikut te një ofertë e plotë në sinjalistikë rrugore dhe infrastrukturë - Suharekë, Kosovë.",
};

// Only verified milestones - see brief section 13: add further entries
// only once the client confirms them, never invented.
const milestones = [
  {
    year: "2012",
    title: "Themelohet kompania",
    body: "NSH LIRIU fillon veprimtarinë e saj e fokusuar në inxhinieri trafiku, ekspertizë trafiku dhe ekspertizë aksidentesh.",
  },
  {
    year: "2013",
    title: "Zgjerim në sinjalistikë",
    body: "Kompania zgjerohet në sinjalistikë rrugore - horizontale dhe vertikale - duke ndërtuar bazën e shërbimeve që ofron edhe sot.",
  },
  {
    year: "Sot",
    title: "Partner i plotë",
    body: "Ofrojmë shërbime të plota - nga sinjalistika e infrastruktura, deri te konsulenca e mbikëqyrja - për institucione, komuna, kompani ndërtimi dhe kontraktorë privatë.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Reusable notched-corner clip path, applied to the photo below via
          clip-path: url(#about-clip). Real project photography - road
          markings freshly laid by LIRIU. */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id="about-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z" />
          </clipPath>
        </defs>
      </svg>

      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="h-px w-8 bg-red" />
            Rreth Nesh
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.08}
              staggerFrom="first"
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            >
              Nga ekspertiza e trafikut te infrastruktura e plotë rrugore.
            </VerticalCutReveal>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            NSH LIRIU është një kompani kosovare me seli në Suharekë, e
            specializuar në inxhinieri trafiku, sinjalistikë rrugore dhe
            infrastrukturë. Që nga themelimi, kompania është zgjeruar
            vazhdimisht - duke ruajtur të njëjtën qasje: precizitet
            inxhinierik në çdo projekt.
          </p>
        </div>
      </section>

      <section className="px-6 pt-16 md:px-10 md:pt-20">
        <div className="relative mx-auto aspect-[12/5] w-full max-w-6xl bg-ink" style={{ clipPath: "url(#about-clip)" }}>
          <Image
            src="/about/aboutus.png"
            alt="Sinjalistikë horizontale e sapo vendosur nga NSH LIRIU"
            fill
            priority
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-12 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Historiku
          </p>

          <ol className="relative flex flex-col gap-14 border-l border-line pl-8 sm:pl-10">
            {milestones.map((milestone) => (
              <li key={milestone.year} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[calc(2rem+5px)] top-1.5 h-[9px] w-[9px] shrink-0 bg-red sm:-left-[calc(2.5rem+5px)]"
                />
                <p className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {milestone.year}
                </p>
                <p className="mt-2 font-display text-lg font-medium text-ink">
                  {milestone.title}
                </p>
                <p className="mt-2 max-w-xl leading-relaxed text-muted">
                  {milestone.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              &ldquo;{company.slogan.sq}&rdquo;
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Shikoni shërbimet tona ose na kontaktoni drejtpërdrejt për
              projektin tuaj të radhës.
            </p>
          </div>
          <div className="flex shrink-0 gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center border border-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-red hover:bg-red hover:text-paper"
            >
              Shërbimet
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-red px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
            >
              Na Kontaktoni
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
