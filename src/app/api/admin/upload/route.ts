import { NextResponse } from "next/server";
import { api, ApiError } from "@/lib/api/client";
import { getToken } from "@/lib/admin/session";

// The admin image picker uploads here; the file is forwarded to the API,
// which converts it to WebP and returns its /media/... path.
export async function POST(request: Request) {
  const token = await getToken();
  if (!token) return NextResponse.json({ error: "Kërkohet identifikim." }, { status: 401 });

  const incoming = await request.formData().catch(() => null);
  const file = incoming?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Zgjidhni një imazh." }, { status: 400 });

  const body = new FormData();
  body.append("file", file, file.name);
  try {
    const { url } = await api<{ url: string }>("/uploads", { method: "POST", body, token });
    return NextResponse.json({ url });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
