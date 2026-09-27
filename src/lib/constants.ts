// Verified company facts only. Anything not confirmed by the client stays
// out of this file - see src/lib/data/README.md and brief section 27.

export const company = {
  name: "NSH LIRIU",
  location: "Suharekë, Kosovë",
  mapsUrl: "https://maps.app.goo.gl/yG67XsiDDmwz2nX86",
  // Embeddable form of mapsUrl above (same pin, resolved to coordinates -
  // Google's share links can't be embedded directly in an iframe).
  mapsEmbedUrl: "https://www.google.com/maps?q=42.3623359,20.8312462&z=16&t=k&output=embed",
  founded: 2012,
  slogan: {
    sq: "Klientët tanë, reklama jonë.",
    en: "Our clients are our advertisement.",
  },
} as const;

// Site language is Albanian (sq) only - see src/app/layout.tsx `lang="sq"`.
export const mainNav = [
  { label: "Ballina", href: "/" },
  { label: "Rreth Nesh", href: "/about" },
  { label: "Shërbimet", href: "/services" },
  { label: "Produktet", href: "/products" },
  { label: "Projektet", href: "/projects" },
  { label: "Kontakt", href: "/contact" },
] as const;
