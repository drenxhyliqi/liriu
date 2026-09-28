"use client";

import * as React from "react";
import { deleteOrder, updateOrder } from "@/app/admin/actions";
import { ActionForm, ConfirmButton, FormMessage, SubmitButton } from "@/components/admin/forms";
import { hintClass, labelClass, Panel, textareaClass } from "@/components/admin/ui";
import { orderStatusHints, orderStatusLabels } from "@/lib/admin/format";
import type { Order, OrderStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export function OrderManage({ order }: { order: Order }) {
  const [status, setStatus] = React.useState<OrderStatus>(order.status);
  return (
    <>
      <Panel title="Statusi" description="Ndiqni ku ndodhet kjo kërkesë.">
        <ActionForm action={updateOrder.bind(null, order.id)} className="grid gap-5">
          {(state) => (
            <>
              <input type="hidden" name="status" value={status} />
              <div className="grid gap-1.5" role="radiogroup" aria-label="Statusi">
                {(Object.keys(orderStatusLabels) as OrderStatus[]).map((s) => {
                  const selected = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setStatus(s)}
                      className={cn(
                        "flex items-center gap-3 border px-3 py-2.5 text-left transition-colors",
                        selected ? "border-ink bg-ink/[0.03]" : "border-line hover:border-ink/30",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center border",
                          selected ? "border-ink bg-ink" : "border-ink/25",
                        )}
                      >
                        {selected && <span className="h-1.5 w-1.5 bg-paper" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium text-ink">{orderStatusLabels[s]}</span>
                        <span className="block text-[12px] text-muted">{orderStatusHints[s]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div>
                <label htmlFor="adminNote" className={labelClass}>
                  Shënim i brendshëm
                </label>
                <textarea
                  id="adminNote"
                  name="adminNote"
                  rows={3}
                  defaultValue={order.adminNote ?? ""}
                  placeholder="p.sh. Oferta u dërgua me email më 12.10"
                  className={textareaClass}
                />
                <p className={hintClass}>E dukshme vetëm për administratorët.</p>
              </div>
              <FormMessage state={state} />
              <SubmitButton className="w-full">Ruaj ndryshimet</SubmitButton>
            </>
          )}
        </ActionForm>
      </Panel>

      <Panel title="Zona e rrezikshme">
        <p className="mb-4 text-[13px] leading-relaxed text-muted">
          Fshirja e heq kërkesën përgjithmonë. Përdoreni vetëm për kërkesa të dyfishta ose spam.
        </p>
        <ConfirmButton action={() => deleteOrder(order.id)} label="Fshi porosinë" question="Fshi përgjithmonë?" />
      </Panel>
    </>
  );
}
