import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { isHeading, Prose, slug } from "@/components/site/prose";
import { Button } from "@/components/ui/button";
import { getResource } from "@/lib/content";
import { pad, paragraphs } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Code of conduct",
  description: "ASCOM International standards for ethical conduct, anti-bribery and raising a concern.",
  alternates: { canonical: "/code-of-conduct" },
};

export default async function ConductPage() {
  const resource = getResource("code-of-conduct");
  if (!resource) notFound();
  const headings = paragraphs(resource.body).filter(isHeading);
  return (
    <>
      <PageHero
        variant="plain"
        kicker="Governance"
        title={resource.title}
        text={resource.summary}
        crumbs={[{ href: "/", label: "Home" }, { href: "/resources", label: "Resources" }, { label: resource.title }]}
      />
      <article className="bg-foam">
        <div className="shell grid gap-12 py-20 lg:grid-cols-12 lg:gap-6 lg:py-28">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              {headings.length > 0 ? (
                <nav aria-label="On this page">
                  <p className="eyebrow text-muted">On this page</p>
                  <ol className="mt-5 border-t border-line">
                    {headings.map((heading, index) => (
                      <li key={heading} className="border-b border-line">
                        <a href={`#${slug(heading)}`} className="group flex items-baseline gap-3 py-3 text-[0.95rem] transition-colors hover:text-blue">
                          <span className="eyebrow text-muted/70 group-hover:text-blue">{pad(index + 1)}</span>
                          {heading}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}
              <div className="mt-10 border border-line bg-white p-6">
                <p className="text-[0.95rem] font-medium">Raise a concern</p>
                <p className="mt-2 text-sm leading-6 text-muted">Use the contact form and choose “Code of conduct”.</p>
                <Button href="/contact?category=Code%20of%20conduct" size="sm" className="mt-5">
                  Contact form
                </Button>
              </div>
            </div>
          </aside>
          <div className="lg:col-span-7 lg:col-start-5">
            <Prose text={resource.body} headings lead />
          </div>
        </div>
      </article>
    </>
  );
}
