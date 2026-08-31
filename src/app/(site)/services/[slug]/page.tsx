import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { getServiceBySlug, services } from "@/lib/data/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  return {
    title: service ? `${service.name} | NSH LIRIU` : "Shërbimi | NSH LIRIU",
  };
}

export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== service.slug);

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Shërbimet
          </Link>
          <p className="mt-8 font-display text-sm text-red">
            {service.number} / {String(services.length).padStart(2, "0")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {/* keyed on slug: forces a remount so the reveal replays when
                navigating client-side between service pages, not just on
                a hard page load */}
            <VerticalCutReveal
              key={service.slug}
              splitBy="words"
              staggerDuration={0.08}
              staggerFrom="first"
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            >
              {service.name}
            </VerticalCutReveal>
          </h1>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl">
          {service.overview ? (
            <div>
              <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                {service.overview}
              </p>
              {service.capabilities && service.capabilities.length > 0 && (
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {service.capabilities.map((capability) => (
                    <li key={capability} className="flex items-start gap-2 text-sm text-ink">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-red" />
                      {capability}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="border border-line p-8 md:p-12">
              <p className="font-display text-lg font-medium text-ink">
                Përshkrimi i plotë po përgatitet.
              </p>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                Detajet teknike, kapacitetet dhe procesi i punës për këtë
                shërbim do të shtohen së shpejti. Ndërkohë, na kontaktoni
                drejtpërdrejt për informacione specifike rreth projektit
                tuaj.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center justify-center bg-red px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
              >
                Na Kontaktoni
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Shërbime të Tjera
          </p>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((other) => (
              <Link
                key={other.slug}
                href={`/services/${other.slug}`}
                className="group flex items-center justify-between border-b border-line pb-4 text-ink transition-colors hover:text-red"
              >
                <span className="font-display text-lg font-medium">{other.name}</span>
                <ArrowUpRight
                  aria-hidden
                  className="h-5 w-5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
