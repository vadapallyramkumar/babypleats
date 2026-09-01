import type { Product } from "@/lib/api/types";

export type {
  Product,
  ProductVariant,
  Category,
  CategoryFilter,
} from "@/lib/api/types";

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getFromPrice(product: Product) {
  return Math.min(...product.variants.map((v) => v.price));
}

export function getUniqueSizes(product: Product) {
  return [...new Set(product.variants.map((v) => v.size))];
}

export function getUniqueColors(product: Product) {
  return [...new Set(product.variants.map((v) => v.color))];
}

export function getColorImages(product: Product, color: string) {
  const images = product.colorImages[color];
  if (images && images.length > 0) return images;
  return [product.image];
}

export function getVariant(
  product: Product,
  size: string,
  color: string
) {
  return product.variants.find((v) => v.size === size && v.color === color);
}
