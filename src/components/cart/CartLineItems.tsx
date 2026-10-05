"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { assetPath, productPath } from "@/lib/paths";
import { formatPrice } from "@/lib/product-utils";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

type CartLineItemsProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

export function QtyStepper({
  value,
  max,
  onChange,
  disabled,
}: {
  value: number;
  max: number;
  onChange: (qty: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center border border-[#E8D0DA] bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className="flex size-8 items-center justify-center text-gray-700 transition hover:text-[#A02C68] disabled:opacity-40"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className="flex size-8 items-center justify-center text-gray-700 transition hover:text-[#A02C68] disabled:opacity-40"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function CartLineItems({ compact, onNavigate }: CartLineItemsProps) {
  const { items, setQty, removeItem } = useCart();

  return (
    <ul className={cn("divide-y divide-[#E8D0DA]", compact ? "" : "border-y border-[#E8D0DA]")}>
      {items.map((item) => (
        <li key={item.variantId} className={cn("flex gap-3", compact ? "py-4" : "py-5")}>
          <Link
            href={productPath(item.slug)}
            onClick={onNavigate}
            className="relative size-20 shrink-0 overflow-hidden bg-[#F5E6EC] sm:size-24"
          >
            <Image
              src={assetPath(item.image)}
              alt={item.productName}
              fill
              className="object-cover"
              sizes="96px"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={productPath(item.slug)}
                  onClick={onNavigate}
                  className="line-clamp-2 font-medium text-gray-900 hover:text-[#A02C68]"
                >
                  {item.productName}
                </Link>
                <p className="mt-1 text-xs text-gray-500">
                  {item.color} · {item.size}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#A02C68]">
                  {formatPrice(item.unitPrice)}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${item.productName}`}
                onClick={() => removeItem(item.variantId)}
                className="shrink-0 p-1 text-gray-400 transition hover:text-[#A02C68]"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <QtyStepper
                value={item.qty}
                max={item.stock}
                onChange={(qty) => setQty(item.variantId, qty)}
              />
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(item.unitPrice * item.qty)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
