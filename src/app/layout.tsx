import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import Providers from "@/components/providers";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Handmade Kids Ethnic Wear`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#FFF8F5] font-[family-name:var(--font-sans)] text-gray-800">
        <Script id="legacy-product-path" strategy="beforeInteractive">
          {`(function () {
  var base = ${JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH ?? "")};
  var path = location.pathname;
  if (base && path.indexOf(base) === 0) path = path.slice(base.length) || "/";
  var match = path.match(/^\\/products\\/([^/]+)\\/?$/);
  if (!match) return;
  var slug = decodeURIComponent(match[1]);
  if (!slug || slug === "index.html") return;
  location.replace(base + "/products/?slug=" + encodeURIComponent(slug) + location.hash);
})();`}
        </Script>
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}
