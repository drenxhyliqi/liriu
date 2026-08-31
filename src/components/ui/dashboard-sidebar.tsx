"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  shortcut?: string;
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

function NavItem({
  item,
  activeId,
  onSelect,
}: {
  item: NavItemData;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const isActive = activeId === item.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={cn(
        "group flex w-full items-center gap-3.5 border-l-2 py-3 pl-[18px] pr-4 text-left transition-colors",
        isActive ? "border-red bg-red/5" : "border-transparent hover:bg-surface",
      )}
    >
      <item.icon
        aria-hidden
        className={cn("h-5 w-5 shrink-0", isActive ? "text-red" : "text-ink/45 group-hover:text-ink/75")}
        strokeWidth={1.5}
      />
      <span className={cn("flex-1 truncate text-[14px]", isActive ? "font-medium text-ink" : "text-ink/70")}>
        {item.title}
      </span>

      {item.shortcut && (
        <kbd className="hidden shrink-0 border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-muted group-hover:inline-flex">
          {item.shortcut}
        </kbd>
      )}
      {item.badge !== undefined && (
        <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center bg-red/10 px-1.5 text-[10px] font-medium text-red">
          {item.badge}
        </span>
      )}
    </button>
  );
}

export function SidebarNav({
  groups,
  bottomItems,
  activeId,
  onSelect,
  header,
  className,
}: {
  groups: NavGroupData[];
  bottomItems?: NavItemData[];
  activeId: string;
  onSelect: (id: string) => void;
  header?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full w-64 flex-col border-r border-line bg-paper", className)}>
      {header}

      <nav aria-label="Paneli i administrimit" className="flex-1 overflow-y-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((group, i) => (
          <div key={group.heading ?? i} className="flex flex-col pb-5">
            {group.heading && (
              <span className="px-[18px] pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                {group.heading}
              </span>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavItem key={item.id} item={item} activeId={activeId} onSelect={onSelect} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {bottomItems && bottomItems.length > 0 && (
        <div className="flex flex-col gap-0.5 border-t border-line py-3">
          {bottomItems.map((item) => (
            <NavItem key={item.id} item={item} activeId={activeId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
