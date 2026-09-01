# Baby Pleats — Catalog & Backend API Contract (v1.1)

**Status:** Design frozen (v1.1 — size/color variants). External backend contract (API is a **separate repo**).  
**Implemented now:** public `GET /categories`, `GET /products`, `GET /products/:slug` (plus `GET /health`). Admin, auth, media, orders, and site settings are deferred.  
**Storefront:** Fetches catalog via `NEXT_PUBLIC_API_BASE_URL`; WhatsApp remains the order CTA.  
**Base URL (example):** `https://api.babypleats.com/v1`

This document is the source of truth for Product, Category, Order, Site, and Admin API shapes. An OpenAPI 3 description lives alongside it at [`openapi.yaml`](./openapi.yaml). The deployed API currently exposes the public catalog section only.

---

## 1. Design principles

- Public catalog endpoints are unauthenticated (read-only).
- Admin endpoints require `Authorization: Bearer <access_token>`.
- List endpoints return `{ data, meta }`.
- Errors return `{ error: { code, message, details? } }` with appropriate HTTP status.
- Discount is **derived per variant**, not stored:  
  `discountPercent = original ? Math.round((1 - selling / original) * 100) : 0`
- Price and stock live on **variants** (one size + color combo). Missing combos are omitted.
- Product primary image is always `images[0]` (require ≥ 1 image). Colour galleries (`colorGalleries`) hold 1+ photos per colour; variant `image` is an optional override.
- Category filters use **slug / id** (`pattu-pavadai`), never display names.
- “New Arrivals” is a product flag (`isNew`), not a category row.

---

## 2. Canonical schemas

### 2.1 Category

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Stable id, e.g. `pattu-pavadai` |
| `slug` | string | yes | URL/filter key; same as `id` in v1 |
| `name` | string | yes | Display name |
| `image` | string | yes | Absolute URL or CDN path |
| `description` | string | yes | Shop subtitle / SEO |
| `sortOrder` | number | yes | Ascending; admin-controlled |
| `isActive` | boolean | yes | Inactive hidden from public GETs |
| `filter` | string \| null | no | Merchandising: `budgetFriendly` \| `readyToDispatch` \| `bestseller`. When set, `GET /products?category=<slug>` applies that rule instead of `categoryId`. |

```json
{
  "id": "pattu-pavadai",
  "slug": "pattu-pavadai",
  "name": "Pattu Pavadai",
  "image": "https://cdn.example.com/images/categories/pattu-pavadai.jpg",
  "description": "Classic silk pavadais for festivals and family celebrations.",
  "sortOrder": 1,
  "isActive": true
}
```

### 2.2 Product variant (stored)

Each sellable unit is a unique `(size, color)` on a product. Sparse: omit combos that do not exist.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | e.g. `BP001-PNK-3Y` |
| `sku` | string | yes | Same as `id` unless overridden |
| `size` | string | yes | e.g. `3Y` |
| `color` | string | yes | e.g. `Pink` |
| `price.selling` | number | yes | Price for this combo |
| `price.original` | number | no | Compare-at for this combo |
| `price.currency` | `"INR"` | yes | |
| `stock` | number | yes | Qty for this combo |
| `isActive` | boolean | yes | Soft-hide a combo |
| `image` | string | no | Optional color-specific image |

### 2.3 Product

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Parent id, e.g. `BP001` |
| `slug` | string | yes | Unique URL key |
| `name` | string | yes | |
| `categoryId` | string | yes | FK → Category.id |
| `subcategory` | string | no | Optional label (e.g. Traditional) |
| `description` | string | yes | |
| `fabric` | string | no | Shown on PDP |
| `care` | string[] | yes | Care bullets; may be empty array |
| `images` | string[] | yes | Length ≥ 1; `[0]` = card/hero fallback |
| `colorGalleries` | `{ color, images }[]` | yes | Per-colour photos; `images` length ≥ 1 |
| `variants` | Variant[] | yes | Length ≥ 1; unique `(size, color)` |
| `isNew` | boolean | yes | New Arrivals filter |
| `featured` | boolean | yes | Home bestsellers |
| `isActive` | boolean | yes | Soft hide |
| `rating` | number | no | 0–5 |
| `reviewsCount` | number | no | |
| `tags` | string[] | yes | |
| `createdAt` | string (ISO 8601) | yes | |
| `updatedAt` | string (ISO 8601) | yes | |

