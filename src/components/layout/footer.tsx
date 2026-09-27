import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { FacebookIcon, WhatsAppIcon } from "@/components/icons/social-icons";
import { CookiePreferencesButton } from "@/components/layout/cookie-preferences-button";
import { services } from "@/lib/data/services";
import { company, mainNav } from "@/lib/constants";
import { socialPlaceholder } from "@/lib/social-placeholder";

const columnLabel = "text-xs font-medium uppercase tracking-[0.14em] text-paper/40";
const link = "text-[15px] text-paper/75 transition-colors hover:text-red";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center">
              <Image src="/brand/logo-white.png" alt="NSH LIRIU" width={72} height={72} className="h-14 w-14" />
            </Link>
            <p className="mt-5 max-w-[32ch] text-sm italic leading-relaxed text-paper/50">
              &ldquo;{company.slogan.sq}&rdquo;
            </p>
          </div>

          <nav aria-label="Navigimi" className="lg:col-span-2">
            <p className={columnLabel}>Navigimi</p>
            <ul className="mt-5 flex flex-col gap-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Shërbimet" className="lg:col-span-3">
            <p className={columnLabel}>Shërbimet</p>
            <ul className="mt-5 flex flex-col gap-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className={link}>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className={columnLabel}>Kontakt</p>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={company.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-paper/75 transition-colors hover:text-red"
              >
                {company.location}
              </Link>
              <Link href="/contact" className="group inline-flex items-center gap-1.5 text-[15px] text-paper transition-colors hover:text-red">
                Na kontaktoni
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 -translate-y-px transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-1"
                />
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href={socialPlaceholder.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-paper/70 transition-colors hover:border-red hover:text-red"
              >
                <FacebookIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`https://wa.me/${socialPlaceholder.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-paper/70 transition-colors hover:border-red hover:text-red"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`mailto:${socialPlaceholder.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-paper/70 transition-colors hover:border-red hover:text-red"
              >
                <Mail aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. Të gjitha të drejtat e rezervuara.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/privacy" className="transition-colors hover:text-red">Politika e Privatësisë</Link></li>
            <li><Link href="/cookies" className="transition-colors hover:text-red">Politika e Cookies</Link></li>
            <li><Link href="/terms" className="transition-colors hover:text-red">Kushtet e Përdorimit</Link></li>
            <li><CookiePreferencesButton className="transition-colors hover:text-red" /></li>
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-paper/40">
          Site by{" "}
          <Link
            href="https://www.venight.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-red"
          >
            Venight
          </Link>
        </p>
      </div>
    </footer>
  );
}
