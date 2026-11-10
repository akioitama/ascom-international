import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FileText } from "lucide-react";
import { Crumbs } from "@/components/site/crumbs";
import { GridFill } from "@/components/site/grid-fill";
import { InquiryBand } from "@/components/site/inquiry-band";
import { Photo } from "@/components/site/photo";
import { Plate } from "@/components/site/plate";
import { ProductCard } from "@/components/site/product-card";
import { ProductRows } from "@/components/site/product-rows";
import { ProjectCard } from "@/components/site/project-card";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { getCompany, getProduct, getProducts } from "@/lib/content";
import { productIcon } from "@/lib/icons";
import { pad, siteUrl } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.summary,
    alternates: { canonical: `/products/${slug}` },
    openGraph: { title: product.name, description: product.summary },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const { profile } = getCompany();
  const hasSpecs = (product.specs?.length ?? 0) > 0;
  const hasDocuments = (product.documents?.length ?? 0) > 0;
  const all = getProducts();
  const number = all.findIndex((item) => item.slug === product.slug) + 1;
  const Icon = productIcon(product.slug, product.category?.slug);
  const site = siteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    brand: { "@type": "Brand", name: "ASCOM International" },
    url: `${site}/products/${product.slug}`,
  };
  const related = product.related_products ?? [];
  const projects = product.projects ?? [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="bg-foam">
        <div className="shell pt-8 lg:pt-10">
          <Crumbs items={[{ href: "/", label: "Home" }, { href: "/products", label: "Products" }, { label: product.name }]} />
        </div>
        <div className="shell grid gap-12 pb-24 pt-10 lg:grid-cols-12 lg:gap-6 lg:pb-32 lg:pt-14">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              {product.hero_image ? (
                <Photo
                  src={product.hero_image}
                  alt={product.hero_caption || product.name}
                  company={product.hero_is_company_photo}
                  priority
                  frame
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="aspect-[4/3] animate-fade-in"
                />
              ) : (
                <Plate icon={Icon} tone="dark" label={product.category?.name} index={`No. ${pad(number)}`} className="aspect-[4/3] animate-fade-in" />
              )}
              <p className="eyebrow mt-4 flex flex-wrap gap-x-3 gap-y-1 text-muted">
                <span className="text-blue">No. {pad(number)}</span>
                <span>{product.hero_image ? product.hero_caption || "Project photograph" : product.category?.name}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-8">
            <p className="eyebrow flex animate-rise items-center gap-3 text-muted">
              <span className="inline-block h-px w-8 bg-blue" />
              {product.category ? (
                <Link href={`/products?category=${product.category.slug}`} className="transition-colors hover:text-ink">
                  {product.category.name}
                </Link>
              ) : (
                "Product"
              )}
            </p>
            <h1 className="mt-6 animate-rise text-headline font-medium [animation-delay:80ms]">{product.name}</h1>
            <p className="mt-6 animate-rise text-lead text-muted [animation-delay:160ms]">{product.summary}</p>

            {product.description ? (
              <div className="mt-10 border-t border-line pt-10">
                <Prose text={product.description} />
              </div>
            ) : null}

            {product.verification_note ? <p className="mt-8 border-l-2 border-signal pl-4 text-sm leading-6 text-muted">{product.verification_note}</p> : null}

            {hasSpecs ? (
              <div className="mt-12">
                <h2 className="eyebrow text-ink">Specifications</h2>
                <dl className="mt-4 border-t border-ink">
                  {product.specs?.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 border-b border-line py-4 text-[0.95rem]">
                      <dt className="text-muted">{spec.label}</dt>
                      <dd className="font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {hasDocuments ? (
              <div className="mt-12">
                <h2 className="eyebrow text-ink">Documents</h2>
                <ul className="mt-4 border-t border-ink">
                  {product.documents?.map((document) => (
                    <li key={document.id} className="border-b border-line">
                      <a className="group flex items-center gap-4 py-4 text-[0.95rem] font-medium" href={document.file_url}>
                        <FileText className="h-4 w-4 text-blue" strokeWidth={1.5} aria-hidden />
                        <span className="mr-auto transition-colors group-hover:text-blue">{document.title}</span>
                        <ArrowUpRight className="h-4 w-4 text-muted" strokeWidth={1.5} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <dl className="mt-12 grid grid-cols-2 border-t border-line">
              <div className="border-b border-line py-4 pr-4">
                <dt className="eyebrow text-muted">Business</dt>
                <dd className="mt-1.5 text-[0.95rem]">
                  {product.division ? (
                    <Link href={`/businesses/${product.division.slug}`} className="link-underline">
                      {product.division.name}
                    </Link>
                  ) : (
                    "ASCOM International"
                  )}
                </dd>
              </div>
              <div className="border-b border-l border-line py-4 pl-4">
                <dt className="eyebrow text-muted">{projects.length > 0 ? "Published projects" : "Category"}</dt>
                <dd className="mt-1.5 text-[0.95rem]">
                  {projects.length > 0 ? (
                    pad(projects.length)
                  ) : product.category ? (
                    <Link href={`/products?category=${product.category.slug}`} className="link-underline">
                      {product.category.name}
                    </Link>
                  ) : (
                    "Catalogue"
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={`/contact?category=${encodeURIComponent(product.division?.name || "Products")}&subject=${encodeURIComponent(product.name)}`} size="lg">
                Inquire about this product
              </Button>
              <Button href={`tel:${profile.phone_primary.replace(/\s/g, "")}`} variant="line" size="lg" arrow={false}>
                {profile.phone_primary}
              </Button>
            </div>
          </div>
        </div>
      </article>

      {projects.length > 0 ? (
        <section className="border-t border-line bg-white">
          <div className="shell py-24 lg:py-32">
            <Reveal>
              <SectionHeading index="01" label="Related projects" title="Where it was delivered" />
            </Reveal>
            <div className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:mt-20">
              {projects.map((project, index) => (
                <Reveal key={project.slug} delay={(index % 2) * 0.08}>
                  <ProjectCard project={project} index={pad(index + 1)} ratio="aspect-[16/10]" sizes="(min-width: 768px) 45vw, 100vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="border-t border-line bg-paper">
          <div className="shell py-24 lg:py-32">
            <Reveal>
              <SectionHeading
                index={projects.length > 0 ? "02" : "01"}
                label="Related products"
                title={product.category ? `More in ${product.category.name}` : "More products"}
                action={product.category ? { href: `/products?category=${product.category.slug}`, label: "View category" } : undefined}
              />
            </Reveal>
            {related.length < 3 ? (
              <div className="mt-16 lg:mt-20">
                <ProductRows products={related} numbers={Object.fromEntries(all.map((item, index) => [item.slug, index + 1]))} />
              </div>
            ) : (
              <ul className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
                {related.map((item) => (
                  <li key={item.slug}>
                    <ProductCard product={item} index={all.findIndex((entry) => entry.slug === item.slug) + 1} />
                  </li>
                ))}
                <GridFill count={related.length} cols={{ sm: 2, lg: 4 }} />
              </ul>
            )}
          </div>
        </section>
      ) : null}

      <InquiryBand />
    </>
  );
}
