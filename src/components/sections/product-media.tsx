import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { ImageFit } from "@/types/catalog";

const gridBackground = {
  backgroundImage:
    "linear-gradient(to right, rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.05) 1px, transparent 1px)",
  backgroundSize: "26px 26px",
};

// Real photo when one exists, otherwise the abstract icon panel.
export function ProductMedia({
  src,
  alt,
  fit = "cover",
  Icon,
  iconClassName,
  className = "",
  sizes = "(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 50vw",
  priority,
  children,
}: {
  src?: string | null;
  alt: string;
  fit?: ImageFit;
  Icon: LucideIcon;
  iconClassName: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-line bg-paper shadow-sm ${className}`}
      style={src ? undefined : gridBackground}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={fit === "contain" ? "object-contain p-3 sm:p-6" : "object-cover object-[70%_center]"}
        />
      ) : (
        <Icon aria-hidden className={`${iconClassName} text-ink/15`} strokeWidth={1} />
      )}
      {children}
    </div>
  );
}
