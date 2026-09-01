import type { Metadata } from "next";
import CheckoutSuccessClient from "@/components/checkout/CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Order confirmed",
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />;
}
