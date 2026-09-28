"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronsUpDown,
  ExternalLink,
  FolderPlus,
  FolderTree,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PackagePlus,
  Search,
  ShoppingCart,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/actions";
import { CommandPalette, type PaletteItem } from "@/components/admin/command-palette";
import { Avatar } from "@/components/admin/ui";
import type { AdminUser } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: number; exact?: boolean };

const sectionLabels: Record<string, string> = {
  porosite: "Porositë",
  mesazhet: "Mesazhet",
  kategorite: "Kategoritë",
  produktet: "Produktet",
  profili: "Profili",
  perdoruesit: "Përdoruesit",
};

function crumbsFor(pathname: string) {
  const parts = pathname.split("/").filter(Boolean).slice(1); // drop "admin"
  const crumbs: { href: string; label: string }[] = [{ href: "/admin", label: "Paneli" }];
  const [section, id] = parts;
  if (section && sectionLabels[section]) {
    crumbs.push({ href: `/admin/${section}`, label: sectionLabels[section] });
    if (id === "re") {
      crumbs.push({ href: pathname, label: section === "kategorite" ? "Kategori e re" : "Produkt i ri" });
    } else if (id) {
      const label = section === "porosite" ? `Porosia #${id}` : section === "mesazhet" ? "Mesazhi" : "Ndrysho";
      crumbs.push({ href: pathname, label });
    }
  }
  return crumbs;
}

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const pathname = usePathname();
  const active = isActive(pathname, item);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-9 items-center gap-3 px-3 text-[14px] transition-colors",
        active ? "bg-ink/[0.06] font-medium text-ink" : "text-ink/65 hover:bg-ink/[0.04] hover:text-ink",
      )}
    >
      {active && <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] bg-red" />}
      <item.icon
        aria-hidden
        strokeWidth={1.7}
        className={cn("h-[18px] w-[18px] shrink-0", active ? "text-ink" : "text-ink/40 group-hover:text-ink/70")}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <span className="flex h-5 min-w-5 items-center justify-center bg-red px-1.5 text-[11px] font-semibold tabular-nums text-paper">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

