export const siteConfig = {
  name: "Baby Pleats",
  tagline: "Handmade pattu dresses for little princesses",
  description:
    "Beautiful handmade kids' ethnic wear crafted with love for every special occasion.",
  whatsapp: {
    number: "919121581387",
    display: "+91 91215 81387",
  },
  instagram: {
    handle: "@babypleats",
    url: "https://www.instagram.com/babypleats",
  },
  email: "hello@babypleats.com",
  freeShippingThreshold: 999,
  shippingFee: 99,
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp.number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
