"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { adminApi, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin/session";
import type { ActionState, AdminCategory, AdminProduct } from "@/lib/admin/types";
import { CATALOG_TAG } from "@/lib/catalog";

function failure(err: unknown): ActionState {
  unstable_rethrow(err);
  if (err instanceof ApiError) return { error: err.message };
  console.error(err);
  return { error: "Diçka shkoi keq. Provoni përsëri." };
}

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const optional = (fd: FormData, key: string) => text(fd, key) || null;
const checked = (fd: FormData, key: string) => fd.get(key) === "on";

function refreshAdmin() {
  revalidatePath("/admin", "layout");
}

function refreshCatalog() {
  updateTag(CATALOG_TAG);
  refreshAdmin();
}

// ---------------------------------------------------------------- session

export async function login(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = text(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Email-i dhe fjalëkalimi janë të detyrueshëm." };

  let token: string;
  try {
    ({ accessToken: token } = await api<{ accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }));
  } catch (err) {
    if (err instanceof ApiError && err.status === 422) return { error: "Email-i nuk është i vlefshëm." };
    return failure(err);
  }

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  const next = text(fd, "next");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

// ---------------------------------------------------------------- orders

export async function updateOrder(orderId: number, _prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await adminApi(`/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: text(fd, "status"), adminNote: text(fd, "adminNote") }),
    });
  } catch (err) {
    return failure(err);
  }
  refreshAdmin();
  return { ok: true, message: "Ndryshimet u ruajtën." };
}

export async function setOrderStatus(orderId: number, status: string): Promise<ActionState> {
  try {
    await adminApi(`/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ status }) });
  } catch (err) {
    return failure(err);
  }
  refreshAdmin();
  return { ok: true };
}

export async function deleteOrder(orderId: number): Promise<ActionState> {
  try {
    await adminApi(`/orders/${orderId}`, { method: "DELETE" });
  } catch (err) {
    return failure(err);
  }
  refreshAdmin();
  redirect("/admin/porosite");
}

// ---------------------------------------------------------------- messages

export async function setMessageRead(messageId: number, isRead: boolean): Promise<ActionState> {
  try {
    await adminApi(`/contact/${messageId}`, { method: "PATCH", body: JSON.stringify({ isRead }) });
  } catch (err) {
    return failure(err);
  }
  refreshAdmin();
  return { ok: true };
}

export async function deleteMessage(messageId: number): Promise<ActionState> {
  try {
    await adminApi(`/contact/${messageId}`, { method: "DELETE" });
  } catch (err) {
    return failure(err);
  }
  refreshAdmin();
  redirect("/admin/mesazhet");
}

// ---------------------------------------------------------------- catalog

export async function saveCategory(categoryId: number | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const parent = text(fd, "parentId");
  const body = {
    name: text(fd, "name"),
    slug: optional(fd, "slug"),
    description: optional(fd, "description"),
    imageUrl: optional(fd, "imageUrl"),
    imageFit: text(fd, "imageFit") === "contain" ? "contain" : "cover",
    parentId: parent ? Number(parent) : null,
    sortOrder: Number(text(fd, "sortOrder")) || 0,
    isActive: checked(fd, "isActive"),
  };
  if (!body.name) return { error: "Emri është i detyrueshëm." };
  if (categoryId !== null && !body.slug) return { error: "Slug-u nuk mund të jetë bosh." };

  let saved: AdminCategory;
  try {
    saved = await adminApi<AdminCategory>(categoryId === null ? "/categories" : `/categories/${categoryId}`, {
      method: categoryId === null ? "POST" : "PATCH",
      body: JSON.stringify(body),
    });
  } catch (err) {
    return failure(err);
  }
  refreshCatalog();
  if (categoryId === null) redirect(`/admin/kategorite/${saved.id}?krijuar=1`);
  return { ok: true, message: "Kategoria u ruajt." };
}

export async function deleteCategory(categoryId: number): Promise<ActionState> {
  try {
    await adminApi(`/categories/${categoryId}`, { method: "DELETE" });
  } catch (err) {
    return failure(err);
  }
  refreshCatalog();
  redirect("/admin/kategorite");
}

