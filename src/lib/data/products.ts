import type { Product, ProductGroup, ProductItem, ProductVariant } from "@/types";
import { mandatorySigns } from "@/lib/data/mandatory-signs";
import { notificationSigns } from "@/lib/data/notification-signs";
import { prohibitorySigns } from "@/lib/data/prohibitory-signs";
import { dangerSigns } from "@/lib/data/warning-signs";

// Signs are defined once (in the sign data files) and referenced by slug, so
// the same sign can be listed in every category it belongs to.
const signPool = [...prohibitorySigns, ...notificationSigns, ...mandatorySigns, ...dangerSigns];

function pick(...slugs: string[]): ProductItem[] {
  return slugs.map((slug) => {
    const sign = signPool.find((item) => item.slug === slug);
    if (!sign) throw new Error(`Unknown sign slug: ${slug}`);
    return sign;
  });
}


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
    image: {
      src: "/categories/sinjalistike-vertikale.webp",
      alt: "Shenja trafiku vertikale përgjatë një rruge",
      width: 1448,
      height: 1086,
    },
  },
  {
    slug: "information-signs",
    name: "Shenja Informacioni & Orientimi",
    groupSlug: "vertical-signage",
    description: "Tabela orientuese dhe informative për drejtim dhe destinacion.",
    image: {
      src: "/categories/shenja-informacioni-orientimi.webp",
      alt: "Shenja informacioni dhe orientimi: drejtime, parkim, karburant, hotel dhe restorant",
      width: 1200,
      height: 800,
    },
  },
  {
    slug: "street-name-plates",
    name: "Tabela me Emra Rrugësh",
    groupSlug: "vertical-signage",
    description: "Sinjalistikë identifikuese për rrugë, lagje dhe zona urbane.",
    image: {
      src: "/categories/tabela-me-emra-rrugesh-qytet.webp",
      alt: "Tabela me emra rrugësh në shtylla, në një sheshi qyteti",
      width: 1200,
      height: 800,
    },
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
    image: {
      src: "/categories/sinjalistike-led.webp",
      alt: "Panel LED me shenjë punimesh në rrugë natën, me kone dhe shenja kthese",
      width: 1200,
      height: 800,
    },
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
    slug: "urdhera-te-prera",
    name: "Shenjat e Urdhërave të Prera",
    productSlug: "traffic-signs",
    description:
      "Shenjat e komunikacionit për urdhra të prera u japin në dijeni pjesëmarrësve në komunikacion në rrugë për ndalesat, për kufizimet dhe obligimet të cilave ata doemos duhet t'u përmbahen. Shenjat e urdhrave të prera vendosen drejtpërdrejt para vendit nga i cili pjesëmarrësit në trafik obligohen t'u përmbahen urdhëresave të shprehura me shenjat e komunikacionit. Këto shenja kanë vlerë deri te udhëkryqi pas shenjës, përkatësisht deri te shenja e ardhshme që e ndërron (shfuqizon) urdhëresën e prerë. Shenjat e urdhrave të prera kanë formë rrethi.\n\nShenjat e urdhrave të prera ndahen në:\n• Shenja për ndalim, gjegjësisht kufizim - ngjyrën bazë e kanë të bardhë me teh të kuq.\n• Shenja për obligim - ngjyrë bazë e kanë të kaltër të mbyllur, ndërsa simbolet janë me ngjyrë të bardhë.",
    image: {
      src: "/categories/shenja-ndalese.webp",
      alt: "Shenja e ndalimit STOP",
      width: 800,
      height: 800,
    },
    items: prohibitorySigns,
  },
  {
    slug: "paralajmeruese",
    name: "Shenja Paralajmëruese",
    productSlug: "traffic-signs",
    description:
      "Shenjat e komunikacionit për rrezik shërbejnë që pjesëmarrësit në komunikacion të paralajmërohen për rrezikun që u kanoset në vend të caktuar, gjegjësisht në një pjesë të rrugës, dhe të lajmërohen për natyrën e atij rreziku. Shenjat për rrezik kanë formë të trekëndëshit barabrinjës. Ngjyrën bazë e kanë të bardhë, simbolet janë të paraqitura me ngjyrë të zezë, ndërsa tehet i kanë me ngjyrë të kuqe. Jashtë vendbanimit, shenjat e rrezikut sipas rregullave vihen prej 150 deri në 250 m para vendit të rrezikshëm në rrugë.",
    image: {
      src: "/categories/shenja-paralajmeruese.webp",
      alt: "Shenja paralajmëruese për kthesa të njëpasnjëshme",
      width: 800,
      height: 800,
    },
    items: dangerSigns,
  },
  {
    slug: "detyrimit",
    name: "Shenjat e Detyrimit",
    productSlug: "traffic-signs",
    description: "Shenja që përcaktojnë një sjellje të detyrueshme, si drejtimi i lëvizjes apo shpejtësia minimale.",
    image: {
      src: "/categories/shenja-urdheruese.webp",
      alt: "Shenja urdhëruese e drejtimit përpara",
      width: 800,
      height: 800,
    },
    items: mandatorySigns,
  },
  {
    slug: "lajmerimit",
    name: "Shenjat e Lajmërimit",
    productSlug: "traffic-signs",
    description:
      "Shenjat e lajmërimit u japin pjesëmarrësve në komunikacion lajmërimet e nevojshme për rrugën nëpër të cilën qarkullojnë, vendbanimet nëpër të cilat kalon rruga, largësinë deri te ato vende, objekte apo shërbime që gjenden përgjatë rrugës, për shfuqizimin e shenjave të urdhrave të prera, si dhe lajmërime të tjera që mund të jenë të nevojshme. Këto shenja kanë formë rrethi, katrori apo këndrejti. Ngjyra themelore e shenjave për lajmërim është e bardhë apo e verdhë ndriçuese, me simbole dhe mbishkrime me ngjyrë të zezë, gjegjësisht e kaltër e errët me simbole dhe mbishkrime me ngjyrë të bardhë dhe të zezë.",
    image: {
      src: "/categories/shenja-perparesie.webp",
      alt: "Shenja e rrugës me përparësi",
      width: 800,
      height: 800,
    },
    items: notificationSigns,
  },

  // Shenja Informacioni & Orientimi
  {
    slug: "drejtimi",
    name: "Shenja Drejtimi",
    productSlug: "information-signs",
    items: pick(
      "rreshtimi-i-automjeteve",
      "rruge-pa-dalje",
      "udhetregues-per-anashkalim",
      "kahe-per-anashkalim-per-disa-lloje-te-automjetev",
      "kahe-per-anashkalim-per-disa-lloje-te-automjetev-84",
      "shenja-e-largesise-deri-te-dalja-100-200-300-m",
      "shenje-per-numrin-e-daljes-ose-nyjes",
      "shenje-per-nyje-te-autostradave",
    ),
    description: "Tabela që udhëzojnë drejtuesit drejt destinacioneve dhe rrugëve kryesore.",
    image: {
      src: "/categories/shenja-drejtimi.webp",
      alt: "Shenja e drejtimit të lëvizjes përpara",
      width: 800,
      height: 800,
    },
  },
  {
    slug: "destinacioni",
    name: "Shenja Destinacioni",
    productSlug: "information-signs",
    image: pick("paraudhetregues")[0].image,
    items: pick(
      "rreshtimi-i-automjeteve-me-emertim-te-vendbanime",
      "parashenje-per-anashkalim",
      "paraudhetregues",
      "tabele-paraudhetreguese-per-dalje",
    ),
    description: "Tabela që tregojnë distancën dhe drejtimin për qytete, zona apo objekte kryesore.",
  },
  {
    slug: "sherbimesh",
    name: "Shenja Shërbimesh",
    productSlug: "information-signs",
    image: pick("spital")[0].image,
    items: pick(
      "spital",
      "stacion-policor",
      "stacion-per-ndihme-te-pare",
      "taxi-vendqendrim",
      "pompe-benzini",
      "telefon",
      "punetori-per-rregullim-te-automjeteve-oficine",
      "uje-i-pijshem",
      "informata",
      "restorant",
      "kafeteri",
      "tualet-wc",
      "hotel-ose-motel",
      "teren-per-kamping-ne-kamp-shtepiza",
      "teren-per-kamping-nen-tenda",
      "teren-per-kamping-me-automjete",
      "shtepi-malore",
      "teren-i-rregulluar-per-piknik",
      "vendqendrim-per-autobuse",
      "aeroport",
      "stacion-per-tramvaj",
      "port-detar-traekt",
      "vendparkim",
      "garazhe",
    ),
    description: "Tabela informuese për shërbime përgjatë rrugës, si parkime apo pika interesi.",
  },

  // Tabela me Emra Rrugësh
  {
    slug: "standarde",
    name: "Tabela Standarde",
    productSlug: "street-name-plates",
    image: pick("numri-i-autostrades")[0].image,
    items: pick(
      "numri-i-autostrades",
      "numri-i-rruges-nderkombetare",
      "numri-i-rruges-ekspres-rruge-magjistrale-dhe-rru",
      "numri-i-rruges-regjionale",
    ),
    description: "Tabela identifikuese për emrin e rrugës, në format standard.",
  },
  {
    slug: "sheshe-lagje",
    name: "Tabela për Sheshe & Lagje",
    productSlug: "street-name-plates",
    image: {
      src: "/categories/tabela-per-sheshe.webp",
      alt: "Tabelë për shesh: Sheshi / Trg. Gjergj Kastrioti Skënderbeu",
      width: 500,
      height: 230,
    },
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
    image: { src: "/categories/shtylla-delineatore.webp", alt: "Shtyllë delineatore fleksibile me shirita reflektuese", width: 178, height: 715 },
    description: "Shtylla anësore që ndihmojnë në orientimin e drejtuesve përgjatë rrugës.",
  },
  {
    slug: "reflektore-anesore",
    name: "Reflektorë Anësorë",
    productSlug: "delineators",
    image: { src: "/categories/reflektore-anesore.webp", alt: "Reflektor anësor me shenjë kthese në shtyllë", width: 427, height: 800 },
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
    image: pick("vendparkim")[0].image,
    items: pick(
      "parkimi",
      "ndaljes-parkimit",
      "parkim-tek",
      "parkim-cift",
      "zone-ku-kufizohet-kohezgjatja-e-parkimit",
      "mbarimi-i-zones-ku-kufizohet-kohezgjatja-e-parki",
      "vendparkim",
      "garazhe",
      "kufizim-kohor-i-parkimit",
    ),
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

export function getItem(productSlug: string, variantSlug: string, itemSlug: string) {
  return getVariant(productSlug, variantSlug)?.items?.find((item) => item.slug === itemSlug);
}
