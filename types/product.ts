export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Collection {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  coverImageUrl?: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  priceOverride: number | null;
  quantity: number;
  status: "in_stock" | "low_stock" | "sold_out";
}

export interface ProductMedia {
  id: string;
  mediaType: "image" | "video";
  url: string;
  altText: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  collectionId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isLimitedEdition: boolean;
  subCategory: string;
  variants: ProductVariant[];
  media: ProductMedia[];
}
