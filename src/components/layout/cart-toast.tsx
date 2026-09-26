"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const VISIBLE_MS = 2500;

export function CartToast() {
  const { notice, dismissNotice } = useCart();

  React.useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(dismissNotice, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [notice, dismissNotice]);

  return (
    <div
      className="pointer-events-none fixed inset-x-4 z-[95] flex justify-end sm:inset-x-auto sm:right-6"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice.id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full items-center gap-3 border-l-4 border-l-red bg-ink px-4 py-3.5 text-paper shadow-2xl sm:w-auto"
          >
            <Check aria-hidden className="h-4 w-4 shrink-0 text-paper" />
            <p className="text-[14px] font-medium">Produkti u shtua në porosi</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
