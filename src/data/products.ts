/** @deprecated Prefer @/lib/api/catalog — kept as thin re-exports for helpers/types. */
export type { Product, ProductVariant } from "@/lib/api/types";
export {
  formatPrice,
  getFromPrice,
  getUniqueSizes,
  getUniqueColors,
  getColorImages,
  getVariant,
} from "@/lib/product-utils";

export {
  getProduct,
  getBestsellers,
  getNewArrivals,
  getProductsByCategory,
  getRelatedProducts,
  listProducts,
  productMatchesCategory,
} from "@/lib/api/catalog";
