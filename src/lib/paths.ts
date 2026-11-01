/** Optional path prefix when the site is not hosted at the domain root. */
export function assetPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (!base || path === base || path.startsWith(`${base}/`)) {
    return path;
  }

  return `${base}${path}`;
}

/** Product URL that works for slugs added after the last static build. */
export function productPath(slug: string): string {
  return `/products?slug=${encodeURIComponent(slug)}`;
}
