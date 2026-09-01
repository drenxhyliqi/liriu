"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardStickyProps extends HTMLMotionProps<"div"> {
  index: number;
  incrementY?: number;
  incrementZ?: number;
}

/**
 * Sticky card-stack primitives: as the page scrolls, each CardSticky pins a
 * little lower than the one before it, so the stack piles up and each card
 * covers the previous one - the "on scroll" effect is native CSS
 * `position: sticky`, not a JS-driven animation, so it needs no rAF and
 * keeps working under reduced-motion.
 *
 * Adapted from a reference component built on the `motion` package; this
 * codebase already depends on `framer-motion` (see hero.tsx, story-scroll.tsx),
 * so this uses that instead of adding a second, near-identical animation
 * library. The two packages share the same API for what's used here
 * (`motion.div`, `HTMLMotionProps`), so the swap is a straight import change.
 *
 * The reference passed `layout="position"` on the card - Framer Motion's
 * layout projection, meant to animate a reflow if the list reorders or
 * filters. Nothing here ever reorders, and keeping it breaks native
 * `position: sticky` outright for the LAST card in the stack (measured:
 * the browser reports a full 900px of legal "room to stick" below it and
 * still never pins it - a documented incompatibility between layout
 * projection and native sticky, not a spacing bug). Dropped rather than
 * worked around.
 */
const ContainerScroll = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ children, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ContainerScroll.displayName = "ContainerScroll";

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  ({ index, incrementY = 10, incrementZ = 10, children, className, style, ...props }, ref) => {
    const y = index * incrementY;
    const z = index * incrementZ;

    return (
      <motion.div
        ref={ref}
        style={{ top: y, zIndex: z, backfaceVisibility: "hidden", ...style }}
        className={cn("sticky", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
CardSticky.displayName = "CardSticky";

export { ContainerScroll, CardSticky };