**Derived on read** (include on GET responses; do not persist as source of truth):

| Field | How |
|---|---|
| `priceFrom.selling` | Min `selling` among **active** variants |
| `priceFrom.original` | `original` of that same min-price variant, if present |
| `priceFrom.currency` | `"INR"` |
| `sizes` | Unique sizes from active variants |
| `colors` | Unique colors from active variants |
| `stock` | Sum of active variant `stock` |

```json
{
  "id": "BP001",
  "slug": "traditional-pink-pattu-pavadai",
  "name": "Traditional Pink Pattu Pavadai",
  "categoryId": "pattu-pavadai",
  "subcategory": "Traditional",
  "description": "Premium silk pattu pavadai with traditional zari border.",
  "fabric": "Semi Kanjeevaram silk",
  "care": ["Dry clean only", "Do not bleach", "Steam iron"],
  "images": [
    "https://cdn.example.com/images/products/BP001/1.jpg",
    "https://cdn.example.com/images/products/BP001/2.jpg",
    "https://cdn.example.com/images/products/BP001/3.jpg"
  ],
  "variants": [
    {
      "id": "BP001-PNK-1Y",
      "sku": "BP001-PNK-1Y",
      "size": "1Y",
      "color": "Pink",
      "price": { "selling": 2499, "original": 2999, "currency": "INR" },
      "stock": 3,
      "isActive": true
    },
    {
      "id": "BP001-GLD-2Y",
      "sku": "BP001-GLD-2Y",
      "size": "2Y",
      "color": "Gold",
      "price": { "selling": 2999, "original": 3499, "currency": "INR" },
      "stock": 2,
      "isActive": true
    }
  ],
  "priceFrom": { "selling": 2499, "original": 2999, "currency": "INR" },
  "sizes": ["1Y", "2Y"],
  "colors": ["Pink", "Gold"],
  "stock": 5,
  "isNew": true,
  "featured": true,
  "isActive": true,
  "rating": 4.9,
  "reviewsCount": 18,
  "tags": ["festival", "wedding", "traditional"],
  "createdAt": "2026-08-01T00:00:00.000Z",
  "updatedAt": "2026-08-01T00:00:00.000Z"
}
```

### 2.4 Order

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | e.g. `ORD-1001` |
| `status` | enum | yes | See below |
| `source` | enum | yes | `whatsapp` \| `website` \| `manual` |
| `customer.name` | string | yes | |
| `customer.phone` | string | yes | E.164 preferred (`+919121581387`) |
| `customer.city` | string | no | |
| `items[]` | array | yes | Length ≥ 1 |
| `items[].productId` | string | yes | Parent product |
| `items[].variantId` | string | yes | Chosen size/color combo |
| `items[].productName` | string | yes | Snapshot at order time |
| `items[].sku` | string | no | Snapshot from variant |
| `items[].size` | string | no | Snapshot from variant |
| `items[].color` | string | no | Snapshot from variant |
| `items[].qty` | number | yes | ≥ 1 |
| `items[].unitPrice` | number | yes | Snapshot from variant `price.selling` |
| `totals.subtotal` | number | yes | |
| `totals.shipping` | number | yes | |
| `totals.total` | number | yes | |
| `totals.currency` | `"INR"` | yes | |
| `notes` | string | no | |
| `whatsappMessageId` | string | no | Future automation |
| `createdAt` | string | yes | |
| `updatedAt` | string | yes | |

**Status enum:** `new` | `confirmed` | `in_progress` | `shipped` | `delivered` | `cancelled`

```json
{
  "id": "ORD-1001",
  "status": "new",
  "source": "manual",
  "customer": {
    "name": "Ananya R",
    "phone": "+919876543210",
    "city": "Hyderabad"
  },
  "items": [
    {
      "productId": "BP001",
      "variantId": "BP001-PNK-3Y",
      "productName": "Traditional Pink Pattu Pavadai",
      "sku": "BP001-PNK-3Y",
      "size": "3Y",
      "color": "Pink",
      "qty": 1,
      "unitPrice": 2899
    }
  ],
  "totals": {
    "subtotal": 2899,
    "shipping": 0,
    "total": 2899,
    "currency": "INR"
  },
  "notes": "Customer messaged on WhatsApp — preferred delivery before Ugadi.",
  "createdAt": "2026-08-07T10:00:00.000Z",
  "updatedAt": "2026-08-07T10:00:00.000Z"
}
```

