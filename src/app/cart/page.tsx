import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Bag",
  description: "Review the pieces in your Baby Pleats bag.",
};

export default function CartPage() {
  return <CartPageClient />;
}
