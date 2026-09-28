import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { api, ApiError, type ApiInit } from "@/lib/api/client";
import type { AdminUser } from "@/lib/admin/types";

export const SESSION_COOKIE = "liriu_admin";
// Matches the API's token lifetime (ACCESS_TOKEN_EXPIRE_MINUTES).
export const SESSION_MAX_AGE = 60 * 60 * 12;

export async function getToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** Calls the API as the signed-in admin; an expired session sends them to /login. */
export async function adminApi<T>(path: string, init: ApiInit = {}): Promise<T> {
  const token = await getToken();
  if (!token) redirect("/login");
  try {
    return await api<T>(path, { ...init, token });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect("/login?skaduar=1");
    throw err;
  }
}

/** The signed-in admin, fetched once per request. */
export const requireAdmin = cache(async () => adminApi<AdminUser>("/auth/me"));
