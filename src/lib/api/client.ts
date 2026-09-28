import "server-only";

const API_BASE = `${process.env.API_URL ?? "http://localhost:8000"}/api/v1`;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type ErrorBody = { detail?: string | { msg?: string; loc?: (string | number)[] }[] };

function messageFrom(status: number, body: ErrorBody | null): string {
  const detail = body?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    // FastAPI validation errors - surface the first one.
    return "Të dhënat nuk janë të vlefshme. Kontrolloni fushat dhe provoni përsëri.";
  }
  if (status >= 500) return "Serveri nuk u përgjigj. Provoni përsëri pas pak.";
  return "Diçka shkoi keq. Provoni përsëri.";
}

export type ApiInit = RequestInit & { token?: string; next?: { tags?: string[]; revalidate?: number | false } };

export async function api<T>(path: string, { token, headers, ...init }: ApiInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      ...init,
      headers: {
        ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(503, "Serveri nuk është i arritshëm. Provoni përsëri pas pak.");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ErrorBody | null;
    throw new ApiError(res.status, messageFrom(res.status, body));
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
