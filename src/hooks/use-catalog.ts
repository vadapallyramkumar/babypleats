"use client";

import { useEffect, useState } from "react";
import {
  getBestsellers,
  getCategory,
  getProduct,
  getRelatedProducts,
  listCategories,
  listProducts,
} from "@/lib/api/catalog";
import type { Category, Product } from "@/lib/api/types";

type CatalogState<T> = {
  data: T;
  loading: boolean;
};

export function useCategories(): CatalogState<Category[]> {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listCategories()
      .then((categories) => {
        if (active) setData(categories);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}

export function useProducts(
  params?: Parameters<typeof listProducts>[0]
): CatalogState<Product[]> {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params ?? {});

  useEffect(() => {
    let active = true;
    setLoading(true);
    listProducts(params)
      .then(({ data: products }) => {
        if (active) setData(products);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when filter params change
  }, [key]);

  return { data, loading };
}

export function useBestsellers(limit = 8): CatalogState<Product[]> {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getBestsellers(limit)
      .then((items) => {
        if (active) setData(items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return { data, loading };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState<string>();
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([getProduct(slug), getRelatedProducts(slug, 4)])
      .then(async ([item, relatedItems]) => {
        if (!active) return;
        setProduct(item);
        setRelated(relatedItems);
        if (item) {
          const category = await getCategory(item.category);
          if (active) setCategoryName(category?.name);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return { product, categoryName, related, loading };
}
