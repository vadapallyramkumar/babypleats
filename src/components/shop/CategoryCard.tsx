import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/paths";

export const CATEGORY_BADGE_BY_SLUG: Record<string, string> = {
  "budget-friendly": "Budget Friendly",
  "aari-work-pavada-set": "Aari Work",
  "aari-work-frocks": "Aari Work",
  "aari-work-coat-set": "Aari Work",
  "ethnic-silk-frocks": "Silk",
  "kota-collection": "Kota",
  "paithani-collection": "Paithani",
  "kalyani-cotton-frocks": "Cotton",
  "pattu-pavada-sets": "Pattu",
  "crop-top-and-skirt-set": "Crop Top",
  "ready-to-dispatch": "Ready",
  "best-sellers": "Bestsellers",
};

type CategoryCardProps = {
  href: string;
  image: string;
  label: string;
  badge: string;
  sizes?: string;
};

export default function CategoryCard({
  href,
  image,
  label,
  badge,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E8D5C4]/80 bg-[#FDF8F5] shadow-[0_4px_16px_-6px_rgba(90,40,50,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_-10px_rgba(90,40,50,0.28)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5E6EC]">
        <Image
          src={assetPath(image)}
          alt={label}
          fill
          sizes={sizes}
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-md bg-[#7A1B30] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white md:text-[11px]">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center px-3 pb-5 pt-4 text-center md:px-4 md:pb-6 md:pt-5">
        <h1 className="font-[family-name:var(--font-display)] text-base font-bold leading-snug text-[#7A1B30] md:text-lg">
          {label}
        </h1>

        <div className="mt-3 flex w-full items-center gap-2 md:mt-4">
          <span
            aria-hidden
            className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C4A35A]/80"
          />
          <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#7A1B30] md:text-[10px]">
            Explore Collection →
          </span>
          <span
            aria-hidden
            className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C4A35A]/80"
          />
        </div>
      </div>
    </Link>
  );
}
