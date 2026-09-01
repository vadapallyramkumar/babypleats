"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

export default function CartButton() {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count > 0 ? `Open bag, ${count} items` : "Open bag"}
      className="relative text-gray-700 transition hover:text-[#A02C68]"
    >
      <ShoppingBag size={20} />
      {count > 0 ? (
        <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A02C68] px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
