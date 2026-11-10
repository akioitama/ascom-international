import Image from "next/image";
import { cn, mediaUrl } from "@/lib/utils";

export function Photo({
  src,
  alt,
  company = true,
  caption,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  src?: string | null;
  alt: string;
  company?: boolean;
  caption?: string | null;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    return <div className={`bg-mist ${className}`} />;
  }
  return (
    <figure className={cn("relative overflow-hidden bg-navy", className)}>
      <Image src={mediaUrl(src)} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      {!company ? (
        <figcaption className="absolute bottom-3 left-3 bg-navy/80 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-white">
          Atmospheric photograph
        </figcaption>
      ) : null}
      {caption && company ? <span className="sr-only">{caption}</span> : null}
    </figure>
  );
}
