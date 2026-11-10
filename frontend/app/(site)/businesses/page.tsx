import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/site/photo";
import { getDivisions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Businesses",
  description: "ASCOM International businesses: creative solutions, construction, manufacturing, technology, engineering, road safety and vehicle customisation.",
  alternates: { canonical: "/businesses" },
};

export default function BusinessesPage() {
  const divisions = getDivisions();
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">Businesses</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold">The work ASCOM publishes, kept as separate practices.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {divisions.map((division) => (
          <Link key={division.slug} href={`/businesses/${division.slug}`} className="group grid overflow-hidden border border-line bg-white md:grid-cols-[0.8fr_1.2fr]">
            <Photo src={division.hero_image} alt={division.name} company={division.hero_is_company_photo} className="min-h-48" />
            <div className="p-6">
              <h2 className="font-display text-2xl font-semibold group-hover:text-blue">{division.name}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{division.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
