import type { ImageFit } from "@/types/catalog";

export type Role = "owner" | "admin";
export type OrderStatus = "new" | "contacted" | "quoted" | "closed";

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OrderItem {
  id: number;
  productSlug: string | null;
  name: string;
  groupName: string;
  imageUrl: string | null;
  quantity: number;
}

export interface Order {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  note: string | null;
  status: OrderStatus;
  adminNote: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  projectType: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  imageFit: ImageFit;
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  childCount: number;
}

export interface AdminProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  keywords: string;
  imageUrl: string | null;
  imageFit: ImageFit;
  isActive: boolean;
  categories: { id: number; slug: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  newOrders: number;
  openOrders: number;
  totalOrders: number;
  unreadMessages: number;
  totalMessages: number;
  products: number;
  categories: number;
  recentOrders: Order[];
  recentMessages: ContactMessage[];
}

export type ActionState = { ok?: boolean; error?: string; message?: string } | null;
