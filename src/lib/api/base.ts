export function getApiBase(): string {
  const raw = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://babypleats-api.onrender.com"
  ).replace(/\/$/, "");
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
