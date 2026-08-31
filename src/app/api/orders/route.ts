import { NextResponse } from "next/server";

interface OrderItem {
  name: string;
  groupName: string;
  quantity: number;
}

interface OrderPayload {
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  items?: OrderItem[];
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Same pattern as /api/contact: this is a real, working endpoint - it
// validates and logs the request - but nothing persists it to a database
// or notifies anyone yet. Wire that up once there's somewhere real for
// order requests to land (and see the admin dashboard's "Porosite" view,
// which reads from the same not-yet-built store).
export async function POST(request: Request) {
  let body: OrderPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Trup i pavlefshëm kërkese." }, { status: 400 });
  }

  const { name, email, phone, note, items } = body;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Emri dhe email-i janë të detyrueshëm." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email-i nuk është i vlefshëm." }, { status: 400 });
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Porosia nuk ka artikuj." }, { status: 400 });
  }

  console.log("[orders] New order request:", {
    name,
    email,
    phone: phone || null,
    note: note || null,
    items,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
