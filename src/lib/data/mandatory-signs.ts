import type { ProductItem } from "@/types";

// Mandatory signs ("Shenjat e Detyrimit"). Not yet supplied by the client:
// "Shpejtësi që rekomandohet". Direction suffixes in brackets were added to tell
// otherwise identical names apart - confirm wording with the client.
export const mandatorySigns: ProductItem[] = [
  { slug: "kahje-majtas", name: "Kahje e detyruar (majtas)", image: { src: "/signs/detyrimit/kahje-majtas.webp", alt: "Kahje e detyruar (majtas)", width: 420, height: 420 } },
  { slug: "kahje-drejt", name: "Kahje e detyruar (drejt)", image: { src: "/signs/detyrimit/kahje-drejt.webp", alt: "Kahje e detyruar (drejt)", width: 417, height: 420 } },
  { slug: "kahje-kthim-djathtas", name: "Kahje e detyruar (kthim djathtas)", image: { src: "/signs/detyrimit/kahje-kthim-djathtas.webp", alt: "Kahje e detyruar (kthim djathtas)", width: 417, height: 420 } },
  { slug: "kahje-kthim-majtas", name: "Kahje e detyruar (kthim majtas)", image: { src: "/signs/detyrimit/kahje-kthim-majtas.webp", alt: "Kahje e detyruar (kthim majtas)", width: 417, height: 420 } },
  { slug: "kahje-kthim-gjysmerrethor", name: "Kahje e detyruar (kthim gjysmërrethor)", image: { src: "/signs/detyrimit/kahje-kthim-gjysmerrethor.webp", alt: "Kahje e detyruar (kthim gjysmërrethor)", width: 417, height: 420 } },
  { slug: "lejuara-drejt-majtas", name: "Kahje të lejuara (drejt ose majtas)", image: { src: "/signs/detyrimit/lejuara-drejt-majtas.webp", alt: "Kahje të lejuara (drejt ose majtas)", width: 417, height: 420 } },
  { slug: "lejuara-majtas-djathtas", name: "Kahje të lejuara (majtas ose djathtas)", image: { src: "/signs/detyrimit/lejuara-majtas-djathtas.webp", alt: "Kahje të lejuara (majtas ose djathtas)", width: 417, height: 420 } },
  { slug: "lejuara-drejt-djathtas", name: "Kahje të lejuara (drejt ose djathtas)", image: { src: "/signs/detyrimit/lejuara-drejt-djathtas.webp", alt: "Kahje të lejuara (drejt ose djathtas)", width: 417, height: 420 } },
  { slug: "anashkalim-majtas", name: "Anashkalim i detyruar nga ana e majtë", image: { src: "/signs/detyrimit/anashkalim-majtas.webp", alt: "Anashkalim i detyruar nga ana e majtë", width: 417, height: 420 } },
  { slug: "anashkalim-djathtas", name: "Anashkalim i detyruar nga ana e djathtë", image: { src: "/signs/detyrimit/anashkalim-djathtas.webp", alt: "Anashkalim i detyruar nga ana e djathtë", width: 417, height: 420 } },
  { slug: "rrjedhe-rrethore", name: "Rrjedhë rrethore e komunikacionit", image: { src: "/signs/detyrimit/rrjedhe-rrethore.webp", alt: "Rrjedhë rrethore e komunikacionit", width: 418, height: 420 } },
  { slug: "shteg-biciklista", name: "Shteg për biçiklistë", image: { src: "/signs/detyrimit/shteg-biciklista.webp", alt: "Shteg për biçiklistë", width: 417, height: 420 } },
  { slug: "shteg-kembesore", name: "Shteg për këmbësorë", image: { src: "/signs/detyrimit/shteg-kembesore.webp", alt: "Shteg për këmbësorë", width: 417, height: 420 } },
  { slug: "shteg-i-ndare", name: "Shteg i ndarë për biçiklistë dhe këmbësorë", image: { src: "/signs/detyrimit/shteg-i-ndare.webp", alt: "Shteg i ndarë për biçiklistë dhe këmbësorë", width: 417, height: 420 } },
  { slug: "pajisje-dimrore", name: "Pajisje dimrore (zinxhirë për dëborë)", image: { src: "/signs/detyrimit/pajisje-dimrore.webp", alt: "Pajisje dimrore (zinxhirë për dëborë)", width: 417, height: 420 } },
  { slug: "shteg-kalores", name: "Shteg për kalorës", image: { src: "/signs/detyrimit/shteg-kalores.webp", alt: "Shteg për kalorës", width: 417, height: 420 } },
  { slug: "shpejtesia-minimale", name: "Shpejtësia më e vogël e lejuar", image: { src: "/signs/detyrimit/shpejtesia-minimale.webp", alt: "Shpejtësia më e vogël e lejuar", width: 417, height: 420 } },
];
