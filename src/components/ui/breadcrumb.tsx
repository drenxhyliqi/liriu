import { Fragment } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Last item (or any item without an href) is treated as the current page:
// bold, ink, with a red underline. Earlier items are muted links.
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={item.label}>
            {i > 0 && (
              <span aria-hidden className="text-muted">
                /
              </span>
            )}
            {item.href && !isLast ? (
              <Link href={item.href} className="text-muted transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "relative pb-1",
                  isLast
                    ? "font-medium text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-red"
                    : "text-muted",
                )}
              >
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
