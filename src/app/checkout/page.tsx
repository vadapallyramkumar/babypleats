import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Pay securely for your Baby Pleats order.",
};

export default function CheckoutPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-gray-900 md:text-5xl">
          Checkout
        </h1>
        <p className="mt-3 max-w-2xl text-base text-gray-600">
          Add your delivery details and pay online.
        </p>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </Container>
    </main>
  );
}
