import { API_BASE } from "@/lib/api/base";
import { CheckoutError } from "@/lib/api/orders";
import type { CartItem } from "@/lib/cart";

export type CouponTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: "INR";
};

export type ValidatedCoupon = {
  code: string;
  type: "percent" | "fixed";
  discount: number;
  totals: CouponTotals;
};

type ApiErrorBody = {
  error?: { message?: string };
  message?: string;
};

export async function validateCoupon(input: {
  code: string;
  items: CartItem[];
  phone?: string;
}): Promise<ValidatedCoupon> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        code: input.code,
        phone: input.phone,
        items: input.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          qty: item.qty,
        })),
      }),
    });
  } catch {
    throw new CheckoutError("We couldn't check that coupon. Please try again.");
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const json = (await res.json()) as ApiErrorBody;
      message = json.error?.message || json.message || message;
    } catch {
      // keep fallback
    }
    throw new CheckoutError(message, res.status);
  }

  const json = (await res.json()) as { data?: ValidatedCoupon };
  if (!json.data?.code) {
    throw new CheckoutError("This coupon is not valid.");
  }
  return json.data;
}
