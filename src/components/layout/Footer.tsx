"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";
import { assetPath } from "@/lib/paths";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { useCategories } from "@/hooks/use-catalog";

const helpLinks = [
  { name: "Size Chart", href: "/size-chart" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
  { name: "Shipping Policy", href: "/shipping-policy" },
  { name: "Return Policy", href: "/return-policy" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

export default function Footer() {
  const { data: categories } = useCategories();
  const shopLinks = [
    { name: "All Products", href: "/shop" },
    ...categories.map((c) => ({
      name: c.name,
      href: `/shop?category=${c.slug}`,
    })),
  ];

  return (
    <footer className="mt-auto border-t border-[#E8D0DA] bg-[#FBF0F4]">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src={assetPath("/Logo.jpg")}
                alt={siteConfig.name}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <span className="font-[family-name:var(--font-display)] text-2xl text-[#A02C68]">
                {siteConfig.name}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-600">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-[#A02C68]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
              Help
            </h3>
            <ul className="mt-4 space-y-2">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-[#A02C68]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
              Connect
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#A02C68]"
                >
                  WhatsApp: {siteConfig.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#A02C68]"
                >
                  Instagram: {siteConfig.instagram.handle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition hover:text-[#A02C68]"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#E8D0DA] pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Handmade ethnic wear for little ones.</p>
        </div>
      </Container>
    </footer>
  );
}
