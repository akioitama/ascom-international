import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Gallery } from "@/components/site/gallery";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero, type Fact } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { ProductRows } from "@/components/site/product-rows";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getProducts, getProject, getProjects } from "@/lib/content";
import { pad } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return { title: project.seo_title || project.title, description: project.seo_description || project.summary, alternates: { canonical: `/projects/${slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const all = getProjects();
  const position = all.findIndex((item) => item.slug === slug);
  const next = all[(position + 1) % all.length];
  const images = project.images ?? [];
  const products = getProducts().filter((item) => project.products?.some((entry) => entry.slug === item.slug));
  const catalogue = getProducts();
  const facts: Fact[] = [
    {
      label: "Business",
      value: project.division ? (
        <Link href={`/businesses/${project.division.slug}`} className="link-underline">
          {project.division.name}
        </Link>
      ) : (
        "ASCOM International"
      ),
    },
    ...(project.client_name ? [{ label: "Named on the project page", value: project.client_name }] : []),
    ...(project.location ? [{ label: "Location as published", value: project.location }] : []),
    { label: "Photographs", value: pad(images.length) },
  ];

  return (
    <>
      <PageHero
        variant="cover"
        kicker={project.division?.name || "Project"}
        index={`${pad(position + 1)} / ${pad(all.length)}`}
        title={project.title}
        text={project.summary}
        image={project.cover_image}
        alt={images[0]?.alt || project.title}
        crumbs={[{ href: "/", label: "Home" }, { href: "/projects", label: "Projects" }, { label: project.title }]}
        facts={facts}
      />

      <section className="bg-foam">
        <div className="shell grid gap-12 py-24 lg:grid-cols-12 lg:gap-6 lg:py-32">
          <div className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-3 text-muted">
              <span className="text-blue">(01)</span>
              <span>Project record</span>
            </p>
          </div>
          <Reveal className="lg:col-span-7">
            <Prose text={project.description} lead />
          </Reveal>
        </div>
      </section>

      {images.length > 0 ? (
        <section className="border-t border-line bg-white">
          <div className="shell py-24 lg:py-32">
            <Reveal>
              <SectionHeading index="02" label="Gallery" title={`${pad(images.length)} photographs`} intro="From the project page. Select a photograph to view it full screen." />
            </Reveal>
            <div className="mt-16 lg:mt-20">
              <Gallery images={images} title={project.title} />
            </div>
          </div>
        </section>
      ) : null}

      {products.length > 0 ? (
        <section className="border-t border-line bg-paper">
          <div className="shell py-24 lg:py-32">
            <Reveal>
              <SectionHeading index="03" label="Related products" title="In the catalogue" action={{ href: "/products", label: "Full catalogue" }} />
            </Reveal>
            <div className="mt-16 lg:mt-20">
              <ProductRows products={products} numbers={Object.fromEntries(catalogue.map((item, index) => [item.slug, index + 1]))} />
            </div>
          </div>
        </section>
      ) : null}

      {next && next.slug !== project.slug ? (
        <Link href={`/projects/${next.slug}`} className="group relative isolate block overflow-hidden bg-navy text-white">
          <Photo src={next.cover_image} alt="" zoom sizes="100vw" className="absolute inset-0 -z-20" imgClassName="opacity-70" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/75 to-navy/25" />
          <div className="shell flex min-h-[360px] flex-col justify-end py-14 lg:min-h-[420px] lg:py-20">
            <p className="eyebrow flex items-center gap-3 text-white/60">
              <span className="inline-block h-px w-8 bg-bright" />
              Next project
            </p>
            <div className="mt-6 flex items-end justify-between gap-8">
              <div>
                <p className="text-headline font-medium">{next.title}</p>
                <p className="mt-3 text-white/60">{next.division?.name}</p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center border border-white/30 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                <ArrowRight className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
              </span>
            </div>
          </div>
        </Link>
      ) : null}

      <InquiryBand />
    </>
  );
}
