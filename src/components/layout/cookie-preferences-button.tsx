"use client";

import { useConsent } from "@/lib/consent-context";

export function CookiePreferencesButton({ className }: { className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      Preferencat e cookies
    </button>
  );
}
