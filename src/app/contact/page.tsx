import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { siteConfig, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Baby Pleats on WhatsApp, Instagram, or email.",
};

export default function ContactPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-gray-900 md:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          For custom requests, bulk purchases, or sizing help — WhatsApp is the
          fastest way to reach us. Ready-to-wear orders can be placed in the
          shop and paid at checkout.
        </p>

        <div className="mt-10 space-y-6 border-t border-[#E8D0DA] pt-10">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
              WhatsApp
            </h2>
            <a
              href={whatsappUrl(
                "Hi Baby Pleats! I'd like to get in touch."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-lg text-[#A02C68] hover:underline"
            >
              {siteConfig.whatsapp.display}
            </a>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
              Instagram
            </h2>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-lg text-[#A02C68] hover:underline"
            >
              {siteConfig.instagram.handle}
            </a>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
              Email
            </h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-2 inline-block text-lg text-[#A02C68] hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        <a
          href={whatsappUrl(
            "Hi Baby Pleats! I have a question / need help with an order."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex bg-[#A02C68] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#8B235A]"
        >
          Message on WhatsApp
        </a>
      </Container>
    </main>
  );
}
