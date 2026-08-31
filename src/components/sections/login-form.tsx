"use client";

import * as React from "react";
import { Lock, Mail } from "lucide-react";

type Status = "idle" | "submitting" | "error";

const inputClass =
  "w-full border border-line bg-paper py-3 pl-11 pr-4 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";
const labelClass = "mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-muted";

export function LoginForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <div className="relative">
          <Mail aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input id="email" name="email" type="email" required autoComplete="username" className={inputClass} placeholder="admin@liriu.com" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Fjalëkalimi
        </label>
        <div className="relative">
          <Lock aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 inline-flex items-center justify-center bg-red px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink disabled:opacity-60"
      >
        {status === "submitting" ? "Duke u identifikuar..." : "Kyçu"}
      </button>
    </form>
  );
}
