"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { assetPath } from "@/lib/paths";
import { siteConfig } from "@/lib/site";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Size Chart", href: "/size-chart" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

export default function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex items-center justify-center text-gray-800"
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[min(20rem,85vw)] gap-0 border-[#E8D0DA] bg-[#FFF8F5] p-0 shadow-2xl"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <div className="flex h-20 items-center gap-3 border-b border-[#E8D0DA] px-5">
          <Image
            src={assetPath("/Logo.jpg")}
            alt=""
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg leading-tight text-[#A02C68]">
              {siteConfig.name}
            </p>
            <p className="text-[11px] tracking-wide text-gray-500 uppercase">
              Menu
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col px-3 py-4">
          {menuItems.map((item) => {
            const pathOnly = item.href.split("?")[0];
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href.includes("?")
                  ? false
                  : pathname === pathOnly ||
                    pathname.startsWith(`${pathOnly}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`relative rounded-sm px-4 py-3 text-base transition ${
                  active
                    ? "bg-[#F5E6EC] font-semibold text-[#A02C68]"
                    : "font-medium text-gray-700 hover:bg-[#FBF0F4] hover:text-[#A02C68]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#E8D0DA] p-5">
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center bg-[#A02C68] px-5 py-3 text-sm font-semibold text-white hover:bg-[#8B235A]"
          >
            Shop collection
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
