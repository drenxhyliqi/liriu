import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Typography: Space Grotesk (display/headlines/wordmark) for a technical,
// geometric, engineering-drawing character; Inter (body/UI) for maximum
// legibility at small sizes. Both accessible Google Fonts. Final sizing
// scale is defined when we build the type system, not here.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

// Placeholder metadata - final SEO copy comes later (brief section 25).
// Site language is Albanian.
export const metadata: Metadata = {
  title: "NSH LIRIU",
  description:
    "Inxhinieri trafiku, sinjalistikë rrugore dhe infrastrukturë - Suharekë, Kosovë.",
};

// Pins Safari/Chrome mobile toolbar tint to white so the full-bleed red
// homepage panel is never sampled as the browser chrome color.
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Deliberately bare - no Navbar/Footer here. Those live in
// `(site)/layout.tsx` so `/login` (outside that group) can be a full-bleed
// standalone screen instead of inheriting the main site's chrome.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sq"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
