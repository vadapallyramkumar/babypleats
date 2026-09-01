import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { assetPath } from "@/lib/paths";
import { siteConfig, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Baby Pleats — handmade kids ethnic wear crafted with love.",
};

export default function AboutPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#F5E6EC]">
          <video
            src={assetPath("/Insta1.mp4")}
            aria-label="About Baby Pleats"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-[#A02C68] uppercase">
              Our story
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-gray-900 md:text-5xl">
              Tradition, stitched with care
            </h1>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                {siteConfig.name} creates handmade pattu dresses and ethnic
                outfits for little ones — pieces meant for festivals, family
                gatherings, and the moments you&apos;ll photograph forever.
              </p>
              <p>
                Every outfit is chosen for soft comfort against small skin,
                beautiful colour, and craftsmanship that honours South Indian
                tradition without feeling heavy or stiff.
              </p>
              <p>
                Follow along on Instagram at {siteConfig.instagram.handle}, or
                message us anytime — we love helping parents find the right look
                and size.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex bg-[#A02C68] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#8B235A]"
              >
                Shop Collection
              </Link>
              <a
                href={whatsappUrl("Hi Baby Pleats! I'd love to know more about your brand.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex border border-[#A02C68] px-8 py-3.5 text-sm font-semibold text-[#A02C68] hover:bg-[#A02C68] hover:text-white"
              >
                Chat with us
              </a>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
