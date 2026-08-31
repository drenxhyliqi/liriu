import type { Metadata } from "next";
import { OrderRequest } from "@/components/sections/order-request";

export const metadata: Metadata = {
  title: "Porosia | NSH LIRIU",
  robots: { index: false, follow: false },
};

export default function PorosiaPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="h-px w-8 bg-red" />
            Porosia
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Dërgo kërkesën tuaj.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Rishikoni artikujt e zgjedhur dhe na dërgoni të dhënat tuaja -
            do t&apos;ju kontaktojmë me një ofertë të përshtatur.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <OrderRequest />
        </div>
      </section>
    </main>
  );
}
