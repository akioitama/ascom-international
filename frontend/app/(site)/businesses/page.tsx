import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { getDivisions } from "@/lib/content";
import { cn, numberWord, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Businesses",
  description: "ASCOM International businesses: creative solutions, construction, manufacturing, technology, engineering, road safety and vehicle customisation.",
  alternates: { canonical: "/businesses" },
};

const spans = [
  "lg:col-span-7 lg:h-[560px]",
  "lg:col-span-5 lg:h-[560px]",
  "lg:col-span-4 lg:h-[440px]",
  "lg:col-span-4 lg:h-[440px]",
  "lg:col-span-4 lg:h-[440px]",
  "lg:col-span-5 lg:h-[500px]",
  "lg:col-span-7 lg:h-[500px]",
  "lg:col-span-6 lg:h-[460px]",
  "lg:col-span-6 lg:h-[460px]",
];

export default function BusinessesPage() {
  const divisions = getDivisions();
  return (
    <>
      <PageHero
        variant="plain"
        kicker="Businesses"
        title={
          <>
            ASCOM&apos;s businesses, <span className="text-ink/50">each with its own practice.</span>
          </>
        }
        text={`${numberWord(divisions.length)} businesses. Each has its own page, with its services and projects.`}
        crumbs={[{ href: "/", label: "Home" }, { label: "Businesses" }]}
      />
      <section className="bg-foam">
        <div className="shell grid gap-4 py-16 lg:grid-cols-12 lg:py-24">
          {divisions.map((division, index) => (
            <Reveal key={division.slug} className={cn("aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto", spans[index] ?? "lg:col-span-6 lg:h-[460px]")} delay={(index % 3) * 0.06}>
              <Link href={`/businesses/${division.slug}`} className="group relative flex h-full flex-col justify-between overflow-hidden bg-navy p-6 text-white lg:p-8">
                <Photo
                  src={division.hero_image}
                  alt={division.hero_caption || division.name}
                  company={division.hero_is_company_photo}
                  zoom
                  tag="top-right"
                  sizes={index < 2 || index > 4 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                  className="absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/10 transition-opacity duration-700 group-hover:opacity-90" />
                <span className="eyebrow relative text-white/70">{pad(index + 1)}</span>
                <div className="relative">
                  <h2 className="max-w-md text-[1.9rem] font-medium leading-[1.05] tracking-tight lg:text-[2.4rem]">{division.name}</h2>
                  <div className="mt-4 flex items-end justify-between gap-8">
                    <p className="max-w-md text-sm leading-6 text-white/75">{division.summary}</p>
                    <span className="grid h-12 w-12 shrink-0 place-items-center border border-white/30 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <InquiryBand />
    </>
  );
}
