"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/common/SectionHeading";
import CategoryCard, {
  CATEGORY_BADGE_BY_SLUG,
} from "@/components/shop/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { productMatchesCategory } from "@/lib/api/catalog";
import { useCategories, useProducts } from "@/hooks/use-catalog";
import { assetPath } from "@/lib/paths";

function ShopCatalogSkeleton() {
  return (
    <>
      <div className="mb-10 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/5] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </>
  );
}

export default function ShopCatalog() {
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: products, loading: productsLoading } = useProducts({
    limit: 100,
  });
  const loading = categoriesLoading || productsLoading;
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const isBrowseMode = !categorySlug && sort !== "new";

  const items = useMemo(() => {
    let list = products;
    if (sort === "new") {
      list = list.filter((p) => p.newArrival);
    }
    if (activeCategory) {
      list = list.filter((p) => productMatchesCategory(p, activeCategory));
    } else if (categorySlug) {
      list = list.filter((p) => p.category === categorySlug);
    }
    return list;
  }, [products, sort, activeCategory, categorySlug]);

  const title =
    sort === "new"
      ? "New Arrivals"
      : activeCategory
        ? activeCategory.name
        : "All Categories";

  if (loading) {
    return <ShopCatalogSkeleton />;
  }

  if (isBrowseMode && categories.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">No collections available right now.</p>
      </div>
    );
  }

  return (
    <>
      <SectionHeading
        align="left"
        title={title}
        subtitle={
          activeCategory?.description ??
          "Handmade ethnic wear crafted for comfort and celebration."
        }
      />

      {isBrowseMode ? (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                image={category.image}
                label={category.name}
                badge={CATEGORY_BADGE_BY_SLUG[category.slug] ?? category.name}
              />
            ))}
          </div>

          {products.length > 0 ? (
            <div className="mt-16 overflow-hidden bg-[#F5E6EC]">
              <div className="grid md:grid-cols-2">
                <div className="relative min-h-[240px] md:min-h-[320px]">
                  <Image
                    src={assetPath("/hero.png")}
                    alt="Baby Pleats collection"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-center px-8 py-10 md:px-12">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl text-gray-900">
                    Need help choosing?
                  </h2>
                  <p className="mt-3 text-gray-600">
                    Tell us the occasion and age — we&apos;ll help you pick the
                    right outfit.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex w-fit bg-[#A02C68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8B235A]"
                  >
                    Get in touch
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <Link
            href="/shop"
            className="mb-8 inline-flex text-sm font-semibold text-[#A02C68] transition hover:text-[#8B235A]"
          >
            ← All categories
          </Link>

          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-600">No products in this collection yet.</p>
              <Link
                href="/shop"
                className="mt-4 inline-block font-semibold text-[#A02C68]"
              >
                All categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
