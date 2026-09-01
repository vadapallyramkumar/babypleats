"use client";

import { useMemo, useState } from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import {
  getColorImages,
  getUniqueColors,
  getUniqueSizes,
  getVariant,
  type Product,
} from "@/lib/product-utils";

type ProductDetailProps = {
  product: Product;
  categoryName?: string;
};

export default function ProductDetail({
  product,
  categoryName,
}: ProductDetailProps) {
  const colors = getUniqueColors(product);
  const sizes = getUniqueSizes(product);

  const [color, setColor] = useState(colors[0] ?? "");
  const [size, setSize] = useState(() => {
    const first = sizes.find((s) => getVariant(product, s, colors[0] ?? ""));
    return first ?? sizes[0] ?? "";
  });

  function selectColor(nextColor: string) {
    setColor(nextColor);
    if (!getVariant(product, size, nextColor)) {
      const nextSize = sizes.find((s) => getVariant(product, s, nextColor));
      if (nextSize) setSize(nextSize);
    }
  }

  const gallery = useMemo(
    () => getColorImages(product, color),
    [product, color]
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery
        images={gallery}
        alt={`${product.name} — ${color}`}
      />

      <div>
        {categoryName ? (
          <p className="text-sm font-semibold tracking-wide text-[#A02C68] uppercase">
            {categoryName}
          </p>
        ) : null}
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-gray-900 md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-gray-600">
          {product.description}
        </p>

        <dl className="mt-8 space-y-3 border-t border-[#E8D0DA] pt-6 text-sm">
          {product.fabric ? (
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 font-semibold text-gray-900">
                Fabric
              </dt>
              <dd className="text-gray-600">{product.fabric}</dd>
            </div>
          ) : null}
          {product.care ? (
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 font-semibold text-gray-900">
                Care
              </dt>
              <dd className="text-gray-600">{product.care}</dd>
            </div>
          ) : null}
          <div className="flex gap-3">
            <dt className="w-24 shrink-0 font-semibold text-gray-900">SKU</dt>
            <dd className="text-gray-600">{product.id}</dd>
          </div>
        </dl>

        <ProductPurchase
          product={product}
          color={color}
          size={size}
          onColorChange={selectColor}
          onSizeChange={setSize}
        />
      </div>
    </div>
  );
}
