"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

export interface TimelineImage {
  src: string;
  alt: string;
}

export interface TimelineEntry {
  /** The large sticky marker - a year, or a label like "Sot". */
  title: string;
  content: React.ReactNode;
  /**
   * Optional supporting photography. Nothing on the site uses this yet -
   * there is no approved project imagery - but the slot is here so real
   * photos can be dropped in later without reworking the layout.
   */
  images?: TimelineImage[];
  /**
   * Marks copy that is stand-in text rather than client-confirmed fact.
   * Renders nothing visible; it emits `data-placeholder` on the entry so
   * unreplaced copy can be found with a grep or a DOM query before launch.
   */
  placeholder?: boolean;
}

/**
 * Timeline: a sticky year marker per entry - a plain square dot, no
 * connecting rule - with its body fading and sliding up into place as it
 * scrolls into view.
 *
 * Adapted from a reference component that instead drew a scroll-tracked
 * line filling red behind the markers; removed on request in favour of
 * this per-entry reveal, which is what now carries the "on scroll" motion.
 * Reworked onto the site's tokens (ink/muted/red, square markers, no
 * rounded pills or drop shadows) and stripped of its dark-mode variants,
 * since this site is light-only. The heading and copy are supplied by the
 * calling page rather than baked in, so the component carries no content
 * of its own.
 */
export function Timeline({
  data,
  className,
}: {
  data: TimelineEntry[];
  className?: string;
}) {
  return (
    <ol className={cn("w-full", className)}>
      {data.map((entry) => (
        <li
          key={entry.title}
          data-placeholder={entry.placeholder ? "true" : undefined}
          className={cn(
            "flex justify-start md:gap-10",
            // A marker with no content is a scale tick, not an unfinished
            // milestone - it gets a shorter run so it reads as part of the
            // spine rather than as a gap.
            entry.content ? "pt-16 first:pt-0 md:pt-44" : "pt-16 first:pt-0 md:pt-28",
          )}
        >
          <div className="sticky top-32 z-20 flex shrink-0 flex-col items-start self-start md:w-96 md:flex-row md:items-center">
            {/* Square marker, matching the wordmark and the nav's active
                dot - the only trace of a "line" left once the scroll-fill
                rule was removed. */}
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center"
            >
              <span className="h-[9px] w-[9px] bg-red" />
            </span>
            <h3
              className={cn(
                "hidden font-display font-semibold tracking-tight md:block md:pl-10",
                entry.content
                  ? "text-ink md:text-7xl lg:text-8xl"
                  : "text-muted/45 md:text-5xl lg:text-6xl",
              )}
            >
              {entry.title}
            </h3>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            variants={reveal}
            className="relative w-full pl-6 md:pl-4"
          >
            <h3
              className={cn(
                "font-display font-semibold tracking-tight md:hidden",
                entry.content ? "mb-5 text-5xl text-ink" : "text-4xl text-muted/45",
              )}
            >
              {entry.title}
            </h3>

            {entry.content}

            {entry.images && entry.images.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {entry.images.map((image) => (
                  <div key={image.src} className="relative aspect-[4/3] w-full bg-ink">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 320px, 45vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </li>
      ))}
    </ol>
  );
}
