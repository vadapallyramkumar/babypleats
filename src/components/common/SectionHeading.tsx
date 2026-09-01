import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export default function SectionHeading({
  title,
  subtitle,
  className,
  align = "center", 
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-gray-900 md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-xl text-base leading-relaxed text-gray-600">
          {subtitle}
        </p>
      ) : null}
      {action}
    </div>
  );
}
