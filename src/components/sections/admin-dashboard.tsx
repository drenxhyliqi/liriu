"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Command,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Shapes,
  ShoppingCart,
  X,
} from "lucide-react";
import { SidebarNav, type NavGroupData, type NavItemData } from "@/components/ui/dashboard-sidebar";
import { getProductsByGroup, productGroups, products, productVariants } from "@/lib/data/products";
import { cn } from "@/lib/utils";

type View = "overview" | "categories" | "products" | "variants" | "orders" | "messages" | "settings";

function resolveView(id: string): View {
  if (id === "orders") return "orders";
  if (id === "messages") return "messages";
  if (id === "settings") return "settings";
  if (id === "variants") return "variants";
  if (id === "categories") return "categories";
  if (id === "products") return "products";
  return "overview";
}

const navGroups: NavGroupData[] = [
  {
    items: [
      { id: "search", title: "Kërko", icon: Search, shortcut: "⌘K" },
      { id: "overview", title: "Paneli", icon: LayoutDashboard },
      { id: "orders", title: "Porosite", icon: ShoppingCart },
      { id: "messages", title: "Mesazhet", icon: Inbox },
    ],
  },
  {
    heading: "Katalogu",
    items: [
      { id: "categories", title: "Kategoritë", icon: FolderKanban },
      { id: "products", title: "Produktet", icon: Package },
      { id: "variants", title: "Dizajnet", icon: Shapes },
    ],
  },
];

const bottomItems: NavItemData[] = [
  { id: "settings", title: "Cilësimet", icon: Settings },
  { id: "logout", title: "Dilni", icon: LogOut },
];

const viewTitles: Record<View, string> = {
  overview: "Paneli",
  categories: "Kategoritë",
  products: "Produktet",
  variants: "Dizajnet",
  orders: "Porosite",
  messages: "Mesazhet",
  settings: "Cilësimet",
};

const cellClass = "px-4 py-3 text-[13px]";
const headCellClass = "px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted";

