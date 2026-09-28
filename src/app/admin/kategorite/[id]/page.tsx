import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, ExternalLink, FolderPlus, Package } from "lucide-react";
import { deleteCategory } from "@/app/admin/actions";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmButton } from "@/components/admin/forms";
import { btnGhost, btnSecondary, first, PageHeader, Panel, Thumb, VisibilityDot } from "@/components/admin/ui";
import { adminApi } from "@/lib/admin/session";
import { descendantIds, flattenTree } from "@/lib/admin/tree";
import type { AdminCategory } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Ndrysho kategorinë" };

export default async function EditCategoryPage({ params, searchParams }: PageProps<"/admin/kategorite/[id]">) {
  const id = Number((await params).id);
  const created = first((await searchParams).krijuar) === "1";
  const categories = await adminApi<AdminCategory[]>("/categories");
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const rows = flattenTree(categories);
  const blocked = descendantIds(categories, id);
  const parentOptions = rows.filter((c) => !blocked.has(c.id));
  const children = rows.filter((c) => c.parentId === id);
  const path = rows.find((c) => c.id === id)?.path;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/kategorite", label: "Kategoritë" }}
        meta={
          <>
            <VisibilityDot active={category.isActive} />
            {path && path !== category.name && <span className="truncate">· {path}</span>}
          </>
        }
        title={category.name}
        actions={
          <>
            <Link href={`/admin/produktet?kategoria=${category.id}`} className={btnSecondary}>
              <Package aria-hidden className="h-4 w-4" />
              Produktet ({category.productCount})
            </Link>
            {category.isActive && (
              <Link href={`/products/${category.slug}`} target="_blank" className={btnSecondary}>
                Shiko në faqe <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              </Link>
            )}
          </>
        }
      />

      {created && (
        <div role="status" className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 border border-line bg-paper px-4 py-3 text-[14px] text-ink">
          <span className="flex items-center gap-2.5">
            <CheckCircle2 aria-hidden className="h-4 w-4 shrink-0" />
            Kategoria u krijua.
          </span>
          <span className="flex gap-3 text-[13px]">
            <Link href={`/admin/produktet/re?kategoria=${category.id}`} className="font-medium underline underline-offset-4">
              Shto një produkt
            </Link>
            <Link href={`/admin/kategorite/re?prind=${category.id}`} className="font-medium underline underline-offset-4">
              Shto një nënkategori
            </Link>
          </span>
        </div>
      )}

      <CategoryForm key={category.id} category={category} parentOptions={parentOptions} />

      <div className="mt-8 grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <Panel
          title="Nënkategoritë"
          description={children.length ? `${children.length} brenda kësaj kategorie` : "Kjo kategori nuk ka nënkategori."}
          className="xl:col-span-2"
          actions={
            <Link href={`/admin/kategorite/re?prind=${category.id}`} className={btnGhost}>
              <FolderPlus aria-hidden className="h-4 w-4" /> Shto
            </Link>
          }
          flush
        >
          {children.length > 0 && (
            <ul className="divide-y divide-line">
              {children.map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/kategorite/${c.id}`} className="group flex items-center gap-3 px-5 py-3 hover:bg-ink/[0.02]">
                    <Thumb src={c.imageUrl} fit={c.imageFit} size={36} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] text-ink">{c.name}</span>
                      <span className="block text-[12px] text-muted">{c.productCount} produkte</span>
                    </span>
                    {!c.isActive && <VisibilityDot active={false} />}
                    <ChevronRight aria-hidden className="h-4 w-4 text-muted/50 group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Zona e rrezikshme">
          <p className="mb-4 text-[13px] leading-relaxed text-muted">
            {children.length > 0
              ? "Kjo kategori ka nënkategori. Fshini ose zhvendosni ato së pari."
              : "Produktet hiqen vetëm nga kjo kategori - nuk fshihen."}
          </p>
          {children.length === 0 && <ConfirmButton action={deleteCategory.bind(null, category.id)} label="Fshi kategorinë" />}
        </Panel>
      </div>
    </>
  );
}
