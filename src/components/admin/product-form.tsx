"use client";

import * as React from "react";
import { Check, Search, X } from "lucide-react";
import { saveProduct } from "@/app/admin/actions";
import { ActionForm, FormFooter, Toggle, useMarkDirty } from "@/components/admin/forms";
import { ImageField } from "@/components/admin/image-field";
import { hintClass, inputClass, labelClass, Panel, textareaClass } from "@/components/admin/ui";
import type { AdminProduct } from "@/lib/admin/types";
import type { TreeRow } from "@/lib/admin/tree";
import { cn } from "@/lib/utils";

function CategoryPicker({ categories, initial }: { categories: TreeRow[]; initial: number[] }) {
  const markDirty = useMarkDirty();
  const [selected, setSelected] = React.useState<Set<number>>(() => new Set(initial));
  const [filter, setFilter] = React.useState("");
  const f = filter.trim().toLowerCase();
  const visible = f ? categories.filter((c) => c.path.toLowerCase().includes(f)) : categories;
  const selectedRows = categories.filter((c) => selected.has(c.id));

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    markDirty();
  };

  return (
    <>
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="categoryIds" value={id} />
      ))}

      <div className="mb-3 flex min-h-8 flex-wrap gap-1.5">
        {selectedRows.length === 0 ? (
          <p className="flex items-center text-[13px] text-red">
            Pa kategori - produkti nuk do të shfaqet askund në faqe.
          </p>
        ) : (
          selectedRows.map((c) => (
            <span key={c.id} className="inline-flex h-8 items-center gap-1 bg-ink pl-2.5 pr-1 text-[12px] text-paper">
              <span className="max-w-64 truncate" title={c.path}>
                {c.name}
              </span>
              <button
                type="button"
                onClick={() => toggle(c.id)}
                aria-label={`Hiq ${c.name}`}
                className="flex h-6 w-6 items-center justify-center text-paper/70 hover:bg-paper/15 hover:text-paper"
              >
                <X aria-hidden className="h-3.5 w-3.5" />
              </button>
            </span>
          ))
        )}
      </div>

      <div className="border border-line">
        <div className="relative border-b border-line">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            placeholder="Kërko kategori..."
            aria-label="Kërko kategori"
            className="h-10 w-full bg-transparent pl-9 pr-3 text-[14px] text-ink outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
        <div className="max-h-72 overflow-y-auto py-1">
          {visible.length === 0 && <p className="px-4 py-6 text-center text-[13px] text-muted">Asnjë kategori.</p>}
          {visible.map((c) => {
            const on = selected.has(c.id);
            return (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-3 py-2 pr-3 hover:bg-ink/[0.03]"
                style={{ paddingLeft: 12 + (f ? 0 : c.depth) * 20 }}
              >
                <input type="checkbox" checked={on} onChange={() => toggle(c.id)} className="peer sr-only" />
                <span
                  aria-hidden
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                    on ? "border-ink bg-ink text-paper" : "border-ink/25 bg-paper",
                  )}
                >
                  {on && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className={cn("min-w-0 flex-1 truncate text-[13px]", c.depth === 0 ? "font-medium text-ink" : "text-ink/85")}>
                  {f ? c.path : c.name}
                </span>
                {!c.isActive && <span className="shrink-0 text-[11px] text-muted">e fshehur</span>}
              </label>
            );
          })}
        </div>
      </div>
      <p className={hintClass}>Një produkt mund të jetë në disa kategori njëkohësisht.</p>
    </>
  );
}

export function ProductForm({
  product,
  categories,
  defaultCategoryId,
}: {
  product?: AdminProduct;
  categories: TreeRow[];
  defaultCategoryId?: number;
}) {
  const action = saveProduct.bind(null, product?.id ?? null);
  const initial = product ? product.categories.map((c) => c.id) : defaultCategoryId ? [defaultCategoryId] : [];

  return (
    <ActionForm action={action}>
      {(state) => (
        <>
          <div className="grid grid-cols-1 items-start gap-6 pb-6 xl:grid-cols-3">
            <div className="flex flex-col gap-6 xl:col-span-2">
              <Panel title="Të dhënat" description="Çfarë shohin klientët në faqen e produktit.">
                <div className="grid gap-5">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Emri <span className="text-red">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      defaultValue={product?.name}
                      placeholder="p.sh. Kone me Bazë të Rëndë"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className={labelClass}>
                      Përshkrimi
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      defaultValue={product?.description}
                      placeholder="Përmasat, materiali, përdorimi..."
                      className={textareaClass}
                    />
                  </div>
                </div>
              </Panel>

              <Panel title="Kategoritë" description="Ku shfaqet produkti në katalog.">
                <CategoryPicker categories={categories} initial={initial} />
              </Panel>

              <Panel title="Kërkimi dhe adresa" description="Ndihmon klientët ta gjejnë produktin.">
                <div className="grid gap-5">
                  <div>
                    <label htmlFor="keywords" className={labelClass}>
                      Fjalë kyçe
                    </label>
                    <input
                      id="keywords"
                      name="keywords"
                      defaultValue={product?.keywords}
                      placeholder="p.sh. stop, ndalim"
                      className={inputClass}
                    />
                    <p className={hintClass}>Nuk shfaqen në faqe - vetëm ndihmojnë kërkimin.</p>
                  </div>
                  <div>
                    <label htmlFor="slug" className={labelClass}>
                      Adresa (URL)
                    </label>
                    <div className="flex">
                      <span className="flex h-10 shrink-0 items-center border border-r-0 border-line bg-surface px-3 text-[13px] text-muted">
                        /products/
                      </span>
                      <input
                        id="slug"
                        name="slug"
                        defaultValue={product?.slug}
                        placeholder={product ? undefined : "krijohet-nga-emri"}
                        className={`${inputClass} min-w-0`}
                      />
                    </div>
                    <p className={hintClass}>
                      {product
                        ? "Ndryshimi prish lidhjet e vjetra dhe produktin në shportat e ruajtura."
                        : "Lëreni bosh dhe krijohet automatikisht nga emri."}
                    </p>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="flex flex-col gap-6 xl:sticky xl:top-20">
              <Panel title="Dukshmëria">
                <Toggle
                  name="isActive"
                  defaultChecked={product?.isActive ?? true}
                  label="I dukshëm në faqe"
                  hint="Produktet e fshehura mbeten këtu, por klientët nuk i shohin."
                />
              </Panel>
              <Panel title="Imazhi">
                <ImageField defaultUrl={product?.imageUrl ?? null} defaultFit={product?.imageFit ?? "contain"} />
              </Panel>
            </div>
          </div>

          <FormFooter
            state={state}
            submitLabel={product ? "Ruaj ndryshimet" : "Krijo produktin"}
            cancelHref={product ? undefined : "/admin/produktet"}
          />
        </>
      )}
    </ActionForm>
  );
}
