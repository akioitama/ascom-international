import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Photo } from "@/components/site/photo";
import { Plate } from "@/components/site/plate";
import { productIcon } from "@/lib/icons";
import type { ProductCard as Product } from "@/lib/types";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const Icon = productIcon(product.slug, product.category?.slug);
  const number = `No. ${String(index).padStart(2, "0")}`;
  return (
    <Link href={`/products/${product.slug}`} className="group flex h-full flex-col bg-white transition-colors duration-500 hover:bg-foam">
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]">
        {product.hero_image ? (
          <Photo
            src={product.hero_image}
            alt={product.hero_caption || product.name}
            company={product.hero_is_company_photo}
            zoom
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0"
          />
        ) : (
          <Plate icon={Icon} label={number} className="absolute inset-0 transition-colors duration-500 group-hover:bg-mist" />
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-line p-6">
        <p className="eyebrow text-blue">{product.category?.name}</p>
        <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight">{product.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{product.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-ink">
          View details
          <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
