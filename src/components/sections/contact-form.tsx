"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { services } from "@/lib/data/services";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full border border-line bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";
const labelClass = "mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-muted";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      projectType: String(data.get("projectType") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Diçka shkoi keq. Provoni përsëri.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Diçka shkoi keq. Provoni përsëri.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line p-8 md:p-10">
        <p className="font-display text-xl font-semibold text-ink">Mesazhi u dërgua.</p>
        <p className="mt-3 max-w-md text-muted leading-relaxed">
          Faleminderit që na kontaktuat. Do t&apos;ju përgjigjemi sa më shpejt të jetë e mundur.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-ink underline underline-offset-4 transition-colors hover:text-red"
        >
          Dërgo një mesazh tjetër
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Emri i Plotë *
          </label>
          <input id="name" name="name" type="text" required className={inputClass} placeholder="Emri Mbiemri" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="emri@shembull.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefoni
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+383 ..." />
        </div>
        <div>
          <label htmlFor="projectType" className={labelClass}>
            Lloji i Projektit
          </label>
          <div className="relative">
            <select
              id="projectType"
              name="projectType"
              defaultValue=""
              className={`${inputClass} appearance-none pr-11`}
            >
              <option value="" disabled>
                Zgjidhni një shërbim
              </option>
              {services.map((service) => (
                <option key={service.slug} value={service.name}>
                  {service.name}
                </option>
              ))}
              <option value="Tjetër">Tjetër</option>
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Mesazhi *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClass}
          placeholder="Na tregoni pak për projektin tuaj..."
        />
      </div>

      {error && <p className="text-sm text-red">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-fit items-center justify-center bg-red px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink disabled:opacity-60"
      >
        {status === "submitting" ? "Duke dërguar..." : "Dërgo Mesazhin"}
      </button>
    </form>
  );
}
