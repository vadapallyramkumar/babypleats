"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { LAST_ORDER_KEY, type LastOrder } from "@/lib/cart";
import { formatPrice } from "@/lib/product-utils";

function subscribe() {
  return () => {};
}

function getOrderSnapshot() {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}

export default function CheckoutSuccessClient() {
  const raw = useSyncExternalStore(subscribe, getOrderSnapshot, () => null);
  const order = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LastOrder;
    } catch {
      return null;
    }
  }, [raw]);

  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-[#A02C68] uppercase">
          Thank you
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-gray-900 md:text-5xl">
          Order confirmed
        </h1>

        {order ? (
          <>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              {order.customerName}, we&apos;ve received order{" "}
              <span className="font-semibold text-gray-900">{order.id}</span>
              {order.paymentMethod === "cod"
                ? ". Please keep cash ready for delivery."
                : ". Your payment was successful."}
            </p>
            {order.paymentId ? (
              <p className="mt-2 text-sm text-gray-500">
                Payment ID: {order.paymentId}
              </p>
            ) : null}

            <ul className="mt-8 divide-y divide-[#E8D0DA] border border-[#E8D0DA] bg-white">
              {order.items.map((item, index) => (
                <li
                  key={`${item.productName}-${item.size}-${item.color}-${index}`}
                  className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-gray-500">
                      {item.color} · {item.size} · Qty {item.qty}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.unitPrice * item.qty)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <dt>Subtotal</dt>
                <dd>{formatPrice(order.totals.subtotal)}</dd>
              </div>
              {order.totals.discount ? (
                <div className="flex justify-between text-gray-600">
                  <dt>
                    Discount
                    {order.totals.couponCode ? ` (${order.totals.couponCode})` : ""}
                  </dt>
                  <dd>−{formatPrice(order.totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-gray-600">
                <dt>Shipping</dt>
                <dd>
                  {order.totals.shipping === 0
                    ? "Free"
                    : formatPrice(order.totals.shipping)}
                </dd>
              </div>
              <div className="flex justify-between pt-1 font-semibold text-gray-900">
                <dt>Total</dt>
                <dd>{formatPrice(order.totals.total)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="mt-4 text-base text-gray-600">
            If you just paid, a confirmation will also arrive by email or SMS
            once the order is processed.
          </p>
        )}

        <Link
          href="/shop"
          className="mt-10 inline-flex bg-[#A02C68] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#8B235A]"
        >
          Continue shopping
        </Link>
      </Container>
    </main>
  );
}
