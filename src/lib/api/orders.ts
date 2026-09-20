import { API_BASE } from "@/lib/api/base";
import type { CartItem, CartTotals, PaymentMethod } from "@/lib/cart";

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type PlaceOrderInput = {
  customer: CheckoutCustomer;
  items: CartItem[];
  totals: CartTotals;
  paymentMethod: PaymentMethod;
  notes?: string;
};

export type RazorpayOrderPayload = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
};

export type PlacedOrder = {
  id: string;
  status?: string;
  razorpay?: RazorpayOrderPayload;
};

export class CheckoutError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "CheckoutError";
    this.status = status;
  }
}

type ApiErrorBody = {
  error?: { message?: string; code?: string };
  message?: string;
};

async function parseError(res: Response) {
  try {
    const json = (await res.json()) as ApiErrorBody;
    return json.error?.message || json.message || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      body: JSON.stringify(body),
    });
  } catch {
    throw new CheckoutError(
      "We couldn't reach the order service. Please check your connection and try again."
    );
  }

  if (!res.ok) {
    throw new CheckoutError(await parseError(res), res.status);
  }

  return (await res.json()) as T;
}

function buildNotes(input: PlaceOrderInput) {
  const { customer, paymentMethod, notes, totals } = input;
  const lines = [
    `Payment: ${paymentMethod === "cod" ? "Cash on delivery" : "Razorpay"}`,
    `Email: ${customer.email}`,
    `Address: ${customer.address}`,
    customer.address2 ? customer.address2 : null,
    `${customer.city}, ${customer.state} ${customer.pincode}`,
    `Total: ₹${totals.total}`,
    notes?.trim() ? `Note: ${notes.trim()}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

function toOrderBody(input: PlaceOrderInput) {
  return {
    source: "website" as const,
    paymentMethod: input.paymentMethod,
    customer: {
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email,
      city: input.customer.city,
      state: input.customer.state,
      pincode: input.customer.pincode,
      address: [input.customer.address, input.customer.address2]
        .filter(Boolean)
        .join(", "),
    },
    items: input.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      size: item.size,
      color: item.color,
      qty: item.qty,
      unitPrice: item.unitPrice,
    })),
    totals: {
      subtotal: input.totals.subtotal,
      shipping: input.totals.shipping,
      total: input.totals.total,
      currency: "INR" as const,
    },
    notes: buildNotes(input),
  };
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function pickRazorpay(source: unknown): RazorpayOrderPayload | undefined {
  const root = asRecord(source);
  if (!root) return undefined;

  const nested =
    asRecord(root.razorpay) ??
    asRecord(root.payment) ??
    asRecord(root.razorpayOrder) ??
    root;

  const keyId =
    (typeof nested.keyId === "string" && nested.keyId) ||
    (typeof nested.key_id === "string" && nested.key_id) ||
    (typeof nested.key === "string" && nested.key) ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "";

  const orderId =
    (typeof nested.orderId === "string" && nested.orderId) ||
    (typeof nested.order_id === "string" && nested.order_id) ||
    (typeof nested.razorpayOrderId === "string" && nested.razorpayOrderId) ||
    "";

  const amountRaw = nested.amount ?? nested.amountDue;
  const amount = typeof amountRaw === "number" ? amountRaw : Number(amountRaw);
  const currency = typeof nested.currency === "string" ? nested.currency : "INR";

  if (!orderId) return undefined;

  return {
    keyId,
    orderId,
    amount: Number.isFinite(amount) ? amount : 0,
    currency,
  };
}

function pickOrderId(source: unknown): string | undefined {
  const root = asRecord(source);
  if (!root) return undefined;
  const data = asRecord(root.data) ?? root;
  const order = asRecord(data.order) ?? data;
  if (typeof order.id === "string" && order.id) return order.id;
  if (typeof data.id === "string" && data.id) return data.id;
  return undefined;
}

function parsePlacedOrder(payload: unknown): PlacedOrder {
  const root = asRecord(payload) ?? {};
  const data = asRecord(root.data) ?? root;
  const id = pickOrderId(payload);
  if (!id) {
    throw new CheckoutError("The server did not return an order id.");
  }

  return {
    id,
    status: typeof data.status === "string" ? data.status : undefined,
    razorpay: pickRazorpay(data) ?? pickRazorpay(root) ?? pickRazorpay(payload),
  };
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlacedOrder> {
  const body = toOrderBody(input);

  try {
    return parsePlacedOrder(await apiPost<unknown>("/checkout", body));
  } catch (error) {
    const canFallback =
      error instanceof CheckoutError &&
      (error.status === 404 || error.status === 405);
    if (!canFallback) throw error;
  }

  try {
    return parsePlacedOrder(await apiPost<unknown>("/orders", body));
  } catch (error) {
    if (
      error instanceof CheckoutError &&
      (error.status === 404 || error.status === 405)
    ) {
      throw new CheckoutError(
        "Checkout is not enabled on the server yet. Please try again shortly."
      );
    }
    throw error;
  }
}

export async function verifyRazorpayPayment(input: {
  orderId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  const body = {
    orderId: input.orderId,
    razorpay_payment_id: input.razorpay_payment_id,
    razorpay_order_id: input.razorpay_order_id,
    razorpay_signature: input.razorpay_signature,
  };

  const paths = [
    "/checkout/verify",
    `/orders/${encodeURIComponent(input.orderId)}/payments/verify`,
    "/payments/verify",
  ];

  let lastError: CheckoutError | null = null;
  for (const path of paths) {
    try {
      await apiPost(path, body);
      return;
    } catch (error) {
      if (error instanceof CheckoutError) {
        lastError = error;
        if (error.status === 404 || error.status === 405) continue;
      }
      throw error;
    }
  }

  if (lastError && lastError.status !== 404 && lastError.status !== 405) {
    throw lastError;
  }
}
