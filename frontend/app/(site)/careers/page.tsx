import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { getCompany, getJobs } from "@/lib/content";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Careers",
  description: "Careers at ASCOM International. Send a CV to the HR team in Lahore.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  const jobs = getJobs();
  const { profile, values } = getCompany();
  return (
    <>
      <PageHero
        variant="plain"
        kicker="Careers"
        title={
          <>
            Work with <span className="text-ink/50">the ASCOM team.</span>
          </>
        }
        text="ASCOM's strength is its people, and the company recruits against the same values it works by. There is no open vacancy at the moment, but CVs are always welcome."
        crumbs={[{ href: "/", label: "Home" }, { label: "Careers" }]}
        facts={[
          { label: "Open vacancies", value: pad(jobs.length) },
          { label: "Apply by email", value: profile.email_careers },
          { label: "Based in", value: "Lahore, Pakistan" },
        ]}
      >
        <Button href={`mailto:${profile.email_careers}`} variant="dark" size="lg">
          Send your CV
        </Button>
      </PageHero>

      <section className="bg-foam">
        <div className="shell py-24 lg:py-32">
          <Reveal>
            <SectionHeading
              index="01"
              label="What we look for"
              title={
                <>
                  The values <span className="text-ink/50">we recruit against.</span>
                </>
              }
            />
          </Reveal>
          <ol className="mt-16 grid gap-x-10 border-t border-line md:grid-cols-2 lg:mt-20">
            {values.map((value, index) => (
              <li key={value.id} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7">
                <span className="eyebrow pt-1.5 text-blue">{pad(index + 1)}</span>
                <div>
                  <h3 className="text-xl font-medium tracking-tight">{value.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-muted">{value.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="shell py-24 lg:py-32">
          <Reveal>
            <SectionHeading index="02" label="Vacancies" title={jobs.length ? "Open roles" : "No vacancy is open right now."} />
          </Reveal>
          {jobs.length === 0 ? (
            <Reveal className="mt-16 lg:mt-20">
              <div className="grid gap-10 border border-line bg-paper p-8 lg:grid-cols-12 lg:gap-6 lg:p-12">
                <p className="text-lead text-ink lg:col-span-6">
                  Send a CV to the HR team and it will be kept for the next opening. You can also call the office on {profile.phone_primary}.
                </p>
                <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:col-start-8 lg:justify-end">
                  <Button href={`mailto:${profile.email_careers}`} size="lg">
                    {profile.email_careers}
                  </Button>
                  <Button href={`tel:${profile.phone_primary.replace(/\s/g, "")}`} variant="line" size="lg" arrow={false}>
                    {profile.phone_primary}
                  </Button>
                </div>
              </div>
            </Reveal>
          ) : (
            <ul className="mt-16 border-t border-line lg:mt-20">
              {jobs.map((job) => (
                <li key={job.slug} className="border-b border-line">
                  <Link href={`/careers/${job.slug}`} className="group grid gap-2 py-7 md:grid-cols-12 md:items-center md:gap-6">
                    <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-blue md:col-span-6">{job.title}</h3>
                    <p className="text-muted md:col-span-3">{job.department}</p>
                    <p className="text-muted md:col-span-2">{job.location}</p>
                    <ArrowUpRight className="hidden h-5 w-5 justify-self-end text-ink/50 transition-colors group-hover:text-blue md:col-span-1 md:block" strokeWidth={1.5} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
