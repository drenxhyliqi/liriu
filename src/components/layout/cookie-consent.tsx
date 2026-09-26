"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useConsent } from "@/lib/consent-context";

const btn =
  "h-11 px-5 text-sm font-medium uppercase tracking-[0.08em] transition-colors";
const btnPrimary = `${btn} bg-red text-paper hover:bg-red-ink`;
const btnOutline = `${btn} border border-ink/25 text-ink hover:border-red hover:text-red`;

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 transition-colors ${checked ? "bg-red" : "bg-ink/25"} ${disabled ? "opacity-60" : ""}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 bg-paper transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

function Preferences() {
  const { consent, save, closePreferences } = useConsent();
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePreferences();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closePreferences]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Preferencat e cookies"
        className="max-h-svh w-full max-w-lg overflow-y-auto bg-paper p-6 text-ink sm:p-8"
      >
        <h2 className="font-display text-2xl font-semibold tracking-tight">Preferencat e cookies</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Zgjidhni cilat kategori të cookies lejoni. Mund t&apos;i ndryshoni
          zgjedhjet në çdo kohë nga fundi i faqes.
        </p>

        <div className="mt-6 divide-y divide-line border-y border-line">
          <div className="flex items-start justify-between gap-6 py-5">
            <div>
              <p className="font-medium">Të domosdoshme</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Ruajnë shportën e kërkesës për ofertë dhe zgjedhjet tuaja për cookies. Faqja nuk funksionon pa to.
              </p>
            </div>
            <Toggle checked disabled label="Të domosdoshme" />
          </div>
          <div className="flex items-start justify-between gap-6 py-5">
            <div>
              <p className="font-medium">Analitika</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Do të na ndihmonin të kuptojmë se si përdoret faqja. Aktualisht nuk përdorim asnjë shërbim analitik.
              </p>
            </div>
            <Toggle checked={analytics} onChange={setAnalytics} label="Analitika" />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" className={btnOutline} onClick={() => save({ analytics: false })}>
            Refuzo të gjitha
          </button>
          <button type="button" className={btnPrimary} onClick={() => save({ analytics })}>
            Ruaj zgjedhjet
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function CookieConsent() {
  const { consent, ready, preferencesOpen, openPreferences, save } = useConsent();

  return (
    <>
      {ready && !consent && !preferencesOpen && (
        <div
          role="region"
          aria-label="Njoftim për cookies"
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-paper text-ink shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
            <p className="max-w-3xl text-sm leading-relaxed text-ink/80">
              Përdorim cookies të domosdoshme që faqja të funksionojë. Mund të zgjidhni edhe cookies opsionale.
              Lexoni{" "}
              <Link href="/cookies" className="underline underline-offset-2 hover:text-red">
                Politikën e Cookies
              </Link>
              .
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
              <button type="button" className={btnOutline} onClick={openPreferences}>
                Preferencat
              </button>
              <button type="button" className={btnOutline} onClick={() => save({ analytics: false })}>
                Refuzo
              </button>
              <button type="button" className={btnPrimary} onClick={() => save({ analytics: true })}>
                Prano të gjitha
              </button>
            </div>
          </div>
        </div>
      )}
      {preferencesOpen && <Preferences />}
    </>
  );
}
