import type { Metadata } from "next";
import Link from "next/link";
import { getResources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description: "Documents and the code of conduct published by ASCOM International.",
  alternates: { canonical: "/resources" },
};

const GROUPS = ["Governance", "Company profile", "Brochures", "Technical catalogues", "Specifications", "Safety documentation", "News", "Articles", "Case studies", "Certifications"];

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const resources = getResources(params.category);
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-14">
      <h1 className="font-display text-5xl font-semibold">Resources</h1>
      <p className="mt-4 max-w-2xl text-muted">Files appear here only when they have been uploaded. The code of conduct is the document currently published in full.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/resources" className="border border-line px-3 py-2 text-sm">
          All
        </Link>
        {GROUPS.map((group) => (
          <Link key={group} href={`/resources?category=${encodeURIComponent(group)}`} className="border border-line px-3 py-2 text-sm">
            {group}
          </Link>
        ))}
      </div>
      {resources.length === 0 ? <p className="mt-10 border border-dashed border-line p-8 text-sm">No document has been uploaded in this category yet.</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <article key={resource.slug} className="border border-line bg-white p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-blue">{resource.category}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">{resource.title}</h2>
            <p className="mt-3 text-sm text-muted">{resource.summary}</p>
            <div className="mt-4 flex gap-4 text-sm font-semibold">
              <Link href={resource.slug === "code-of-conduct" ? "/code-of-conduct" : `/resources#${resource.slug}`} className="text-blue">
                Read
              </Link>
              {resource.file_url ? (
                <a href={resource.file_url} className="text-blue">
                  Download
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
