"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productSlug: string;
  variantSlug?: string;
  name: string;
  groupName: string;
  variant?: "primary" | "compact";
  className?: string;
}

export function AddToCartButton({
  productSlug,
  variantSlug,
  name,
  groupName,
  variant = "primary",
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = React.useState(false);

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      key: variantSlug ? `${productSlug}:${variantSlug}` : productSlug,
      productSlug,
      variantSlug,
      name,
      groupName,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Shto ${name} në porosi`}
        className={cn(
          "flex h-9 w-9 items-center justify-center border transition-colors",
          justAdded ? "border-red bg-red text-paper" : "border-line text-ink hover:border-ink",
          className,
        )}
      >
        {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 border px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors",
        justAdded
          ? "border-red bg-red text-paper"
          : "border-ink bg-ink text-paper hover:border-red hover:bg-red",
        className,
      )}
    >
      {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {justAdded ? "U Shtua" : "Shto në Porosi"}
    </button>
  );
}
