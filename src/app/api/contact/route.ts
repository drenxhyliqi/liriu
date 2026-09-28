import { NextResponse } from "next/server";
import { api, ApiError } from "@/lib/api/client";

// The /contact form posts here; this forwards to the backend, which stores
// the message for the dashboard. No email is sent yet - that needs a
// confirmed destination address and a provider.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Trup i pavlefshëm kërkese." }, { status: 400 });
  }

  try {
    await api("/contact", { method: "POST", body: JSON.stringify(body) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = status === 422 ? "Kontrolloni emrin, email-in dhe mesazhin." : (err as Error).message;
    return NextResponse.json({ error: message }, { status: status >= 500 ? 502 : status });
  }
}
