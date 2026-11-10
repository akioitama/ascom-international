import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GridFill } from "@/components/site/grid-fill";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { ProductCard } from "@/components/site/product-card";
import { ProductRows } from "@/components/site/product-rows";
import { ProjectCard } from "@/components/site/project-card";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getDivision, getDivisions, getProducts } from "@/lib/content";
import { pad } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const division = getDivision(slug);
  if (!division) return { title: "Business" };
  return { title: division.seo_title || division.name, description: division.seo_description || division.summary, alternates: { canonical: `/businesses/${slug}` } };
}

export default async function DivisionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const division = getDivision(slug);
  if (!division) notFound();
  const divisions = getDivisions();
  const position = divisions.findIndex((item) => item.slug === slug);
  const previous = divisions[(position - 1 + divisions.length) % divisions.length];
  const next = divisions[(position + 1) % divisions.length];
  const products = getProducts({ division: slug });
  const catalogue = getProducts();
  const offerings = division.offerings ?? [];
  const projects = division.projects ?? [];

  return (
    <>
      <PageHero
        variant="cover"
        kicker="Business"
        index={`${pad(position + 1)} / ${pad(divisions.length)}`}
        title={division.name}
        text={division.summary}
        image={division.hero_image}
        alt={division.hero_caption || division.name}
        company={division.hero_is_company_photo}
        crumbs={[{ href: "/", label: "Home" }, { href: "/businesses", label: "Businesses" }, { label: division.name }]}
        facts={[
          { label: "Services listed", value: pad(offerings.length) },
          { label: "Published projects", value: pad(projects.length) },
          { label: "Catalogue items", value: pad(products.length) },
          { label: "Photograph", value: division.hero_is_company_photo ? "ASCOM project photography" : "Atmospheric photograph" },
        ]}
      />

      <section className="bg-foam">
        <div className="shell grid gap-12 py-24 lg:grid-cols-12 lg:gap-6 lg:py-32">
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow flex items-center gap-3 text-muted">
                <span className="text-blue">(01)</span>
                <span>Overview</span>
              </p>
              {division.hero_caption ? <p className="mt-6 max-w-xs text-sm leading-6 text-muted">{division.hero_caption}</p> : null}
            </div>
          </div>
          <Reveal className="lg:col-span-7">
            <Prose text={division.body} lead />
          </Reveal>
        </div>
      </section>

      {offerings.length > 0 ? (
        <section className="border-t border-line bg-white">
          <div className="shell py-24 lg:py-32">
            <Reveal>
              <SectionHeading
                index="02"
                label="Services"
                title={
                  <>
                    What {division.name} <span className="text-ink/50">covers.</span>
                  </>
                }
              />
            </Reveal>
            <ol className="mt-16 grid gap-x-10 border-t border-line md:grid-cols-2 lg:mt-20">
              {offerings.map((offering, index) => (
                <li key={offering.id} className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7">
                  <span className="eyebrow pt-1.5 text-blue">{pad(index + 1)}</span>
                  <div>
                    <h3 className="text-xl font-medium tracking-tight">{offering.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-7 text-muted">{offering.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {projects.length > 0 ? (
        <section className="bg-paper">
          <div className="shell py-24 lg:py-32">
            <Reveal>
              <SectionHeading index="03" label="Related projects" title="Published work" action={{ href: `/projects?division=${division.slug}`, label: "All related projects" }} />
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

      {products.length > 0 ? (
        <section className="border-t border-line bg-white">
          <div className="shell py-24 lg:py-32">
            <Reveal>
              <SectionHeading
                index={projects.length > 0 ? "04" : "03"}
                label="Products & solutions"
                title="From the catalogue"
                action={{ href: `/products?division=${division.slug}`, label: `All ${products.length} items` }}
              />
            </Reveal>
            {products.length < 3 ? (
              <div className="mt-16 lg:mt-20">
                <ProductRows products={products} numbers={Object.fromEntries(catalogue.map((item, index) => [item.slug, index + 1]))} />
              </div>
            ) : (
              <ul className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
                {products.slice(0, 4).map((product) => (
                  <li key={product.slug}>
                    <ProductCard product={product} index={catalogue.findIndex((item) => item.slug === product.slug) + 1} />
                  </li>
                ))}
                <GridFill count={Math.min(products.length, 4)} cols={{ sm: 2, lg: 4 }} />
              </ul>
            )}
          </div>
        </section>
      ) : null}

      <nav aria-label="Other businesses" className="border-t border-line bg-foam">
        <div className="shell grid sm:grid-cols-2">
          <Link href={`/businesses/${previous.slug}`} className="group flex flex-col gap-3 border-line py-10 pr-6 sm:border-r lg:py-14">
            <span className="eyebrow flex items-center gap-2 text-muted">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" strokeWidth={1.75} aria-hidden />
              Previous business
            </span>
            <span className="text-2xl font-medium tracking-tight transition-colors group-hover:text-blue lg:text-3xl">{previous.name}</span>
          </Link>
          <Link href={`/businesses/${next.slug}`} className="group flex flex-col items-end gap-3 border-t border-line py-10 text-right sm:border-t-0 sm:pl-6 lg:py-14">
            <span className="eyebrow flex items-center gap-2 text-muted">
              Next business
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="text-2xl font-medium tracking-tight transition-colors group-hover:text-blue lg:text-3xl">{next.name}</span>
          </Link>
        </div>
      </nav>

      <InquiryBand />
    </>
  );
}
