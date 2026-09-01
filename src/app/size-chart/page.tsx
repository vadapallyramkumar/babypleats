import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { sizeRows } from "@/data/size-chart";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Size Chart",
  description: "Baby Pleats kids ethnic wear size guide.",
};

export default function SizeChartPage() {
  return (
    <main className="pb-20 pt-10 md:pt-14">
      <Container>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-gray-900 md:text-5xl">
          Size Chart
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
          Measurements are approximate (in inches). For the best fit, measure
          your child and share details on WhatsApp — especially for custom
          orders.
        </p>

        <div className="mt-10 overflow-x-auto border border-[#E8D0DA] bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-[#A02C68] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Age</th>
                <th className="px-4 py-3 font-semibold">Chest</th>
                <th className="px-4 py-3 font-semibold">Length</th>
              </tr>
            </thead>
            <tbody>
              {sizeRows.map((row, i) => (
                <tr
                  key={row.size}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#FFF8F5]"}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {row.size}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.age}</td>
                  <td className="px-4 py-3 text-gray-600">{row.chest}&quot;</td>
                  <td className="px-4 py-3 text-gray-600">{row.length}&quot;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Prefer a perfect fit?{" "}
          <Link href="/contact" className="font-semibold text-[#A02C68]">
            Contact us
          </Link>{" "}
          with chest, waist, and height.
        </p>

        <a
          href={whatsappUrl(
            "Hi Baby Pleats! I need help choosing a size."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex bg-[#A02C68] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#8B235A]"
        >
          Ask for size help
        </a>
      </Container>
    </main>
  );
}
