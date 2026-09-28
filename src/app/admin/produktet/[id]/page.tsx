import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/forms";
import { ProductForm } from "@/components/admin/product-form";
import { btnSecondary, first, PageHeader, Panel, VisibilityDot } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/admin/format";
import { adminApi } from "@/lib/admin/session";
import { flattenTree } from "@/lib/admin/tree";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";
import { ApiError } from "@/lib/api/client";

export const metadata: Metadata = { title: "Ndrysho produktin" };

async function getProduct(id: string) {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await adminApi<AdminProduct>(`/products/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/produktet/[id]">) {
  const [product, categories] = await Promise.all([
    getProduct((await params).id),
    adminApi<AdminCategory[]>("/categories"),
  ]);
  const created = first((await searchParams).krijuar) === "1";
  const live = product.isActive && product.categories.length > 0;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/produktet", label: "Produktet" }}
        meta={
          <>
            <VisibilityDot active={product.isActive} />
            <span>· Ndryshuar më {formatDateTime(product.updatedAt)}</span>
          </>
        }
        title={product.name}
        actions={
          live ? (
            <Link href={`/products/${product.slug}`} target="_blank" className={btnSecondary}>
              Shiko në faqe <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </Link>
          ) : undefined
        }
      />

      {created && (
        <div role="status" className="mb-6 flex items-center gap-2.5 border border-line bg-paper px-4 py-3 text-[14px] text-ink">
          <CheckCircle2 aria-hidden className="h-4 w-4 shrink-0" />
          Produkti u krijua{live ? " dhe është tashmë në faqe." : "."}
        </div>
      )}

      <ProductForm key={product.id} product={product} categories={flattenTree(categories)} />

      <Panel title="Zona e rrezikshme" className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-[13px] leading-relaxed text-muted">
            Fshirja e heq produktin nga katalogu dhe nga të gjitha kategoritë. Porositë e vjetra e ruajnë emrin dhe imazhin.
          </p>
          <ConfirmButton action={deleteProduct.bind(null, product.id)} label="Fshi produktin" />
        </div>
      </Panel>
    </>
  );
}
