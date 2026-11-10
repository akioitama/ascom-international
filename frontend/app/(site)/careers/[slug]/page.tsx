import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@/components/site/prose";
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
    <article className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.16em] text-blue">{job.department || "Careers"}</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">{job.title}</h1>
      <p className="mt-3 text-muted">{job.location}</p>
      <div className="mt-6">
        <Prose text={job.description} />
      </div>
      <p className="mt-10">
        Apply by emailing <a className="text-blue" href={`mailto:${profile.email_careers}`}>{profile.email_careers}</a>.
      </p>
    </article>
  );
}
