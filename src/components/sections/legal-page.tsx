// CLIENT INFORMATION REQUIRED: the legal pages using this layout are generic
// starter text, not lawyer-reviewed and without confirmed company legal data
// (registration number, address, data-controller contact). Mark and replace
// before launch. See HANDOFF.md.

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="h-px w-8 bg-red" />
            Juridike
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">{intro}</p>
        </div>
      </section>

      <section data-placeholder className="px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 text-base leading-relaxed text-ink/80">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
