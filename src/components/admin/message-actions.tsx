"use client";

import * as React from "react";
import { Loader2, MailOpen, MailX } from "lucide-react";
import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/forms";
import { btnSecondary } from "@/components/admin/ui";

/** Marks the message read once it has been opened. */
export function MarkReadOnView({ id, isRead }: { id: number; isRead: boolean }) {
  const done = React.useRef(false);
  React.useEffect(() => {
    if (isRead || done.current) return;
    done.current = true;
    setMessageRead(id, true);
  }, [id, isRead]);
  return null;
}

export function MessageActions({ id, isRead }: { id: number; isRead: boolean }) {
  const [pending, startTransition] = React.useTransition();
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => void (await setMessageRead(id, !isRead)))}
        className={`${btnSecondary} w-full`}
      >
        {pending ? (
          <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
        ) : isRead ? (
          <MailX aria-hidden className="h-4 w-4" />
        ) : (
          <MailOpen aria-hidden className="h-4 w-4" />
        )}
        {isRead ? "Shëno si të palexuar" : "Shëno si të lexuar"}
      </button>
      <ConfirmButton action={() => deleteMessage(id)} label="Fshi mesazhin" question="Fshi mesazhin?" className="w-full" />
    </div>
  );
}
