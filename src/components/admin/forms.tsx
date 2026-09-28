"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, Check, CircleDot, Loader2, TriangleAlert } from "lucide-react";
import type { ActionState } from "@/lib/admin/types";
import { btnDanger, btnDangerSolid, btnGhost, btnPrimary, btnSecondary } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state?.error && !state?.message) return null;
  return state.error ? (
    <p role="alert" className="flex items-start gap-2.5 border border-red/20 bg-red/[0.04] px-3.5 py-3 text-[13px] leading-relaxed text-ink">
      <AlertCircle aria-hidden className="mt-px h-4 w-4 shrink-0 text-red" />
      {state.error}
    </p>
  ) : (
    <p role="status" className="flex items-start gap-2.5 border border-line bg-surface px-3.5 py-3 text-[13px] leading-relaxed text-ink">
      <Check aria-hidden className="mt-px h-4 w-4 shrink-0" />
      {state.message}
    </p>
  );
}

type FormContextValue = { pending: boolean; dirty: boolean; markDirty: () => void };
const FormContext = React.createContext<FormContextValue>({ pending: false, dirty: false, markDirty: () => {} });

/** For fields that change hidden inputs (image, category picker) - they don't fire input events. */
export function useMarkDirty() {
  return React.useContext(FormContext).markDirty;
}

export function SubmitButton({
  children,
  pendingLabel = "Duke ruajtur...",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = React.useContext(FormContext);
  return (
    <button type="submit" disabled={pending} className={cn(btnPrimary, className)}>
      {pending && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
      {pending ? pendingLabel : children}
    </button>
  );
}

type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * A form bound to a server action. Submits via startTransition rather than
 * `<form action>` because React resets a form after its action - which
 * would wipe the user's input whenever the action returns a validation error.
 * Tracks unsaved changes for the save bar and warns before leaving the page.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess,
}: {
  action: FormAction;
  children: (state: ActionState) => React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [dirty, setDirty] = React.useState(false);
  const [state, formAction, pending] = React.useActionState(async (prev: ActionState, fd: FormData) => {
    const result = await action(prev, fd);
    if (result?.ok) {
      setDirty(false);
      if (resetOnSuccess) formRef.current?.reset();
    }
    return result;
  }, null);

  React.useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const markDirty = React.useCallback(() => setDirty(true), []);
  const value = React.useMemo(() => ({ pending, dirty, markDirty }), [pending, dirty, markDirty]);

  return (
    <form
      ref={formRef}
      className={className}
      onChange={markDirty}
      onSubmit={(event) => {
        event.preventDefault();
        const fd = new FormData(event.currentTarget);
        React.startTransition(() => formAction(fd));
      }}
    >
      <FormContext.Provider value={value}>{children(state)}</FormContext.Provider>
    </form>
  );
}

/**
 * Sticky save bar at the bottom of long edit forms: shows unsaved changes,
 * the result of the last save and the primary action, always in reach.
 */
export function FormFooter({
  state,
  submitLabel,
  cancelHref,
  className,
}: {
  state: ActionState;
  submitLabel: string;
  cancelHref?: string;
  className?: string;
}) {
  const { dirty, pending } = React.useContext(FormContext);
  let status: React.ReactNode = null;
  if (pending) {
    status = (
      <span className="flex items-center gap-2 text-muted">
        <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> Duke ruajtur...
      </span>
    );
  } else if (state?.error) {
    status = (
      <span role="alert" className="flex items-start gap-2 text-red">
        <AlertCircle aria-hidden className="mt-px h-4 w-4 shrink-0" /> {state.error}
      </span>
    );
  } else if (dirty) {
    status = (
      <span className="flex items-center gap-2 text-ink">
        <CircleDot aria-hidden className="h-4 w-4 text-red" /> Ndryshime të paruajtura
      </span>
    );
  } else if (state?.message) {
    status = (
      <span role="status" className="flex items-center gap-2 text-ink">
        <Check aria-hidden className="h-4 w-4" /> {state.message}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[13px] empty:hidden sm:block sm:min-h-5">{status}</div>
        <div className="flex items-center gap-2">
          {cancelHref && (
            <Link href={cancelHref} className={btnGhost}>
              Anulo
            </Link>
          )}
          <SubmitButton className="min-w-32 flex-1 sm:flex-none">{submitLabel}</SubmitButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Two-step destructive button: the first click asks for confirmation inline,
 * the second runs the action. No browser dialog.
 */
export function ConfirmButton({
  action,
  label,
  confirmLabel = "Po, fshije",
  question = "Jeni i sigurt?",
  className,
}: {
  action: () => Promise<ActionState>;
  label: React.ReactNode;
  confirmLabel?: string;
  question?: string;
  className?: string;
}) {
  const [asking, setAsking] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  if (!asking) {
    return (
      <div className="flex flex-col items-start gap-2">
        <button type="button" onClick={() => setAsking(true)} className={cn(btnDanger, className)}>
          {label}
        </button>
        {error && <p className="text-[12px] text-red">{error}</p>}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 border border-red/20 bg-red/[0.04] p-2">
      <span className="flex items-center gap-2 px-1 text-[13px] font-medium text-ink">
        <TriangleAlert aria-hidden className="h-4 w-4 text-red" />
        {question}
      </span>
      <div className="ml-auto flex gap-2">
        <button type="button" disabled={pending} onClick={() => setAsking(false)} className={btnSecondary}>
          Anulo
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await action();
              if (result?.error) {
                setError(result.error);
                setAsking(false);
              }
            })
          }
          className={btnDangerSolid}
        >
          {pending && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

export function Toggle({
  name,
  defaultChecked,
  label,
  hint,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">{hint}</span>}
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden
        className="relative mt-0.5 h-5 w-9 shrink-0 bg-ink/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:bg-paper after:shadow-sm after:transition-transform peer-checked:bg-ink peer-checked:after:translate-x-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
      />
    </label>
  );
}
