import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { first, PageHeader } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin/session";
import { flattenTree } from "@/lib/admin/tree";
import type { AdminCategory } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Produkt i ri" };

export default async function NewProductPage({ searchParams }: PageProps<"/admin/produktet/re">) {
  const category = Number(first((await searchParams).kategoria));
  const categories = await adminApi<AdminCategory[]>("/categories");
  return (
    <>
      <PageHeader
        back={{ href: "/admin/produktet", label: "Produktet" }}
        title="Produkt i ri"
        description="Plotësoni emrin, zgjidhni kategoritë dhe ngarkoni një imazh. Mund ta ndryshoni gjithçka më vonë."
      />
      <ProductForm
        categories={flattenTree(categories)}
        defaultCategoryId={Number.isInteger(category) && category > 0 ? category : undefined}
      />
    </>
  );
}
