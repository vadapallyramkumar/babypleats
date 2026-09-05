"use client";

import { useEffect, useState } from "react";
import { usePromotionalMessages } from "@/hooks/use-home";

export default function AnnouncementBar() {
  const { data: messages } = usePromotionalMessages();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [messages.length]);

  useEffect(() => {
    setIndex(0);
  }, [messages]);

  const text = messages[index]?.message;
  if (!text) return null;

  return (
    <div className="bg-[#A02C68] text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 text-center text-sm font-medium">
        <p key={messages[index]?.id ?? index} className="transition-opacity duration-500">
          {text}
        </p>
      </div>
    </div>
  );
}
