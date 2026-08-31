import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CartProvider } from "@/lib/cart-context";

// Chrome (navbar + footer) for every page on the main site. `/login` lives
// outside this route group deliberately - it's a full-bleed standalone
// screen, not a page within the site's navigation.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <div className="flex flex-1 flex-col pt-16 md:pt-20">{children}</div>
      <Footer />
    </CartProvider>
  );
}
