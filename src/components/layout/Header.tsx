import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import AnnouncementBar from "./AnnouncementBar";
import Container from "./Container";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import CartButton from "@/components/cart/CartButton";
import { assetPath } from "@/lib/paths";
import { siteConfig } from "@/lib/site";

export default function Header() {
  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-50 border-b border-[#E8D0DA]/80 bg-[#FFF8F5]/95 backdrop-blur">
        <Container>
          <div className="flex h-20 items-center justify-between">
            <div className="lg:hidden">
              <MobileMenu />
            </div>

            <Link href="/" className="flex items-center gap-2">
              <Image
                src={assetPath("/Logo.jpg")}
                alt={siteConfig.name}
                width={64}
                height={64}
                priority
                className="rounded-full object-cover"
              />
              <span className="hidden font-[family-name:var(--font-display)] text-xl text-[#A02C68] sm:inline">
                {siteConfig.name}
              </span>
            </Link>

            <Navbar />

            <div className="flex items-center gap-4 sm:gap-5">
              <Link
                href="/shop"
                aria-label="Search shop"
                className="text-gray-700 transition hover:text-[#A02C68]"
              >
                <Search size={20} />
              </Link>
              <CartButton />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}
