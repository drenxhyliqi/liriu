import type { Product, ProductGroup, ProductVariant } from "@/types";

// STARTER STRUCTURE - CLIENT INFORMATION REQUIRED.
// Groups and product types are drawn from (a) LIRIU's own confirmed
// service categories (see services.ts) and (b) standard, generic
// terminology used across the road-signage industry - not invented
// company-specific claims. Variants below are standard, universal design
// categories (e.g. prohibitory/warning/mandatory signs are defined by
// road-signage regulation, not a LIRIU-specific catalog) - not real SKUs.
//
// Before this goes live, LIRIU needs to confirm/edit:
// - which of these product types and variants they actually supply
// - real product photography (currently rendered as abstract icon panels,
//   no stock photos used)
// - any technical spec sheets, if applicable
export const productGroups: ProductGroup[] = [
  { slug: "vertical-signage", name: "Sinjalistikë Vertikale" },
  { slug: "illuminated", name: "Sinjalistikë e Ndriçuar" },
  { slug: "road-safety", name: "Siguri & Përcaktim Rrugësh" },
  { slug: "street-furniture", name: "Mobilje Rrugore" },
];

export const products: Product[] = [
  {
    slug: "traffic-signs",
    name: "Shenja Trafiku",
    groupSlug: "vertical-signage",
    description: "Shenja rregullative, paralajmëruese dhe udhëzuese sipas standardeve rrugore.",
  },
  {
    slug: "information-signs",
    name: "Shenja Informacioni & Orientimi",
    groupSlug: "vertical-signage",
    description: "Tabela orientuese dhe informative për drejtim dhe destinacion.",
  },
  {
    slug: "street-name-plates",
    name: "Tabela me Emra Rrugësh",
    groupSlug: "vertical-signage",
    description: "Sinjalistikë identifikuese për rrugë, lagje dhe zona urbane.",
  },
  {
    slug: "poles-brackets",
    name: "Shtylla & Mbajtëse",
    groupSlug: "vertical-signage",
    description: "Struktura montimi për vendosjen e qëndrueshme të sinjalistikës.",
  },
  {
    slug: "signage-portals",
    name: "Portale Sinjalistike",
    groupSlug: "illuminated",
    description: "Struktura mbi rrugë për sinjalistikë me shikueshmëri të lartë.",
  },
  {
    slug: "led-signage",
    name: "Sinjalistikë me Ndriçim LED",
    groupSlug: "illuminated",
    description: "Sinjalistikë e ndriçuar për shikueshmëri gjatë natës dhe kushteve të vështira.",
  },
  {
    slug: "traffic-cones",
    name: "Kone Trafiku",
    groupSlug: "road-safety",
    description: "Përcaktim i përkohshëm i zonave të punës dhe devijimeve.",
  },
  {
    slug: "delineators",
    name: "Delineatorë & Reflektorë",
    groupSlug: "road-safety",
    description: "Shenjues anësorë për orientim dhe siguri gjatë natës.",
  },
  {
    slug: "barriers",
    name: "Pengesa & Barriera",
    groupSlug: "road-safety",
    description: "Ndarje dhe mbrojtje fizike për zona pune dhe kantiere.",
  },
  {
    slug: "traffic-mirrors",
    name: "Pasqyra Trafiku",
    groupSlug: "street-furniture",
    description: "Pasqyra për shikueshmëri në kryqëzime dhe kthesa të kufizuara.",
  },
  {
    slug: "parking-solutions",
    name: "Zgjidhje për Parkim",
    groupSlug: "street-furniture",
    description: "Sinjalistikë dhe pajisje për organizimin e hapësirave të parkimit.",
  },
];

