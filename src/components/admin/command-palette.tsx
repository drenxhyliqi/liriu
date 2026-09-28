"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaletteItem = {
  id: string;
  label: string;
  group: string;
  href: string;
  icon: React.ElementType;
  hint?: string;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * ⌘K / Ctrl+K palette: jump to any section, start a new record, or search
 * products, orders and messages (hands off to the list pages' own search).
 */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  searchTargets,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PaletteItem[];
  /** Built from the query: "Kërko 'x' në produkte" etc. */
  searchTargets: (query: string) => PaletteItem[];
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Mounted only while open, so every opening starts with an empty search.
  return open ? <PaletteDialog onClose={() => onOpenChange(false)} items={items} searchTargets={searchTargets} /> : null;
}

function PaletteDialog({
  onClose,
  items,
  searchTargets,
}: {
  onClose: () => void;
  items: PaletteItem[];
  searchTargets: (query: string) => PaletteItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const q = normalize(query.trim());
  const results = [
    ...(q ? items.filter((i) => normalize(`${i.label} ${i.group} ${i.hint ?? ""}`).includes(q)) : items),
    ...(q ? searchTargets(query.trim()) : []),
  ];

  React.useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item: PaletteItem | undefined) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]">
      <button type="button" aria-label="Mbyll" onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Kërko në panel"
        className="relative w-full max-w-xl overflow-hidden border border-line bg-paper shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(results[active]);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Shko te një faqe ose kërko..."
            className="h-13 w-full bg-transparent py-4 text-[15px] text-ink outline-none placeholder:text-muted"
          />
          <kbd className="hidden shrink-0 border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted sm:block">Esc</kbd>
        </div>

        <div ref={listRef} className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
          {results.length === 0 && <p className="px-3 py-8 text-center text-[14px] text-muted">Asnjë rezultat.</p>}
          {results.map((item, i) => {
            const heading = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            const Icon = item.icon;
            return (
              <React.Fragment key={item.id}>
                {heading && <p className="px-3 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{heading}</p>}
                <button
                  type="button"
                  data-active={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(item)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left text-[14px]",
                    i === active ? "bg-ink text-paper" : "text-ink",
                  )}
                >
                  <Icon aria-hidden className={cn("h-4 w-4 shrink-0", i === active ? "text-paper" : "text-muted")} strokeWidth={1.8} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    <span className={cn("truncate text-[12px]", i === active ? "text-paper/70" : "text-muted")}>{item.hint}</span>
                  )}
                  {i === active && <CornerDownLeft aria-hidden className="h-3.5 w-3.5 shrink-0 text-paper/70" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-4 border-t border-line bg-surface/60 px-4 py-2 text-[11px] text-muted">
          <span>
            <kbd className="font-mono">↑↓</kbd> lëviz
          </span>
          <span>
            <kbd className="font-mono">↵</kbd> hap
          </span>
          <span className="ml-auto">
            <kbd className="font-mono">⌘K</kbd> hap / mbyll
          </span>
        </div>
      </div>
    </div>
  );
}
