"use client";

import { saveCategory } from "@/app/admin/actions";
import { ActionForm, FormFooter, Toggle } from "@/components/admin/forms";
import { ImageField } from "@/components/admin/image-field";
import { hintClass, inputClass, labelClass, Panel, textareaClass } from "@/components/admin/ui";
import type { AdminCategory } from "@/lib/admin/types";
import type { TreeRow } from "@/lib/admin/tree";

export function CategoryForm({
  category,
  parentOptions,
  defaultParentId,
}: {
  category?: AdminCategory;
  /** Valid parents only - the category itself and its subcategories are already excluded. */
  parentOptions: TreeRow[];
  defaultParentId?: number | null;
}) {
  const action = saveCategory.bind(null, category?.id ?? null);
  return (
    <ActionForm action={action}>
      {(state) => (
        <>
          <div className="grid grid-cols-1 items-start gap-6 pb-6 xl:grid-cols-3">
            <div className="flex flex-col gap-6 xl:col-span-2">
              <Panel title="Të dhënat" description="Si shfaqet kategoria në faqe.">
                <div className="grid gap-5">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Emri <span className="text-red">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      defaultValue={category?.name}
                      placeholder="p.sh. Shenja Trafiku"
                      className={inputClass}
                    />
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
                        defaultValue={category?.slug}
                        placeholder={category ? undefined : "krijohet-nga-emri"}
                        className={`${inputClass} min-w-0`}
                      />
                    </div>
                    <p className={hintClass}>
                      {category
                        ? "Ndryshimi i adresës prish lidhjet e vjetra që janë ndarë."
                        : "Lëreni bosh dhe krijohet automatikisht nga emri."}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="description" className={labelClass}>
                      Përshkrimi
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      defaultValue={category?.description ?? ""}
                      placeholder="Tekst i shkurtër që shfaqet në krye të faqes së kategorisë."
                      className={textareaClass}
                    />
                    <p className={hintClass}>Rreshtat e rinj ruhen ashtu siç i shkruani.</p>
                  </div>
                </div>
              </Panel>

              <Panel title="Vendndodhja" description="Ku bën pjesë kjo kategori në strukturë.">
                <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
                  <div>
                    <label htmlFor="parentId" className={labelClass}>
                      Kategoria prind
                    </label>
                    <select
                      id="parentId"
                      name="parentId"
                      defaultValue={String(category?.parentId ?? defaultParentId ?? "")}
                      className={inputClass}
                    >
                      <option value="">— Kategori kryesore —</option>
                      {parentOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {"   ".repeat(c.depth)}
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sortOrder" className={labelClass}>
                      Renditja
                    </label>
                    <input
                      id="sortOrder"
                      name="sortOrder"
                      type="number"
                      defaultValue={category?.sortOrder ?? 0}
                      className={inputClass}
                    />
                  </div>
                </div>
                <p className={hintClass}>Kategoritë me numër më të vogël shfaqen më parë.</p>
              </Panel>
            </div>

            <div className="flex flex-col gap-6">
              <Panel title="Dukshmëria">
                <Toggle
                  name="isActive"
                  defaultChecked={category?.isActive ?? true}
                  label="E dukshme në faqe"
                  hint="Kur fshihet, fshihen edhe nënkategoritë dhe produktet e saj."
                />
              </Panel>
              <Panel title="Imazhi" description="Kartela e kategorisë në faqe.">
                <ImageField defaultUrl={category?.imageUrl ?? null} defaultFit={category?.imageFit ?? "cover"} />
              </Panel>
            </div>
          </div>

          <FormFooter
            state={state}
            submitLabel={category ? "Ruaj ndryshimet" : "Krijo kategorinë"}
            cancelHref={category ? undefined : "/admin/kategorite"}
          />
        </>
      )}
    </ActionForm>
  );
}
