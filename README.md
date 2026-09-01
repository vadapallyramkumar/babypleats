This is a [Next.js](https://nextjs.org) Baby Pleats storefront.

## Catalog

Products and categories are fetched from the external API (`NEXT_PUBLIC_API_BASE_URL`). If the API is unreachable, the storefront falls back to [`src/data/catalog.fallback.json`](src/data/catalog.fallback.json).

API contract and seed docs: [`docs/`](docs/README.md).

For local dev, create `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=https://babypleats-api.onrender.com
```

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Static export → GitHub Pages (see `.github/workflows/deploy.yml`).
