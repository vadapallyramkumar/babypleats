"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import CategoryCard, {
  CATEGORY_BADGE_BY_SLUG,
} from "@/components/shop/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-catalog";

export default function Collections() {
  const { data: categories, loading } = useCategories();

  if (!loading && categories.length === 0) return null;

  return (
    <section className="bg-[#FFF8F5] py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Browse Our Collections"
          subtitle="Explore handcrafted ethnic styles for every little celebration."
        />
      </Container>

      {loading ? (
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[70%] shrink-0 sm:w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/6"
              >
                <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                <Skeleton className="mt-3 h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-3 md:-ml-3">
              {categories.map((category) => (
                <CarouselItem
                  key={category.slug}
                  className="basis-[70%] pl-3 sm:basis-1/2 md:basis-1/3 md:pl-3 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.2857%]"
                >
                  <CategoryCard
                    href={`/shop?category=${category.slug}`}
                    image={category.image}
                    label={category.name}
                    badge={CATEGORY_BADGE_BY_SLUG[category.slug] ?? category.name}
                    sizes="(max-width: 768px) 70vw, (max-width: 1280px) 20vw, (max-width: 1536px) 16vw, 14vw"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 hidden border-[#A02C68]/30 bg-white/90 md:flex lg:left-4" />
            <CarouselNext className="right-2 hidden border-[#A02C68]/30 bg-white/90 md:flex lg:right-4" />
          </Carousel>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/shop"
          className="inline-flex border border-[#A02C68] px-8 py-3 text-sm font-semibold text-[#A02C68] transition hover:bg-[#A02C68] hover:text-white"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
