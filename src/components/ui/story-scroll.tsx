"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the visual viewport when the address bar hides/shows
// mid-scroll. By default ScrollTrigger treats that as a resize and recalculates
// every trigger's start/end, which desyncs the pins and makes cards jump -
// the original reason this sequence was desktop-only. `ignoreMobileResize` is
// GSAP's built-in fix and is what makes the pinned sequence viable on phones.
// Paired with `svh` units below (which, unlike `vh`, don't change when the
// address bar collapses) the pin geometry stays stable for the whole scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "aria-label"?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  "aria-label": ariaLabel,
}) => (
  // `min-h-svh` (not `min-h-screen`/`vh`) at every breakpoint: each panel has
  // to fill the viewport for the pin+rotate sequence to read correctly, and the
  // *small* viewport unit is the one that stays constant while mobile browser
  // chrome expands and collapses.
  <section
    data-flow-section
    aria-label={ariaLabel}
    className={cx("relative min-h-svh w-full overflow-hidden", className)}
  >
    <div
      data-flow-inner
      className={cx(
        "flow-art-container relative flex min-h-svh w-full flex-col justify-between gap-6 px-6 py-16 sm:px-[4vw] lg:pb-[4vw] lg:pt-[clamp(2rem,8vw,4vw)]",
        "will-change-transform",
      )}
      style={{ transformOrigin: "bottom left", ...style }}
    >
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  "aria-label": ariaLabel = "Story scroll",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // The pin+rotate sequence runs at every breakpoint - `ignoreMobileResize`
  // above plus `svh` sizing keep the pins stable on touch devices, which was
  // the one thing that previously made this desktop-only. Reduced-motion is
  // still honoured and falls back to a plain stacked layout.
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionMq.matches);
    updateMotion();
    motionMq.addEventListener("change", updateMotion);
    return () => motionMq.removeEventListener("change", updateMotion);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-flow-section]"),
      );
      if (sections.length === 0) return;

      // GSAP's .set() calls below mutate the DOM directly (inline styles),
      // outside React's render cycle. Killing ScrollTrigger instances on
      // cleanup does NOT undo those - so every run starts by clearing any
      // rotation/z-index a *previous* run may have left behind (e.g. toggling
      // reduced-motion, or dev-mode's effect double-invoke). Without this, a
      // card can get permanently stuck mid-rotation even though the branch
      // below never runs again.
      sections.forEach((section) => {
        gsap.set(section, { clearProps: "zIndex" });
        const inner = section.querySelector<HTMLElement>(".flow-art-container");
        if (inner) gsap.set(inner, { clearProps: "rotation,transformOrigin" });
      });

      if (reducedMotion) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>(".flow-art-container");
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: "bottom left" });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 25%",
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "bottom bottom",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    // A <div role="region">, not <main> - this is one section among several
    // on the page, and the page shell already owns the <main> landmark.
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className={cx("w-full overflow-x-hidden", className)}
    >
      {children}
    </div>
  );
};

export default FlowArt;
