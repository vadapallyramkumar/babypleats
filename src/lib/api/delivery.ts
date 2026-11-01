import { API_BASE } from "@/lib/api/base";
import { CheckoutError } from "@/lib/api/orders";

export type DeliveryDayRange = {
  minDays: number;
  maxDays: number;
};

export type DeliveryRegion = {
  id: string;
  name: string;
};

export type DeliveryDateRange = {
  from: string;
  to: string;
};

export type DeliveryEstimate = {
  serviceable: boolean;
  pincode: string;
  region: DeliveryRegion;
  preparation: DeliveryDayRange;
  transit: DeliveryDayRange;
  estimatedDelivery: DeliveryDateRange;
  message: string;
};

type ApiErrorBody = {
  error?: { message?: string; code?: string };
  message?: string;
};

function friendlyStatusMessage(status: number): string | null {
  if (status === 400) return "Please enter a valid 6-digit PIN code.";
  if (status === 429) return "Too many checks. Please try again in a minute.";
  if (status === 503) return "Delivery estimates are temporarily unavailable.";
  return null;
}

async function parseError(res: Response): Promise<string> {
  const fallback =
    friendlyStatusMessage(res.status) ??
    "Unable to check delivery right now. Please try again.";
  try {
    const json = (await res.json()) as ApiErrorBody;
    // Prefer our customer-facing copy; never surface raw backend wording.
    void json;
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Request a delivery estimate for a 6-digit Indian PIN code.
 * Backend is the single source of truth for dates and serviceability.
 */
export async function getDeliveryEstimate(
  pincode: string
): Promise<DeliveryEstimate> {
  const trimmed = pincode.trim();
  if (!/^\d{6}$/.test(trimmed)) {
    throw new CheckoutError("Please enter a valid 6-digit PIN code.", 400);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/delivery/estimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ pincode: trimmed }),
    });
  } catch {
    throw new CheckoutError(
      "Unable to check delivery right now. Please try again."
    );
  }

  if (!res.ok) {
    throw new CheckoutError(await parseError(res), res.status);
  }

  const json = (await res.json()) as { data?: DeliveryEstimate } | DeliveryEstimate;
  const data =
    json && typeof json === "object" && "data" in json ? json.data : (json as DeliveryEstimate);

  if (!data || typeof data.serviceable !== "boolean" || !data.pincode) {
    throw new CheckoutError(
      "Unable to check delivery right now. Please try again."
    );
  }

  return data;
}
