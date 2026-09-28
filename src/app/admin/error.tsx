"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { btnPrimary } from "@/components/admin/ui";

export default function AdminError({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="border border-line bg-paper px-6 py-14 text-center">
      <AlertTriangle aria-hidden className="mx-auto h-8 w-8 text-red" strokeWidth={1.5} />
      <p className="mt-4 font-display text-lg font-semibold text-ink">Të dhënat nuk u ngarkuan</p>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-muted">
        {error.message && !error.message.startsWith("An error occurred")
          ? error.message
          : "Serveri nuk u përgjigj. Kontrolloni që API-ja është në punë dhe provoni përsëri."}
      </p>
      <button type="button" onClick={() => retry()} className={`${btnPrimary} mt-6`}>
        <RotateCw aria-hidden className="h-4 w-4" />
        Provo përsëri
      </button>
    </div>
  );
}
