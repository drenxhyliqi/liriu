import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/sections/login-form";
import { company } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Identifikohu | NSH LIRIU",
  robots: { index: false, follow: false },
};

// Fine technical grid, same motif as the site's engineering-drawing feel.
// Sized in px so it stays constant regardless of panel width.
const gridBackground = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "44px 44px",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row">
      {/*
       * Brand panel. Desktop-only: on small screens the same identity is
       * carried by the compact header in the form column, so the screen
       * stays a single uninterrupted column instead of stacking two
       * competing full-bleed blocks.
       */}
      <aside className="relative hidden overflow-hidden bg-ink lg:flex lg:w-[44%] lg:flex-col lg:justify-between xl:w-1/2">
        <div aria-hidden className="absolute inset-0" style={gridBackground} />

        {/* Road-marking motif: a wide asphalt band with its dashed lane line. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <line x1="14" y1="112" x2="78" y2="-12" stroke="white" strokeOpacity="0.04" strokeWidth="26" />
          <line x1="14" y1="112" x2="78" y2="-12" stroke="white" strokeOpacity="0.18" strokeWidth="0.3" strokeDasharray="3 3" />
          <line x1="56" y1="112" x2="120" y2="-12" stroke="var(--color-red)" strokeOpacity="0.45" strokeWidth="0.3" strokeDasharray="2 2.4" />
        </svg>

        <div
          aria-hidden
          className="pointer-events-none absolute -left-1/4 top-1/3 h-[540px] w-[540px] rounded-full bg-red/12 blur-[140px]"
        />

        <div className="relative flex items-center gap-3 p-10 xl:p-14">
          <Image
            src="/brand/logo-white.png"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-paper">
            {company.name}
          </span>
        </div>

        <div className="relative px-10 pb-4 xl:px-14">
          <p className="mb-6 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-paper/60">
            <span aria-hidden className="h-px w-8 bg-red" />
            Paneli i Administrimit
          </p>
          <p className="max-w-md font-display text-3xl font-semibold leading-[1.15] tracking-tight text-paper xl:text-4xl">
            {company.slogan.sq}
          </p>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-paper/60">
            Menaxho kategoritë, produktet dhe përmbajtjen e faqes nga një vend i
            vetëm.
          </p>
        </div>

        <div className="relative flex items-center justify-between border-t border-white/10 px-10 py-6 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/40 xl:px-14">
          <span>{company.location}</span>
          <span>Që nga {company.founded}</span>
        </div>
      </aside>

      {/* Form column. */}
      <main className="relative flex flex-1 flex-col bg-paper">
        <div className="flex items-center justify-between px-6 py-6 sm:px-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft
              aria-hidden
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            />
            Kthehu në faqe
          </Link>

          {/* Identity for the small-screen layout, where the brand panel is hidden. */}
          <Image
            src="/brand/logo.png"
            alt="NSH LIRIU"
            width={40}
            height={40}
            className="h-9 w-9 object-contain lg:hidden"
          />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[400px]">
            <span aria-hidden className="block h-1 w-10 bg-red" />

            <h1 className="mt-6 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
              Identifikohu
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Fut kredencialet e tua për të hyrë në panelin e administrimit.
            </p>

            <div className="mt-9">
              <LoginForm />
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="text-[13px] leading-relaxed text-muted">
                Qasje vetëm për administratorë. Sistemi është ende në zhvillim.{" "}
                <Link
                  href="/admin"
                  className="font-medium text-ink underline underline-offset-4 transition-colors hover:text-red"
                >
                  Shiko pamjen paraprake
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Held to the form's own measure so it reads as part of the same
            column rather than drifting to the panel edge. */}
        <div className="px-6 pb-8 sm:px-10">
          <p className="mx-auto w-full max-w-[400px] font-mono text-[11px] uppercase tracking-[0.12em] text-muted/60">
            © {new Date().getFullYear()} {company.name}
          </p>
        </div>
      </main>
    </div>
  );
}
