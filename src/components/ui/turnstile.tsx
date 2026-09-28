"use client";

import * as React from "react";

// Cloudflare Turnstile site key (public). When unset, the widget renders
// nothing and TURNSTILE_ENABLED is false, so the forms submit without a token
// and the backend skips verification - the whole feature stays inert until
// both this and the backend's TURNSTILE_SECRET_KEY are configured.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const TURNSTILE_ENABLED = SITE_KEY.length > 0;

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type TurnstileHandle = { reset: () => void };

type Props = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
};

export const Turnstile = React.forwardRef<TurnstileHandle, Props>(function Turnstile(
  { onVerify, onExpire, className },
  ref,
) {
  const container = React.useRef<HTMLDivElement | null>(null);
  const widgetId = React.useRef<string | null>(null);
  // Keep callbacks fresh without re-rendering the widget.
  const verify = React.useRef(onVerify);
  const expire = React.useRef(onExpire);
  verify.current = onVerify;
  expire.current = onExpire;

  React.useImperativeHandle(ref, () => ({
    reset() {
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    },
  }));

  React.useEffect(() => {
    if (!TURNSTILE_ENABLED) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: SITE_KEY,
          theme: "light",
          callback: (token: string) => verify.current(token),
          "expired-callback": () => expire.current?.(),
          "error-callback": () => expire.current?.(),
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  if (!TURNSTILE_ENABLED) return null;
  return <div ref={container} className={className} />;
});
