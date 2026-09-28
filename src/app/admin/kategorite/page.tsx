import type { Metadata } from "next";
import Link from "next/link";
import { FolderPlus, FolderTree } from "lucide-react";
import { CategoryTree } from "@/components/admin/category-tree";
import { btnPrimary, EmptyState, PageHeader, Panel } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin/session";
import { flattenTree } from "@/lib/admin/tree";
import type { AdminCategory } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Kategoritë" };

export default async function CategoriesPage() {
  const categories = await adminApi<AdminCategory[]>("/categories");
  const rows = flattenTree(categories);
  const hidden = categories.filter((c) => !c.isActive).length;

  return (
    <>
      <PageHeader
        title="Kategoritë"
        description={`Struktura e katalogut · ${categories.length} kategori${hidden ? ` · ${hidden} të fshehura` : ""}`}
        actions={
          <Link href="/admin/kategorite/re" className={btnPrimary}>
            <FolderPlus aria-hidden className="h-4 w-4" />
            Kategori e re
          </Link>
        }
      />

      <Panel flush>
        {rows.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="Ende asnjë kategori"
            action={
              <Link href="/admin/kategorite/re" className={btnPrimary}>
                Krijo kategorinë e parë
              </Link>
            }
          >
            Kategoritë organizojnë produktet në faqe - p.sh. Sinjalistikë Vertikale → Shenja Trafiku.
          </EmptyState>
        ) : (
          <CategoryTree rows={rows} />
        )}
      </Panel>
    </>
  );
}
