"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { instagramPosts } from "@/data/instagram";
import { assetPath } from "@/lib/paths";
import { siteConfig } from "@/lib/site";

function InstagramVideo({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
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

export default function InstagramFeed() {
  return (
    <section className="bg-[#FFF8F5] py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Follow Us on Instagram"
          subtitle={`Everyday moments and new drops at ${siteConfig.instagram.handle}`}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {instagramPosts.map((post, i) => (
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
                <InstagramVideo src={assetPath(post.video)} alt={post.alt} />
                <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium tracking-wide text-white uppercase">
                  Reel
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

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
