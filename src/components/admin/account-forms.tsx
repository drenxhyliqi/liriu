"use client";

import * as React from "react";
import { KeyRound, Loader2, MoreHorizontal, ShieldCheck, ShieldOff, Trash2, UserCheck, UserX } from "lucide-react";
import { changePassword, createUser, deleteUser, updateProfile, updateUser } from "@/app/admin/actions";
import { ActionForm, ConfirmButton, FormMessage, SubmitButton } from "@/components/admin/forms";
import { Avatar, btnPrimary, btnSecondary, hintClass, inputClass, labelClass, Pill } from "@/components/admin/ui";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import type { ActionState, AdminUser } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export function ProfileForm({ admin }: { admin: AdminUser }) {
  return (
    <ActionForm action={updateProfile} className="grid gap-5">
      {(state) => (
        <>
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Emri i plotë
            </label>
            <input id="fullName" name="fullName" defaultValue={admin.fullName} autoComplete="name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={admin.email}
              autoComplete="email"
              className={inputClass}
            />
            <p className={hintClass}>Përdoret për t&apos;u kyçur në panel.</p>
          </div>
          <FormMessage state={state} />
          <div className="flex justify-end border-t border-line pt-4">
            <SubmitButton>Ruaj profilin</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function PasswordForm() {
  return (
    <ActionForm action={changePassword} resetOnSuccess className="grid gap-5">
      {(state) => (
        <>
          <div>
            <label htmlFor="currentPassword" className={labelClass}>
              Fjalëkalimi aktual
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="newPassword" className={labelClass}>
                Fjalëkalimi i ri
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Përsërite
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
          </div>
          <p className={cn(hintClass, "-mt-3")}>Të paktën 8 karaktere. Përdorni një fjalëkalim që nuk e përdorni gjetiu.</p>
          <FormMessage state={state} />
          <div className="flex justify-end border-t border-line pt-4">
            <SubmitButton pendingLabel="Duke ndryshuar...">Ndrysho fjalëkalimin</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function NewUserForm() {
  return (
    <ActionForm action={createUser} resetOnSuccess className="grid gap-4">
      {(state) => (
        <>
          <div>
            <label htmlFor="new-fullName" className={labelClass}>
              Emri i plotë
            </label>
            <input id="new-fullName" name="fullName" placeholder="Emri Mbiemri" className={inputClass} />
          </div>
          <div>
            <label htmlFor="new-email" className={labelClass}>
              Email <span className="text-red">*</span>
            </label>
            <input id="new-email" name="email" type="email" required placeholder="emri@liriu.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="new-password" className={labelClass}>
              Fjalëkalimi i përkohshëm <span className="text-red">*</span>
            </label>
            <input id="new-password" name="password" type="text" required minLength={8} autoComplete="off" className={inputClass} />
            <p className={hintClass}>Ndajeni në mënyrë të sigurt; personi mund ta ndryshojë te Profili.</p>
          </div>
          <fieldset>
            <legend className={labelClass}>Roli</legend>
            <div className="grid gap-2">
              {(
                [
                  ["admin", "Administrator", "Porositë, mesazhet dhe katalogu"],
                  ["owner", "Pronar", "Gjithçka, përfshirë përdoruesit"],
                ] as const
              ).map(([value, title, hint]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-start gap-3 border border-line px-3 py-2.5 has-[:checked]:border-ink has-[:checked]:bg-ink/[0.03]"
                >
                  <input type="radio" name="role" value={value} defaultChecked={value === "admin"} className="mt-0.5 accent-[var(--color-ink)]" />
                  <span>
                    <span className="block text-[13px] font-medium text-ink">{title}</span>
                    <span className="block text-[12px] text-muted">{hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <FormMessage state={state} />
          <SubmitButton pendingLabel="Duke shtuar..." className="w-full">
            Shto përdoruesin
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

function RowMenu({ children }: { children: (close: () => void) => React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Veprime"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center text-muted hover:bg-ink/[0.06] hover:text-ink"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-56 border border-line bg-paper py-1 shadow-xl">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

const menuItem = "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] hover:bg-ink/[0.04] disabled:opacity-50";

export function UserRow({ user, isSelf }: { user: AdminUser; isSelf: boolean }) {
  const [pending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<ActionState>(null);
  const [mode, setMode] = React.useState<"idle" | "reset" | "delete">("idle");
  const [password, setPassword] = React.useState("");

  const run = (fn: () => Promise<ActionState>) =>
    startTransition(async () => {
      const r = await fn();
      setResult(r);
      if (r?.ok) {
        setMode("idle");
        setPassword("");
      }
    });

  const name = user.fullName || user.email;

  return (
    <li className={cn("px-5 py-4", !user.isActive && "bg-surface/50")}>
      <div className="flex items-center gap-3">
        <Avatar name={name} className={cn(!user.isActive && "opacity-50")} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-ink">
            <span className="truncate">{name}</span>
            {isSelf && <Pill tone="ink">Ju</Pill>}
          </p>
          <p className="truncate text-[13px] text-muted">{user.email}</p>
        </div>
        <div className="hidden w-32 shrink-0 sm:block">
          {user.role === "owner" ? <Pill tone="red">Pronar</Pill> : <Pill>Administrator</Pill>}
        </div>
        <div className="hidden w-36 shrink-0 text-[12px] text-muted md:block" title={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : undefined}>
          {!user.isActive ? (
            <span className="font-medium text-ink">Çaktivizuar</span>
          ) : user.lastLoginAt ? (
            `Aktiv ${timeAgo(user.lastLoginAt)}`
          ) : (
            "Nuk është kyçur ende"
          )}
        </div>
        <div className="w-8 shrink-0">
          {pending ? (
            <Loader2 aria-hidden className="m-2 h-4 w-4 animate-spin text-muted" />
          ) : (
            !isSelf && (
              <RowMenu>
                {(close) => (
                  <>
                    <button
                      role="menuitem"
                      type="button"
                      className={menuItem}
                      onClick={() => {
                        close();
                        run(() => updateUser(user.id, { role: user.role === "owner" ? "admin" : "owner" }));
                      }}
                    >
                      {user.role === "owner" ? (
                        <ShieldOff aria-hidden className="h-4 w-4 text-muted" />
                      ) : (
                        <ShieldCheck aria-hidden className="h-4 w-4 text-muted" />
                      )}
                      {user.role === "owner" ? "Bëje administrator" : "Bëje pronar"}
                    </button>
                    <button
                      role="menuitem"
                      type="button"
                      className={menuItem}
                      onClick={() => {
                        close();
                        run(() => updateUser(user.id, { isActive: !user.isActive }));
                      }}
                    >
                      {user.isActive ? (
                        <UserX aria-hidden className="h-4 w-4 text-muted" />
                      ) : (
                        <UserCheck aria-hidden className="h-4 w-4 text-muted" />
                      )}
                      {user.isActive ? "Çaktivizo llogarinë" : "Aktivizo llogarinë"}
                    </button>
                    <button
                      role="menuitem"
                      type="button"
                      className={menuItem}
                      onClick={() => {
                        close();
                        setMode("reset");
                      }}
                    >
                      <KeyRound aria-hidden className="h-4 w-4 text-muted" />
                      Rivendos fjalëkalimin
                    </button>
                    <div className="my-1 border-t border-line" />
                    <button
                      role="menuitem"
                      type="button"
                      className={cn(menuItem, "text-red hover:bg-red/[0.05]")}
                      onClick={() => {
                        close();
                        setMode("delete");
                      }}
                    >
                      <Trash2 aria-hidden className="h-4 w-4" />
                      Fshi përdoruesin
                    </button>
                  </>
                )}
              </RowMenu>
            )
          )}
        </div>
      </div>

      {mode === "reset" && (
        <div className="mt-3 flex flex-col gap-2 border border-line bg-surface/60 p-3 sm:ml-12 sm:flex-row sm:items-center">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Fjalëkalimi i ri (të paktën 8 karaktere)"
            autoComplete="off"
            autoFocus
            className={`${inputClass} sm:max-w-xs`}
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode("idle")} className={btnSecondary}>
              Anulo
            </button>
            <button
              type="button"
              disabled={pending || password.length < 8}
              onClick={() => run(() => updateUser(user.id, { password }))}
              className={btnPrimary}
            >
              Ruaj fjalëkalimin
            </button>
          </div>
        </div>
      )}
      {mode === "delete" && (
        <div className="mt-3 sm:ml-12">
          <ConfirmButton
            action={async () => {
              const r = await deleteUser(user.id);
              if (!r?.ok) setMode("idle");
              setResult(r);
              return r;
            }}
            label="Fshi përdoruesin"
            question={`Fshi ${name}?`}
          />
        </div>
      )}
      {result && (result.error || result.message) && (
        <div className="mt-3 sm:ml-12">
          <FormMessage state={result} />
        </div>
      )}
    </li>
  );
}
