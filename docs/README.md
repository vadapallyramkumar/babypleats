# Baby Pleats API docs

Design contract for the **external** Baby Pleats API (separate repo). Storefront integrates via `NEXT_PUBLIC_API_BASE_URL`.

Live catalog surface used by this site: **products + categories** (`GET /v1/categories`, `GET /v1/products`, `GET /v1/products/:slug`). Offline fallback: [`src/data/catalog.fallback.json`](../src/data/catalog.fallback.json).

| File | Purpose |
|---|---|
| [api-contract.md](./api-contract.md) | Human-readable v1 contract, envelopes, roadmap |
| [openapi.yaml](./openapi.yaml) | OpenAPI 3.0 specification |
| [catalog.seed.json](./catalog.seed.json) | Seed categories + products for the API repo |
| [schemas/category.json](./schemas/category.json) | JSON Schema — Category |
| [schemas/product.json](./schemas/product.json) | JSON Schema — Product |
| [schemas/order.json](./schemas/order.json) | JSON Schema — Order |

## Phases (summary)

1. **Now** — Contract frozen (this folder)
2. **A** — Backend skeleton in the API repo (public GETs + seed)
3. **B** — Admin portal MVP (auth, CRUD, orders list) — API repo
4. **C** — Storefront integration (this repo uses the API) — done
5. **D** — Orders automation (website create + optional WhatsApp) — optional
