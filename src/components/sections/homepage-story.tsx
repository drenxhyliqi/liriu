import Link from "next/link";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { services } from "@/lib/data/services";
import { company } from "@/lib/constants";

const yearsExperience = new Date().getFullYear() - company.founded;

const eyebrow = "text-xs font-medium uppercase tracking-[0.2em]";
const headline =
  "break-words font-display font-semibold uppercase leading-[0.9] tracking-tight text-[clamp(2.5rem,10vw,10rem)]";
const body = "max-w-[42ch] text-[clamp(1rem,2vw,1.4rem)] font-normal leading-relaxed";
const hrDark = "my-4 border-none border-t border-white/15 md:my-[2vw]";
const hrLight = "my-4 border-none border-t border-ink/15 md:my-[2vw]";
const blockNum = "text-sm font-bold text-red";
const blockTitle = "mt-2 font-display text-lg font-semibold";
const blockBody = "mt-2 text-[clamp(0.8rem,1.2vw,0.95rem)] leading-relaxed opacity-70";

// Everything after the Hero, told as one continuous scroll sequence
// instead of separately-styled sections - every panel rotates into view
// and pins while the next one reveals over it.
//
// Content is carried over from the previous section-by-section build
// (company intro, expertise, differentiators, process, safety statement,
// final CTA) with no invented facts, numbers, or claims. "Siguria Mbi Të
// Gjitha" was folded into the dedicated Siguria panel rather than also
// listed under Pse LIRIU, to avoid repeating the same claim twice in
// adjacent cards.
const reasons = [
  {
    number: "01",
    title: "Ekspertizë Teknike",
    body: "Njohuri e thelluar në inxhinieri trafiku, sinjalistikë dhe infrastrukturë rrugore.",
  },
  {
    number: "02",
    title: "Përvojë e Dëshmuar",
    body: "Operojmë në Kosovë që nga viti 2012, me evoluim të vazhdueshëm në shërbime.",
  },
  {
    number: "03",
    title: "Ekzekutim Profesional",
    body: "Nga planifikimi e deri te zbatimi në terren, me qasje të organizuar në çdo projekt.",
  },
  {
    number: "04",
    title: "Shërbim i Plotë",
    body: "Konsulencë, planifikim, furnizim, instalim dhe mbikëqyrje - nën një kulm.",
  },
];

const steps = [
  { number: "01", title: "Vlerësimi", body: "Kuptojmë vendndodhjen, kërkesat dhe objektivat e projektit." },
  { number: "02", title: "Planifikimi", body: "Zhvillojmë qasjen teknike dhe afatet e punës." },
  { number: "03", title: "Dizajni", body: "Krijojmë zgjidhjen e sinjalistikës, trafikut ose infrastrukturës." },
  { number: "04", title: "Ekzekutimi", body: "Ndërtim dhe instalim profesional në terren." },
  { number: "05", title: "Mbikëqyrja", body: "Kontroll cilësie dhe mbikëqyrje teknike gjatë zbatimit." },
  { number: "06", title: "Përfundimi", body: "Dorëzimi final dhe mbyllja e projektit." },
];

