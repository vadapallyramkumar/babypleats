"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useBestsellers } from "@/hooks/use-catalog";

export default function BestSellers() {
  const { data: items, loading } = useBestsellers(14);

  if (!loading && items.length === 0) return null;

  return (
    <section className="border-t border-[#E8D0DA]/60 bg-[#FFF8F5] py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Best Sellers"
          subtitle="Our most-loved outfits — the ones families come back for."
        />
      </Container>

      {loading ? (
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 md:gap-x-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 md:gap-x-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/shop?category=best-sellers"
          className="inline-flex bg-[#A02C68] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#8B235A]"
        >
          View All Best Sellers
        </Link>
      </div>
    </section>
  );
}
