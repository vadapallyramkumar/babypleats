import Container from "@/components/layout/Container";
import { siteConfig, whatsappUrl } from "@/lib/site";

export default function ContactStrip() {
  return (
    <section className="bg-[#A02C68] py-14 text-white md:py-16">
      <Container className="flex flex-col items-center text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
          Have a Question?
        </h2>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-white/85">
          For custom outfits, bulk orders, or sizing help — message us on
          WhatsApp. We&apos;re happy to guide you.
        </p>
        <a
          href={whatsappUrl(
            "Hi Baby Pleats! I have a question about your outfits."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex bg-white px-8 py-3.5 text-sm font-semibold text-[#A02C68] transition hover:bg-[#FFF8F5]"
        >
          Message on WhatsApp
        </a>
        <p className="mt-4 text-sm text-white/75">
          {siteConfig.whatsapp.display} · {siteConfig.instagram.handle}
        </p>
      </Container>
    </section>
  );
}