export function AdminDashboard() {
  const [activeId, setActiveId] = React.useState("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const view = resolveView(activeId);

  function handleSelect(id: string) {
    if (id === "search") {
      setSearchOpen(true);
      return;
    }
    setActiveId(id);
  }

  return (
    <div className="flex h-svh w-full bg-surface">
      <div
        className={cn(
          "h-full shrink-0 overflow-hidden border-r border-line transition-all duration-200",
          sidebarOpen ? "w-64" : "w-0 border-none",
        )}
      >
        <SidebarNav
          className="w-64 border-none"
          groups={navGroups}
          bottomItems={bottomItems}
          activeId={activeId}
          onSelect={handleSelect}
          header={
            <Link href="/" className="flex items-center gap-3 border-b border-line px-[18px] py-5">
              <Image src="/brand/logo.png" alt="NSH LIRIU" width={44} height={44} className="h-10 w-10 shrink-0" />
              <span className="flex flex-col overflow-hidden">
                <span className="truncate font-display text-[15px] font-semibold text-ink">NSH LIRIU</span>
                <span className="text-[11px] text-muted">Paneli i Administrimit</span>
              </span>
            </Link>
          }
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-paper px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:bg-surface hover:text-ink"
              aria-label={sidebarOpen ? "Mbyll panelin anësor" : "Hap panelin anësor"}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" strokeWidth={1.5} /> : <PanelLeftOpen className="h-4 w-4" strokeWidth={1.5} />}
            </button>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>NSH LIRIU</span>
              <span aria-hidden>/</span>
              <span className="font-medium text-ink">{viewTitles[view]}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden border border-line bg-surface px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted sm:inline-block">
              Pamje Paraprake
            </span>
            <Link href="/" className="text-[13px] text-muted transition-colors hover:text-ink">
              Shiko Faqen →
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {view === "overview" && <OverviewView />}
          {view === "categories" && <CategoriesView />}
          {view === "products" && <ProductsView />}
          {view === "variants" && <VariantsView />}
          {view === "orders" && <OrdersView />}
          {view === "messages" && <MessagesView />}
          {view === "settings" && <SettingsView />}
        </div>
      </div>

      {searchOpen && (
        <div className="absolute inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[15vh]">
          <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-xl border border-line bg-paper shadow-2xl">
            <div className="flex items-center border-b border-line px-4">
              <Search aria-hidden className="mr-3 h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
              <input
                autoFocus
                className="flex-1 bg-transparent py-4 text-[14px] text-ink outline-none placeholder:text-muted"
                placeholder="Kërko produkte, kategori..."
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-3 p-1 text-muted transition-colors hover:text-ink"
                aria-label="Mbyll kërkimin"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center px-2 py-10">
              <Command aria-hidden className="mb-2 h-5 w-5 text-ink/20" strokeWidth={1.5} />
              <p className="text-[13px] font-medium text-muted">Kërkimi ende nuk është aktivizuar.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border border-line bg-paper p-5">
      <p className="font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-[13px] text-muted">{label}</p>
    </div>
  );
}

function OverviewView() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Kategoritë" value={productGroups.length} />
        <StatCard label="Produktet" value={products.length} />
        <StatCard label="Dizajnet" value={productVariants.length} />
        <StatCard label="Mesazhet" value="-" />
      </div>

      <div className="mt-8 border border-line bg-paper">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-display text-base font-semibold text-ink">Kategoritë</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-line">
              <th className={headCellClass}>Emri</th>
              <th className={headCellClass}>Slug</th>
              <th className={headCellClass}>Produkte</th>
            </tr>
          </thead>
          <tbody>
            {productGroups.map((group) => (
              <tr key={group.slug} className="border-b border-line last:border-b-0">
                <td className={cn(cellClass, "font-medium text-ink")}>{group.name}</td>
                <td className={cn(cellClass, "font-mono text-muted")}>{group.slug}</td>
                <td className={cn(cellClass, "text-muted")}>{getProductsByGroup(group.slug).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesView() {
  return (
    <div className="border border-line bg-paper">
      <table className="w-full">
        <thead>
          <tr className="border-b border-line">
            <th className={headCellClass}>Emri</th>
            <th className={headCellClass}>Slug</th>
            <th className={headCellClass}>Produkte</th>
          </tr>
        </thead>
        <tbody>
          {productGroups.map((group) => (
            <tr key={group.slug} className="border-b border-line last:border-b-0">
              <td className={cn(cellClass, "font-medium text-ink")}>{group.name}</td>
              <td className={cn(cellClass, "font-mono text-muted")}>{group.slug}</td>
              <td className={cn(cellClass, "text-muted")}>{getProductsByGroup(group.slug).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsView() {
  return (
    <div className="border border-line bg-paper">
      <table className="w-full">
        <thead>
          <tr className="border-b border-line">
            <th className={headCellClass}>Emri</th>
            <th className={headCellClass}>Kategoria</th>
            <th className={headCellClass}>Dizajne</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const group = productGroups.find((g) => g.slug === product.groupSlug);
            const variantCount = productVariants.filter((v) => v.productSlug === product.slug).length;
            return (
              <tr key={product.slug} className="border-b border-line last:border-b-0">
                <td className={cn(cellClass, "font-medium text-ink")}>{product.name}</td>
                <td className={cn(cellClass, "text-muted")}>{group?.name}</td>
                <td className={cn(cellClass, "text-muted")}>{variantCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VariantsView() {
  return (
    <div className="border border-line bg-paper">
      <table className="w-full">
        <thead>
          <tr className="border-b border-line">
            <th className={headCellClass}>Emri</th>
            <th className={headCellClass}>Produkti</th>
          </tr>
        </thead>
        <tbody>
          {productVariants.map((variant) => {
            const product = products.find((p) => p.slug === variant.productSlug);
            return (
              <tr key={`${variant.productSlug}-${variant.slug}`} className="border-b border-line last:border-b-0">
                <td className={cn(cellClass, "font-medium text-ink")}>{variant.name}</td>
                <td className={cn(cellClass, "text-muted")}>{product?.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-line bg-paper p-10 text-center">
      <p className="font-display text-lg font-medium text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function OrdersView() {
  return (
    <EmptyState
      title="Porositë nuk ruhen ende."
      body="Klientët mund të shtojnë produkte në porosi dhe të dërgojnë kërkesën te /api/orders, por porositë vetëm regjistrohen në server (console) - nuk ka ende bazë të dhënash për t'i ruajtur e shfaqur këtu."
    />
  );
}

function MessagesView() {
  return (
    <EmptyState
      title="Mesazhet nuk ruhen ende."
      body="Formulari i kontaktit dërgon me sukses te /api/contact, por mesazhet vetëm regjistrohen në server (console) - nuk ka ende bazë të dhënash apo shërbim email-i të lidhur për t'i ruajtur e shfaqur këtu."
    />
  );
}

function SettingsView() {
  return (
    <EmptyState
      title="Cilësimet ende nuk janë ndërtuar."
      body="Kjo faqe do të lejojë menaxhimin e të dhënave të kompanisë, kontaktit dhe llogarive të administratorëve, pasi të lidhet një bazë të dhënash e vërtetë."
    />
  );
}
