"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatPrice, getFromPrice, type Product } from "@/lib/product-utils";
import { assetPath, productPath } from "@/lib/paths";
import { toCartItem } from "@/lib/cart";
import { useCart } from "@/components/cart/cart-context";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const badge = product.bestseller
    ? "Bestseller"
    : product.newArrival
      ? "New"
      : null;

  const inStockVariants = product.variants.filter((variant) => variant.stock > 0);
  const canQuickAdd = inStockVariants.length === 1;

  function handleAdd() {
    const variant = inStockVariants[0];
    if (!variant) return;
    addItem(toCartItem(product, variant, 1));
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#E8D5C4]/80 bg-[#FDF8F5] shadow-[0_4px_16px_-6px_rgba(90,40,50,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_-10px_rgba(90,40,50,0.28)]"
    >
      <Link href={productPath(product.slug)} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5E6EC]">
          <Image
            src={assetPath(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          {badge ? (
            <span className="absolute left-3 top-3 rounded-md bg-[#7A1B30] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white md:text-[11px]">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col items-center px-3 pt-4 text-center md:px-4 md:pt-5">
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold leading-snug text-[#7A1B30] md:text-lg">
            {product.name}
          </h3>

          <div className="mt-3 flex w-full items-center gap-2" aria-hidden>
            <span className="h-px flex-1 bg-[#7A1B30]/35" />
            <span className="size-1 rotate-45 bg-[#7A1B30]/70" />
            <span className="h-px flex-1 bg-[#7A1B30]/35" />
          </div>

          <p className="mt-3 text-sm text-[#7A1B30]">
            <span className="font-normal">From </span>
            <span className="font-semibold">
              {formatPrice(getFromPrice(product))}
            </span>
          </p>
        </div>
      </Link>

      <div className="mt-auto flex justify-center px-3 pb-5 pt-4 md:px-4 md:pb-6">
        {canQuickAdd ? (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#7A1B30] bg-white px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7A1B30] transition hover:bg-[#7A1B30] hover:text-white md:text-[11px]"
          >
            <ShoppingBag className="size-4 shrink-0" />
            Add to bag
          </button>
        ) : (
          <Link
            href={productPath(product.slug)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#7A1B30] bg-white px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7A1B30] transition hover:bg-[#7A1B30] hover:text-white md:text-[11px]"
          >
            <ShoppingBag className="size-4 shrink-0" />
            {inStockVariants.length === 0 ? "View details" : "Select options"}
          </Link>
        )}
      </div>
    </motion.article>
  );
}
