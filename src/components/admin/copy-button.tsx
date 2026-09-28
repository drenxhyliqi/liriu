"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label = "Kopjo" }: { value: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard unavailable (e.g. insecure context) - nothing to do.
        }
      }}
      aria-label={copied ? "U kopjua" : label}
      title={copied ? "U kopjua" : label}
      className="flex h-7 w-7 shrink-0 items-center justify-center text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink"
    >
      {copied ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Copy aria-hidden className="h-3.5 w-3.5" />}
    </button>
  );
}
