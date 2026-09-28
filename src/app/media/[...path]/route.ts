const API_BASE = process.env.API_URL ?? "http://localhost:8000";

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const upstream = `${API_BASE}/media/${path.join("/")}`;

  let res: Response;
  try {
    res = await fetch(upstream, { cache: "force-cache" });
  } catch {
    return new Response(null, { status: 502 });
  }

  if (!res.ok) return new Response(null, { status: res.status });

  const headers = new Headers();
  const ct = res.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const cc = res.headers.get("cache-control");
  headers.set("cache-control", cc ?? "public, max-age=31536000, immutable");

  return new Response(res.body, { headers });
}
