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

## Deploy (Render Static Site)

The app builds as a Next.js static export (`output: "export"`) into the `out/` directory.

1. Create a **Static Site** on [Render](https://render.com).
2. Connect this repository.
3. Configure:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `out`
4. Set environment variables (build-time; `NEXT_PUBLIC_*` are inlined):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://babypleats-api.onrender.com` |

Optional (only if the checkout API response omits Razorpay `keyId`):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | your Razorpay **publishable** key |

A Blueprint file [`render.yaml`](render.yaml) is included for the same settings.

Ensure the API allows CORS from your Render Static Site origin.
