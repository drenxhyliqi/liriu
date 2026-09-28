"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "@/lib/consent-context";

// Vercel Web Analytics (cookieless, aggregate page views). Loaded only after
// the visitor turns on "Analitika" in the cookie preferences.
export function SiteAnalytics() {
  const { consent } = useConsent();
  if (!consent?.analytics) return null;
  return <Analytics />;
}
