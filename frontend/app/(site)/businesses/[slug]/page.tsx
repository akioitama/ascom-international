import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/site/crumbs";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Prose } from "@/components/site/prose";
import { getDivision } from "@/lib/content";

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
  return (
    <>
      <PageHero kicker="Business" title={division.name} text={division.summary} image={division.hero_image} alt={division.hero_caption || division.name} company={division.hero_is_company_photo} />
      <article className="mx-auto max-w-[1100px] px-5 py-14">
        <Crumbs items={[{ href: "/", label: "Home" }, { href: "/businesses", label: "Businesses" }, { label: division.name }]} />
        <Prose text={division.body} />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {division.offerings?.map((offering) => (
            <article key={offering.id} className="border border-line bg-white p-5">
              <h2 className="font-display text-xl font-semibold">{offering.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{offering.description}</p>
            </article>
          ))}
        </div>
      </article>
      {division.projects && division.projects.length > 0 ? (
        <section className="bg-paper">
          <div className="mx-auto max-w-[1100px] px-5 py-14">
            <h2 className="font-display text-3xl font-semibold">Related projects</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {division.projects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="bg-white">
                  <Photo src={project.cover_image} alt={project.title} className="h-56" />
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold">{project.title}</h3>
                    <p className="mt-2 text-sm text-muted">{project.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <InquiryBand />
    </>
  );
}
