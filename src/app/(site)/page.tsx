import { Hero } from "@/components/sections/hero";
import { HomepageStory } from "@/components/sections/homepage-story";
import { company } from "@/lib/constants";
import { SITE_URL } from "@/lib/site-url";

// Verified facts only (src/lib/constants.ts). Social profiles are left out
// until the client confirms them.
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  url: SITE_URL,
  telephone: company.phone.international,
  email: company.email,
  logo: `${SITE_URL}/brand/logo.png`,
  image: `${SITE_URL}/brand/logo.png`,
  slogan: company.slogan.sq,
  foundingDate: String(company.founded),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Suharekë",
    addressCountry: "XK",
  },
  geo: { "@type": "GeoCoordinates", latitude: 42.3623359, longitude: 20.8312462 },
  hasMap: company.mapsUrl,
  areaServed: "Kosovë",
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <HomepageStory />
    </main>
  );
}
