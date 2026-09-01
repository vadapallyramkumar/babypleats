import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Return Policy",
};

export default function ReturnPolicyPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-gray-900">
          Return Policy
        </h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-600">
          <p>
            Unused, unworn items in original condition may be eligible for
            exchange within 7 days of delivery, subject to stock and approval.
          </p>
          <p>
            Custom-made and personalized orders are generally final sale and
            cannot be returned unless there is a manufacturing defect.
          </p>
          <p>
            To start a return or exchange, message us on WhatsApp at{" "}
            {siteConfig.whatsapp.display} with your order details and photos of
            the item.
          </p>
        </div>
      </Container>
    </main>
  );
}