export const productVariants: ProductVariant[] = [
  // Shenja Trafiku - standard regulatory sign categories
  {
    slug: "ndalese",
    name: "Shenja Ndalese",
    productSlug: "traffic-signs",
    description: "Shenja që ndalojnë ose kufizojnë veprime specifike në rrugë, sipas standardeve rregullative.",
  },
  {
    slug: "paralajmeruese",
    name: "Shenja Paralajmëruese",
    productSlug: "traffic-signs",
    description: "Shenja që njoftojnë drejtuesit për rreziqe ose kushte të veçanta përpara tyre.",
  },
  {
    slug: "urdheruese",
    name: "Shenja Urdhëruese",
    productSlug: "traffic-signs",
    description: "Shenja që përcaktojnë një sjellje të detyrueshme, si drejtimi i lëvizjes apo shpejtësia minimale.",
  },
  {
    slug: "perparesie",
    name: "Shenja Përparësie",
    productSlug: "traffic-signs",
    description: "Shenja që rregullojnë përparësinë e kalimit në kryqëzime dhe ngushtime rruge.",
  },

  // Shenja Informacioni & Orientimi
  {
    slug: "drejtimi",
    name: "Shenja Drejtimi",
    productSlug: "information-signs",
    description: "Tabela që udhëzojnë drejtuesit drejt destinacioneve dhe rrugëve kryesore.",
  },
  {
    slug: "destinacioni",
    name: "Shenja Destinacioni",
    productSlug: "information-signs",
    description: "Tabela që tregojnë distancën dhe drejtimin për qytete, zona apo objekte kryesore.",
  },
  {
    slug: "sherbimesh",
    name: "Shenja Shërbimesh",
    productSlug: "information-signs",
    description: "Tabela informuese për shërbime përgjatë rrugës, si parkime apo pika interesi.",
  },

  // Tabela me Emra Rrugësh
  {
    slug: "standarde",
    name: "Tabela Standarde",
    productSlug: "street-name-plates",
    description: "Tabela identifikuese për emrin e rrugës, në format standard.",
  },
  {
    slug: "sheshe-lagje",
    name: "Tabela për Sheshe & Lagje",
    productSlug: "street-name-plates",
    description: "Tabela identifikuese për shesh, lagje apo zonë urbane specifike.",
  },

  // Shtylla & Mbajtëse
  {
    slug: "shtylla-metalike",
    name: "Shtylla Metalike",
    productSlug: "poles-brackets",
    description: "Struktura vertikale për montimin e qëndrueshëm të sinjalistikës rrugore.",
  },
  {
    slug: "mbajtese-njeshe",
    name: "Mbajtëse për Shenja të Vetme",
    productSlug: "poles-brackets",
    description: "Mbajtëse për montimin e një shenje të vetme mbi shtyllë.",
  },
  {
    slug: "mbajtese-shumefishta",
    name: "Mbajtëse për Shenja të Shumëfishta",
    productSlug: "poles-brackets",
    description: "Mbajtëse që lejojnë montimin e disa shenjave njëkohësisht mbi të njëjtën shtyllë.",
  },

  // Portale Sinjalistike
  {
    slug: "krah-i-vetem",
    name: "Portal me Krah të Vetëm",
    productSlug: "signage-portals",
    description: "Strukturë me krah anësor për vendosjen e sinjalistikës mbi një pjesë të rrugës.",
  },
  {
    slug: "krah-i-dyfishte",
    name: "Portal me Krah të Dyfishtë",
    productSlug: "signage-portals",
    description: "Strukturë që kalon mbi të gjithë gjerësinë e rrugës për shikueshmëri maksimale.",
  },

  // Sinjalistikë me Ndriçim LED
  {
    slug: "led-integruar",
    name: "Shenja me LED të Integruar",
    productSlug: "led-signage",
    description: "Sinjalistikë me ndriçim të integruar për shikueshmëri gjatë natës.",
  },
  {
    slug: "panel-mesazh",
    name: "Panel me Mesazh të Ndryshueshëm",
    productSlug: "led-signage",
    description: "Panele elektronike që shfaqin mesazhe ose paralajmërime të ndryshueshme.",
  },

  // Kone Trafiku
  {
    slug: "kone-standarde",
    name: "Kone Standarde",
    productSlug: "traffic-cones",
    description: "Kone të lehta për përcaktim të përkohshëm të zonave dhe devijimeve.",
  },
  {
    slug: "kone-baze-e-rende",
    name: "Kone me Bazë të Rëndë",
    productSlug: "traffic-cones",
    description: "Kone me bazë të qëndrueshme për kushte me erë ose trafik intensiv.",
  },

  // Delineatorë & Reflektorë
  {
    slug: "shtylla-delineatore",
    name: "Shtylla Delineatore",
    productSlug: "delineators",
    description: "Shtylla anësore që ndihmojnë në orientimin e drejtuesve përgjatë rrugës.",
  },
  {
    slug: "reflektore-anesore",
    name: "Reflektorë Anësorë",
    productSlug: "delineators",
    description: "Elemente reflektuese për shikueshmëri të përmirësuar gjatë natës.",
  },

  // Pengesa & Barriera
  {
    slug: "barriera-plastike",
    name: "Barriera Plastike",
    productSlug: "barriers",
    description: "Barriera të lehta për ndarjen e përkohshme të zonave të punës.",
  },
  {
    slug: "gardhe-ndarese",
    name: "Gardhe Ndarëse",
    productSlug: "barriers",
    description: "Gardhe për izolimin e kantiereve dhe zonave në ndërtim.",
  },

  // Pasqyra Trafiku
  {
    slug: "pasqyra-konvekse",
    name: "Pasqyra Konvekse",
    productSlug: "traffic-mirrors",
    description: "Pasqyra me kënd të gjerë pamjeje për zona me shikueshmëri të kufizuar.",
  },
  {
    slug: "pasqyra-kryqezime",
    name: "Pasqyra për Kryqëzime",
    productSlug: "traffic-mirrors",
    description: "Pasqyra të pozicionuara për të përmirësuar shikueshmërinë në kryqëzime.",
  },

  // Zgjidhje për Parkim
  {
    slug: "sinjalistike-parkimi",
    name: "Sinjalistikë Parkimi",
    productSlug: "parking-solutions",
    description: "Shenja që organizojnë dhe rregullojnë hapësirat e parkimit.",
  },
  {
    slug: "barriera-parkimi",
    name: "Barriera Parkimi",
    productSlug: "parking-solutions",
    description: "Barriera për kontrollin e hyrjes dhe daljes në hapësira parkimi.",
  },
];

export function getProductsByGroup(groupSlug: string) {
  return products.filter((product) => product.groupSlug === groupSlug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getVariantsByProduct(productSlug: string) {
  return productVariants.filter((variant) => variant.productSlug === productSlug);
}

export function getVariant(productSlug: string, variantSlug: string) {
  return productVariants.find(
    (variant) => variant.productSlug === productSlug && variant.slug === variantSlug,
  );
}
