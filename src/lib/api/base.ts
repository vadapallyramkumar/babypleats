/**
 * Resolve the public API origin from NEXT_PUBLIC_API_BASE_URL.
 * Accepts either `https://host` or `https://host/v1` and normalizes to `.../v1`.
 */
export function getApiBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!configured) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local (dev) or the host environment (production)."
    );
  }

  const raw = configured.replace(/\/$/, "");
  return raw.endsWith("/v1") ? raw : `${raw}/v1`;
}

export const API_BASE = getApiBase();

export async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const isServer = typeof window === "undefined";
    const res = await fetch(`${API_BASE}${path}`, {
      ...(isServer ? { next: { revalidate: 60 } } : { cache: "no-store" }),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
