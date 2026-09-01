/** GitHub Pages project site path (must match next.config `basePath`). */
const PROD_BASE_PATH = "/babypleates";

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
