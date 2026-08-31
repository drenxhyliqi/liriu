import type { Service } from "@/types";

// Service names/order are verified (brief section 08 / current offering).
// Site language is Albanian. shortDescription, overview, capabilities and
// process are marketing/technical copy and are intentionally left unset -
// CLIENT INFORMATION REQUIRED.
export const services: Service[] = [
  { slug: "horizontal-signage", number: "01", name: "Sinjalistika Horizontale" },
  { slug: "vertical-signage", number: "02", name: "Sinjalistika Vertikale" },
  { slug: "traffic-engineering", number: "03", name: "Inxhinieria e Trafikut" },
  {
    slug: "construction-installation",
    number: "04",
    name: "Ndërtim & Instalim",
  },
  {
    slug: "consulting-supervision",
    number: "05",
    name: "Konsulencë & Mbikëqyrje",
  },
  {
    slug: "traffic-accident-expertise",
    number: "06",
    name: "Ekspertizë Aksidentesh në Trafik",
  },
  {
    slug: "illuminated-signage-portals",
    number: "07",
    name: "Sinjalistikë e Ndriçuar & Portale",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
