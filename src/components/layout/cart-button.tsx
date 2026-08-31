"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function CartButton({ light }: { light?: boolean }) {
  const { items, totalQuantity, removeItem, updateQuantity, clear } = useCart();
  const [open, setOpen] = React.useState(false);

  // The drawer is portalled to <body> rather than rendered here, because this
  // button sits inside the <header> - and that header becomes a *containing
  // block* for `position: fixed` descendants the moment it has either a
  // transform (framer-motion's hide-on-scroll `y`, where even an identity
  // matrix counts) or a backdrop-filter (`backdrop-blur-sm`, applied once
  // scrolled). Either one re-anchors the drawer's `inset-y-0` to the 80px-tall
  // header instead of the viewport, collapsing it to a sliver with the overlay
  // dimming only the navbar strip. Portalling lifts it out of that subtree.
  const [mounted, setMounted] = React.useState(false);

  // `document.body` only exists client-side, so the portal can't be created
  // during SSR/the first hydration pass - startTransition keeps this flip out
  // of the synchronous render cascade (same pattern as the cart's storage read).
  React.useEffect(() => {
    React.startTransition(() => setMounted(true));
  }, []);

  React.useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Kept mounted (rather than gated on `open`) so AnimatePresence still has a
  // tree to run the exit animation in when the drawer closes.
  const drawer = (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-ink/50"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col border-l border-line bg-paper shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-semibold text-ink">
                Porosia ({totalQuantity})
              </h2>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="px-2 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-muted transition-colors hover:text-red"
                  >
                    Fshi të Gjitha
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Mbyll"
                  className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="mt-8 text-center text-sm text-muted">
                  Porosia juaj është bosh. Shtoni produkte nga katalogu.
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-start justify-between gap-3 border-b border-line pb-4"
                    >
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.06em] text-red">
                          {item.groupName}
                        </p>
                        <p className="mt-1 text-[14px] font-medium text-ink">{item.name}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, -1)}
                            aria-label="Zvogëlo sasinë"
                            className="flex h-6 w-6 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-[13px] text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, 1)}
                            aria-label="Shto sasinë"
                            className="flex h-6 w-6 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Hiq ${item.name}`}
                        className="mt-1 text-muted transition-colors hover:text-red"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-line p-5">
              <Link
                href="/porosia"
                onClick={() => setOpen(false)}
                aria-disabled={items.length === 0}
                className={cn(
                  "flex w-full items-center justify-center bg-red px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-red-ink",
                  items.length === 0 && "pointer-events-none opacity-40",
                )}
              >
                Vazhdo te Kërkesa
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Porosia (${totalQuantity} artikuj)`}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center border transition-colors hover:border-red hover:text-red",
          light ? "border-paper/40 text-paper" : "border-line text-ink",
        )}
      >
        <ShoppingCart aria-hidden className="h-4 w-4" />
        {totalQuantity > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center bg-red px-1 text-[10px] font-medium text-paper">
            <NumberFlow value={totalQuantity} />
          </span>
        )}
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
