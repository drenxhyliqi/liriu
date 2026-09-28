"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, FolderPlus, Search } from "lucide-react";
import { btnGhost, inputClass, Thumb, VisibilityDot } from "@/components/admin/ui";
import type { TreeRow } from "@/lib/admin/tree";
import { cn } from "@/lib/utils";

/** Collapsible, filterable view of the whole catalog tree. */
export function CategoryTree({ rows }: { rows: TreeRow[] }) {
  const withChildren = React.useMemo(() => new Set(rows.filter((r) => r.childCount > 0).map((r) => r.id)), [rows]);
  // Top level open by default so the structure is visible at a glance.
  const [open, setOpen] = React.useState<Set<number>>(
    () => new Set(rows.filter((r) => r.depth === 0 && r.childCount > 0).map((r) => r.id)),
  );
  const [filter, setFilter] = React.useState("");
  const byId = React.useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows]);

  const f = filter.trim().toLowerCase();
  const visible = f
    ? rows.filter((r) => r.path.toLowerCase().includes(f))
    : rows.filter((r) => {
        let parent = r.parentId;
        while (parent !== null) {
          if (!open.has(parent)) return false;
          parent = byId.get(parent)?.parentId ?? null;
        }
        return true;
      });

  const allOpen = open.size === withChildren.size;
  const toggle = (id: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <div className="flex flex-col gap-2 border-b border-line p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtro kategoritë..."
            aria-label="Filtro kategoritë"
            className={`${inputClass} pl-9`}
          />
        </div>
        {!f && (
          <button
            type="button"
            onClick={() => setOpen(allOpen ? new Set() : new Set(withChildren))}
            className={btnGhost}
          >
            {allOpen ? <ChevronsDownUp aria-hidden className="h-4 w-4" /> : <ChevronsUpDown aria-hidden className="h-4 w-4" />}
            {allOpen ? "Mbyll të gjitha" : "Hap të gjitha"}
          </button>
        )}
      </div>

      <div className="hidden grid-cols-[1fr_110px_110px_110px_44px] border-b border-line bg-surface/60 text-[12px] font-medium text-muted md:grid">
        <span className="px-5 py-2.5">Kategoria</span>
        <span className="px-3 py-2.5 text-right">Nënkategori</span>
        <span className="px-3 py-2.5 text-right">Produkte</span>
        <span className="px-3 py-2.5">Statusi</span>
        <span />
      </div>

      {visible.length === 0 ? (
        <p className="px-5 py-10 text-center text-[14px] text-muted">Asnjë kategori nuk përputhet me “{filter}”.</p>
      ) : (
        <ul className="divide-y divide-line">
          {visible.map((c) => {
            const expandable = c.childCount > 0 && !f;
            const isOpen = open.has(c.id);
            return (
              <li
                key={c.id}
                className="group grid grid-cols-[1fr_auto] items-center transition-colors hover:bg-ink/[0.02] md:grid-cols-[1fr_110px_110px_110px_44px]"
              >
                <div className="flex min-w-0 items-center gap-2 py-2.5 pr-3" style={{ paddingLeft: 12 + (f ? 0 : c.depth) * 24 }}>
                  {expandable ? (
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      aria-label={isOpen ? `Mbyll ${c.name}` : `Hap ${c.name}`}
                      aria-expanded={isOpen}
                      className="flex h-6 w-6 shrink-0 items-center justify-center text-muted hover:bg-ink/[0.06] hover:text-ink"
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  ) : (
                    <span className="w-6 shrink-0" />
                  )}
                  <Thumb src={c.imageUrl} fit={c.imageFit} size={36} />
                  <Link href={`/admin/kategorite/${c.id}`} className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[14px] text-ink hover:underline", c.depth === 0 && "font-semibold")}>
                      {f ? c.path : c.name}
                    </span>
                    <span className="block truncate text-[12px] text-muted md:hidden">
                      {c.childCount > 0 && `${c.childCount} nënkategori · `}
                      {c.productCount} produkte{!c.isActive && " · e fshehur"}
                    </span>
                  </Link>
                </div>
                <span className="hidden px-3 text-right text-[13px] tabular-nums text-muted md:block">{c.childCount || "–"}</span>
                <span className="hidden px-3 text-right text-[13px] tabular-nums text-ink md:block">{c.productCount}</span>
                <span className="hidden px-3 md:block">
                  <VisibilityDot active={c.isActive} />
                </span>
                <span className="pr-3">
                  <Link
                    href={`/admin/kategorite/re?prind=${c.id}`}
                    aria-label={`Shto nënkategori te ${c.name}`}
                    title="Shto nënkategori"
                    className="flex h-8 w-8 items-center justify-center text-muted opacity-100 hover:bg-ink/[0.06] hover:text-ink md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  >
                    <FolderPlus aria-hidden className="h-4 w-4" />
                  </Link>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
