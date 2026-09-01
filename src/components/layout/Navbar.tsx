"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Size Chart", href: "/size-chart" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-7 lg:flex">
      {menu.map((item) => {
        const pathOnly = item.href.split("?")[0];
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`text-sm font-semibold transition-colors ${
              active
                ? "text-[#A02C68]"
                : "text-gray-700 hover:text-[#A02C68]"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
