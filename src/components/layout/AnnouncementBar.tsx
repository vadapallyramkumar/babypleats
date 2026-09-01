"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const messages = [
  `Free shipping on orders above ₹${siteConfig.freeShippingThreshold}`,
  "Pay online at checkout — UPI, cards, or cash on delivery",
  `Follow ${siteConfig.instagram.handle} for new arrivals`,
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#A02C68] text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 text-center text-sm font-medium">
        <p key={index} className="transition-opacity duration-500">
          {messages[index]}
        </p>
      </div>
    </div>
  );
}
