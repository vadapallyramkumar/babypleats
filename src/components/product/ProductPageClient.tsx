"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/product/ProductCard";
import ProductDetail from "@/components/product/ProductDetail";
import { useProduct } from "@/hooks/use-catalog";

type ProductPageClientProps = {
  slug: string;
};

export default function ProductPageClient({ slug }: ProductPageClientProps) {
  const { product, categoryName, related, loading } = useProduct(slug);

  if (loading) {
    return (
      <main className="pb-20 pt-10 md:pt-14">
        <Container>
          <p className="py-20 text-center text-gray-600">Loading product…</p>
        </Container>
      </main>
    );
  }

  if (!product) notFound();

  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container>
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/shop" className="hover:text-[#A02C68]">
            Shop
          </Link>
          {product.category ? (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/shop?category=${product.category}`}
                className="hover:text-[#A02C68]"
              >
                {categoryName ?? product.category}
              </Link>
            </>
          ) : null}
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <ProductDetail product={product} categoryName={categoryName} />

        {related.length > 0 ? (
          <section className="mt-20">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-gray-900">
              You May Also Like
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
