import type { AdminCategory } from "@/lib/admin/types";

export type TreeRow = AdminCategory & { depth: number; path: string };

/** Flattens categories into display order with their depth and full path. */
export function flattenTree(categories: AdminCategory[]): TreeRow[] {
  const byParent = new Map<number | null, AdminCategory[]>();
  for (const c of categories) {
    const list = byParent.get(c.parentId) ?? [];
    list.push(c);
    byParent.set(c.parentId, list);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "sq"));
  }
  const rows: TreeRow[] = [];
  const walk = (parentId: number | null, depth: number, prefix: string) => {
    for (const c of byParent.get(parentId) ?? []) {
      const path = prefix ? `${prefix} › ${c.name}` : c.name;
      rows.push({ ...c, depth, path });
      walk(c.id, depth + 1, path);
    }
  };
  walk(null, 0, "");
  return rows;
}

/** A category plus everything below it - used to hide invalid parent choices. */
export function descendantIds(categories: AdminCategory[], id: number) {
  const out = new Set<number>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of categories) {
      if (c.parentId !== null && out.has(c.parentId) && !out.has(c.id)) {
        out.add(c.id);
        grew = true;
      }
    }
  }
  return out;
}
