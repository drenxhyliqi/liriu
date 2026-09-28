"use client";

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from "react";

// `analytics` gates Vercel Web Analytics (site-analytics.tsx) and must gate
// any other tracking script added later. The site sets no marketing cookies.
export type Consent = { analytics: boolean };

type ConsentContextValue = {
  consent: Consent | null;
  ready: boolean;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  save: (consent: Consent) => void;
};

const STORAGE_KEY = "liriu-cookie-consent";
const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    startTransition(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setConsent({ analytics: Boolean(JSON.parse(raw).analytics) });
      } catch {}
      setReady(true);
    });
  }, []);

  const save = useCallback((next: Consent) => {
    setConsent(next);
    setPreferencesOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      consent,
      ready,
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      save,
    }),
    [consent, ready, preferencesOpen, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}
