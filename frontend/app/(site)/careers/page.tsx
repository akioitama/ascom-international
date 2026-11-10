import type { Metadata } from "next";
import Link from "next/link";
import { getCompany, getJobs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description: "Careers at ASCOM International. Send a CV to the HR team in Lahore.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  const jobs = getJobs();
  const { profile, values } = getCompany();
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">Careers</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Work with the ASCOM team</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8">
        ASCOM says its strength is its people, and it recruits against the same values published on the about page. Signage media work is dated from 2018. There is no open vacancy on the current website.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <article key={value.id} className="border-t border-navy pt-3">
            <h2 className="font-semibold">{value.title}</h2>
            <p className="mt-2 text-sm text-muted">{value.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-12 border border-line bg-white p-6">
        <h2 className="font-display text-3xl font-semibold">Vacancies</h2>
        {jobs.length === 0 ? (
          <p className="mt-4 text-muted">
            No vacancy is open. Send a CV to <a className="text-blue" href={`mailto:${profile.email_careers}`}>{profile.email_careers}</a>. You can also call {profile.phone_primary}.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {jobs.map((job) => (
              <li key={job.slug} className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted">{job.location}</p>
                </div>
                <Link href={`/careers/${job.slug}`} className="text-sm font-semibold text-blue">
                  View role
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
