/** GitHub Pages project site path (must match next.config `basePath`). */
const PROD_BASE_PATH = "/babypleats";

/** Prefix public assets for GitHub Pages (`basePath`). */
export function assetPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base =
    process.env.NEXT_PUBLIC_BASE_PATH ??
    (process.env.NODE_ENV === "production" ? PROD_BASE_PATH : "");

  if (!base || path === base || path.startsWith(`${base}/`)) {
    return path;
  }

  return `${base}${path}`;
}

/** Product URL that works for slugs added after the last GitHub Pages build. */
export function productPath(slug: string): string {
  return `/products?slug=${encodeURIComponent(slug)}`;
}
