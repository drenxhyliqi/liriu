"use client";

import * as React from "react";
import type { CartItem } from "@/types";

// v2: cart lines are keyed by product slug since the catalog moved to the API.
const STORAGE_KEY = "liriu-order-cart-v2";

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, delta: number) => void;
  clear: () => void;
  /** Set on every add so the toast can show a brief confirmation. */
  notice: CartNotice | null;
  dismissNotice: () => void;
}

export interface CartNotice {
  id: number;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);
  const [notice, setNotice] = React.useState<CartNotice | null>(null);
  const noticeId = React.useRef(0);

  // Per-viewer only - this is a quote-request cart, not an order system
  // with a shared backend, so localStorage is the right (and only) place
  // for it to live. Reading it can only happen client-side after mount
  // (SSR has no localStorage, and reading it during the initial render
  // would risk a hydration mismatch against the server-rendered "empty
  // cart" HTML) - wrapped in startTransition to mark it as a deferred
  // external-store sync rather than a synchronous render cascade.
  React.useEffect(() => {
    React.startTransition(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // ignore corrupt/inaccessible storage
      }
      setHydrated(true);
    });
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures (private browsing, quota, etc.)
    }
  }, [items, hydrated]);

  const addItem = React.useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      const existing = current.find((i) => i.key === item.key);
      if (existing) {
        return current.map((i) => (i.key === item.key ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...current, { ...item, quantity: 1 }];
    });
    // Adding again while the toast is still showing reuses its id instead of
    // remounting it - two fast adds would otherwise force the toast to
    // unmount and remount mid-animation, briefly showing two overlapping
    // toasts side by side (the container is a plain flex row, not stacked).
    setNotice((current) => {
      if (current) return { id: current.id };
      noticeId.current += 1;
      return { id: noticeId.current };
    });
  }, []);

  const dismissNotice = React.useCallback(() => setNotice(null), []);

  const removeItem = React.useCallback((key: string) => {
    setItems((current) => current.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = React.useCallback((key: string, delta: number) => {
    setItems((current) =>
      current.flatMap((i) => {
        if (i.key !== key) return [i];
        const nextQuantity = i.quantity + delta;
        return nextQuantity > 0 ? [{ ...i, quantity: nextQuantity }] : [];
      }),
    );
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = React.useMemo(
    () => ({
      items,
      totalQuantity,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      notice,
      dismissNotice,
    }),
    [items, totalQuantity, addItem, removeItem, updateQuantity, clear, notice, dismissNotice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
