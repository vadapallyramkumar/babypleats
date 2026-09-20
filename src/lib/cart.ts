import { siteConfig } from "@/lib/site";
import type { Product, ProductVariant } from "@/lib/api/types";
import { getColorImages } from "@/lib/product-utils";

export const CART_STORAGE_KEY = "babypleats.cart.v1";
export const LAST_ORDER_KEY = "babypleats.lastOrder.v1";

export type CartItem = {
  variantId: string;
  productId: string;
  productName: string;
  slug: string;
  size: string;
  color: string;
  unitPrice: number;
  qty: number;
  image: string;
  stock: number;
};

export type CartTotals = {
  subtotal: number;
  shipping: number;
  total: number;
  currency: "INR";
  remainingForFreeShipping: number;
  discount?: number;
  couponCode?: string;
};

export type PaymentMethod = "razorpay" | "cod";

export type LastOrder = {
  id: string;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  customerName: string;
  totals: CartTotals;
  items: Pick<
    CartItem,
    "productName" | "size" | "color" | "qty" | "unitPrice"
  >[];
};

export function getCartTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const shipping =
    subtotal === 0 || subtotal >= siteConfig.freeShippingThreshold
      ? 0
      : siteConfig.shippingFee;
  const remainingForFreeShipping = Math.max(
    0,
    siteConfig.freeShippingThreshold - subtotal
  );

  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: "INR",
    remainingForFreeShipping,
  };
}

export function cartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function toCartItem(
  product: Product,
  variant: ProductVariant,
  qty = 1
): CartItem {
  const image = getColorImages(product, variant.color)[0] ?? product.image;
  return {
    variantId: variant.id,
    productId: product.id,
    productName: product.name,
    slug: product.slug,
    size: variant.size,
    color: variant.color,
    unitPrice: variant.price,
    qty: Math.min(Math.max(1, qty), Math.max(1, variant.stock)),
    image,
    stock: variant.stock,
  };
}

export function mergeCartItem(items: CartItem[], incoming: CartItem): CartItem[] {
  const existing = items.find((item) => item.variantId === incoming.variantId);
  if (!existing) {
    return [...items, { ...incoming, qty: Math.min(incoming.qty, incoming.stock) }];
  }

  const qty = Math.min(existing.qty + incoming.qty, incoming.stock || existing.stock);
  return items.map((item) =>
    item.variantId === incoming.variantId
      ? { ...item, qty, stock: incoming.stock, unitPrice: incoming.unitPrice }
      : item
  );
}
