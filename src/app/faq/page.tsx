import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { faqs } from "@/data/faq";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Baby Pleats orders and care.",
};

export default function FaqPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-gray-900 md:text-5xl">
          Help Center
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Quick answers about ordering, shipping, and care. Still unsure?
          Message us anytime.
        </p>

        <div className="mt-12 space-y-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group border border-[#E8D0DA] bg-white open:bg-[#FFF8F5]"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-gray-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-[#A02C68] transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="border-t border-[#E8D0DA] px-5 py-4 text-sm leading-relaxed text-gray-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <a
          href={whatsappUrl("Hi Baby Pleats! I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex bg-[#A02C68] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#8B235A]"
        >
          Ask on WhatsApp
        </a>
      </Container>
    </main>
  );
}
