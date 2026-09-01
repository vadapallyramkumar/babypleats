import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping Policy",
};

export default function ShippingPolicyPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container className="max-w-3xl prose-headings:font-[family-name:var(--font-display)]">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-gray-900">
          Shipping Policy
        </h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-600">
          <p>
            {siteConfig.name} ships across India. Free shipping applies on
            eligible orders above ₹{siteConfig.freeShippingThreshold} via
            standard delivery.
          </p>
          <p>
            Ready-to-dispatch pieces typically ship within 5–7 business days.
            Custom and made-to-order outfits may require 2–4 weeks. Festival
            seasons can extend timelines — expected dates are confirmed after
            you place your order.
          </p>
          <p>
            Orders below ₹{siteConfig.freeShippingThreshold} include a standard
            shipping fee of ₹{siteConfig.shippingFee}.
          </p>
          <p>
            International or bulk shipping is available on request. Contact us
            at {siteConfig.whatsapp.display} for a quote.
          </p>
        </div>
      </Container>
    </main>
  );
}
