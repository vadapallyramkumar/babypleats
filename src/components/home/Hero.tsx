"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useHeroImages } from "@/hooks/use-home";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/site";
import type { HeroImage } from "@/lib/api/types";

function HeroSlide({ image, priority }: { image: HeroImage; priority?: boolean }) {
  return (
    <>
      {image.mobileUrl ? (
        <>
          <Image
            src={image.mobileUrl}
            alt={image.alt}
            width={1080}
            height={1350}
            priority={priority}
            sizes="100vw"
            className="h-auto w-full object-contain object-center md:hidden"
          />
          <Image
            src={image.url}
            alt={image.alt}
            width={1920}
            height={900}
            priority={priority}
            sizes="100vw"
            className="hidden h-auto w-full object-contain object-center md:block"
          />
        </>
      ) : (
        <Image
          src={image.url}
          alt={image.alt}
          width={1920}
          height={900}
          priority={priority}
          sizes="100vw"
          className="h-auto w-full object-contain object-center"
        />
      )}
    </>
  );
}

export default function Hero() {
  const { data: images, loading } = useHeroImages();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length]);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-[#F3E6D8]">
        <Skeleton className="h-[400px] w-full rounded-none bg-[#E8D5C4] md:h-[600px]" />
        <div className="flex justify-center bg-[#FFF8F5] px-4 py-5 md:hidden">
          <Skeleton className="h-12 w-full max-w-xs rounded-md bg-[#E8D5C4]" />
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  const current = images[index] ?? images[0];

  return (
    <section className="relative w-full overflow-hidden bg-[#F3E6D8]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <Link
          href="/shop"
          className="group relative block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A02C68] focus-visible:ring-offset-2"
          aria-label={`${siteConfig.name} — Shop collection`}
        >
          {images.length > 1 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <HeroSlide image={current} priority={index === 0} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <HeroSlide image={current} priority />
          )}
        </Link>

        {images.length > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`pointer-events-auto size-2 rounded-full transition ${
                  i === index ? "bg-[#A02C68]" : "bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        ) : null}
      </motion.div>

      <div className="flex justify-center bg-[#FFF8F5] px-4 py-5 md:hidden">
        <Link
          href="/shop"
          className="inline-flex w-full max-w-xs items-center justify-center bg-[#A02C68] px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#8B235A]"
        >
          Shop Collection
        </Link>
      </div>
    </section>
  );
}
