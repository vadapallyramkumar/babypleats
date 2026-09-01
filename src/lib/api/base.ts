export function getApiBase(): string {
  const raw = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://babypleats-api.onrender.com"
  ).replace(/\/$/, "");
  return raw.endsWith("/v1") ? raw : `${raw}/v1`;
}

export const API_BASE = getApiBase();