### 2.5 Site settings

```json
{
  "name": "Baby Pleats",
  "tagline": "Handmade pattu dresses for little princesses",
  "description": "Beautiful handmade kids' ethnic wear crafted with love for every special occasion.",
  "whatsapp": {
    "number": "919121581387",
    "display": "+91 91215 81387"
  },
  "instagram": {
    "handle": "@babypleats",
    "url": "https://www.instagram.com/babypleats"
  },
  "email": "hello@babypleats.com",
  "freeShippingThreshold": 999,
  "currency": "INR"
}
```

### 2.6 Admin user (auth/me)

```json
{
  "id": "adm_1",
  "email": "owner@babypleats.com",
  "name": "Baby Pleats Admin",
  "role": "owner"
}
```

---

## 3. Response envelopes

### Success — single resource

```json
{
  "data": { }
}
```

### Success — list

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 24,
    "total": 12
  }
}
```

### Error

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found",
    "details": null
  }
}
```

| HTTP | `error.code` | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Bad body/query; `details` may list fields |
| 401 | `UNAUTHORIZED` | Missing/invalid token |
| 403 | `FORBIDDEN` | Authenticated but not allowed |
| 404 | `NOT_FOUND` | Unknown id/slug |
| 409 | `CONFLICT` | Duplicate slug / id |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server fault |

---

## 4. Public endpoints (storefront)

### `GET /categories`

Returns active categories ordered by `sortOrder` ascending.

**Response:** `{ "data": Category[] }` (no pagination in v1)

---

### `GET /products`

**Query**

| Param | Type | Notes |
|---|---|---|
| `category` | string | Filter by `categoryId` / slug |
| `featured` | boolean | `true` → bestsellers |
| `isNew` | boolean | `true` → new arrivals |
| `tag` | string | Match any tag |
| `q` | string | Search name / description / id |
| `page` | number | Default `1` |
| `limit` | number | Default `24`, max `100` |

Public GETs return only `isActive: true` products.

**Response:** `{ data: Product[], meta }`

---

### `GET /products/:slug`

Product detail by slug. 404 if missing or inactive.

**Response:** `{ "data": Product }`

---

### `GET /site`

Public site settings for header/footer/CTA.

**Response:** `{ "data": SiteSettings }`

---

### `POST /orders`

Create an order or inquiry. May be called by the website later, or by admin tools. Rate-limit this endpoint.

**Request body**

```json
{
  "source": "website",
  "customer": {
    "name": "Ananya R",
    "phone": "+919876543210",
    "city": "Hyderabad"
  },
  "items": [
    {
      "productId": "BP001",
      "variantId": "BP001-PNK-3Y",
      "qty": 1
    }
  ],
  "notes": "Need by next Saturday"
}
```

`size` / `color` on the request are optional and ignored; the server uses `variantId`.  
Server snapshots `productName`, `sku`, `size`, `color`, and `unitPrice` from that variant and computes `totals`.  
Initial `status` is always `new`.

**Response:** `201` `{ "data": Order }`

---

## 5. Admin endpoints

All require `Authorization: Bearer <token>` unless noted.

### Auth

| Method | Path | Body / notes |
|---|---|---|
| `POST` | `/auth/login` | `{ "email", "password" }` → `{ data: { accessToken, expiresIn, user } }` |
| `POST` | `/auth/logout` | Invalidate token/session |
| `GET` | `/auth/me` | Current admin user |

### Catalog

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/admin/products` | List all (incl. inactive); same query params as public + `isActive` |
| `POST` | `/admin/products` | Create product |
| `GET` | `/admin/products/:id` | Get by id |
| `PATCH` | `/admin/products/:id` | Partial update |
| `DELETE` | `/admin/products/:id` | Soft-delete preferred (`isActive: false`) or hard-delete |
| `GET` | `/admin/categories` | List all categories |
| `POST` | `/admin/categories` | Create |
| `PATCH` | `/admin/categories/:id` | Update |
| `DELETE` | `/admin/categories/:id` | Soft/hard delete |

**Create product body:** stored Product fields including `variants`; omit derived `priceFrom` / `sizes` / `colors` / `stock`. `createdAt` / `updatedAt` are server-set. `id` may be client-supplied or server-generated.

### Media

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/admin/media` | `multipart/form-data` file upload |