function UserMenu({ admin }: { admin: AdminUser }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const name = admin.fullName || admin.email;

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {open && (
        <div role="menu" className="absolute inset-x-0 bottom-full z-10 mb-2 border border-line bg-paper py-1 shadow-xl">
          <div className="border-b border-line px-3 py-2.5">
            <p className="truncate text-[13px] font-medium text-ink">{name}</p>
            <p className="truncate text-[12px] text-muted">{admin.email}</p>
          </div>
          <Link
            role="menuitem"
            href="/admin/profili"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-ink hover:bg-ink/[0.04]"
          >
            <UserRound aria-hidden className="h-4 w-4 text-muted" /> Profili
          </Link>
          <Link
            role="menuitem"
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-ink hover:bg-ink/[0.04]"
          >
            <ExternalLink aria-hidden className="h-4 w-4 text-muted" /> Shiko faqen
          </Link>
          <form action={logout} className="border-t border-line pt-1">
            <button
              role="menuitem"
              type="submit"
              className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-red hover:bg-red/[0.05]"
            >
              <LogOut aria-hidden className="h-4 w-4" /> Dilni
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-2 text-left transition-colors hover:bg-ink/[0.04]"
      >
        <Avatar name={name} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-ink">{name}</span>
          <span className="block truncate text-[11px] text-muted">{admin.role === "owner" ? "Pronar" : "Administrator"}</span>
        </span>
        <ChevronsUpDown aria-hidden className="h-4 w-4 shrink-0 text-muted" />
      </button>
    </div>
  );
}

export function AdminShell({
  admin,
  newOrders,
  unreadMessages,
  children,
}: {
  admin: AdminUser;
  newOrders: number;
  unreadMessages: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawer, setDrawer] = React.useState(false);
  const [palette, setPalette] = React.useState(false);
  const closeDrawer = React.useCallback(() => setDrawer(false), []);

  React.useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [drawer]);

  const groups: { heading?: string; items: NavItem[] }[] = [
    {
      items: [
        { href: "/admin", label: "Paneli", icon: LayoutDashboard, exact: true },
        { href: "/admin/porosite", label: "Porositë", icon: ShoppingCart, badge: newOrders },
        { href: "/admin/mesazhet", label: "Mesazhet", icon: Inbox, badge: unreadMessages },
      ],
    },
    {
      heading: "Katalogu",
      items: [
        { href: "/admin/kategorite", label: "Kategoritë", icon: FolderTree },
        { href: "/admin/produktet", label: "Produktet", icon: Package },
      ],
    },
    {
      heading: "Llogaria",
      items: [
        { href: "/admin/profili", label: "Profili", icon: UserRound },
        ...(admin.role === "owner" ? [{ href: "/admin/perdoruesit", label: "Përdoruesit", icon: Users }] : []),
      ],
    },
  ];

  const paletteItems: PaletteItem[] = [
    ...groups.flatMap((g) => g.items.map((i) => ({ id: i.href, label: i.label, group: "Shko te", href: i.href, icon: i.icon }))),
    { id: "new-product", label: "Produkt i ri", group: "Krijo", href: "/admin/produktet/re", icon: PackagePlus },
    { id: "new-category", label: "Kategori e re", group: "Krijo", href: "/admin/kategorite/re", icon: FolderPlus },
    {
      id: "new-orders",
      label: "Porositë e reja",
      group: "Filtro",
      href: "/admin/porosite?status=new",
      icon: ShoppingCart,
      hint: newOrders ? `${newOrders} të reja` : undefined,
    },
    {
      id: "unread",
      label: "Mesazhet e palexuara",
      group: "Filtro",
      href: "/admin/mesazhet?filtri=palexuara",
      icon: Inbox,
      hint: unreadMessages ? `${unreadMessages} të palexuara` : undefined,
    },
    { id: "hidden", label: "Produktet e fshehura", group: "Filtro", href: "/admin/produktet?statusi=fshehur", icon: Package },
    { id: "site", label: "Hap faqen publike", group: "Tjetër", href: "/", icon: ExternalLink },
  ];

  const searchTargets = (q: string): PaletteItem[] => {
    const v = encodeURIComponent(q);
    return [
      { id: "s-products", label: `Kërko “${q}” te produktet`, group: "Kërko", href: `/admin/produktet?q=${v}`, icon: Search },
      { id: "s-orders", label: `Kërko “${q}” te porositë`, group: "Kërko", href: `/admin/porosite?q=${v}`, icon: Search },
      { id: "s-messages", label: `Kërko “${q}” te mesazhet`, group: "Kërko", href: `/admin/mesazhet?q=${v}`, icon: Search },
    ];
  };

  const crumbs = crumbsFor(pathname);

  const sidebar = (
    <div className="flex h-full flex-col bg-paper">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/admin" onClick={closeDrawer} className="flex items-center gap-2.5">
          <Image src="/brand/logo.png" alt="" width={36} height={36} className="h-8 w-8 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[15px] font-semibold text-ink">NSH LIRIU</span>
            <span className="text-[11px] text-muted">Paneli i administrimit</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={closeDrawer}
          aria-label="Mbyll menunë"
          className="flex h-9 w-9 items-center justify-center text-muted hover:text-ink lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={() => {
            closeDrawer();
            setPalette(true);
          }}
          className="flex h-9 w-full items-center gap-2 border border-line bg-surface/60 px-3 text-left text-[13px] text-muted transition-colors hover:border-ink/25 hover:text-ink"
        >
          <Search aria-hidden className="h-4 w-4" />
          <span className="flex-1">Kërko ose shko te...</span>
          <kbd className="border border-line bg-paper px-1.5 font-mono text-[11px]">⌘K</kbd>
        </button>
      </div>

      <nav aria-label="Paneli i administrimit" className="flex-1 overflow-y-auto px-3 py-2">
        {groups.map((group, i) => (
          <div key={group.heading ?? i} className="mb-5 flex flex-col gap-0.5">
            {group.heading && (
              <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{group.heading}</p>
            )}
            {group.items.map((item) => (
              <NavLink key={item.href} item={item} onNavigate={closeDrawer} />
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-2">
        <UserMenu admin={admin} />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-svh bg-surface">
      <aside className="sticky top-0 hidden h-svh w-[248px] shrink-0 border-r border-line lg:block">{sidebar}</aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Mbyll menunë" onClick={closeDrawer} className="absolute inset-0 bg-ink/40" />
          <aside className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-line shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <CommandPalette open={palette} onOpenChange={setPalette} items={paletteItems} searchTargets={searchTargets} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-paper/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Hap menunë"
            className="-ml-1 flex h-9 w-9 items-center justify-center text-ink lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav aria-label="Vendndodhja" className="min-w-0 flex-1">
            <ol className="flex items-center gap-1.5 text-[13px]">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={c.href} className={cn("flex min-w-0 items-center gap-1.5", !last && "hidden sm:flex")}>
                    {i > 0 && <ChevronRight aria-hidden className="hidden h-3.5 w-3.5 shrink-0 text-muted/60 sm:block" />}
                    {last ? (
                      <span aria-current="page" className="truncate font-medium text-ink">
                        {c.label}
                      </span>
                    ) : (
                      <Link href={c.href} className="truncate text-muted transition-colors hover:text-ink">
                        {c.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <button
            type="button"
            onClick={() => setPalette(true)}
            aria-label="Kërko"
            className="flex h-9 w-9 items-center justify-center text-muted hover:bg-ink/[0.05] hover:text-ink lg:hidden"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link
            href="/"
            target="_blank"
            className="hidden h-9 items-center gap-1.5 px-2.5 text-[13px] text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink sm:inline-flex"
          >
            Shiko faqen
            <ExternalLink aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
