import { Suspense } from "react";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ShopCatalog from "@/components/shop/ShopCatalog";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse handmade pattu dresses and kids ethnic wear at Baby Pleats.",
};

function ShopPageFallback() {
  return (
    <>
      <div className="mb-10 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/5] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container>
        <Suspense fallback={<ShopPageFallback />}>
          <ShopCatalog />
        </Suspense>
      </Container>
    </main>
  );
}
