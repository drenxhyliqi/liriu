"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Mail, Menu, User, X } from "lucide-react";
import { CartButton } from "@/components/layout/cart-button";
import { FacebookIcon, WhatsAppIcon } from "@/components/icons/social-icons";
import { company, mainNav } from "@/lib/constants";
import { socialPlaceholder } from "@/lib/social-placeholder";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const HIDE_AFTER_PX = 120;

// Orchestrates the mobile menu's link list: the container starts staggering
// its children in only once the panel's own clip-path reveal is partway
// open (`delayChildren`), so the text animates in as a distinct second beat
// rather than fighting the panel's own motion.
const navListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
};
const navItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  // Hide-on-scroll-down is a desktop-only affordance - on mobile the
  // navbar (and the cart icon it holds) should always stay visible, so
  // scroll never sets `hidden` there.
  const [isDesktop, setIsDesktop] = React.useState(false);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setIsDesktop(mq.matches);
      // Crossing down to mobile mid-scroll shouldn't leave the bar stuck
      // hidden from whatever desktop scroll position it was at.
      if (!mq.matches) setHidden(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollY } = useScroll();
  const lastY = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);

    if (menuOpen || !isDesktop) {
      lastY.current = latest;
      return;
    }

    const goingDown = latest > lastY.current;
    if (goingDown && latest > HIDE_AFTER_PX) {
      setHidden(true);
    } else if (!goingDown) {
      setHidden(false);
    }
    lastY.current = latest;
  });

  React.useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // The bar is solid white on every page and every breakpoint. It used to go
  // transparent over the homepage's full-bleed video hero; that hero is now a
  // light section with the video cut into a contained band, so there is no
  // dark backdrop for white nav text to sit on.

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors duration-300 md:h-20",
          scrolled || menuOpen
            ? cn("border-line bg-paper", isDesktop && "bg-paper/95 backdrop-blur-sm")
            : "border-transparent bg-paper",
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10">
          <Link
            href="/"
            aria-label="LIRIU - Ballina"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink transition-colors md:text-lg"
          >
            <span aria-hidden className="h-2 w-2 shrink-0 bg-red" />
            N.SH LIRIU
          </Link>

          <nav aria-label="Primare" className="hidden items-center gap-8 md:flex">
            {mainNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "group relative block py-2 text-[13px] font-medium uppercase tracking-[0.08em]",
                    active ? "text-ink" : "text-ink/55",
                  )}
                >
                  {/* Hover rolls the label up and swaps in a red duplicate
                      from below, echoing the VerticalCutReveal used on the
                      page headlines. The mask is this wrapper, so the two
                      copies must stay the same width - hence the shared
                      whitespace-nowrap and the duplicate being absolutely
                      positioned rather than in flow.

                      The label is duplicated in the DOM, so the whole visual
                      pair is hidden from assistive tech and the accessible
                      name comes from the sr-only copy - same arrangement as
                      vertical-cut-reveal.tsx - here the name comes from the
                      link's own aria-label. Without that the link is left
                      with either no computed name or a doubled one. */}
                  <span aria-hidden className="relative block overflow-hidden">
                    <span className="block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                      {item.label}
                    </span>
                    <span className="absolute left-0 top-0 block translate-y-full whitespace-nowrap text-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                      {item.label}
                    </span>
                  </span>

                  {/* Active marker: the same small red square used by the
                      wordmark and the About timeline, not an underline. */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 bg-red"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* One right-hand cluster holding every trailing control, including
              the mobile hamburger. Keeping the hamburger *outside* this group
              made it a third `justify-between` child once the <nav> went
              `display:none` on mobile, which stranded the cart in the middle
              of the bar with a large gap either side. */}
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <Link
              href="/login"
              aria-label="Identifikohu"
              className={cn(
                "hidden h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-red hover:text-red md:flex",
              )}
            >
              <User aria-hidden className="h-4 w-4" />
            </Link>
            {/* Cart stays visible at every breakpoint - unlike User/CTA,
                which fold into the mobile menu. */}
            <CartButton />
            <Link
              href="/contact"
              className={cn(
                "hidden items-center border border-ink px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-red hover:bg-red hover:text-paper md:inline-flex",
              )}
            >
              Fillo një Projekt
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Mbyll menynë" : "Hap menynë"}
              aria-expanded={menuOpen}
              className="-mr-2 flex h-10 w-10 items-center justify-center text-ink transition-colors md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

function MobileMenu({
  open,
  onNavigate,
  pathname,
}: {
  open: boolean;
  onNavigate: () => void;
  pathname: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="fixed inset-0 z-40 flex flex-col bg-paper pt-16 md:hidden"
        >
          <motion.nav
            aria-label="Menyja"
            variants={navListVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-1 flex-col justify-center gap-1 px-6"
          >
            {mainNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <motion.div key={item.href} variants={navItemVariants}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span
                      className={cn(
                        "font-display text-3xl font-medium tracking-tight transition-colors",
                        active ? "text-red" : "text-ink group-hover:text-red",
                      )}
                    >
                      {item.label}
                    </span>
                    <ArrowRight
                      aria-hidden
                      className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-200",
                        active
                          ? "translate-x-0 text-red opacity-100"
                          : "-translate-x-1 text-muted/40 opacity-0 group-hover:translate-x-0 group-hover:text-red group-hover:opacity-100",
                      )}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>

          <div className="flex flex-col gap-4 border-t border-line px-6 py-8">
            <Link
              href="/contact"
              onClick={onNavigate}
              className="inline-flex items-center justify-center bg-red px-5 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
            >
              Fillo një Projekt
            </Link>
            <p className="text-xs uppercase tracking-[0.08em] text-muted">{company.location}</p>
            <div className="flex items-center gap-3">
              <Link
                href={socialPlaceholder.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center border border-line text-ink/70 transition-colors hover:border-red hover:text-red"
              >
                <FacebookIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`https://wa.me/${socialPlaceholder.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center border border-line text-ink/70 transition-colors hover:border-red hover:text-red"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`mailto:${socialPlaceholder.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center border border-line text-ink/70 transition-colors hover:border-red hover:text-red"
              >
                <Mail aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Admin/login entry - deliberately kept out of the always-visible
              chrome (both the closed mobile bar and this panel's main link
              list) and tucked in its own corner, reachable only once the
              menu is open. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.18 + mainNav.length * 0.06 }}
            className="absolute bottom-6 right-6"
          >
            <Link
              href="/login"
              onClick={onNavigate}
              aria-label="Identifikohu"
              className="flex h-10 w-10 items-center justify-center border border-line text-ink/70 transition-colors hover:border-red hover:text-red"
            >
              <User aria-hidden className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
