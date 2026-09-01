import fallback from "@/data/catalog.fallback.json";
import { API_BASE } from "./base";
import { mapCategory, mapProduct } from "./map";
import type { ApiCategory, ApiProduct, ApiVariant, Category, Product } from "./types";

type ListMeta = { page: number; limit: number; total: number };

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const isServer = typeof window === "undefined";
    const res = await fetch(`${API_BASE}${path}`, {
      ...(isServer ? { next: { revalidate: 60 } } : { cache: "no-store" }),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function enrichSeedProduct(raw: Record<string, unknown>): ApiProduct {
  const variants = (raw.variants as ApiVariant[]) ?? [];
  const active = variants.filter((v) => v.isActive !== false);
  let min = active[0];
  for (const v of active) {
    if (v.price.selling < (min?.price.selling ?? Infinity)) min = v;
  }
  return {
    ...(raw as unknown as ApiProduct),
    variants,
    colorGalleries: (raw.colorGalleries as ApiProduct["colorGalleries"]) ?? [],
    care: (raw.care as string[]) ?? [],
    tags: (raw.tags as string[]) ?? [],
    images: (raw.images as string[]) ?? [],
    priceFrom: min
      ? {
          selling: min.price.selling,
          ...(min.price.original != null
            ? { original: min.price.original }
            : {}),
          currency: "INR",
        }
      : { selling: 0, currency: "INR" },
    sizes: [...new Set(active.map((v) => v.size))],
    colors: [...new Set(active.map((v) => v.color))],
    stock: active.reduce((s, v) => s + v.stock, 0),
  };
}

function fallbackCategories(): Category[] {
  return (fallback.categories as ApiCategory[]).map(mapCategory);
}

function fallbackProducts(): Product[] {
  return (fallback.products as Record<string, unknown>[]).map((p) =>
    mapProduct(enrichSeedProduct(p))
  );
}

export async function listCategories(): Promise<Category[]> {
  const json = await apiGet<{ data: ApiCategory[] }>("/categories");
  if (json?.data?.length) return json.data.map(mapCategory);
  return fallbackCategories();
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const cats = await listCategories();
  return cats.find((c) => c.slug === slug);
}

export async function listProducts(params?: {
  category?: string;
  featured?: boolean;
  isNew?: boolean;
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Product[]; meta: ListMeta }> {
  const sp = new URLSearchParams();
  if (params?.category) sp.set("category", params.category);
  if (params?.featured != null) sp.set("featured", String(params.featured));
  if (params?.isNew != null) sp.set("isNew", String(params.isNew));
  if (params?.tag) sp.set("tag", params.tag);
  if (params?.q) sp.set("q", params.q);
  if (params?.page) sp.set("page", String(params.page));
  sp.set("limit", String(params?.limit ?? 100));

  const json = await apiGet<{ data: ApiProduct[]; meta: ListMeta }>(
    `/products?${sp.toString()}`
  );
  if (json?.data) {
    return { data: json.data.map(mapProduct), meta: json.meta };
  }

  let data = fallbackProducts();
  if (params?.featured) data = data.filter((p) => p.bestseller);
  if (params?.isNew) data = data.filter((p) => p.newArrival);
  if (params?.category) {
    data = data.filter((p) =>
      productMatchesCategorySync(p, params.category!, fallbackCategories())
    );
  }
  if (params?.limit != null) data = data.slice(0, params.limit);
  return {
    data,
    meta: { page: 1, limit: data.length, total: data.length },
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  const json = await apiGet<{ data: ApiProduct }>(
    `/products/${encodeURIComponent(slug)}`
  );
  if (json?.data) return mapProduct(json.data);
  return fallbackProducts().find((p) => p.slug === slug) ?? null;
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  const { data } = await listProducts({ featured: true, limit });
  return data.slice(0, limit);
}

export async function getNewArrivals(limit = 20): Promise<Product[]> {
  const { data } = await listProducts({ isNew: true, limit });
  return data.slice(0, limit);
}

export async function getProductsByCategory(
  category?: string
): Promise<Product[]> {
  const { data } = await listProducts({ category, limit: 100 });
  return data;
}

export async function getRelatedProducts(
  slug: string,
  limit = 4
): Promise<Product[]> {
  const product = await getProduct(slug);
  if (!product) {
    const { data } = await listProducts({ limit });
    return data.slice(0, limit);
  }
  const { data } = await listProducts({
    category: product.category,
    limit: limit + 5,
  });
  return data.filter((p) => p.slug !== slug).slice(0, limit);
}

function productMatchesCategorySync(
  product: Product,
  slug: string,
  cats: Category[]
) {
  const meta = cats.find((c) => c.slug === slug);
  if (meta?.filter === "budgetFriendly") return Boolean(product.budgetFriendly);
  if (meta?.filter === "readyToDispatch")
    return Boolean(product.readyToDispatch);
  if (meta?.filter === "bestseller") return Boolean(product.bestseller);
  return product.category === slug;
}

export function productMatchesCategory(product: Product, category: Category) {
  if (category.filter === "budgetFriendly")
    return Boolean(product.budgetFriendly);
  if (category.filter === "readyToDispatch")
    return Boolean(product.readyToDispatch);
  if (category.filter === "bestseller") return Boolean(product.bestseller);
  return product.category === category.slug;
}

export { API_BASE } from "./base";
