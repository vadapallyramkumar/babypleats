import { apiGet } from "./base";
import { mapCategory, mapProduct } from "./map";
import type { ApiCategory, ApiProduct, Category, Product } from "./types";

type ListMeta = { page: number; limit: number; total: number };

export async function listCategories(): Promise<Category[]> {
  const json = await apiGet<{ data: ApiCategory[] }>("/categories");
  if (json?.data?.length) return json.data.map(mapCategory);
  return [];
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

  return {
    data: [],
    meta: { page: 1, limit: params?.limit ?? 100, total: 0 },
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  const json = await apiGet<{ data: ApiProduct }>(
    `/products/${encodeURIComponent(slug)}`
  );
  if (json?.data) return mapProduct(json.data);
  return null;
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

export function productMatchesCategory(product: Product, category: Category) {
  if (category.filter === "budgetFriendly")
    return Boolean(product.budgetFriendly);
  if (category.filter === "readyToDispatch")
    return Boolean(product.readyToDispatch);
  if (category.filter === "bestseller") return Boolean(product.bestseller);
  return product.category === category.slug;
}

export { API_BASE } from "./base";
