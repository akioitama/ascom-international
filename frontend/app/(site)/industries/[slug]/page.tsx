import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/site/crumbs";
import { InquiryBand } from "@/components/site/inquiry-band";
import { Photo } from "@/components/site/photo";
import { Prose } from "@/components/site/prose";
import { getIndustry } from "@/lib/content";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Industry" };
  return { title: industry.seo_title || industry.name, description: industry.seo_description || industry.summary, alternates: { canonical: `/industries/${slug}` } };
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();
  return (
    <>
      <article className="mx-auto max-w-[1100px] px-5 py-14">
        <Crumbs items={[{ href: "/", label: "Home" }, { href: "/industries", label: "Industries" }, { label: industry.name }]} />
        <h1 className="font-display text-5xl font-semibold">{industry.name}</h1>
        <p className="mt-4 text-lg text-muted">{industry.summary}</p>
        <Photo src={industry.image} alt={industry.image_caption || industry.name} company={industry.image_is_company_photo} className="mt-8 min-h-80" />
        {industry.image_caption ? <p className="mt-3 text-sm text-muted">{industry.image_caption}</p> : null}
        <div className="mt-8">
          <Prose text={industry.body} />
        </div>
      </article>
      <InquiryBand />
    </>
  );
}
