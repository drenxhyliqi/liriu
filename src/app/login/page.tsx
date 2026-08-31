import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/sections/login-form";

export const metadata: Metadata = {
  title: "Identifikohu | NSH LIRIU",
  robots: { index: false, follow: false },
};

const gridBackground = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
  backgroundSize: "36px 36px",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-ink px-6 py-16">
      <div aria-hidden className="absolute inset-0" style={gridBackground} />

      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <line x1="-10" y1="115" x2="60" y2="-15" stroke="var(--color-red)" strokeOpacity="0.3" strokeWidth="0.3" strokeDasharray="1.4 1.4" />
        <line x1="40" y1="115" x2="110" y2="-15" stroke="var(--color-red)" strokeOpacity="0.15" strokeWidth="0.3" strokeDasharray="1.4 1.4" />
      </svg>

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-paper/60 transition-colors hover:text-paper"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Kthehu në faqe
        </Link>

        <div className="relative border border-white/10 bg-paper p-8 shadow-2xl sm:p-10">
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-red" />
          <span aria-hidden className="absolute left-4 top-6 font-mono text-xs text-ink/20">+</span>
          <span aria-hidden className="absolute right-4 top-6 font-mono text-xs text-ink/20">+</span>
          <span aria-hidden className="absolute bottom-4 left-4 font-mono text-xs text-ink/20">+</span>
          <span aria-hidden className="absolute bottom-4 right-4 font-mono text-xs text-ink/20">+</span>

          <Image src="/brand/logo.png" alt="NSH LIRIU" width={56} height={56} className="h-12 w-12" />

          <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
            Paneli i Administrimit
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Identifikohu për të menaxhuar kategoritë, produktet dhe përmbajtjen.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-paper/40">
          Vetëm për administratorë. Sistemi është ende në zhvillim.
        </p>
        <p className="mt-2 text-center text-xs text-paper/40">
          <Link href="/admin" className="underline underline-offset-2 transition-colors hover:text-paper">
            Shiko pamjen paraprake të panelit
          </Link>
        </p>
      </div>
    </div>
  );
}
