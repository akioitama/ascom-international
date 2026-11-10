import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/site/photo";
import { getIndustries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industries",
  description: "Industries connected to published ASCOM International work.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  const industries = getIndustries();
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-14">
      <h1 className="font-display text-5xl font-semibold">Industries</h1>
      <p className="mt-4 max-w-2xl text-muted">Each industry is tied to a published activity or a named project. A logo on its own is not treated as a contract.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {industries.map((industry) => (
          <Link key={industry.slug} href={`/industries/${industry.slug}`} className="overflow-hidden border border-line bg-white">
            <Photo src={industry.image} alt={industry.name} company={industry.image_is_company_photo} className="h-56" />
            <div className="p-5">
              <h2 className="font-display text-2xl font-semibold">{industry.name}</h2>
              <p className="mt-2 text-sm text-muted">{industry.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