export async function saveProduct(productId: number | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const body = {
    name: text(fd, "name"),
    slug: optional(fd, "slug"),
    description: text(fd, "description"),
    keywords: text(fd, "keywords"),
    imageUrl: optional(fd, "imageUrl"),
    imageFit: text(fd, "imageFit") === "cover" ? "cover" : "contain",
    isActive: checked(fd, "isActive"),
    categoryIds: fd.getAll("categoryIds").map(Number).filter(Boolean),
  };
  if (!body.name) return { error: "Emri është i detyrueshëm." };
  if (productId !== null && !body.slug) return { error: "Slug-u nuk mund të jetë bosh." };

  let saved: AdminProduct;
  try {
    saved = await adminApi<AdminProduct>(productId === null ? "/products" : `/products/${productId}`, {
      method: productId === null ? "POST" : "PATCH",
      body: JSON.stringify(body),
    });
  } catch (err) {
    return failure(err);
  }
  refreshCatalog();
  if (productId === null) redirect(`/admin/produktet/${saved.id}?krijuar=1`);
  return { ok: true, message: "Produkti u ruajt." };
}

export async function setProductActive(productId: number, isActive: boolean): Promise<ActionState> {
  try {
    await adminApi(`/products/${productId}`, { method: "PATCH", body: JSON.stringify({ isActive }) });
  } catch (err) {
    return failure(err);
  }
  refreshCatalog();
  return { ok: true };
}

export async function deleteProduct(productId: number): Promise<ActionState> {
  try {
    await adminApi(`/products/${productId}`, { method: "DELETE" });
  } catch (err) {
    return failure(err);
  }
  refreshCatalog();
  redirect("/admin/produktet");
}

// ---------------------------------------------------------------- account

export async function updateProfile(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await adminApi("/auth/me", {
      method: "PATCH",
      body: JSON.stringify({ fullName: text(fd, "fullName"), email: text(fd, "email") }),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 422) return { error: "Email-i nuk është i vlefshëm." };
    return failure(err);
  }
  refreshAdmin();
  return { ok: true, message: "Profili u përditësua." };
}

export async function changePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const next = String(fd.get("newPassword") ?? "");
  if (next.length < 8) return { error: "Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere." };
  if (next !== String(fd.get("confirmPassword") ?? "")) return { error: "Fjalëkalimet nuk përputhen." };
  try {
    await adminApi("/auth/me/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: String(fd.get("currentPassword") ?? ""), newPassword: next }),
    });
  } catch (err) {
    return failure(err);
  }
  return { ok: true, message: "Fjalëkalimi u ndryshua." };
}

// ---------------------------------------------------------------- admins (owner only)

export async function createUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const password = String(fd.get("password") ?? "");
  if (password.length < 8) return { error: "Fjalëkalimi duhet të ketë të paktën 8 karaktere." };
  try {
    await adminApi("/users", {
      method: "POST",
      body: JSON.stringify({
        email: text(fd, "email"),
        fullName: text(fd, "fullName"),
        password,
        role: text(fd, "role") === "owner" ? "owner" : "admin",
      }),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 422) return { error: "Email-i nuk është i vlefshëm." };
    return failure(err);
  }
  refreshAdmin();
  return { ok: true, message: "Përdoruesi u shtua." };
}

export async function updateUser(
  userId: number,
  changes: { role?: "owner" | "admin"; isActive?: boolean; password?: string },
): Promise<ActionState> {
  if (changes.password !== undefined && changes.password.length < 8) {
    return { error: "Fjalëkalimi duhet të ketë të paktën 8 karaktere." };
  }
  try {
    await adminApi(`/users/${userId}`, { method: "PATCH", body: JSON.stringify(changes) });
  } catch (err) {
    return failure(err);
  }
  refreshAdmin();
  return { ok: true, message: changes.password ? "Fjalëkalimi u rivendos." : "U ruajt." };
}

export async function deleteUser(userId: number): Promise<ActionState> {
  try {
    await adminApi(`/users/${userId}`, { method: "DELETE" });
  } catch (err) {
    return failure(err);
  }
  refreshAdmin();
  return { ok: true };
}
