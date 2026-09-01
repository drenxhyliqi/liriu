import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CutFrame } from "@/components/ui/cut-frame";
import { Timeline } from "@/components/ui/timeline";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { company } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Rreth Nesh | NSH LIRIU",
  description:
    "Që nga 2012, NSH LIRIU është zgjeruar nga inxhinieria e trafikut te një ofertë e plotë në sinjalistikë rrugore dhe infrastrukturë - Suharekë, Kosovë.",
};

// The spine runs on a five-year cadence from founding to today.
//
// !! PLACEHOLDER COPY - NOT CLIENT-CONFIRMED !!
// Entries marked `placeholder: true` (2017, 2022) were written to fill the
// timeline until the client supplies the real history. They are deliberately
// free of checkable claims - no dates beyond the year itself, no project or
// client names, no headcount, revenue, certifications or contract wins - so
// nothing here can be false in a way that matters. They still describe the
// company, so they MUST be replaced or removed before launch.
// Tracked in HANDOFF.md under "Next steps". 2012, 2013 and "Sot" are
// confirmed (brief section 13) and must not be reworded to match.
const milestones: {
  year: string;
  title?: string;
  body?: string;
  placeholder?: boolean;
}[] = [
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
    year: "2017",
    title: "Konsolidim i proceseve",
    body: "Terreni dhe zyra afrohen: vlerësimi, planifikimi dhe mbikëqyrja fillojnë të trajtohen si një zinxhir i vetëm pune, jo si faza të shkëputura nga njëra-tjetra. Ekipet fillojnë të koordinohen që nga vizita e parë në terren, në mënyrë që çdo vendim teknik të kalojë nëpër të njëjtin sy kritik para se të arrijë në fazën e zbatimit.",
    placeholder: true,
  },
  {
    year: "2022",
    title: "Cikli i plotë i projektit",
    body: "Nga projektimi te instalimi dhe kontrolli përfundimtar - çdo hap i një ndërhyrjeje rrugore mbulohet brenda së njëjtës ekipe, me të njëjtin standard në çdo fazë. Kjo qasje e vazhdueshme e mban përgjegjësinë e cilësisë brenda një vendi të vetëm, në vend që të ndahet mes palëve të ndryshme përgjatë projektit.",
    placeholder: true,
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
        {/* Real project photography - road markings freshly laid by LIRIU. */}
        <CutFrame cut="bevel" className="mx-auto aspect-[12/5] w-full max-w-6xl">
          <Image
            src="/about/aboutus.png"
            alt="Sinjalistikë horizontale e sapo vendosur nga NSH LIRIU"
            fill
            priority
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="object-cover"
          />
        </CutFrame>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-12 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Historiku
          </p>

          {/* Text only - there is no approved project photography yet. The
              Timeline takes an optional `images` array per entry for when
              there is; see src/components/ui/timeline.tsx. */}
          <Timeline
            data={milestones.map((milestone) => ({
              title: milestone.year,
              placeholder: milestone.placeholder,
              content: milestone.title ? (
                <>
                  <p className="font-display text-3xl font-medium text-ink md:text-4xl">
                    {milestone.title}
                  </p>
                  <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted md:text-2xl">
                    {milestone.body}
                  </p>
                </>
              ) : null,
            }))}
          />
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
