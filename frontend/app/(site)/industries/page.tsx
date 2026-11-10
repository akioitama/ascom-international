import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Plate } from "@/components/site/plate";
import { Reveal } from "@/components/site/reveal";
import { getIndustries } from "@/lib/content";
import { industryIcon } from "@/lib/icons";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Industries",
  description: "Industries connected to published ASCOM International work.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  const industries = getIndustries();
  return (
    <>
      <PageHero
        variant="plain"
        kicker="Industries"
        title={
          <>
            Industries served, <span className="text-ink/50">tied to published work.</span>
          </>
        }
        text="Each industry is tied to a published activity or a named project. A logo on its own is not treated as a contract."
        crumbs={[{ href: "/", label: "Home" }, { label: "Industries" }]}
      />
      <section className="bg-foam">
        <ul className="shell grid gap-x-6 gap-y-14 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:py-24">
          {industries.map((industry, index) => {
            const Icon = industryIcon(industry.slug);
            return (
              <li key={industry.slug}>
                <Reveal delay={(index % 3) * 0.06}>
                  <Link href={`/industries/${industry.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Photo
                        src={industry.image}
                        alt={industry.image_caption || industry.name}
                        company={industry.image_is_company_photo}
                        zoom
                        frame
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="absolute inset-0"
                        fallback={<Plate icon={Icon} label={industry.name} index={pad(index + 1)} className="absolute inset-0 transition-colors duration-500 group-hover:bg-mist" />}
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-6">
                      <div>
                        <p className="eyebrow text-blue">{pad(index + 1)}</p>
                        <h2 className="mt-2 text-[1.5rem] font-medium leading-tight tracking-tight transition-colors group-hover:text-blue">{industry.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-muted">{industry.summary}</p>
                      </div>
                      <ArrowUpRight className="mt-7 h-5 w-5 shrink-0 text-ink/30 transition-[transform,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue" strokeWidth={1.5} aria-hidden />
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>
      <InquiryBand />
    </>
  );
}
