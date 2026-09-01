"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartLineItems } from "@/components/cart/CartLineItems";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/product-utils";
import { siteConfig } from "@/lib/site";

export default function CartDrawer() {
  const { items, totals, isOpen, closeCart, count } = useCart();
  const empty = items.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-[#E8D0DA] bg-[#FFF8F5] p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-[#E8D0DA] px-5 py-4">
          <SheetTitle className="font-[family-name:var(--font-display)] text-2xl text-gray-900">
            Your bag {count > 0 ? `(${count})` : ""}
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            {empty
              ? "Add a piece you love to get started."
              : "Review sizes and quantities before checkout."}
          </SheetDescription>
        </SheetHeader>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-gray-600">Your bag is empty.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-5 inline-flex bg-[#A02C68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8B235A]"
            >
              Shop collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <CartLineItems compact onNavigate={closeCart} />
            </div>

            <div className="border-t border-[#E8D0DA] bg-white px-5 py-4">
              {totals.shipping === 0 ? (
                <p className="text-xs text-[#A02C68]">
                  Free shipping unlocked on this order.
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Add {formatPrice(totals.remainingForFreeShipping)} more for
                  free shipping (above ₹{siteConfig.freeShippingThreshold}).
                </p>
              )}

              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>Shipping</dt>
                  <dd>
                    {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between pt-1 font-semibold text-gray-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 inline-flex w-full items-center justify-center bg-[#A02C68] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#8B235A]"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-2 inline-flex w-full items-center justify-center px-6 py-2 text-sm font-semibold text-[#A02C68] hover:underline"
              >
                View bag
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
