export type ImageFit = "cover" | "contain";

export interface CatalogCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  imageFit: ImageFit;
  parentId: number | null;
  sortOrder: number;
}

export interface CatalogProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  keywords: string;
  imageUrl: string | null;
  imageFit: ImageFit;
  placements: { categoryId: number; position: number }[];
}

export interface CatalogData {
  categories: CatalogCategory[];
  products: CatalogProduct[];
}