export function HomepageStory() {
  return (
    <FlowArt aria-label="LIRIU - kush jemi, çfarë ofrojmë dhe si punojmë">
      <FlowSection
        aria-label="Kush Jemi Ne"
        style={{ backgroundColor: "var(--color-ink)", color: "var(--color-paper)" }}
      >
        <p className={eyebrow}>01 - Kush Jemi Ne</p>
        <hr className={hrDark} />
        <h2 className={headline}>
          Që nga 2012,
          <br />
          ndërtojmë rrugë
          <br />
          më të sigurta.
        </h2>
        <hr className={hrDark} />
        <p className={body}>
          NSH LIRIU është një kompani kosovare e specializuar në inxhinieri
          trafiku, sinjalistikë rrugore dhe infrastrukturë. Nga ekspertiza
          fillestare në inxhinieri trafiku dhe ekspertizë aksidentesh, që
          nga viti 2013 kompania u zgjerua në sinjalistikë horizontale dhe
          vertikale - duke u bërë sot një partner i plotë për institucione,
          komuna, kompani ndërtimi dhe kontraktorë privatë në të gjithë
          Kosovën.
        </p>
        <hr className={hrDark} />
        <div className="mt-auto flex flex-wrap gap-[4vw]">
          <div>
            <p className="font-display text-4xl font-semibold md:text-5xl">{company.founded}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.1em] opacity-60">Themeluar</p>
          </div>
          <div>
            <p className="font-display text-4xl font-semibold md:text-5xl">{yearsExperience}+</p>
            <p className="mt-2 text-xs uppercase tracking-[0.1em] opacity-60">Vite Përvojë</p>
          </div>
        </div>
      </FlowSection>

      <FlowSection
        aria-label="Ekspertiza Jonë"
        style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink)" }}
      >
        <p className={eyebrow}>02 - Ekspertiza Jonë</p>
        <hr className={hrLight} />
        <h2 className={headline}>Ekspertiza Jonë.</h2>
        <hr className={hrLight} />
        <p className={`${body} text-muted`}>
          Nga sinjalistika deri te inxhinieria e trafikut - çdo shërbim
          mbulon një pjesë të infrastrukturës rrugore.
        </p>
        <hr className={hrLight} />
        <div className="mt-auto grid grid-cols-1 gap-x-[3vw] gap-y-7 sm:grid-cols-2 md:grid-cols-4">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="group block">
              <p className={blockNum}>{service.number}</p>
              <p className="mt-2 font-display text-base font-medium leading-snug transition-colors group-hover:text-red sm:text-lg">
                {service.name}
              </p>
            </Link>
          ))}
        </div>
      </FlowSection>

      <FlowSection
        aria-label="Siguria"
        style={{ backgroundColor: "var(--color-red)", color: "var(--color-paper)" }}
      >
        <p className={eyebrow}>03 - Siguria</p>
        <hr className="my-4 border-none border-t border-white/25 md:my-[2vw]" />
        <h2 className={headline}>
          Siguria
          <br />
          s&apos;është
          <br />
          opsion.
        </h2>
        <hr className="my-4 border-none border-t border-white/25 md:my-[2vw]" />
        <p className={body}>
          Sinjalistika dhe infrastruktura që projektojmë mbrojnë jetë çdo
          ditë në rrugët e Kosovës. E trajtojmë këtë përgjegjësi me
          seriozitetin që meriton.
        </p>
        <hr className="my-4 border-none border-t border-white/25 md:my-[2vw]" />
        <div className="mt-auto flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">Sinjalistikë Horizontale</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-80">
              Vija, kalime dhe shenja që udhëzojnë çdo drejtim.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">Sinjalistikë Vertikale</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-80">
              Shenja të qarta dhe të qëndrueshme në çdo kusht.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">Inxhinieri Trafiku</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-80">
              Analizë dhe zgjidhje për një qarkullim më të sigurt.
            </p>
          </div>
        </div>
      </FlowSection>

      <FlowSection
        aria-label="Pse LIRIU"
        style={{ backgroundColor: "var(--color-ink)", color: "var(--color-paper)" }}
      >
        <p className={eyebrow}>04 - Pse LIRIU</p>
        <hr className={hrDark} />
        <h2 className={headline}>Pse LIRIU.</h2>
        <hr className={hrDark} />
        <div className="mt-auto grid grid-cols-1 gap-x-[3vw] gap-y-8 sm:grid-cols-2 md:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.number}>
              <p className={blockNum}>{reason.number}</p>
              <p className={blockTitle}>{reason.title}</p>
              <p className={blockBody}>{reason.body}</p>
            </div>
          ))}
        </div>
      </FlowSection>

      <FlowSection
        aria-label="Si Punojmë"
        style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink)" }}
      >
        <p className={eyebrow}>05 - Si Punojmë</p>
        <hr className={hrLight} />
        <h2 className={headline}>Procesi Ynë.</h2>
        <hr className={hrLight} />
        <div className="mt-auto grid grid-cols-1 gap-x-[3vw] gap-y-8 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <p className={blockNum}>{step.number}</p>
              <p className={blockTitle}>{step.title}</p>
              <p className={`${blockBody} text-muted opacity-100`}>{step.body}</p>
            </div>
          ))}
        </div>
      </FlowSection>

      <FlowSection
        aria-label="Fillo Projektin"
        style={{ backgroundColor: "var(--color-ink)", color: "var(--color-paper)" }}
      >
        <p className={eyebrow}>06 - Filloni Projektin</p>
        <hr className={hrDark} />
        <h2 className={headline}>
          Gati për
          <br />
          rrugë më
          <br />
          të sigurta?
        </h2>
        <hr className={hrDark} />
        <div className="mt-auto flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className={body}>
            Na kontaktoni për një konsultim rreth projektit tuaj të radhës -
            sinjalistikë, inxhinieri trafiku ose infrastrukturë rrugore.
          </p>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center bg-red px-7 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
          >
            Kërko një Konsultim
          </Link>
        </div>
      </FlowSection>
    </FlowArt>
  );
}
