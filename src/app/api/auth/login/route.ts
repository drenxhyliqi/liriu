import { NextResponse } from "next/server";

// No authentication backend exists yet - the admin CMS (product/category
// CRUD, persistent storage, real sessions) is a separate build from the
// login page itself. This endpoint exists so the form has something real
// to submit to, but it always reports the system as not yet live rather
// than faking a success or a "wrong password" failure.
export async function POST(request: Request) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Trup i pavlefshëm kërkese." }, { status: 400 });
  }

  if (!body.email?.trim() || !body.password?.trim()) {
    return NextResponse.json({ error: "Email-i dhe fjalëkalimi janë të detyrueshëm." }, { status: 400 });
  }

  return NextResponse.json(
    { error: "Sistemi i identifikimit ende nuk është aktivizuar." },
    { status: 501 },
  );
}
