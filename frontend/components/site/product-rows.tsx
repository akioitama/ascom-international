import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Photo } from "@/components/site/photo";
import { Plate } from "@/components/site/plate";
import { productIcon } from "@/lib/icons";
import type { ProductCard as Product } from "@/lib/types";
import { pad } from "@/lib/utils";

export function ProductRows({ products, numbers }: { products: Product[]; numbers: Record<string, number> }) {
  return (
    <ul className="border-t border-ink/15">
      {products.map((product) => {
        const Icon = productIcon(product.slug, product.category?.slug);
        return (
          <li key={product.slug} className="border-b border-ink/15">
            <Link href={`/products/${product.slug}`} className="group grid grid-cols-[6rem_minmax(0,1fr)_auto] items-center gap-5 py-5 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-8">
              <div className="relative aspect-[4/3] overflow-hidden">
                {product.hero_image ? (
                  <Photo src={product.hero_image} alt="" company zoom sizes="144px" className="absolute inset-0" />
                ) : (
                  <Plate icon={Icon} compact className="absolute inset-0" />
                )}
              </div>
              <div className="min-w-0">
                <p className="eyebrow flex gap-3 text-muted">
                  <span className="shrink-0 whitespace-nowrap text-blue">No. {pad(numbers[product.slug] ?? 0)}</span>
                  <span className="truncate">{product.category?.name}</span>
                </p>
                <h3 className="mt-2 text-xl font-medium tracking-tight transition-colors group-hover:text-blue sm:text-2xl">{product.name}</h3>
                <p className="mt-1 hidden max-w-2xl text-sm leading-6 text-muted sm:block">{product.summary}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center border border-ink/15 transition-colors duration-300 group-hover:border-navy group-hover:bg-navy group-hover:text-white">
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
