"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";
import { CartLineItems } from "@/components/cart/CartLineItems";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/product-utils";
import { siteConfig } from "@/lib/site";

export default function CartPageClient() {
  const { items, totals, count, ready } = useCart();

  if (!ready) {
    return (
      <main className="pb-20 pt-10 md:pt-14">
        <Container>
          <p className="py-20 text-center text-gray-600">Loading bag…</p>
        </Container>
      </main>
    );
  }

  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container className="max-w-4xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-gray-900 md:text-5xl">
          Your bag
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {count === 0 ? "No pieces yet." : `${count} item${count === 1 ? "" : "s"}`}
        </p>

        {items.length === 0 ? (
          <div className="mt-12 border border-[#E8D0DA] bg-white px-6 py-16 text-center">
            <p className="text-gray-600">Your bag is empty.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex bg-[#A02C68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8B235A]"
            >
              Shop collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <CartLineItems />
            <aside className="h-fit border border-[#E8D0DA] bg-white p-5 lg:sticky lg:top-28">
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
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>Shipping</dt>
                  <dd>
                    {totals.shipping === 0
                      ? "Free"
                      : formatPrice(totals.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 font-semibold text-gray-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-5 inline-flex w-full items-center justify-center bg-[#A02C68] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#8B235A]"
              >
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}
