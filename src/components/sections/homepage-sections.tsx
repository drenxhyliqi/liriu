import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { company } from "@/lib/constants";
import { services } from "@/lib/data/services";

// Everything after the Hero, as plain stacked sections. This replaced a
// pinned, rotating GSAP scroll sequence the client did not want - nothing
// here is scroll-driven; the page simply scrolls.
//
// Copy is carried over from that sequence (company intro, expertise, safety
// statement, differentiators, process, final CTA) with no invented facts.
// The two additions use only real material: the supplied project photos
// (same set as /projects) and the live catalog categories.

const yearsExperience = new Date().getFullYear() - company.founded;

const statement =
  "font-display text-[clamp(2.25rem,5.6vw,5rem)] font-semibold uppercase leading-none tracking-[-0.02em]";
const title = "font-display text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.05] tracking-tight";
const lead = "max-w-xl text-base leading-relaxed md:text-lg";

// A road centre line: long dashes, short gaps.
const laneDashes = (direction: "90deg" | "180deg", color: string) => ({
  backgroundImage: `repeating-linear-gradient(${direction}, ${color} 0 36px, transparent 36px 60px)`,
});

function Eyebrow({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" | "red" }) {
  const text = { light: "text-muted", dark: "text-paper/60", red: "text-paper/80" }[tone];
  return (
    <p className={`mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] ${text}`}>
      <span aria-hidden className={`h-px w-8 ${tone === "red" ? "bg-paper" : "bg-red"}`} />
      {children}
    </p>
  );
}

function ArrowLink({ href, children, tone = "light" }: { href: string; children: React.ReactNode; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <Link
      href={href}
      className={`group inline-flex shrink-0 items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] ${
        dark ? "text-paper" : "text-ink"
      }`}
    >
      <span
        className={`border-b pb-0.5 transition-colors group-hover:border-red group-hover:text-red ${
          dark ? "border-paper/30" : "border-ink/25"
        }`}
      >
        {children}
      </span>
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-red"
      />
    </Link>
  );
}

function SectionHead({
  eyebrow,
  heading,
  body,
  link,
  tone = "light",
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  link?: { href: string; label: string };
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2 className={title}>{heading}</h2>
        {body && <p className={`${lead} mt-5 ${tone === "dark" ? "text-paper/65" : "text-muted"}`}>{body}</p>}
      </div>
      {link && (
        <ArrowLink href={link.href} tone={tone}>
          {link.label}
        </ArrowLink>
      )}
    </div>
  );
}

function Intro() {
  const stats = [
    { value: String(company.founded), label: "Themeluar" },
    { value: `${yearsExperience}+`, label: "Vite përvojë" },
    { value: String(services.length), label: "Fusha shërbimi" },
  ];

  return (
    <section aria-labelledby="home-intro" className="px-6 pb-20 md:px-10 md:pb-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <Eyebrow>Kush Jemi Ne</Eyebrow>
        </div>
        <div className="lg:col-span-9">
          <h2 id="home-intro" className={`${statement} text-ink`}>
            Që nga 2012, ndërtojmë rrugë më të sigurta.
          </h2>
          <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-16">
            <p className={`${lead} text-muted`}>
              NSH LIRIU është një kompani kosovare e specializuar në inxhinieri trafiku, sinjalistikë rrugore dhe
              infrastrukturë. Nga ekspertiza fillestare në inxhinieri trafiku dhe ekspertizë aksidentesh, që nga viti
              2013 kompania u zgjerua në sinjalistikë horizontale dhe vertikale - duke u bërë sot një partner i plotë
              për institucione, komuna, kompani ndërtimi dhe kontraktorë privatë në të gjithë Kosovën.
            </p>
            <dl className="grid grid-cols-3 border-t border-ink md:grid-cols-1">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 border-line py-5 md:flex-row md:items-baseline md:justify-between md:border-b"
                >
                  <dt className="order-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted md:order-1">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-display text-3xl font-semibold tracking-tight text-ink md:order-2 md:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Expertise() {
  return (
    <section aria-label="Ekspertiza Jonë" className="bg-ink px-6 py-20 text-paper md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          tone="dark"
          eyebrow="Ekspertiza Jonë"
          heading="Shtatë fusha ekspertize, një ekip i vetëm."
          body="Nga sinjalistika deri te inxhinieria e trafikut - çdo shërbim mbulon një pjesë të infrastrukturës rrugore."
          link={{ href: "/services", label: "Të gjitha shërbimet" }}
        />

        <ol className="mt-14 border-t border-white/15 md:mt-20">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="group grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/15 py-5 md:grid-cols-[7rem_minmax(0,1fr)_auto] md:py-7"
              >
                <span className="text-sm font-bold tabular-nums text-red">{service.number}</span>
                <span className="font-display text-xl font-medium tracking-tight transition-[color,translate] duration-300 ease-out group-hover:text-red sm:text-2xl md:text-4xl md:group-hover:translate-x-3">
                  {service.name}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-5 w-5 text-paper/35 transition duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-red md:h-7 md:w-7"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Same supplied photos as the /projects gallery (see projects-gallery.tsx) -
// alt text describes only what is visible.
const workPhotos = {
  feature: {
    src: "/projects/pedestrian-crossing-decorative.jpg",
    alt: "Kalim këmbësorësh me vizatim dekorativ kuq e bardhë në një sheshe urban",
  },
  side: [
    {
      src: "/projects/warehouse-floor-marking.jpg",
      alt: "Vijëzim i dyshemesë në një hapësirë industriale, me korsi të shënuara për lëvizje të brendshme",
    },
    {
      src: "/projects/parking-garage-bay-numbers.jpg",
      alt: "Vende parkimi të numëruara dhe të vijëzuara në një garazh të brendshëm, me mbrojtëse cepash të verdha e të zeza",
    },
  ],
};

function Work() {
  return (
    <section aria-label="Projektet" className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          eyebrow="Projektet"
          heading="Puna jonë, e dukshme në terren."
          body="Sinjalistikë rrugore, hapësira private dhe infrastrukturë - disa shembuj nga punimet tona."
          link={{ href: "/projects", label: "Shiko projektet" }}
        />

        {/* The left photo is 3:4, so at md+ its height equals the two wide
            (~2.2:1) photos stacked beside it - every cell crops lightly. */}
        <div className="mt-12 grid gap-3 md:mt-16 md:grid-cols-12 md:gap-4">
          <Link
            href="/projects"
            className="group relative block aspect-[4/5] overflow-hidden bg-surface md:col-span-5 md:aspect-[3/4]"
          >
            <Image
              src={workPhotos.feature.src}
              alt={workPhotos.feature.alt}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </Link>
          <div className="grid gap-3 md:col-span-7 md:grid-rows-2 md:gap-4">
            {workPhotos.side.map((photo) => (
              <Link
                key={photo.src}
                href="/projects"
                className="group relative block aspect-[16/9] overflow-hidden bg-surface md:aspect-auto"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const safetyAreas = [
  { name: "Sinjalistikë Horizontale", body: "Vija, kalime dhe shenja që udhëzojnë çdo drejtim." },
  { name: "Sinjalistikë Vertikale", body: "Shenja të qarta dhe të qëndrueshme në çdo kusht." },
  { name: "Inxhinieri Trafiku", body: "Analizë dhe zgjidhje për një qarkullim më të sigurt." },
];

function Safety() {
  return (
    <section aria-labelledby="home-safety" className="bg-red px-6 py-20 text-paper md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Eyebrow tone="red">Siguria</Eyebrow>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="home-safety" className={`${statement} lg:col-span-7`}>
            Siguria s&apos;është opsion.
          </h2>
          <p className={`${lead} text-paper/85 lg:col-span-5`}>
            Sinjalistika dhe infrastruktura që projektojmë mbrojnë jetë çdo ditë në rrugët e Kosovës. E trajtojmë këtë
            përgjegjësi me seriozitetin që meriton.
          </p>
        </div>

        <div aria-hidden className="mt-14 h-1 w-full md:mt-20" style={laneDashes("90deg", "rgba(255,255,255,0.9)")} />

        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {safetyAreas.map((area) => (
            <div key={area.name}>
              <p className="text-sm font-bold uppercase tracking-wider">{area.name}</p>
              <p className="mt-2 max-w-xs leading-relaxed text-paper/80">{area.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function loadProductGroups() {
  try {
    const catalog = await getCatalog();
    return catalog.roots().map((root) => {
      const children = catalog.children(root.id);
      const cover = root.imageUrl ? root : children.find((c) => c.imageUrl);
      return {
        slug: root.slug,
        name: root.name,
        count: catalog.productsUnder(root).length,
        children: children.map((c) => c.name),
        image: cover?.imageUrl ? { src: cover.imageUrl, fit: cover.imageFit } : null,
      };
    });
  } catch {
    // The homepage should never fail because the API is down - the section
    // is just left out until the catalog is reachable again.
    return [];
  }
}

async function Products() {
  const groups = await loadProductGroups();
  if (groups.length === 0) return null;

  return (
    <section aria-label="Produktet" className="border-t border-line bg-surface px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          eyebrow="Produktet"
          heading="Materiale dhe pajisje për rrugë më të sigurta."
          body="Nga sinjalistika vertikale te mobilja rrugore - furnizojmë dhe instalojmë materialet që përdorim edhe vetë në projektet tona."
          link={{ href: "/products", label: "Të gjitha produktet" }}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {groups.map((group) => (
            <Link
              key={group.slug}
              href={`/products/${group.slug}`}
              className="group flex flex-col border border-line bg-paper transition-colors hover:border-ink"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-paper">
                {group.image && (
                  <Image
                    src={group.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className={`transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                      group.image.fit === "contain" ? "object-contain p-6" : "object-cover"
                    }`}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  {group.count} {group.count === 1 ? "produkt" : "produkte"}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-red">
                  {group.name}
                </h3>
                {group.children.length > 0 && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{group.children.join(" · ")}</p>
                )}
                <span className="mt-auto flex items-center gap-2 pt-6 text-[12px] font-medium uppercase tracking-[0.08em] text-ink">
                  Shiko
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-red"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const reasons = [
  {
    number: "01",
    title: "Ekspertizë Teknike",
    body: "Njohuri e thelluar në inxhinieri trafiku, sinjalistikë dhe infrastrukturë rrugore.",
  },
  {
    number: "02",
    title: "Përvojë e Dëshmuar",
    body: "Operojmë në Kosovë që nga viti 2012, me evoluim të vazhdueshëm në shërbime.",
  },
  {
    number: "03",
    title: "Ekzekutim Profesional",
    body: "Nga planifikimi e deri te zbatimi në terren, me qasje të organizuar në çdo projekt.",
  },
  {
    number: "04",
    title: "Shërbim i Plotë",
    body: "Konsulencë, planifikim, furnizim, instalim dhe mbikëqyrje - nën një kulm.",
  },
];

function WhyLiriu() {
  return (
    <section aria-labelledby="home-why" className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Eyebrow>Pse LIRIU</Eyebrow>
          <h2 id="home-why" className={`${title} text-ink`}>
            Pse LIRIU.
          </h2>
        </div>
        <div className="grid border-t border-ink sm:grid-cols-2 lg:col-span-8">
          {reasons.map((reason) => (
            <div
              key={reason.number}
              className="border-b border-line py-8 sm:px-8 sm:odd:border-r sm:odd:pl-0 sm:even:pr-0 md:py-10"
            >
              <p className="text-sm font-bold tabular-nums text-red">{reason.number}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">{reason.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{reason.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { number: "01", title: "Vlerësimi", body: "Kuptojmë vendndodhjen, kërkesat dhe objektivat e projektit." },
  { number: "02", title: "Planifikimi", body: "Zhvillojmë qasjen teknike dhe afatet e punës." },
  { number: "03", title: "Dizajni", body: "Krijojmë zgjidhjen e sinjalistikës, trafikut ose infrastrukturës." },
  { number: "04", title: "Ekzekutimi", body: "Ndërtim dhe instalim profesional në terren." },
  { number: "05", title: "Mbikëqyrja", body: "Kontroll cilësie dhe mbikëqyrje teknike gjatë zbatimit." },
  { number: "06", title: "Përfundimi", body: "Dorëzimi final dhe mbyllja e projektit." },
];

// Drawn as a road: the steps sit on a dashed centre line - horizontal on
// large screens, vertical down the left edge below that.
function Process() {
  return (
    <section aria-label="Si Punojmë" className="bg-ink px-6 py-20 text-paper md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          tone="dark"
          eyebrow="Si Punojmë"
          heading="Procesi Ynë."
        />

        <ol className="relative mt-14 grid gap-10 md:mt-20 lg:grid-cols-6 lg:gap-6">
          <span
            aria-hidden
            className="absolute bottom-2 left-[5px] top-2 w-0.5 lg:hidden"
            style={laneDashes("180deg", "rgba(255,255,255,0.35)")}
          />
          <span
            aria-hidden
            className="absolute left-0 right-0 top-[5px] hidden h-0.5 lg:block"
            style={laneDashes("90deg", "rgba(255,255,255,0.35)")}
          />
          {steps.map((step) => (
            <li key={step.number} className="relative pl-10 lg:pl-0 lg:pt-12">
              <span aria-hidden className="absolute left-0 top-1 h-3 w-3 bg-red lg:top-0" />
              <p className="text-sm font-bold tabular-nums text-red">{step.number}</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-paper/60">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section aria-labelledby="home-cta" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Eyebrow>Filloni Projektin</Eyebrow>
        <h2 id="home-cta" className={`${statement} max-w-5xl text-ink`}>
          Gati për rrugë më të sigurta?
        </h2>

        <div className="mt-12 grid gap-10 border-t border-line pt-8 md:mt-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="flex flex-col gap-8">
            <p className={`${lead} text-muted`}>
              Na kontaktoni për një konsultim rreth projektit tuaj të radhës - sinjalistikë, inxhinieri trafiku ose
              infrastrukturë rrugore.
            </p>
            <dl className="flex flex-col gap-4 sm:flex-row sm:gap-14">
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Telefoni</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-ink">
                  <a href={`tel:${company.phone.international}`} className="transition-colors hover:text-red">
                    {company.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Email</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-ink">
                  <a href={`mailto:${company.email}`} className="break-all transition-colors hover:text-red">
                    {company.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center self-start bg-red px-8 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink md:self-end"
          >
            Kërko një Konsultim
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomepageSections() {
  return (
    <>
      <Intro />
      <Expertise />
      <Work />
      <Safety />
      <Products />
      <WhyLiriu />
      <Process />
      <FinalCta />
    </>
  );
}
