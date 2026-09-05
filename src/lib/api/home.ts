import { assetPath } from "@/lib/paths";
import { siteConfig } from "@/lib/site";
import { apiGet } from "./base";
import type {
  ApiHeroImage,
  ApiPromotionalMessage,
  ApiSocialLink,
  HeroImage,
  PromotionalMessage,
  SocialLink,
} from "./types";

type HomeEnvelope<T> = {
  success?: boolean;
  data: T;
  message?: string;
};

function fallbackHeroImages(): HeroImage[] {
  return [
    {
      id: "fallback-hero",
      url: assetPath("/hero1.png"),
      alt: `${siteConfig.name} — Traditional elegance for little ones. Handcrafted with love for every special moment.`,
    },
  ];
}

function fallbackPromotionalMessages(): PromotionalMessage[] {
  return [
    {
      id: "fallback-promo-1",
      message: `Free shipping on orders above ₹${siteConfig.freeShippingThreshold}`,
    },
    {
      id: "fallback-promo-2",
      message: "Pay online at checkout — UPI, cards, or cash on delivery",
    },
    {
      id: "fallback-promo-3",
      message: `Follow ${siteConfig.instagram.handle} for new arrivals`,
    },
  ];
}

function fallbackSocialLinks(): SocialLink[] {
  return [1, 2, 3, 4, 5, 6].map((n) => ({
    id: `fallback-social-${n}`,
    url: assetPath(`/Insta${n}.mp4`),
    type: "video" as const,
    alt: `${siteConfig.name} on Instagram — look ${n}`,
  }));
}

function mapHeroImage(row: ApiHeroImage): HeroImage {
  return {
    id: row.id,
    url: row.url,
    ...(row.mobileUrl ? { mobileUrl: row.mobileUrl } : {}),
    alt: row.alt,
  };
}

function mapPromotionalMessage(row: ApiPromotionalMessage): PromotionalMessage {
  return { id: row.id, message: row.message };
}

function mapSocialLink(row: ApiSocialLink, index: number): SocialLink {
  return {
    id: row.id,
    url: row.url,
    type: row.type === "image" ? "image" : "video",
    alt: `${siteConfig.name} on Instagram — look ${index + 1}`,
  };
}

export async function listHeroImages(): Promise<HeroImage[]> {
  const json = await apiGet<HomeEnvelope<ApiHeroImage[]>>("/home/hero-images");
  if (json?.data?.length) return json.data.map(mapHeroImage);
  return fallbackHeroImages();
}

export async function listPromotionalMessages(): Promise<PromotionalMessage[]> {
  const json = await apiGet<HomeEnvelope<ApiPromotionalMessage[]>>(
    "/home/promotional-messages"
  );
  if (json?.data?.length) return json.data.map(mapPromotionalMessage);
  return fallbackPromotionalMessages();
}

export async function listSocialLinks(): Promise<SocialLink[]> {
  const json = await apiGet<HomeEnvelope<ApiSocialLink[]>>("/home/social-links");
  if (json?.data?.length) {
    return json.data.map((row, i) => mapSocialLink(row, i));
  }
  return fallbackSocialLinks();
}
