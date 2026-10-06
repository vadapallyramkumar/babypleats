"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { CartLineItems } from "@/components/cart/CartLineItems";
import {
  CheckoutError,
  placeOrder,
  verifyRazorpayPayment,
  type CheckoutCustomer,
} from "@/lib/api/orders";
import { validateCoupon, type ValidatedCoupon } from "@/lib/api/coupons";
import { LAST_ORDER_KEY, type LastOrder } from "@/lib/cart";
import {
  checkoutFieldClass,
  razorpayAmountPaise,
  toE164Phone,
  validateCheckout,
} from "@/lib/checkout";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { formatPrice } from "@/lib/product-utils";
import { siteConfig } from "@/lib/site";

const emptyCustomer: CheckoutCustomer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-900">
        {label}
      </span>
      {children}
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </label>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const { items, totals, clearCart, closeCart, ready } = useCart();
  const [customer, setCustomer] = useState<CheckoutCustomer>(emptyCustomer);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutCustomer, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [applied, setApplied] = useState<ValidatedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);

  const empty = ready && items.length === 0;
  const itemsKey = items.map((item) => `${item.variantId}:${item.qty}`).join("|");
  const payableTotal = applied?.totals.total ?? totals.total;

  useEffect(() => {
    if (!applied) return;
    const code = applied.code;
    let cancelled = false;
    void validateCoupon({ code, items }).then(
      (next) => {
        if (!cancelled) {
          setApplied(next);
          setCouponError(null);
        }
      },
      () => {
        if (!cancelled) {
          setApplied(null);
          setCouponError("Coupon no longer applies to this bag.");
        }
      },
    );
    return () => {
      cancelled = true;
    };
    // Re-check when bag contents change, not on every applied object identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  const payLabel = `Pay ${formatPrice(payableTotal)}`;

  async function handleApplyCoupon() {
    setCouponError(null);
    const code = couponInput.trim();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }
    setCouponBusy(true);
    try {
      const next = await validateCoupon({
        code,
        items,
        phone: customer.phone.trim() || undefined,
      });
      setApplied(next);
      setCouponInput(next.code);
    } catch (error) {
      setApplied(null);
      setCouponError(
        error instanceof CheckoutError
          ? error.message
          : "This coupon is not valid.",
      );
    } finally {
      setCouponBusy(false);
    }
  }

  function update<K extends keyof CheckoutCustomer>(key: K, value: CheckoutCustomer[K]) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  function persistReceipt(order: LastOrder) {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    const nextErrors = validateCheckout(customer);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || items.length === 0) return;

    const payloadCustomer: CheckoutCustomer = {
      ...customer,
      name: customer.name.trim(),
      email: customer.email.trim(),
      phone: toE164Phone(customer.phone),
      address: customer.address.trim(),
      address2: customer.address2?.trim() || undefined,
      city: customer.city.trim(),
      state: customer.state.trim(),
      pincode: customer.pincode.trim(),
    };

    setSubmitting(true);
    closeCart();

    try {
      const placed = await placeOrder({
        customer: payloadCustomer,
        items,
        totals: {
          ...totals,
          discount: applied?.discount ?? 0,
          total: payableTotal,
          couponCode: applied?.code,
        },
        paymentMethod: "razorpay",
        notes,
        couponCode: applied?.code,
      });

      const receipt: LastOrder = {
        id: placed.id,
        paymentMethod: "razorpay",
        customerName: payloadCustomer.name,
        totals: {
          ...totals,
          discount: applied?.discount ?? 0,
          total: payableTotal,
          couponCode: applied?.code,
        },
        items: items.map((item) => ({
          productName: item.productName,
          size: item.size,
          color: item.color,
          qty: item.qty,
          unitPrice: item.unitPrice,
        })),
      };

      if (!placed.razorpay?.orderId || !placed.razorpay.keyId) {
        throw new CheckoutError(
          "Online payment is not available yet. Please try again in a moment."
        );
      }

      const amountPaise = razorpayAmountPaise(
        placed.razorpay.amount,
        payableTotal
      );

      await new Promise<void>((resolve, reject) => {
        void openRazorpayCheckout({
          key: placed.razorpay!.keyId,
          amount: amountPaise,
          currency: placed.razorpay!.currency || "INR",
          name: siteConfig.name,
          description: `Order ${placed.id}`,
          order_id: placed.razorpay!.orderId,
          prefill: {
            name: payloadCustomer.name,
            email: payloadCustomer.email,
            contact: payloadCustomer.phone,
          },
          notes: { orderId: placed.id },
          theme: { color: "#A02C68" },
          handler: (response) => {
            void (async () => {
              try {
                await verifyRazorpayPayment({
                  orderId: placed.id,
                  ...response,
                });
                persistReceipt({
                  ...receipt,
                  paymentId: response.razorpay_payment_id,
                });
                clearCart();
                resolve();
              } catch (error) {
                reject(error);
              }
            })();
          },
          modal: {
            ondismiss: () =>
              reject(
                new CheckoutError(
                  "Payment was cancelled. Your bag is still saved — you can try again."
                )
              ),
          },
        }).then((checkout) => {
          checkout.on("payment.failed", () => {
            reject(
              new CheckoutError(
                "Payment failed. Please try again."
              )
            );
          });
        });
      });

      router.push("/checkout/success");
    } catch (error) {
      const message =
        error instanceof CheckoutError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Could not place your order. Please try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <p className="py-20 text-center text-gray-600">Loading checkout…</p>;
  }

  if (empty) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">Your bag is empty.</p>
        <Link
          href="/shop"
          className="mt-5 inline-flex bg-[#A02C68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8B235A]"
        >
          Shop collection
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-start"
    >
      <div className="space-y-8">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-gray-900">
            Delivery details
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <input
                className={checkoutFieldClass}
                value={customer.name}
                autoComplete="name"
                onChange={(e) => update("name", e.target.value)}
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input
                className={checkoutFieldClass}
                value={customer.phone}
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit mobile"
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Email" error={errors.email}>
                <input
                  className={checkoutFieldClass}
                  type="email"
                  value={customer.email}
                  autoComplete="email"
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Address" error={errors.address}>
                <input
                  className={checkoutFieldClass}
                  value={customer.address}
                  autoComplete="address-line1"
                  onChange={(e) => update("address", e.target.value)}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Apartment, landmark (optional)">
                <input
                  className={checkoutFieldClass}
                  value={customer.address2}
                  autoComplete="address-line2"
                  onChange={(e) => update("address2", e.target.value)}
                />
              </Field>
            </div>
            <Field label="City" error={errors.city}>
              <input
                className={checkoutFieldClass}
                value={customer.city}
                autoComplete="address-level2"
                onChange={(e) => update("city", e.target.value)}
              />
            </Field>
            <Field label="State" error={errors.state}>
              <input
                className={checkoutFieldClass}
                value={customer.state}
                autoComplete="address-level1"
                onChange={(e) => update("state", e.target.value)}
              />
            </Field>
            <Field label="Pincode" error={errors.pincode}>
              <input
                className={checkoutFieldClass}
                value={customer.pincode}
                inputMode="numeric"
                autoComplete="postal-code"
                onChange={(e) => update("pincode", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-gray-900">
            Payment
          </h2>
          <div className="mt-5 border border-[#A02C68] bg-[#FBF0F4] p-4">
            <span className="block font-semibold text-gray-900">Pay online</span>
            <span className="mt-1 block text-sm text-gray-600">
              UPI, cards, netbanking, and wallets via Razorpay.
            </span>
          </div>
        </section>

        <section>
          <Field label="Order note (optional)">
            <textarea
              className="min-h-24 w-full border border-[#E8D0DA] bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#A02C68]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery date, gift note, or sizing help"
            />
          </Field>
        </section>
      </div>

      <aside className="border border-[#E8D0DA] bg-white p-5 lg:sticky lg:top-28">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-gray-900">
          Order summary
        </h2>
        <div className="mt-2 max-h-[22rem] overflow-y-auto">
          <CartLineItems compact />
        </div>
        <div className="mt-4 border-t border-[#E8D0DA] pt-4">
          <label className="block text-sm font-semibold text-gray-900">
            Have a coupon?
          </label>
          <div className="mt-2 flex gap-2">
            <input
              className={checkoutFieldClass}
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleApplyCoupon();
                }
              }}
              placeholder="FESTIVE10"
              autoComplete="off"
            />
            <button
              type="button"
              disabled={couponBusy || submitting}
              onClick={() => void handleApplyCoupon()}
              className="shrink-0 border border-[#A02C68] px-4 text-sm font-semibold text-[#A02C68] transition hover:bg-[#FBF0F4] disabled:opacity-60"
            >
              {couponBusy ? "…" : "Apply"}
            </button>
          </div>
          {applied ? (
            <p className="mt-2 text-xs text-[#A02C68]">
              {applied.code} applied · {formatPrice(applied.discount)} off
              <button
                type="button"
                className="ml-2 underline"
                onClick={() => {
                  setApplied(null);
                  setCouponError(null);
                }}
              >
                Remove
              </button>
            </p>
          ) : null}
          {couponError ? (
            <p className="mt-2 text-xs text-red-700">{couponError}</p>
          ) : null}
        </div>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <dt>Subtotal</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          {applied ? (
            <div className="flex justify-between text-gray-600">
              <dt>Discount ({applied.code})</dt>
              <dd>−{formatPrice(applied.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between text-gray-600">
            <dt>Shipping</dt>
            <dd>
              {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
            </dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold text-gray-900">
            <dt>Total</dt>
            <dd>{formatPrice(payableTotal)}</dd>
          </div>
        </dl>

        {formError ? (
          <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 inline-flex w-full items-center justify-center bg-[#A02C68] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#8B235A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Please wait…" : payLabel}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          By placing this order you agree to our shipping and return policies.
          Custom outfits may take 2–4 weeks.
        </p>
      </aside>
    </form>
  );
}
