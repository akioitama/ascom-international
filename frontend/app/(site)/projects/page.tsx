import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Chip } from "@/components/site/chip";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { getDivisions, getProjects } from "@/lib/content";
import { cn, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects published by ASCOM International, including firefighting vehicles, vehicle bodies, cycle boats and a prefabricated site.",
  alternates: { canonical: "/projects" },
};

function query(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const value = search.toString();
  return value ? `/projects?${value}` : "/projects";
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const projects = getProjects({ q: params.q, division: params.division });
  const all = getProjects();
  const divisions = getDivisions().filter((division) => all.some((project) => project.division?.slug === division.slug));
  const filtered = Boolean(params.q || params.division);
  const [lead, ...rest] = projects;
  const photographs = all.reduce((total, project) => total + (project.images?.length ?? 0), 0);
  const clients = new Set(all.map((project) => project.client_name).filter(Boolean));

  return (
    <>
      <PageHero
        variant="plain"
        kicker="Portfolio"
        title={
          <>
            Projects, <span className="text-ink/50">from the published galleries.</span>
          </>
        }
        text="Vehicles, equipment, branding and site work, each shown with the photographs from its project page."
        crumbs={[{ href: "/", label: "Home" }, { label: "Projects" }]}
        facts={[
          { label: "Projects", value: pad(all.length) },
          { label: "Photographs", value: pad(photographs) },
          { label: "Businesses", value: pad(divisions.length) },
          { label: "Clients named", value: pad(clients.size) },
        ]}
      />

      <section className="bg-foam">
        <div className="sticky top-[64px] z-30 border-b border-line bg-foam/90 backdrop-blur-xl lg:top-[76px]">
          <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:px-0">
              <Chip href={query({ q: params.q })} active={!params.division} count={all.length}>
                All
              </Chip>
              {divisions.map((division) => (
                <Chip key={division.slug} href={query({ q: params.q, division: division.slug })} active={params.division === division.slug} count={all.filter((project) => project.division?.slug === division.slug).length}>
                  {division.name}
                </Chip>
              ))}
            </div>
            <form action="/projects" className="flex w-full shrink-0 items-center border border-line bg-white focus-within:border-ink/50 lg:w-80">
              {params.division ? <input type="hidden" name="division" value={params.division} /> : null}
              <label className="sr-only" htmlFor="q">
                Search projects
              </label>
              <Search className="ml-4 h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
              <input id="q" name="q" defaultValue={params.q || ""} placeholder="Search projects" className="h-10 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted/80" />
              <button type="submit" className="h-10 shrink-0 border-l border-line px-4 text-[0.8125rem] font-medium transition-colors hover:bg-navy hover:text-white">
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="shell py-14 lg:py-24">
          {filtered ? (
            <div className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <p>
                <span className="font-medium text-ink">{projects.length}</span> {projects.length === 1 ? "project" : "projects"}
                {params.q ? (
                  <>
                    {" "}
                    matching <span className="text-ink">&ldquo;{params.q}&rdquo;</span>
                  </>
                ) : null}
              </p>
              <Link href="/projects" className="link-underline text-ink">
                Clear filters
              </Link>
            </div>
          ) : null}

          {projects.length === 0 ? (
            <div className="border border-dashed border-ink/20 bg-white px-8 py-16 text-center">
              <p className="text-xl font-medium tracking-tight">No projects match that search.</p>
              <p className="mt-2 text-sm text-muted">Try another word, or show all projects.</p>
            </div>
          ) : null}

          {lead ? (
            <Reveal>
              <Link href={`/projects/${lead.slug}`} className="group grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
                <div className="relative aspect-[16/10] overflow-hidden bg-mist lg:col-span-8">
                  <Photo src={lead.cover_image} alt={lead.title} zoom priority sizes="(min-width: 1024px) 62vw, 100vw" className="absolute inset-0" />
                </div>
                <div className="lg:col-span-4 lg:pb-2 lg:pl-4">
                  <p className="eyebrow flex flex-wrap gap-x-3 text-muted">
                    <span className="text-blue">01</span>
                    <span>{lead.division?.name}</span>
                    {lead.client_name ? <span className="text-muted/70">/ {lead.client_name}</span> : null}
                  </p>
                  <h2 className="mt-5 text-headline font-medium transition-colors duration-300 group-hover:text-blue">{lead.title}</h2>
                  <p className="mt-5 text-lead text-muted">{lead.summary}</p>
                  <span className="mt-8 inline-flex items-center gap-3 border-b border-ink/25 pb-1 text-sm font-medium transition-colors group-hover:border-ink">
                    View Project
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ) : null}

          {rest.length > 0 ? (
            <div className="mt-20 grid gap-x-6 gap-y-16 md:grid-cols-2 md:pb-28 lg:mt-28 lg:gap-x-10">
              {rest.map((project, index) => (
                <Reveal key={project.slug} delay={(index % 2) * 0.08}>
                  <div className={cn(index % 2 === 1 && "md:translate-y-28")}>
                    <ProjectCard project={project} index={pad(index + 2)} ratio="aspect-[4/3]" sizes="(min-width: 768px) 45vw, 100vw" />
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <InquiryBand />
    </>
  );
}
