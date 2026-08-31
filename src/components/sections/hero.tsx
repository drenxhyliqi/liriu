"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: 0.15 + i * 0.1 },
  }),
};

// TODO: swap /videos/hero-loop.mp4 for the real, compressed loop once
// available (see chat - the dropped file arrived empty). Keep it short
// (10–20s), silent, and encoded small (~5–10 Mbps H.264) since it autoplays
// on first paint.
export function Hero() {
  return (
    <section className="relative -mt-16 flex h-svh min-h-[560px] w-full items-end overflow-hidden bg-ink md:-mt-20">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-40 md:px-10 md:pb-24">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-paper/80"
        >
          <span aria-hidden className="h-px w-8 bg-red" />
          Inxhinieri &amp; Sinjalistikë Rrugore që nga 2012
        </motion.p>

        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl lg:text-7xl">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.08}
            staggerFrom="first"
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.4 }}
          >
            Siguria Rrugore Fillon me Precizitet.
          </VerticalCutReveal>
        </h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg"
        >
          Zgjidhje profesionale në inxhinieri trafiku, sinjalistikë rrugore
          dhe infrastrukturë - të projektuara dhe të ekzekutuara me
          precizitet.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/services"
            className="inline-flex items-center justify-center bg-red px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
          >
            Shërbimet Tona
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-paper/60 px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Fillo një Projekt
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-2 md:right-10 md:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.14em] text-paper/60">
          Zbrit
        </span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px bg-paper/40"
        />
      </motion.div>
    </section>
  );
}
