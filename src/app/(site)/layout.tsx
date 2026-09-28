import { SiteChrome } from "@/components/layout/site-chrome";

// `/login` lives outside this route group deliberately - it's a full-bleed
// standalone screen, not a page within the site's navigation.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
