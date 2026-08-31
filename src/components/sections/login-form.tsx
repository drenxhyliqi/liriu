"use client";

import * as React from "react";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

type Status = "idle" | "submitting" | "error";

// Sharp corners and 1px rules match the rest of the site. The focus state
// darkens the border and lays a soft ink halo behind it, so it reads on
// both the white form column and (on mobile) any zoomed-in browser chrome.
const inputClass =
  "w-full border border-line bg-surface/50 py-3.5 pl-11 pr-4 text-[15px] text-ink outline-none transition-[background-color,border-color,box-shadow] placeholder:text-muted/70 focus:border-ink focus:bg-paper focus:ring-2 focus:ring-ink/10 disabled:opacity-60";
const labelClass =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-muted";
const iconClass =
  "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-colors group-focus-within:text-ink";

export function LoginForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const submitting = status === "submitting";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Diçka shkoi keq. Provoni përsëri.");

      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Diçka shkoi keq. Provoni përsëri.");
    }
  }

  return (
    // `noValidate` suppresses the browser's own validation bubble - it is
    // unstyleable and localised by the browser, not the site. The API
    // already rejects empty fields with an Albanian message, which renders
    // in the styled error block below.
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <div className="group relative">
          <Mail aria-hidden className={iconClass} />
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={submitting}
            autoComplete="username"
            className={inputClass}
            placeholder="admin@liriu.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Fjalëkalimi
        </label>
        <div className="group relative">
          <Lock aria-hidden className={iconClass} />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            disabled={submitting}
            autoComplete="current-password"
            className={`${inputClass} pr-12`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            // Labelled rather than icon-only so screen readers announce the
            // current state, not just "button".
            aria-label={showPassword ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin"}
            aria-pressed={showPassword}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
          >
            {showPassword ? (
              <EyeOff aria-hidden className="h-4 w-4" />
            ) : (
              <Eye aria-hidden className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 border-l-2 border-red bg-red/5 px-3.5 py-3 text-[13px] leading-relaxed text-ink"
        >
          <AlertCircle aria-hidden className="mt-px h-4 w-4 shrink-0 text-red" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex items-center justify-center gap-2 bg-red px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
        {submitting ? "Duke u identifikuar..." : "Kyçu"}
      </button>
    </form>
  );
}
