import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { Chip } from "@/components/site/chip";
import { GridFill } from "@/components/site/grid-fill";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { getResources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description: "Documents and the code of conduct from ASCOM International.",
  alternates: { canonical: "/resources" },
};

const GROUPS = ["Governance", "Company profile", "Brochures", "Technical catalogues", "Specifications", "Safety documentation", "News", "Articles", "Case studies", "Certifications"];

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const resources = getResources(params.category);
  const all = getResources();
  return (
    <>
      <PageHero
        variant="plain"
        kicker="Resources"
        title={
          <>
            Resource <span className="text-ink/50">centre.</span>
          </>
        }
        text="Company documents and policies. The code of conduct is available to read in full."
        crumbs={[{ href: "/", label: "Home" }, { label: "Resources" }]}
      />
      <section className="bg-foam">
        <div className="border-b border-line">
          <div className="shell no-scrollbar flex gap-2 overflow-x-auto py-4 lg:flex-wrap">
            <Chip href="/resources" active={!params.category} count={all.length}>
              All
            </Chip>
            {GROUPS.map((group) => (
              <Chip key={group} href={`/resources?category=${encodeURIComponent(group)}`} active={params.category === group} count={all.filter((item) => item.category === group).length}>
                {group}
              </Chip>
            ))}
          </div>
        </div>
        <div className="shell py-14 lg:py-20">
          {resources.length === 0 ? (
            <div className="border border-dashed border-ink/20 bg-white px-8 py-16 text-center">
              <FileText className="mx-auto h-8 w-8 text-blue" strokeWidth={1.25} aria-hidden />
              <p className="mt-5 text-xl font-medium tracking-tight">No document has been uploaded in this category yet.</p>
              <Link href="/resources" className="link-underline mt-3 inline-block text-sm text-muted">
                Show all resources
              </Link>
            </div>
          ) : (
            <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
              {resources.map((resource) => (
                <li key={resource.slug} className="flex flex-col bg-white p-8 lg:p-10">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center bg-navy text-bright">
                      <FileText className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <p className="eyebrow text-blue">{resource.category}</p>
                  </div>
                  <h2 className="mt-12 text-[1.75rem] font-medium leading-tight tracking-tight">{resource.title}</h2>
                  <p className="mt-3 max-w-lg text-[0.95rem] leading-7 text-muted">{resource.summary}</p>
                  <div className="mt-auto flex flex-wrap gap-6 pt-10 text-sm font-medium">
                    <Link href={resource.slug === "code-of-conduct" ? "/code-of-conduct" : `/resources#${resource.slug}`} className="group/read inline-flex items-center gap-2 border-b border-ink/25 pb-1 transition-colors hover:border-ink">
                      Read
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/read:translate-x-1" strokeWidth={1.75} aria-hidden />
                    </Link>
                    {resource.file_url ? (
                      <a href={resource.file_url} className="inline-flex items-center gap-2 border-b border-ink/25 pb-1 transition-colors hover:border-ink">
                        Download
                        <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
              <GridFill count={resources.length} cols={{ md: 2 }} />
            </ul>
          )}
        </div>
      </section>
      <InquiryBand />
    </>
  );
}
