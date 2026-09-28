import "server-only";

import { api } from "@/lib/api/client";
import type { CatalogCategory, CatalogData, CatalogProduct } from "@/types/catalog";

export const CATALOG_TAG = "catalog";

/** Cached until an admin edit invalidates the "catalog" tag. */
export async function getCatalog(): Promise<Catalog> {
  const data = await api<CatalogData>("/catalog", { cache: "force-cache", next: { tags: [CATALOG_TAG] } });
  return new Catalog(data);
}

export class Catalog {
  private readonly bySlug = new Map<string, CatalogCategory>();
  private readonly byId = new Map<number, CatalogCategory>();
  private readonly productsBySlug = new Map<string, CatalogProduct>();

  constructor(private readonly data: CatalogData) {
    for (const c of data.categories) {
      this.bySlug.set(c.slug, c);
      this.byId.set(c.id, c);
    }
    for (const p of data.products) this.productsBySlug.set(p.slug, p);
  }

  allCategories() {
    return this.data.categories;
  }

  allProducts() {
    return this.data.products;
  }

  category(slug: string) {
    return this.bySlug.get(slug);
  }

  product(slug: string) {
    return this.productsBySlug.get(slug);
  }

  children(parentId: number | null) {
    return this.data.categories
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "sq"));
  }

  roots() {
    return this.children(null);
  }

  /** Root first, the category itself last. */
  path(category: CatalogCategory) {
    const chain: CatalogCategory[] = [];
    let node: CatalogCategory | undefined = category;
    while (node) {
      chain.unshift(node);
      node = node.parentId ? this.byId.get(node.parentId) : undefined;
    }
    return chain;
  }

  productsIn(categoryId: number) {
    return this.data.products
      .filter((p) => p.placements.some((pl) => pl.categoryId === categoryId))
      .sort((a, b) => this.position(a, categoryId) - this.position(b, categoryId));
  }

  /** Every product anywhere under the category, each listed once. */
  productsUnder(category: CatalogCategory) {
    const seen = new Set<number>();
    const out: { product: CatalogProduct; category: CatalogCategory }[] = [];
    const walk = (node: CatalogCategory) => {
      for (const product of this.productsIn(node.id)) {
        if (!seen.has(product.id)) {
          seen.add(product.id);
          out.push({ product, category: node });
        }
      }
      for (const child of this.children(node.id)) walk(child);
    };
    walk(category);
    return out;
  }

  /** The category a product is shown under in breadcrumbs: the oldest visible one it belongs to. */
  primaryCategory(product: CatalogProduct) {
    return product.placements
      .map((pl) => this.byId.get(pl.categoryId))
      .filter((c): c is CatalogCategory => Boolean(c))
      .sort((a, b) => a.id - b.id)[0];
  }

  /** Sidebar data: roots with their direct children. */
  tree() {
    return this.roots().map((root) => ({
      slug: root.slug,
      name: root.name,
      children: this.children(root.id).map((c) => ({ slug: c.slug, name: c.name })),
    }));
  }

  private position(product: CatalogProduct, categoryId: number) {
    return product.placements.find((pl) => pl.categoryId === categoryId)?.position ?? 0;
  }
}

export type SidebarTree = ReturnType<Catalog["tree"]>;