**Response**

```json
{
  "data": {
    "url": "https://cdn.example.com/images/products/BP001/1.jpg",
    "contentType": "image/jpeg",
    "bytes": 245678
  }
}
```

### Orders & dashboard

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/admin/orders` | List; query: `status`, `from`, `to`, `q`, `page`, `limit` |
| `GET` | `/admin/orders/:id` | Detail |
| `PATCH` | `/admin/orders/:id` | Update `status`, `notes`, shipping fields |
| `POST` | `/admin/orders` | Manual order entry (same body as public create; `source` defaults to `manual`) |
| `GET` | `/admin/dashboard` | Summary counts |

**Dashboard response example**

```json
{
  "data": {
    "ordersNew": 5,
    "ordersInProgress": 3,
    "productsActive": 42,
    "productsLowStock": 4,
    "lowStockThreshold": 5
  }
}
```

`GET /orders` and `GET /orders/:id` / `PATCH /orders/:id` may alias the `/admin/orders*` paths; implementations should pick one prefix and stick to it. **Preferred prefix for admin UI:** `/admin/orders`.

---

## 6. Storefront field mapping (Phase C reference)

| UI need | API field |
|---|---|
| Product card image | `images[0]` |
| “From ₹X” | `priceFrom.selling` (min active variant) |
| Strike-through on card | `priceFrom.original` |
| PDP gallery | `colorGalleries` for selected colour; slider if `images.length > 1` |
| Size / color chips | Unique from `variants` (or derived `sizes` / `colors`) |
| Shop `?category=` | `categoryId` |
| Shop `?sort=new` | `isNew === true` |
| Home bestsellers | `featured === true` |
| PDP fabric / care | `fabric`, `care[]` |
| WhatsApp message | `name` + `id` + variant size/color/price |
| Collections carousel | Category `image`, `name`, `slug` |

---

## 7. Seed catalog (corrected sample)

Use this shape when seeding the external DB. “New” is **not** a category. Price and stock belong on `variants` (Gold has no `1Y` on BP001). Full file: [`catalog.seed.json`](./catalog.seed.json).

```json
{
  "categories": [
    {
      "id": "pattu-pavadai",
      "slug": "pattu-pavadai",
      "name": "Pattu Pavadai",
      "image": "/images/categories/pattu-pavadai.jpg",
      "description": "Classic silk pavadais for festivals and family celebrations.",
      "sortOrder": 1,
      "isActive": true
    },
    {
      "id": "pattu-gown",
      "slug": "pattu-gown",
      "name": "Pattu Gown",
      "image": "/images/categories/pattu-gown.jpg",
      "description": "Flowing silk gowns with timeless ethnic detailing.",
      "sortOrder": 2,
      "isActive": true
    },
    {
      "id": "half-saree",
      "slug": "half-saree",
      "name": "Half Saree",
      "image": "/images/categories/half-saree.jpg",
      "description": "Elegant half saree sets for special occasions.",
      "sortOrder": 3,
      "isActive": true
    },
    {
      "id": "aari-work",
      "slug": "aari-work",
      "name": "Aari Work",
      "image": "/images/categories/aari-work.jpg",
      "description": "Hand-embellished aari outfits with intricate craft.",
      "sortOrder": 4,
      "isActive": true
    },
    {
      "id": "top-skirt",
      "slug": "top-skirt",
      "name": "Top & Skirt",
      "image": "/images/categories/top-skirt.jpg",
      "description": "Comfortable ethnic separates for everyday tradition.",
      "sortOrder": 5,
      "isActive": true
    },
    {
      "id": "frocks",
      "slug": "frocks",
      "name": "Frocks",
      "image": "/images/categories/frocks.jpg",
      "description": "Soft frocks with a festive touch for little ones.",
      "sortOrder": 6,
      "isActive": true
    }
  ],
  "products": [
    {
      "id": "BP001",
      "slug": "traditional-pink-pattu-pavadai",
      "name": "Traditional Pink Pattu Pavadai",
      "categoryId": "pattu-pavadai",
      "subcategory": "Traditional",
      "description": "Premium silk pattu pavadai with traditional zari border.",
      "fabric": "Semi Kanjeevaram silk",
      "care": ["Dry clean only", "Do not bleach", "Steam iron"],
      "images": [
        "/images/products/BP001/1.jpg",
        "/images/products/BP001/2.jpg",
        "/images/products/BP001/3.jpg"
      ],
      "variants": [
        {
          "id": "BP001-PNK-1Y",
          "sku": "BP001-PNK-1Y",
          "size": "1Y",
          "color": "Pink",
          "price": { "selling": 2499, "original": 2999, "currency": "INR" },
          "stock": 3,
          "isActive": true
        },
        {
          "id": "BP001-GLD-2Y",
          "sku": "BP001-GLD-2Y",
          "size": "2Y",
          "color": "Gold",
          "price": { "selling": 2999, "original": 3499, "currency": "INR" },
          "stock": 2,
          "isActive": true
        }
      ],
      "isNew": true,
      "featured": true,
      "isActive": true,
      "rating": 4.9,
      "reviewsCount": 18,
      "tags": ["festival", "wedding", "traditional"],
      "createdAt": "2026-08-01T00:00:00.000Z",
      "updatedAt": "2026-08-01T00:00:00.000Z"
    },
    {
      "id": "BP002",
      "slug": "royal-blue-pattu-gown",
      "name": "Royal Blue Pattu Gown",
      "categoryId": "pattu-gown",
      "subcategory": "Party Wear",
      "description": "Elegant pattu gown for birthdays and special occasions.",
      "fabric": "Tissue silk",
      "care": ["Dry clean recommended"],
      "images": ["/images/products/BP002/1.jpg"],
      "variants": [
        {
          "id": "BP002-RBL-3Y",
          "sku": "BP002-RBL-3Y",
          "size": "3Y",
          "color": "Royal Blue",
          "price": { "selling": 3299, "original": 3999, "currency": "INR" },
          "stock": 3,
          "isActive": true
        }
      ],
      "isNew": false,
      "featured": true,
      "isActive": true,
      "rating": 4.8,
      "reviewsCount": 10,
      "tags": ["birthday", "party"],
      "createdAt": "2026-08-01T00:00:00.000Z",
      "updatedAt": "2026-08-01T00:00:00.000Z"
    },
    {
      "id": "BP003",
      "slug": "maroon-half-saree",
      "name": "Maroon Half Saree",
      "categoryId": "half-saree",
      "subcategory": "Festival",
      "description": "Traditional half saree with rich zari work.",
      "fabric": "Semi silk",
      "care": ["Dry clean only"],
      "images": [
        "/images/products/BP003/1.jpg",
        "/images/products/BP003/2.jpg"
      ],
      "variants": [
        {
          "id": "BP003-MRN-8Y",
          "sku": "BP003-MRN-8Y",
          "size": "8Y",
          "color": "Maroon",
          "price": { "selling": 4199, "original": 4599, "currency": "INR" },
          "stock": 2,
          "isActive": true
        }
      ],
      "isNew": true,
      "featured": false,
      "isActive": true,
      "rating": 5,
      "reviewsCount": 7,
      "tags": ["traditional", "festival"],
      "createdAt": "2026-08-01T00:00:00.000Z",
      "updatedAt": "2026-08-01T00:00:00.000Z"
    }
  ]
}
```

A machine-readable copy of the seed lives at [`catalog.seed.json`](./catalog.seed.json).

---

## 8. Phased roadmap

| Phase | What | Storefront impact |
|---|---|---|
| **Now** | v1.1 contract (variants) + local PDP selectors | Product page size/color |
| **A — Backend skeleton** | External API + DB; seed catalog; public GETs | None |
| **B — Admin portal MVP** | Login, CRUD catalog, media, order list/status | None |
| **C — Storefront integration** | Replace `src/data/*` with API client; keep WhatsApp CTA | Yes |
| **D — Orders automation** | Website `POST /orders`; optional WhatsApp webhooks | Optional |

**Hosting note:** The live site is a static GitHub Pages export. Catalog is loaded at build/runtime from the external API (`NEXT_PUBLIC_API_BASE_URL`), with `src/data/catalog.fallback.json` when the API is unreachable.

**v1 non-goals:** payment gateway, customer accounts, Next.js Route Handlers on GitHub Pages.

---

## 9. Related files

- [`openapi.yaml`](./openapi.yaml) — OpenAPI 3.0 specification
- [`catalog.seed.json`](./catalog.seed.json) — corrected seed payload
- [`schemas/`](./schemas/) — JSON Schema drafts for Category, Product, Order
