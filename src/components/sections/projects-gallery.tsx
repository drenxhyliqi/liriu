"use client";

import Image from "next/image";
import {
  BentoCell,
  BentoGrid,
  ContainerScale,
  ContainerScroll,
} from "@/components/ui/hero-gallery-scroll";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

// Real project photography, supplied directly (not sourced from
// src/lib/data/projects.ts, which stays empty until full case-study
// metadata - client, location, year - is confirmed; see that file's
// header and HANDOFF.md). Alt text below describes only what is visible
// in each photo - no client/location/date claims.
//
// Ordered and cropped for the 5-cell bento layout: cell 1 (large) and
// cells 2-3 (side, md+ only) favour the portrait shots; cells 4-5
// (bottom row) favour the landscape ones.
const GALLERY_IMAGES = [
  {
    src: "/projects/pedestrian-crossing-decorative.jpg",
    alt: "Kalim këmbësorësh me vizatim dekorativ kuq e bardhë në një sheshe urban",
  },
  {
    src: "/projects/road-marking-aerial.jpg",
    alt: "Pamje ajrore e sinjalistikës horizontale të sapo vendosur në një rrugë hyrëse, me vende parkimi dhe kalim këmbësorësh",
  },
  {
    src: "/projects/parking-garage-wall-guard.jpg",
    alt: "Brez mbrojtës i verdhë e i zi i pikturuar përgjatë mureve dhe kolonave në një garazh nëntokësor",
  },
  {
    src: "/projects/warehouse-floor-marking.jpg",
    alt: "Vijëzim i dyshemesë në një hapësirë industriale, me korsi të shënuara për lëvizje të brendshme",
  },
  {
    src: "/projects/parking-garage-bay-numbers.jpg",
    alt: "Vende parkimi të numëruara dhe të vijëzuara në një garazh të brendshëm, me mbrojtëse cepash të verdha e të zeza",
  },
] as const;

/**
 * Scroll-driven hero for the Projects page: real photography of completed
 * work, no invented case-study details. See src/components/ui/
 * hero-gallery-scroll.tsx for the mechanics.
 */
export function ProjectsGallery() {
  return (
    <ContainerScroll className="h-[300vh] bg-ink">
      <BentoGrid className="sticky left-0 top-0 z-0 h-svh w-full p-4 md:p-6">
        {GALLERY_IMAGES.map((image) => (
          <BentoCell key={image.src} className="relative overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </BentoCell>
        ))}
      </BentoGrid>

      {/* The base component's `size-fit` keeps this box no wider than its
          content, so it's dropped here rather than fought with `w-full`.
          The scrim exists because the text sits centered over whichever
          image cell happens to be growing behind it at that scroll
          position - white text with nothing behind it loses contrast fast
          against a bright photo (the crossing shot especially), so a solid
          panel guarantees legibility regardless of what's underneath. */}
      {/* Plain block, not flex - a flex column with items-center gives
          each child (p/h1/p) shrink-to-fit ("fit-content") width, which
          sizes to the text's unwrapped max-content and ignores this
          box's own width entirely, overflowing it. Block children are
          constrained to the box width by default, and text-center
          handles the centering without that trade-off. */}
      <ContainerScale className="z-10 w-[min(94vw,44rem)] px-6 py-10 text-center sm:px-14 sm:py-14">
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink/85" />
        <p className="mb-5 flex items-center justify-center gap-3 text-[clamp(0.6875rem,2.2vw,0.8125rem)] font-medium uppercase tracking-[0.14em] text-paper/70">
          <span aria-hidden className="h-px w-8 bg-red" />
          Projektet
          <span aria-hidden className="h-px w-8 bg-red" />
        </p>
        {/* clamp(), not sm:/md: steps, to match the scale technique already
            used for the homepage's big display headline (see
            homepage-story.tsx) - it tracks viewport width continuously
            instead of jumping at fixed breakpoints, so the box never has
            to wrap a word too large for it on some in-between width. */}
        <h1 className="max-w-full text-[clamp(1.75rem,6vw,3.5rem)] font-display font-semibold leading-[1.08] tracking-tight text-paper">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.08}
            staggerFrom="first"
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          >
            Puna jonë, e dukshme në terren.
          </VerticalCutReveal>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[clamp(0.9rem,2.4vw,1.125rem)] leading-relaxed text-paper/70">
          Sinjalistikë rrugore, hapësira private dhe infrastrukturë - disa
          shembuj nga punimet tona.
        </p>
      </ContainerScale>
    </ContainerScroll>
  );
}
