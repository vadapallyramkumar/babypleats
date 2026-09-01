import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-gray-900">
          Privacy Policy
        </h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-600">
          <p>
            {siteConfig.name} respects your privacy. When you check out or
            contact us via WhatsApp, Instagram, or email, we use your details
            only to fulfil orders and respond to enquiries.
          </p>
          <p>
            We do not sell personal information. Order-related data may be
            shared with delivery partners solely to complete your shipment.
          </p>
          <p>
            For privacy questions, reach us at {siteConfig.email} or WhatsApp{" "}
            {siteConfig.whatsapp.display}.
          </p>
        </div>
      </Container>
    </main>
  );
}
