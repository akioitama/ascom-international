import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/site/photo";
import { getCategories, getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products & Solutions",
  description: "Catalogue of vehicles, road safety products, signage and technology categories published by ASCOM International.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const products = getProducts({ q: params.q, category: params.category, division: params.division });
  const categories = getCategories();
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">Catalogue</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Products & solutions</h1>
      <p className="mt-4 max-w-2xl text-muted">Every item below is named on the current ASCOM website. Specifications appear only where the source published them.</p>
      <form className="mt-8 flex flex-col gap-3 sm:flex-row" action="/products">
        <label className="sr-only" htmlFor="q">Search products</label>
        <input id="q" name="q" defaultValue={params.q || ""} placeholder="Search" className="border border-line bg-white px-3 py-3 sm:w-72" />
        <label className="sr-only" htmlFor="category">Category</label>
        <select id="category" name="category" defaultValue={params.category || ""} className="border border-line bg-white px-3 py-3">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-navy px-5 py-3 text-sm font-semibold text-white">
          Filter
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">{products.length} items</p>
      {products.length === 0 ? <p className="mt-8">No products match that search.</p> : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link key={product.slug} href={`/products/${product.slug}`} className="border border-line bg-white">
            <Photo src={product.hero_image} alt={product.name} company={product.hero_is_company_photo} className="h-44" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-blue">{product.category?.name}</p>
              <h2 className="mt-2 font-display text-xl font-semibold">{product.name}</h2>
              <p className="mt-2 text-sm text-muted">{product.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
