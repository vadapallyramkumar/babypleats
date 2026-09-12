import type { Metadata } from "next";
import ProductPageClient from "@/components/product/ProductPageClient";
import { getProduct, listProducts } from "@/lib/api/catalog";
import fallbackCatalog from "@/data/catalog.fallback.json";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await listProducts({ limit: 100 });
  if (data.length > 0) {
    return data.map((p) => ({ slug: p.slug }));
  }

  // `output: "export"` requires at least one path; use seed slugs when the API
  // is empty or unreachable at build time.
  return fallbackCatalog.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
