import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { ProductImage } from "@/types";

const gridBackground = {
  backgroundImage:
    "linear-gradient(to right, rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.05) 1px, transparent 1px)",
  backgroundSize: "26px 26px",
};

// Real photo when one exists, otherwise the abstract icon panel.
export function ProductMedia({
  image,
  Icon,
  iconClassName,
  fit = "cover",
  className = "",
  priority,
  children,
}: {
  image?: ProductImage;
  Icon: LucideIcon;
  iconClassName: string;
  fit?: "cover" | "contain";
  className?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-line bg-paper shadow-sm ${className}`}
      style={image ? undefined : gridBackground}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          className={`h-full w-full ${fit === "contain" ? "object-contain p-3 sm:p-6" : "object-cover object-[70%_center]"}`}
        />
      ) : (
        <Icon aria-hidden className={`${iconClassName} text-ink/15`} strokeWidth={1} />
      )}
      {children}
    </div>
  );
}
