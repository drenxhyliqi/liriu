import { NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// TODO: this only logs the submission - wire it to a real email service
// (e.g. Resend) once LIRIU confirms a destination address. See
// CLIENT INFORMATION REQUIRED in src/lib/data/README.md. Until then,
// submissions are received here but not delivered anywhere.
export async function POST(request: Request) {
  let body: Partial<ContactPayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Trup i pavlefshëm kërkese." }, { status: 400 });
  }

  const { name, email, phone, projectType, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Emri, email-i dhe mesazhi janë të detyrueshëm." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email-i nuk është i vlefshëm." }, { status: 400 });
  }

  console.log("[contact] New submission:", {
    name,
    email,
    phone: phone || null,
    projectType: projectType || null,
    message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
