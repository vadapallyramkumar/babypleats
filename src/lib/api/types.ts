export type ApiPrice = {
  selling: number;
  original?: number;
  currency: "INR";
};

export type ApiVariant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  price: ApiPrice;
  stock: number;
  isActive: boolean;
  image?: string;
  discountPercent?: number;
};

export type ApiColorGallery = {
  color: string;
  images: string[];
};

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  subcategory?: string;
  description: string;
  fabric?: string;
  care: string[];
  images: string[];
  colorGalleries: ApiColorGallery[];
  variants: ApiVariant[];
  priceFrom: ApiPrice;
  sizes: string[];
  colors: string[];
  stock: number;
  isNew: boolean;
  featured: boolean;
  isActive: boolean;
  rating?: number;
  reviewsCount?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

export type CategoryFilter =
  | "budgetFriendly"
  | "readyToDispatch"
  | "bestseller";

export type Category = {
  slug: string;
  name: string;
  image: string;
  description: string;
  filter?: CategoryFilter;
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  price: number;
  compareAt?: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  bestseller?: boolean;
  newArrival?: boolean;
  budgetFriendly?: boolean;
  readyToDispatch?: boolean;
  description: string;
  fabric?: string;
  care?: string;
  colorImages: Record<string, string[]>;
  variants: ProductVariant[];
};

/** Home CMS — matches babypleats-api `/v1/home/*` mappers */
export type ApiHeroImage = {
  id: string;
  url: string;
  mobileUrl: string | null;
  alt: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiPromotionalMessage = {
  id: string;
  message: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SocialMediaType = "image" | "video";

export type ApiSocialLink = {
  id: string;
  url: string;
  type: SocialMediaType;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HeroImage = {
  id: string;
  url: string;
  mobileUrl?: string;
  alt: string;
};

export type PromotionalMessage = {
  id: string;
  message: string;
};

export type SocialLink = {
  id: string;
  url: string;
  type: SocialMediaType;
  alt: string;
};
