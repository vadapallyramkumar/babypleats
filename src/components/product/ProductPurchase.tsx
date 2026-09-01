"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatPrice,
  getUniqueColors,
  getUniqueSizes,
  getVariant,
  type Product,
} from "@/lib/product-utils";
import { toCartItem } from "@/lib/cart";
import { useCart } from "@/components/cart/cart-context";
import { QtyStepper } from "@/components/cart/CartLineItems";

type ProductPurchaseProps = {
  product: Product;
  color: string;
  size: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
};

const chipBase =
  "px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";
const chipIdle =
  "bg-white text-gray-700 ring-1 ring-[#E8D0DA] hover:text-[#A02C68]";
const chipActive = "bg-[#A02C68] text-white";

export default function ProductPurchase({
  product,
  color,
  size,
  onColorChange,
  onSizeChange,
}: ProductPurchaseProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const colors = getUniqueColors(product);
  const sizes = getUniqueSizes(product);

  const variant = useMemo(
    () => getVariant(product, size, color),
    [product, size, color]
  );

  const inStock = (variant?.stock ?? 0) > 0;
  const maxQty = variant?.stock ?? 1;

  function addToBag() {
    if (!variant || !inStock) return;
    addItem(toCartItem(product, variant, qty));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  function buyNow() {
    if (!variant || !inStock) return;
    addItem(toCartItem(product, variant, qty), { open: false });
    router.push("/checkout");
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        {variant ? (
          <p className="text-2xl font-medium text-[#A02C68]">
            {variant.compareAt && variant.compareAt > variant.price ? (
              <>
                <span className="mr-2 text-lg font-normal text-gray-400 line-through">
                  {formatPrice(variant.compareAt)}
                </span>
                {formatPrice(variant.price)}
              </>
            ) : (
              formatPrice(variant.price)
            )}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            This combination is not available.
          </p>
        )}
        {variant && !inStock ? (
          <p className="mt-1 text-sm font-medium text-gray-600">Out of stock</p>
        ) : null}
      </div>

      {colors.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-gray-900">
            Colour
          </legend>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onColorChange(c);
                  setQty(1);
                }}
                className={`${chipBase} ${color === c ? chipActive : chipIdle}`}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {sizes.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-gray-900">
            Size
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const match = getVariant(product, s, color);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!match}
                  onClick={() => {
                    onSizeChange(s);
                    setQty(1);
                  }}
                  className={`${chipBase} ${size === s && match ? chipActive : chipIdle}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {inStock && variant ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-900">Quantity</p>
          <QtyStepper
            value={Math.min(qty, maxQty)}
            max={maxQty}
            onChange={setQty}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {inStock && variant ? (
          <>
            <button
              type="button"
              onClick={addToBag}
              className="inline-flex bg-[#A02C68] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#8B235A]"
            >
              {added ? "Added to bag" : "Add to bag"}
            </button>
            <button
              type="button"
              onClick={buyNow}
              className="inline-flex border border-[#A02C68] px-8 py-3.5 text-sm font-semibold text-[#A02C68] transition hover:bg-[#A02C68] hover:text-white"
            >
              Buy now
            </button>
          </>
        ) : (
          <span className="inline-flex cursor-not-allowed bg-gray-300 px-8 py-3.5 text-sm font-semibold text-white">
            Out of stock
          </span>
        )}
        <Link
          href="/size-chart"
          className="inline-flex border border-[#E8D0DA] px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#A02C68] hover:text-[#A02C68]"
        >
          Size Chart
        </Link>
      </div>
    </div>
  );
}
