import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/category-form";
import { first, PageHeader } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin/session";
import { flattenTree } from "@/lib/admin/tree";
import type { AdminCategory } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Kategori e re" };

export default async function NewCategoryPage({ searchParams }: PageProps<"/admin/kategorite/re">) {
  const parent = Number(first((await searchParams).prind));
  const categories = await adminApi<AdminCategory[]>("/categories");
  const parentCategory = categories.find((c) => c.id === parent);
  return (
    <>
      <PageHeader
        back={{ href: "/admin/kategorite", label: "Kategoritë" }}
        title="Kategori e re"
        description={
          parentCategory
            ? `Do të krijohet brenda “${parentCategory.name}”. Mund ta ndryshoni më poshtë.`
            : "Krijoni një kategori kryesore ose zgjidhni ku bën pjesë."
        }
      />
      <CategoryForm parentOptions={flattenTree(categories)} defaultParentId={Number.isInteger(parent) ? parent : null} />
    </>
  );
}
