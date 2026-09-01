import type { ApiCategory, ApiProduct, Category, Product } from "./types";

const FILTER_BY_SLUG: Record<string, Category["filter"]> = {
  "budget-friendly": "budgetFriendly",
  "ready-to-dispatch": "readyToDispatch",
  "best-sellers": "bestseller",
};

export function mapCategory(c: ApiCategory): Category {
  return {
    slug: c.slug,
    name: c.name,
    image: c.image,
    description: c.description,
    filter: FILTER_BY_SLUG[c.slug],
  };
}

export function mapProduct(p: ApiProduct): Product {
  const colorImages: Record<string, string[]> = {};
  for (const g of p.colorGalleries ?? []) {
    colorImages[g.color] = g.images;
  }
  if (Object.keys(colorImages).length === 0) {
    for (const color of p.colors) {
      colorImages[color] = p.images;
    }
  }

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.categoryId,
    image: p.images[0] ?? "/hero.png",
    bestseller: p.featured,
    newArrival: p.isNew,
    budgetFriendly: p.tags.includes("budget-friendly"),
    readyToDispatch: p.tags.includes("ready-to-dispatch"),
    description: p.description,
    fabric: p.fabric,
    care: p.care?.length ? p.care.join(" ") : undefined,
    colorImages,
    variants: p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      price: v.price.selling,
      compareAt: v.price.original,
      stock: v.stock,
    })),
  };
}
