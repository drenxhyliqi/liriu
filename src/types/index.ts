// Shared content types for the LIRIU website.
// Data conforming to these types lives in `src/lib/data/*` as static
// TypeScript objects (see src/lib/data/README.md for why).

export type ServiceSlug =
  | "horizontal-signage"
  | "vertical-signage"
  | "traffic-engineering"
  | "construction-installation"
  | "consulting-supervision"
  | "traffic-accident-expertise"
  | "illuminated-signage-portals";

export interface Service {
  slug: ServiceSlug;
  /** Display index, e.g. "01" */
  number: string;
  name: string;
  /** One-line summary used in nav, cards, footer. Requires verified copy. */
  shortDescription?: string;
  /** Full service page copy. Requires verified copy. */
  overview?: string;
  capabilities?: string[];
  process?: string[];
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  name: string;
  location: string;
  client: string;
  year: number;
  services: ServiceSlug[];
  /** Short summary shown on cards/listing. */
  description: string;
  /** Case-study body, per brief section 18. All require verified content. */
  challenge?: string;
  solution?: string;
  execution?: string;
  results?: string;
  images: ProjectImage[];
  /** Explicit publish permission from client, tracked per project. */
  publishApproved: boolean;
}

export interface ProductGroup {
  slug: string;
  name: string;
}

export interface Product {
  slug: string;
  name: string;
  groupSlug: string;
  /** Short, generic description of the product type - not a company-specific
   * spec claim. Verified capabilities/materials/certifications require
   * client confirmation, same as services. */
  description: string;
}

export interface ProductVariant {
  slug: string;
  name: string;
  productSlug: string;
  /** Short, generic description of this design/category - standard
   * regulatory or industry terminology, not a specific LIRIU SKU claim. */
  description?: string;
}

export interface CartItem {
  /** Composite key: `${productSlug}` or `${productSlug}:${variantSlug}`. */
  key: string;
  productSlug: string;
  variantSlug?: string;
  name: string;
  groupName: string;
  quantity: number;
}

export type ClientType =
  | "municipality"
  | "institution"
  | "construction-company"
  | "contractor"
  | "private";

export interface Client {
  name: string;
  type: ClientType;
  logo?: string;
  /** Explicit permission to display this client/logo. */
  publishApproved: boolean;
}
