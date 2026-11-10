import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Chip } from "@/components/site/chip";
import { GridFill } from "@/components/site/grid-fill";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { ProductCard } from "@/components/site/product-card";
import { getCategories, getDivisions, getProducts } from "@/lib/content";
import { categoryIcon, divisionIcon } from "@/lib/icons";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products & Solutions",
  description: "Catalogue of vehicles, road safety products, signage and technology from ASCOM International.",
  alternates: { canonical: "/products" },
};

function query(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const value = search.toString();
  return value ? `/products?${value}` : "/products";
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const products = getProducts({ q: params.q, category: params.category, division: params.division });
  const categories = getCategories();
  const all = getProducts();
  const divisions = getDivisions();
  const division = params.division ? divisions.find((item) => item.slug === params.division) : undefined;
  const category = params.category ? categories.find((item) => item.slug === params.category) : undefined;
  const filtered = Boolean(params.q || params.category || params.division);
  const groups = category
    ? [{ key: category.slug, title: category.name, text: category.description, icon: categoryIcon(category.slug), href: undefined, items: products }]
    : divisions
        .map((item) => ({
          key: item.slug,
          title: item.name,
          text: item.summary,
          icon: divisionIcon(item.slug),
          href: `/businesses/${item.slug}`,
          items: products.filter((product) => product.division?.slug === item.slug),
        }))
        .filter((group) => group.items.length > 0)
        .sort((a, b) => b.items.filter((item) => item.is_featured).length - a.items.filter((item) => item.is_featured).length);

  return (
    <>
      <PageHero
        variant="plain"
        kicker="Catalogue"
        title={
          <>
            Products <span className="text-ink/50">&amp; solutions</span>
          </>
        }
        text="Vehicles, equipment, road safety products, signage and technology, grouped by business. Ask the team for specifications and quantities."
        crumbs={[{ href: "/", label: "Home" }, { label: "Products & Solutions" }]}
        facts={[
          { label: "Items", value: pad(all.length) },
          { label: "Categories", value: pad(categories.length) },
          { label: "With project photography", value: pad(all.filter((item) => item.hero_image).length) },
          { label: "Businesses represented", value: pad(new Set(all.map((item) => item.division?.slug).filter(Boolean)).size) },
        ]}
      />

      <section className="bg-foam">
        <div className="sticky top-[64px] z-30 border-b border-line bg-foam/90 backdrop-blur-xl lg:top-[76px]">
          <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:px-0">
              <Chip href={query({ q: params.q, division: params.division })} active={!params.category} count={all.length}>
                All
              </Chip>
              {categories.map((category) => (
                <Chip key={category.slug} href={query({ q: params.q, division: params.division, category: category.slug })} active={params.category === category.slug} count={all.filter((item) => item.category?.slug === category.slug).length}>
                  {category.name}
                </Chip>
              ))}
            </div>
            <form action="/products" className="flex w-full shrink-0 items-center border border-line bg-white focus-within:border-ink/50 lg:w-80">
              {params.category ? <input type="hidden" name="category" value={params.category} /> : null}
              {params.division ? <input type="hidden" name="division" value={params.division} /> : null}
              <label className="sr-only" htmlFor="q">
                Search products
              </label>
              <Search className="ml-4 h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
              <input id="q" name="q" defaultValue={params.q || ""} placeholder="Search the catalogue" className="h-10 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted/80" />
              <button type="submit" className="h-10 shrink-0 border-l border-line px-4 text-[0.8125rem] font-medium transition-colors hover:bg-navy hover:text-white">
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="shell py-14 lg:py-20">
          {filtered ? (
            <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <p>
                <span className="font-medium text-ink">{products.length}</span> {products.length === 1 ? "item" : "items"}
                {params.q ? (
                  <>
                    {" "}
                    matching <span className="text-ink">&ldquo;{params.q}&rdquo;</span>
                  </>
                ) : null}
                {division ? (
                  <>
                    {" "}
                    in <span className="text-ink">{division.name}</span>
                  </>
                ) : null}
              </p>
              <Link href="/products" className="link-underline text-ink">
                Clear filters
              </Link>
            </div>
          ) : null}

          {products.length === 0 ? (
            <div className="border border-dashed border-ink/20 bg-white px-8 py-16 text-center">
              <p className="text-xl font-medium tracking-tight">No products match that search.</p>
              <p className="mt-2 text-sm text-muted">Try a different word, or browse all categories.</p>
            </div>
          ) : (
            <div className="grid gap-20 lg:gap-24">
              {groups.map(({ key, title, text, icon: Icon, href, items }) => {
                return (
                  <section key={key} aria-labelledby={`group-${key}`}>
                    <header className="grid gap-4 border-t border-ink pb-8 pt-6 md:grid-cols-12 md:gap-6">
                      <div className="flex items-center gap-4 md:col-span-5">
                        <span className="grid h-11 w-11 shrink-0 place-items-center bg-navy text-bright">
                          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                        </span>
                        <h2 id={`group-${key}`} className="text-2xl font-medium tracking-tight lg:text-[1.75rem]">
                          {href ? (
                            <Link href={href} className="link-underline">
                              {title}
                            </Link>
                          ) : (
                            title
                          )}
                        </h2>
                      </div>
                      <p className="max-w-xl text-[0.95rem] leading-7 text-muted md:col-span-5">{text}</p>
                      <p className="eyebrow text-muted md:col-span-2 md:text-right">
                        {pad(items.length)} {items.length === 1 ? "item" : "items"}
                      </p>
                    </header>
                    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {items.map((product) => (
                        <li key={product.slug}>
                          <ProductCard product={product} index={all.findIndex((item) => item.slug === product.slug) + 1} />
                        </li>
                      ))}
                      <GridFill count={items.length} cols={{ sm: 2, lg: 3, xl: 4 }} />
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <InquiryBand title="Looking for something specific?" text="Ask the team about an item, a quantity or a specification that is not listed here." />
    </>
  );
}
