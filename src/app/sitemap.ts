import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { projects } from "@/lib/data/projects";
import { services } from "@/lib/data/services";
import { SITE_URL } from "@/lib/site-url";

// Rebuilt at most hourly, so catalog edits reach search engines without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${SITE_URL}${path}`;

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/services"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/products"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/projects"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.1 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.1 },
    { url: url("/cookies"), changeFrequency: "yearly", priority: 0.1 },
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...projects.map((p) => ({ url: url(`/projects/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];

  // If the API is unreachable, still serve the static pages rather than failing.
  try {
    const catalog = await getCatalog();
    for (const c of catalog.allCategories()) {
      pages.push({ url: url(`/products/${c.slug}`), changeFrequency: "weekly", priority: 0.7 });
    }
    for (const p of catalog.allProducts()) {
      pages.push({ url: url(`/products/${p.slug}`), changeFrequency: "monthly", priority: 0.5 });
    }
  } catch {}

  return pages;
}
