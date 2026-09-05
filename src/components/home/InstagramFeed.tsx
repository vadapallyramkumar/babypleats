"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { useSocialLinks } from "@/hooks/use-home";
import { siteConfig } from "@/lib/site";
import type { SocialLink } from "@/lib/api/types";

function InstagramVideo({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      aria-label={alt}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  );
}

function SocialMedia({ item }: { item: SocialLink }) {
  if (item.type === "image") {
    return (
      <Image
        src={item.url}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
    );
  }

  return <InstagramVideo src={item.url} alt={item.alt} />;
}

export default function InstagramFeed() {
  const { data: posts, loading } = useSocialLinks();

  return (
    <section className="bg-[#FFF8F5] py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Follow Us on Instagram"
          subtitle={`Everyday moments and new drops at ${siteConfig.instagram.handle}`}
        />

        {loading && posts.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[9/16] animate-pulse bg-[#F5E6EC] sm:aspect-square"
                aria-hidden
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Link
                  href={siteConfig.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[9/16] overflow-hidden bg-[#F5E6EC] sm:aspect-square"
                >
                  <SocialMedia item={post} />
                  <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
                  {post.type === "video" ? (
                    <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium tracking-wide text-white uppercase">
                      Reel
                    </span>
                  ) : null}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex border border-[#A02C68] px-8 py-3 text-sm font-semibold text-[#A02C68] transition hover:bg-[#A02C68] hover:text-white"
          >
            Visit Instagram
          </Link>
        </div>
      </Container>
    </section>
  );
}
