"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import ProductPageClient from "@/components/product/ProductPageClient";

export default function ProductBySlug() {
  const slug = useSearchParams().get("slug");

  if (!slug) {
    return (
      <main className="pb-20 pt-10 md:pt-14">
        <Container>
          <p className="py-20 text-center text-gray-600">
            This product is unavailable.{" "}
            <Link href="/shop" className="underline hover:text-[#A02C68]">
              Back to shop
            </Link>
          </p>
        </Container>
      </main>
    );
  }

  return <ProductPageClient slug={slug} />;
}
