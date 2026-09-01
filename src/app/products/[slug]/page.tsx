import type { Metadata } from "next";
import ProductPageClient from "@/components/product/ProductPageClient";
import { getProduct, listProducts } from "@/lib/api/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await listProducts({ limit: 100 });
  return data.map((p) => ({ slug: p.slug }));
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
