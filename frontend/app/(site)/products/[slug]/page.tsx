import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/site/crumbs";
import { InquiryBand } from "@/components/site/inquiry-band";
import { Photo } from "@/components/site/photo";
import { Prose } from "@/components/site/prose";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

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
  const hasSpecs = (product.specs?.length ?? 0) > 0;
  const hasDocuments = (product.documents?.length ?? 0) > 0;
  const site = siteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    brand: { "@type": "Brand", name: "ASCOM International" },
    url: `${site}/products/${product.slug}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <Photo src={product.hero_image} alt={product.hero_caption || product.name} company={product.hero_is_company_photo} className="min-h-[360px]" priority />
        <div>
          <Crumbs items={[{ href: "/", label: "Home" }, { href: "/products", label: "Products" }, { label: product.name }]} />
          <p className="text-xs uppercase tracking-[0.16em] text-blue">{product.category?.name}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-lg text-muted">{product.summary}</p>
          <div className="mt-6">
            <Prose text={product.description} />
          </div>
          {product.verification_note ? <p className="mt-6 border-l-2 border-blue pl-4 text-sm text-muted">{product.verification_note}</p> : null}
          <Button href={`/contact?category=${encodeURIComponent(product.division?.name || "Products")}&subject=${encodeURIComponent(product.name)}`} className="mt-8">
            Inquire about this product
          </Button>
        </div>
      </article>
      {hasSpecs || hasDocuments ? (
        <section className="bg-paper">
          <div className={`mx-auto grid max-w-[1180px] gap-10 px-5 py-14 ${hasSpecs && hasDocuments ? "lg:grid-cols-2" : ""}`}>
            {hasSpecs ? (
              <div>
                <h2 className="font-display text-2xl font-semibold">Specifications</h2>
                <dl className="mt-4 divide-y divide-line border-y border-line">
                  {product.specs?.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-2 gap-4 py-3 text-sm">
                      <dt className="text-muted">{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            {hasDocuments ? (
              <div>
                <h2 className="font-display text-2xl font-semibold">Documents</h2>
                <ul className="mt-4 space-y-2">
                  {product.documents?.map((document) => (
                    <li key={document.id}>
                      <a className="text-blue" href={document.file_url}>
                        {document.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      {product.projects && product.projects.length > 0 ? (
        <section className="mx-auto max-w-[1180px] px-5 py-14">
          <h2 className="font-display text-2xl font-semibold">Related projects</h2>
          <ul className="mt-4 space-y-2">
            {product.projects.map((project) => (
              <li key={project.slug}>
                <Link className="text-blue" href={`/projects/${project.slug}`}>
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {product.related_products && product.related_products.length > 0 ? (
        <section className="mx-auto max-w-[1180px] px-5 pb-14">
          <h2 className="font-display text-2xl font-semibold">Related products</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {product.related_products.map((item) => (
              <Link key={item.slug} href={`/products/${item.slug}`} className="border border-line p-4 text-sm font-semibold">
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <InquiryBand />
    </>
  );
}
