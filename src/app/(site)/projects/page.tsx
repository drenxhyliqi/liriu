import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsGallery } from "@/components/sections/projects-gallery";
import { projects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projektet | NSH LIRIU",
  description:
    "Sinjalistikë rrugore, hapësira private dhe infrastrukturë - disa shembuj nga punimet e NSH LIRIU, Suharekë, Kosovë.",
};

export default function ProjectsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ProjectsGallery />

      {/* projects.ts stays empty until full case-study data (client,
          location, year, services, approved photography) is confirmed -
          see that file's header and HANDOFF.md. The gallery above shows
          real work; this is an honest placeholder for the case studies
          that will sit alongside it once that data exists, matching the
          fallback tone used on service pages. */}
      {projects.length === 0 && (
        <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-4xl border border-line p-8 text-center md:p-12">
            <p className="font-display text-lg font-medium text-ink">
              Studimet e rasteve po përgatiten.
            </p>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">
              Detajet e plota të projekteve tona - vendndodhja, shërbimet e
              ofruara dhe rezultatet - do të shtohen së shpejti. Ndërkohë, na
              kontaktoni drejtpërdrejt për referenca specifike.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center bg-red px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink"
            >
              Na Kontaktoni
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
