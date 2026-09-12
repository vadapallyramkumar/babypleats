import { apiGet } from "./base";
import type {
  ApiHeroImage,
  ApiPromotionalMessage,
  ApiSocialLink,
  HeroImage,
  PromotionalMessage,
  SocialLink,
} from "./types";
import { siteConfig } from "@/lib/site";

type HomeEnvelope<T> = {
  success?: boolean;
  data: T;
  message?: string;
};

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
  return [];
}

export async function listPromotionalMessages(): Promise<PromotionalMessage[]> {
  const json = await apiGet<HomeEnvelope<ApiPromotionalMessage[]>>(
    "/home/promotional-messages"
  );
  if (json?.data?.length) return json.data.map(mapPromotionalMessage);
  return [];
}

export async function listSocialLinks(): Promise<SocialLink[]> {
  const json = await apiGet<HomeEnvelope<ApiSocialLink[]>>("/home/social-links");
  if (json?.data?.length) {
    return json.data.map((row, i) => mapSocialLink(row, i));
  }
  return [];
}
