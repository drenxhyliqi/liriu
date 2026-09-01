"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { CutFrame } from "@/components/ui/cut-frame";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { company } from "@/lib/constants";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: 0.5 + i * 0.08 },
  }),
};

// Verified facts only (see src/lib/constants.ts) - this row replaces the
// former tagline eyebrow, so nothing here may be invented.
const specs = [
  { label: "Selia", value: company.location },
  { label: "Themeluar", value: String(company.founded) },
  { label: "Veprimtaria", value: "Inxhinieri trafiku · Sinjalistikë · Infrastrukturë" },
];

// The loop is deliberately NOT the LCP element: the headline is. The <video>
// ships with no src and preload="none", so first paint downloads only the
// ~40KB poster; the real file is attached and played once the frame scrolls
// near the viewport.
//
// TODO: swap /videos/hero-loop.mp4 for the real, compressed loop once
// available (see chat - the dropped file arrived empty). It is currently
// ~30MB, far too heavy even lazily; target 10-20s, silent, ~5-10 Mbps H.264.
// Regenerate the poster after replacing it:
//   ffmpeg -y -ss 1 -i public/videos/hero-loop.mp4 -frames:v 1 \
//     -vf "scale=1600:-2" -q:v 6 public/videos/hero-poster.jpg
function HeroVideo() {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (el.src) return;
      el.src = "/videos/hero-loop.mp4";
      // Autoplay can still be refused (data saver, reduced-motion policies);
      // the poster stays visible in that case, so there is nothing to undo.
      void el.play().catch(() => {});
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster="/videos/hero-poster.jpg"
      preload="none"
      muted
      loop
      playsInline
      aria-label="Punime të sinjalistikës rrugore nga NSH LIRIU"
    />
  );
}

// Composed as a drawing title block rather than the usual
// eyebrow / headline / paragraph / two-buttons stack: the headline runs
// full width, then a hairline-ruled row splits the verified company data
// (left) from the positioning copy and actions (right). The two calls to
// action are deliberately asymmetric - one solid red plate, one arrow link -
// so the row reads as a hierarchy instead of a pair of matching pills.
export function Hero() {
  return (
    <section className="bg-paper px-6 pb-20 pt-12 md:px-10 md:pb-32 md:pt-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-[clamp(2.5rem,8.6vw,7.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.02em] text-ink">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.06}
            staggerFrom="first"
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.15 }}
          >
            Siguria Rrugore Fillon me Precizitet
          </VerticalCutReveal>
        </h1>

        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="mt-10 grid gap-10 border-y border-line py-7 md:mt-14 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-16 md:py-9"
        >
          <dl className="flex flex-col gap-4">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                <dt className="w-32 shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                  {spec.label}
                </dt>
                <dd className="text-[13px] leading-snug text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col items-start gap-7">
            <p className="max-w-md text-base leading-relaxed text-muted md:text-lg">
              Zgjidhje profesionale në inxhinieri trafiku, sinjalistikë rrugore
              dhe infrastrukturë - të projektuara dhe të ekzekutuara me
              precizitet.
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center bg-red px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
              >
                Shërbimet Tona
              </Link>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-ink"
              >
                <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-red group-hover:text-red">
                  Shiko Produktet
                </span>
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-red"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={reveal}
        className="mt-10 md:mt-14"
      >
        {/* Taller on phones - a 12/5 band collapses to a ~140px sliver at
            360px wide, which is too thin to carry the hero. */}
        <CutFrame className="mx-auto aspect-[3/2] w-full max-w-7xl md:aspect-[12/5]">
          <HeroVideo />
        </CutFrame>
      </motion.div>
    </section>
  );
}
