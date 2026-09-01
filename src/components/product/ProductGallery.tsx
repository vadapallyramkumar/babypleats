"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { assetPath } from "@/lib/paths";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5E6EC]">
        <Image
          src={assetPath(images[0])}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Carousel
        key={images.join("|")}
        setApi={setApi}
        opts={{ loop: true }}
        className="relative"
      >
        <CarouselContent className="-ml-0">
          {images.map((src, i) => (
            <CarouselItem key={src} className="pl-0">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F5E6EC]">
                <Image
                  src={assetPath(src)}
                  alt={`${alt} — photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 border-[#A02C68]/30 bg-white/90" />
        <CarouselNext className="right-3 border-[#A02C68]/30 bg-white/90" />
      </Carousel>
      <div className="flex justify-center gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={`relative h-14 w-11 overflow-hidden ring-1 transition ${
              index === i
                ? "ring-[#A02C68]"
                : "ring-[#E8D0DA] opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={assetPath(src)}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
