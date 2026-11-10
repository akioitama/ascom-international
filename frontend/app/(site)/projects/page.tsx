import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/site/photo";
import { getDivisions, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects published by ASCOM International, including firefighting vehicles, vehicle bodies, cycle boats and a prefabricated site.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const projects = getProjects({ q: params.q, division: params.division });
  const divisions = getDivisions();
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">Portfolio</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Projects</h1>
      <form className="mt-8 flex flex-col gap-3 sm:flex-row" action="/projects">
        <label className="sr-only" htmlFor="q">Search projects</label>
        <input id="q" name="q" defaultValue={params.q || ""} placeholder="Search" className="border border-line bg-white px-3 py-3 sm:w-72" />
        <select name="division" defaultValue={params.division || ""} aria-label="Division" className="border border-line bg-white px-3 py-3">
          <option value="">All divisions</option>
          {divisions.map((division) => (
            <option key={division.slug} value={division.slug}>
              {division.name}
            </option>
          ))}
        </select>
        <button className="bg-navy px-5 py-3 text-sm font-semibold text-white" type="submit">
          Filter
        </button>
      </form>
      {projects.length === 0 ? <p className="mt-10">No projects match that search.</p> : null}
      <div className="mt-8 grid gap-6">
        {projects.map((project) => (
          <article key={project.slug} className="grid overflow-hidden border border-line bg-white lg:grid-cols-[1.2fr_0.8fr]">
            <Photo src={project.cover_image} alt={project.title} className="min-h-64" />
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-blue">{project.division?.name}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">{project.title}</h2>
              <p className="mt-3 text-muted">{project.summary}</p>
              <Link href={`/projects/${project.slug}`} className="mt-6 inline-block text-sm font-semibold text-blue">
                View Project
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
