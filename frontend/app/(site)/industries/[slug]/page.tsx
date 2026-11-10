import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/site/crumbs";
import { InquiryBand } from "@/components/site/inquiry-band";
import { Photo } from "@/components/site/photo";
import { Plate } from "@/components/site/plate";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import { getIndustries, getIndustry } from "@/lib/content";
import { industryIcon } from "@/lib/icons";
import { pad } from "@/lib/utils";

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
  const industries = getIndustries();
  const position = industries.findIndex((item) => item.slug === slug);
  const Icon = industryIcon(industry.slug);

  return (
    <>
      <article className="bg-foam">
        <div className="shell pt-8 lg:pt-10">
          <Crumbs items={[{ href: "/", label: "Home" }, { href: "/industries", label: "Industries" }, { label: industry.name }]} />
        </div>
        <div className="shell grid gap-12 pb-24 pt-14 lg:grid-cols-12 lg:gap-6 lg:pb-32 lg:pt-24">
          <div className="lg:col-span-6">
            <p className="eyebrow flex animate-rise items-center gap-3 text-muted">
              <span className="inline-block h-px w-8 bg-blue" />
              <span className="text-blue">
                ({pad(position + 1)} / {pad(industries.length)})
              </span>
              <span>Industry</span>
            </p>
            <h1 className="mt-6 animate-rise text-display font-medium [animation-delay:80ms]">{industry.name}</h1>
            <p className="mt-8 max-w-xl animate-rise text-lead text-muted [animation-delay:160ms]">{industry.summary}</p>
            <Reveal className="mt-14 border-t border-line pt-10">
              <Prose text={industry.body} />
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-28">
              <Photo
                src={industry.image}
                alt={industry.image_caption || industry.name}
                company={industry.image_is_company_photo}
                priority
                frame
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] animate-fade-in"
                fallback={<Plate icon={Icon} tone="dark" label={industry.name} index={pad(position + 1)} className="absolute inset-0" />}
              />
              {industry.image_caption ? <p className="mt-4 text-sm leading-6 text-muted">{industry.image_caption}</p> : null}
            </div>
          </div>
        </div>
      </article>

      <nav aria-label="Other industries" className="border-t border-line bg-white">
        <div className="shell py-20 lg:py-24">
          <p className="eyebrow text-muted">Other industries</p>
          <ul className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-[clamp(1.35rem,1rem+1.2vw,2.1rem)] font-medium leading-snug tracking-[-0.03em]">
            {industries.map((item, index) => (
              <li key={item.slug} className="flex items-baseline gap-3">
                {item.slug === industry.slug ? (
                  <span aria-current="page" className="text-ink/25">
                    {item.name}
                  </span>
                ) : (
                  <Link href={`/industries/${item.slug}`} className="link-underline transition-colors hover:text-blue">
                    {item.name}
                  </Link>
                )}
                {index < industries.length - 1 ? (
                  <span aria-hidden className="text-ink/15">
                    /
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <InquiryBand />
    </>
  );
}
