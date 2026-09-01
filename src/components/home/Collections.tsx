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
import { useCategories } from "@/hooks/use-catalog";

export default function Collections() {
  const { data: categories, loading } = useCategories();
  return (
    <section className="bg-[#FFF8F5] py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Browse Our Collections"
          subtitle="Explore handcrafted ethnic styles for every little celebration."
        />

        {loading ? (
          <p className="py-12 text-center text-gray-600">Loading collections…</p>
        ) : (
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-3 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem
                key={category.slug}
                className="basis-[70%] pl-3 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
              >
                <CategoryCard
                  href={`/shop?category=${category.slug}`}
                  image={category.image}
                  label={category.name}
                  badge={CATEGORY_BADGE_BY_SLUG[category.slug] ?? category.name}
                  sizes="(max-width: 768px) 70vw, 20vw"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 hidden border-[#A02C68]/30 bg-white/90 md:flex" />
          <CarouselNext className="right-0 hidden border-[#A02C68]/30 bg-white/90 md:flex" />
        </Carousel>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex border border-[#A02C68] px-8 py-3 text-sm font-semibold text-[#A02C68] transition hover:bg-[#A02C68] hover:text-white"
          >
            View All
          </Link>
        </div>
      </Container>
    </section>
  );
}
