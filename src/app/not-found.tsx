import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteChrome } from "@/components/layout/site-chrome";

export const metadata: Metadata = {
  title: "Faqja nuk u gjet | NSH LIRIU",
};

export default function NotFound() {
  return (
    <SiteChrome>
      <main className="flex flex-1 flex-col">
        <section className="flex flex-1 items-center border-b border-line px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
                <span aria-hidden className="h-px w-8 bg-red" />
                Gabim 404
              </p>
              <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
                Ndalim kalimi. Kjo rrugë nuk të çon askund.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                Faqja që kërkuat nuk ekziston ose është zhvendosur. Kthehuni në
                ballinë ose shfletoni katalogun e produkteve.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center bg-red px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
                >
                  Kthehu në Ballinë
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

            <div aria-hidden className="flex justify-center lg:col-span-5 lg:justify-end">
              <NoEntrySign />
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

// "No entry" sign (Vienna Convention C1) on a post, over a dashed lane line.
function NoEntrySign() {
  return (
    <svg viewBox="0 0 240 320" className="h-auto w-48 sm:w-56 lg:w-64">
      <rect x="114" y="150" width="12" height="150" className="fill-ink" />
      <circle cx="120" cy="110" r="100" className="fill-paper" />
      <circle cx="120" cy="110" r="96" className="fill-red" />
      <rect x="52" y="94" width="136" height="32" className="fill-paper" />
      <text
        x="120"
        y="119"
        textAnchor="middle"
        className="fill-ink font-display"
        style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.08em" }}
      >
        404
      </text>
      <line x1="0" y1="306" x2="240" y2="306" className="stroke-ink" strokeWidth="2" />
      <line
        x1="0"
        y1="316"
        x2="240"
        y2="316"
        className="stroke-muted"
        strokeWidth="3"
        strokeDasharray="18 12"
      />
    </svg>
  );
}
