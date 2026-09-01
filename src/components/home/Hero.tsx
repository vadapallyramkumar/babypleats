"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { assetPath } from "@/lib/paths";
import { siteConfig } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F3E6D8]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/shop"
          className="group relative block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A02C68] focus-visible:ring-offset-2"
          aria-label={`${siteConfig.name} — Shop collection`}
        >
          {/* Full banner visible on all screens — no tall crop that cuts the sides */}
          <Image
            src={assetPath("/hero1.png")}
            alt="Baby Pleats — Traditional elegance for little ones. Handcrafted with love for every special moment."
            width={1920}
            height={900}
            priority
            sizes="100vw"
            className="h-auto w-full object-contain object-center"
          />
        </Link>
      </motion.div>

      {/* Mobile-friendly CTA under the banner (baked-in button can be hard to tap) */}
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
