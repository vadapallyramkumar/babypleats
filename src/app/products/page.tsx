import { Suspense } from "react";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ProductBySlug from "@/components/product/ProductBySlug";

export const metadata: Metadata = {
  title: "Product",
};

function ProductFallback() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container>
        <p className="py-20 text-center text-gray-600">Loading product…</p>
      </Container>
    </main>
  );
}

export default function ProductQueryPage() {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductBySlug />
    </Suspense>
  );
}
