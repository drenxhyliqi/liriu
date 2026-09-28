import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Package, PackagePlus, Search, X } from "lucide-react";
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select";
import {
  btnPrimary,
  btnSecondary,
  EmptyState,
  first,
  inputClass,
  pageParam,
  PageHeader,
  Pagination,
  Panel,
  qs,
  tdClass,
  thClass,
  Thumb,
  VisibilityDot,
} from "@/components/admin/ui";
import { formatDate } from "@/lib/admin/format";
import { adminApi } from "@/lib/admin/session";
import { flattenTree } from "@/lib/admin/tree";
import type { AdminCategory, AdminProduct, Page } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Produktet" };

function CategoryChips({ categories }: { categories: AdminProduct["categories"] }) {
  if (categories.length === 0) return <span className="text-[12px] font-medium text-red">Pa kategori</span>;
  const shown = categories.slice(0, 2);
  return (
    <span className="flex flex-wrap items-center gap-1">
      {shown.map((c) => (
        <span key={c.id} className="inline-flex h-6 max-w-44 items-center bg-ink/[0.05] px-2 text-[12px] text-ink/80">
          <span className="truncate">{c.name}</span>
        </span>
      ))}
      {categories.length > shown.length && (
        <span className="text-[12px] text-muted" title={categories.slice(2).map((c) => c.name).join(", ")}>
          +{categories.length - shown.length}
        </span>
      )}
    </span>
  );
}

export default async function ProductsPage({ searchParams }: PageProps<"/admin/produktet">) {
  const params = await searchParams;
  const q = first(params.q)?.trim() ?? "";
  const kategoria = first(params.kategoria) ?? "";
  const statusi = first(params.statusi) ?? "";
  const page = pageParam(params.page);

  const categoryId = /^\d+$/.test(kategoria) ? Number(kategoria) : undefined;
  const [data, categories] = await Promise.all([
    adminApi<Page<AdminProduct>>(
      `/products${qs({
        q,
        categoryId,
        uncategorized: kategoria === "pa" ? "true" : undefined,
        active: statusi === "aktiv" ? "true" : statusi === "fshehur" ? "false" : undefined,
        page,
        pageSize: 25,
      })}`,
    ),
    adminApi<AdminCategory[]>("/categories"),
  ]);
  const tree = flattenTree(categories);
  const filtered = Boolean(q || kategoria || statusi);
  const activeCategory = categoryId ? categories.find((c) => c.id === categoryId) : undefined;

  return (
    <>
      <PageHeader
        title="Produktet"
        description={
          filtered
            ? `${data.total} ${data.total === 1 ? "rezultat" : "rezultate"}${activeCategory ? ` në ${activeCategory.name}` : ""}`
            : `${data.total} produkte në katalog`
        }
        actions={
          <Link href={`/admin/produktet/re${qs({ kategoria: categoryId })}`} className={btnPrimary}>
            <PackagePlus aria-hidden className="h-4 w-4" />
            Produkt i ri
          </Link>
        }
      />

      <form role="search" className="mb-4 grid gap-2 sm:grid-cols-[1fr_220px_160px] lg:grid-cols-[1fr_260px_170px_auto]">
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Kërko sipas emrit ose fjalës kyçe"
            aria-label="Kërko produktet"
            className={`${inputClass} pl-9`}
          />
        </div>
        <AutoSubmitSelect name="kategoria" defaultValue={kategoria} className={inputClass} aria-label="Kategoria">
          <option value="">Të gjitha kategoritë</option>
          <option value="pa">— Pa kategori —</option>
          {tree.map((c) => (
            <option key={c.id} value={c.id}>
              {"  ".repeat(c.depth)}
              {c.name}
            </option>
          ))}
        </AutoSubmitSelect>
        <AutoSubmitSelect name="statusi" defaultValue={statusi} className={inputClass} aria-label="Dukshmëria">
          <option value="">Çdo dukshmëri</option>
          <option value="aktiv">Të dukshme</option>
          <option value="fshehur">Të fshehura</option>
        </AutoSubmitSelect>
        {filtered ? (
          <Link href="/admin/produktet" className={`${btnSecondary} h-10 sm:col-span-3 lg:col-span-1`}>
            <X aria-hidden className="h-4 w-4" />
            Hiq filtrat
          </Link>
        ) : (
          <button type="submit" className="sr-only">
            Kërko
          </button>
        )}
      </form>

      <Panel flush>
        {data.items.length === 0 ? (
          <EmptyState
            icon={Package}
            title={filtered ? "Asnjë produkt nuk përputhet" : "Ende asnjë produkt"}
            action={
              filtered ? (
                <Link href="/admin/produktet" className={btnSecondary}>
                  Hiq filtrat
                </Link>
              ) : (
                <Link href="/admin/produktet/re" className={btnPrimary}>
                  Shto produktin e parë
                </Link>
              )
            }
          >
            {filtered ? "Provoni një fjalë ose kategori tjetër." : "Produktet që shtoni shfaqen në katalogun e faqes."}
          </EmptyState>
        ) : (
          <>
            <table className="hidden w-full table-fixed md:table">
              <thead className="border-b border-line bg-surface/60">
                <tr>
                  <th className={thClass}>Produkti</th>
                  <th className={`${thClass} w-[30%]`}>Kategoritë</th>
                  <th className={`${thClass} w-[120px]`}>Statusi</th>
                  <th className={`${thClass} w-[110px] text-right`}>Ndryshuar</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((p) => (
                  <tr key={p.id} className="group relative transition-colors hover:bg-ink/[0.02]">
                    <td className={tdClass}>
                      <Link href={`/admin/produktet/${p.id}`} className="flex items-center gap-3 after:absolute after:inset-0">
                        <Thumb src={p.imageUrl} fit={p.imageFit} size={44} />
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium text-ink">{p.name}</span>
                          <span className="block truncate text-[12px] text-muted">/{p.slug}</span>
                        </span>
                      </Link>
                    </td>
                    <td className={tdClass}>
                      <CategoryChips categories={p.categories} />
                    </td>
                    <td className={tdClass}>
                      <VisibilityDot active={p.isActive} />
                    </td>
                    <td className={`${tdClass} text-right text-[13px] tabular-nums text-muted`}>{formatDate(p.updatedAt)}</td>
                    <td className="pr-4">
                      <ChevronRight aria-hidden className="h-4 w-4 text-muted/50 transition-colors group-hover:text-ink" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="divide-y divide-line md:hidden">
              {data.items.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/produktet/${p.id}`} className="flex items-center gap-3 px-4 py-3">
                    <Thumb src={p.imageUrl} fit={p.imageFit} size={52} />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[14px] font-medium leading-snug text-ink">{p.name}</p>
                      <p className="mt-0.5 truncate text-[12px] text-muted">
                        {p.categories.length > 0 ? p.categories.map((c) => c.name).join(" · ") : "Pa kategori"}
                      </p>
                      {!p.isActive && (
                        <div className="mt-1">
                          <VisibilityDot active={false} />
                        </div>
                      )}
                    </div>
                    <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted/50" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          href={(p) => `/admin/produktet${qs({ q, kategoria, statusi, page: p })}`}
        />
      </Panel>
    </>
  );
}
