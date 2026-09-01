"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack";
import { services } from "@/lib/data/services";
import type { ServiceSlug } from "@/types";

// !! PLACEHOLDER COPY - NOT CLIENT-CONFIRMED !!
// One-line descriptions for the cards below. Each is a generic, industry-
// standard description of what the named service category covers - no
// LIRIU-specific claims, numbers, certifications, or project history - so
// nothing here can be false in a way that matters. Written to fill the
// cards until the client supplies real copy for `Service.shortDescription`
// (see src/types/index.ts). Kept out of src/lib/data/services.ts on
// purpose - that file's README explicitly disallows placeholder entries.
// Tracked in HANDOFF.md under "Next steps"; replace or remove per entry as
// real copy arrives, same as the About page's placeholder timeline years.
const PLACEHOLDER_DESCRIPTIONS: Record<ServiceSlug, string> = {
  "horizontal-signage":
    "Vijëzimi i rrugëve, kalimet e këmbësorëve dhe çdo shenjë tjetër e pikturuar mbi asfalt - e menduar për dukshmëri dhe qëndrueshmëri në kohë.",
  "vertical-signage":
    "Shenja rrugore, tabela informuese dhe elemente të tjera vertikale - të prodhuara dhe të vendosura sipas standardeve të sigurisë rrugore.",
  "traffic-engineering":
    "Analizë e fluksit të trafikut dhe projektim i zgjidhjeve që përmirësojnë qarkullimin dhe sigurinë në kryqëzime e segmente rrugore.",
  "construction-installation":
    "Zbatim në terren i çdo elementi të sinjalistikës dhe infrastrukturës - nga përgatitja e sipërfaqes deri te instalimi final.",
  "consulting-supervision":
    "Këshillim teknik në fazën e planifikimit dhe mbikëqyrje e vazhdueshme e punimeve, deri në dorëzimin e projektit.",
  "traffic-accident-expertise":
    "Vlerësim teknik i vendngjarjeve të aksidenteve, me fokus te faktorët rrugorë dhe të sinjalistikës që ndikojnë në siguri.",
  "illuminated-signage-portals":
    "Sisteme sinjalistike të ndriçuara dhe portale mbi rrugë - për dukshmëri të shtuar në kushte me vizibilitet të kufizuar.",
};

/**
 * Replaces the old flat list of services with a sticky card stack: each
 * card pins a little lower than the one before it as the page scrolls, so
 * the deck piles up card by card. The stacking itself is the "on scroll"
 * effect - see src/components/ui/cards-stack.tsx - so it needs no
 * IntersectionObserver/rAF-driven reveal on top of it.
 *
 * `index` starts at 8 (not 0) so the first card's sticky `top` clears the
 * fixed navbar (h-16 / md:h-20) rather than pinning underneath it; each
 * subsequent card lands 14px lower, which is enough to read as a stack
 * without eating too much of the viewport per card.
 *
 * ContainerScroll gets no explicit height: `position: sticky` still
 * occupies its normal flow box, so stacking through all N cards already
 * takes exactly N cards' worth of scroll - no vh math to keep in sync with
 * card count or copy length. The trailing padding is only a short dwell
 * on the last card before the next section takes over, not what drives
 * the stack - keep it small, a big value just adds blank scroll at the
 * end with nothing left to reveal.
 */
export function ServicesStack() {
  return (
    <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-16">
        <div className="md:sticky md:top-32 md:h-fit md:self-start">
          <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.14em] text-red">
            <span aria-hidden className="h-px w-8 bg-red" />
            Çdo Shërbim, Në Detaje
          </p>
          <p className="mt-6 max-w-sm font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
            Shtatë fusha, secila e trajtuar me të njëjtin standard - nga
            vlerësimi fillestar deri te mbikëqyrja finale e projektit.
          </p>
        </div>

        <ContainerScroll className="space-y-6 pb-8 md:space-y-8 md:pb-12">
          {services.map((service, index) => (
            <CardSticky
              key={service.slug}
              index={index + 8}
              incrementY={14}
              data-placeholder="true"
              className="border border-line bg-paper p-8 shadow-sm md:p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="font-display text-sm text-red">{service.number}</span>
                <Link
                  href={`/services/${service.slug}`}
                  aria-label={`Shiko ${service.name}`}
                  className="group -m-2 shrink-0 p-2 text-ink transition-colors hover:text-red"
                >
                  <ArrowUpRight
                    aria-hidden
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>

              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                {service.name}
              </h3>
              <p className="mt-4 max-w-lg leading-relaxed text-muted">
                {PLACEHOLDER_DESCRIPTIONS[service.slug]}
              </p>
            </CardSticky>
          ))}
        </ContainerScroll>
      </div>
    </section>
  );
}
