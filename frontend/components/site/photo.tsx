import Image from "next/image";
import { Plate } from "@/components/site/plate";
import { cn, mediaUrl } from "@/lib/utils";

export function Photo({
  src,
  alt,
  company = true,
  caption,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 60vw, 100vw",
  zoom = false,
  grade = true,
  tag = "bottom",
  position,
  fallback,
  imgClassName,
  frame = false,
}: {
  src?: string | null;
  alt: string;
  company?: boolean;
  caption?: string | null;
  priority?: boolean;
  className?: string;
  sizes?: string;
  zoom?: boolean;
  grade?: boolean;
  tag?: "top" | "bottom" | "top-right" | "bottom-right" | "none";
  position?: string;
  fallback?: React.ReactNode;
  imgClassName?: string;
  frame?: boolean;
}) {
  if (!src) {
    return <div className={cn("relative overflow-hidden", className)}>{fallback ?? <Plate className="absolute inset-0" />}</div>;
  }
  return (
    <figure className={cn("relative overflow-hidden bg-deep", className)}>
      <Image
        src={mediaUrl(src)}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={position ? { objectPosition: position } : undefined}
        className={cn(
          "object-cover",
          grade && "img-grade",
          zoom && "transition-transform duration-[1400ms] ease-out-expo will-change-transform group-hover:scale-[1.045]",
          imgClassName,
        )}
      />
      {frame ? <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/[0.07]" /> : null}
      {!company && tag !== "none" ? (
        <figcaption
          className={cn(
            "eyebrow absolute z-[1] bg-midnight/75 px-2 py-1 text-[0.625rem] text-white/85 backdrop-blur-sm",
            tag.startsWith("top") ? "top-3" : "bottom-3",
            tag.endsWith("right") ? "right-3" : "left-3",
          )}
        >
          Atmospheric photograph
        </figcaption>
      ) : null}
      {caption && company ? <span className="sr-only">{caption}</span> : null}
    </figure>
  );
}
