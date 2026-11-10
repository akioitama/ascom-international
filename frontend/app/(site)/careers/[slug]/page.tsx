import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Prose } from "@/components/site/prose";
import { Button } from "@/components/ui/button";
import { getCompany, getJob } from "@/lib/content";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return { title: "Vacancy" };
  return { title: job.seo_title || job.title, description: job.seo_description || job.title, alternates: { canonical: `/careers/${slug}` } };
}

export default async function JobPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();
  const { profile } = getCompany();
  return (
    <>
      <PageHero
        variant="plain"
        kicker={job.department || "Careers"}
        title={job.title}
        text={job.location}
        crumbs={[{ href: "/", label: "Home" }, { href: "/careers", label: "Careers" }, { label: job.title }]}
      />
      <article className="bg-foam">
        <div className="shell grid gap-12 py-24 lg:grid-cols-12 lg:gap-6 lg:py-32">
          <div className="lg:col-span-7 lg:col-start-4">
            <Prose text={job.description} lead />
            <div className="mt-14 flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.95rem] text-muted">Apply by emailing the HR team.</p>
              <Button href={`mailto:${profile.email_careers}?subject=${encodeURIComponent(job.title)}`} size="lg">
                {profile.email_careers}
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
