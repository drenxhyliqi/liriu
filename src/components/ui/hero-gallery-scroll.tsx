"use client";

import * as React from "react";
import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven bento gallery: a fixed set of images fan out from a
 * compressed stack into a bento grid as the page scrolls past, while a
 * centered heading shrinks and fades out of the way. Adapted from a
 * reference component built on the `motion` package and `class-variance-
 * authority`; this codebase already depends on `framer-motion` (see
 * hero.tsx, cards-stack.tsx), so this uses that instead of adding a second
 * animation library. `cva` is dropped too - the reference used it to pick
 * between three grid layouts (5, 3, or 4 cells), and this page only ever
 * needs the 5-cell one, so a variant system for two unused shapes would be
 * dead weight; BentoGrid below just applies that one layout directly.
 */

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}
const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(
  undefined,
);
function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error("useContainerScrollContext must be used within a ContainerScroll component");
  }
  return context;
}

const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div ref={scrollRef} className={cn("relative min-h-screen w-full", className)} {...props}>
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};

// Five-cell bento layout only (see file header). Cell 1 is the large tile;
// cells 2-3 hide below md so a phone shows the 3 tiles that fit its width
// (1, 4, 5) rather than 5 cramped ones.
const BentoGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative grid grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr] gap-4",
          "[&>*:nth-child(1)]:col-span-8 [&>*:nth-child(1)]:row-span-3 [&>*:nth-child(1)]:origin-top-right md:[&>*:nth-child(1)]:col-span-6",
          "[&>*:nth-child(2)]:col-span-2 [&>*:nth-child(2)]:hidden md:[&>*:nth-child(2)]:block md:[&>*:nth-child(2)]:row-span-2",
          "[&>*:nth-child(3)]:col-span-2 [&>*:nth-child(3)]:origin-bottom-right [&>*:nth-child(3)]:hidden md:[&>*:nth-child(3)]:block md:[&>*:nth-child(3)]:row-span-2",
          "[&>*:nth-child(4)]:col-span-4 [&>*:nth-child(4)]:origin-top-right md:[&>*:nth-child(4)]:col-span-3",
          "[&>*:nth-child(5)]:col-span-4 md:[&>*:nth-child(5)]:col-span-3",
          className,
        )}
        {...props}
      />
    );
  },
);
BentoGrid.displayName = "BentoGrid";

const BentoCell = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext();
    const translate = useTransform(scrollYProgress, [0.1, 0.9], ["-35%", "0%"]);
    const scale = useTransform(scrollYProgress, [0, 0.9], [0.5, 1]);

    return (
      <motion.div ref={ref} className={className} style={{ translate, scale, ...style }} {...props} />
    );
  },
);
BentoCell.displayName = "BentoCell";

const ContainerScale = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext();
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const position = useTransform(scrollYProgress, (pos) => (pos >= 0.6 ? "absolute" : "fixed"));

    return (
      <motion.div
        ref={ref}
        // No width/height class here on purpose: the reference's `size-fit`
        // (width/height: fit-content) works for a short "button row" but
        // lets a longer text block grow past the viewport on a narrow
        // screen instead of wrapping - centered via `translate: -50%`, that
        // reads as the box sliding off the right edge. Sizing is left to
        // the caller (see projects-gallery.tsx for the viewport-capped
        // width it uses).
        className={cn("left-1/2 top-1/2", className)}
        style={{ translate: "-50% -50%", scale, position, opacity, ...style }}
        {...props}
      />
    );
  },
);
ContainerScale.displayName = "ContainerScale";

export { ContainerScroll, BentoGrid, BentoCell, ContainerScale };
