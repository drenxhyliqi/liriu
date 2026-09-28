import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CartToast } from "@/components/layout/cart-toast";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { SiteAnalytics } from "@/components/layout/site-analytics";
import { ConsentProvider } from "@/lib/consent-context";
import { CartProvider } from "@/lib/cart-context";

// Navbar + footer for the public site. Shared by the (site) layout and the
// root not-found page, which renders outside that route group.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      <CartProvider>
        <Navbar />
        <div className="flex flex-1 flex-col pt-16 md:pt-20">{children}</div>
        <Footer />
        <CookieConsent />
        <SiteAnalytics />
        <CartToast />
      </CartProvider>
    </ConsentProvider>
  );
}
