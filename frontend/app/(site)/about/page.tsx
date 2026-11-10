import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Compass, MessageSquare, RefreshCw, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/site/photo";
import { Prose } from "@/components/site/prose";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getCompany, getDivisions } from "@/lib/content";
import { numberWord, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: "ASCOM International is a Lahore company working across engineering, manufacturing, construction, signage and road safety.",
  alternates: { canonical: "/about" },
};

const valueIcons: Record<string, LucideIcon> = {
  refresh: RefreshCw,
  compass: Compass,
  badge: BadgeCheck,
  users: Users,
  message: MessageSquare,
  shield: ShieldCheck,
};

export default function AboutPage() {
  const { profile, values } = getCompany();
  const divisions = getDivisions();
  const [first, ...rest] = profile.legal_name.split(" ");
  const office = profile.head_office_address.split(",").slice(1, 3).join(",").trim();

  return (
    <>
      <PageHero
        variant="split"
        kicker="About ASCOM"
        title={
          <>
            {first} {rest.length ? <span className="text-white/45">{rest.join(" ")}</span> : null}
          </>
        }
        text={profile.summary}
        image="/media/projects/sundar-prefabricated-site/01.jpg"
        alt="Crew at the prefabricated site at Sundar Industrial Estate."
        crumbs={[{ href: "/", label: "Home" }, { label: "About Us" }]}
        facts={[
          { label: "Head office", value: office || "Lahore, Pakistan" },
          { label: "Factory", value: "Sundar Industrial Estate" },
          { label: "Signage media", value: `Since ${profile.signage_since_year}` },
          { label: "Business divisions", value: pad(divisions.length) },
        ]}
      />

      <section className="bg-foam">
        <div className="shell grid gap-12 py-24 lg:grid-cols-12 lg:gap-6 lg:py-32">
          <div className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-3 text-muted">
              <span className="text-blue">(01)</span>
              <span>The company</span>
            </p>
          </div>
          <Reveal className="lg:col-span-7">
            <Prose text={profile.about} lead />
          </Reveal>
        </div>
      </section>

      {profile.mission || profile.vision ? (
        <section className="relative isolate overflow-hidden bg-navy text-white">
          <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
          <div className="shell grid py-24 lg:grid-cols-2 lg:py-32">
            {[
              { label: "Mission", index: "02", text: profile.mission },
              { label: "Vision", index: "03", text: profile.vision },
            ]
              .filter((item) => item.text)
              .map((item, index) => (
                <Reveal key={item.label} delay={index * 0.1} className={index === 1 ? "border-white/12 pt-14 max-lg:border-t lg:border-l lg:pl-14 lg:pt-0" : "lg:pr-14"}>
                  <p className="eyebrow flex items-center gap-3 text-white/55">
                    <span className="text-bright">({item.index})</span>
                    <span>{item.label}</span>
                  </p>
                  <p className="mt-8 text-[clamp(1.5rem,1.1rem+1.3vw,2.4rem)] font-medium leading-[1.2] tracking-[-0.025em]">{item.text}</p>
                </Reveal>
              ))}
          </div>
        </section>
      ) : null}

      <section className="bg-paper">
        <div className="shell py-24 lg:py-32">
          <Reveal>
            <SectionHeading
              index="04"
              label="Values"
              title={
                <>
                  {numberWord(values.length)} values, <span className="text-ink/50">one way of working.</span>
                </>
              }
            />
          </Reveal>
          <Reveal className="mt-16 lg:mt-20">
            <ol className="grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, index) => {
                const Icon = valueIcons[value.icon_key] ?? ShieldCheck;
                return (
                  <li key={value.id} className="flex flex-col bg-paper p-6 transition-colors duration-500 hover:bg-white lg:p-10">
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center border border-ink/15 text-blue">
                        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="eyebrow text-muted">{pad(index + 1)}</span>
                    </div>
                    <h3 className="mt-14 text-2xl font-medium tracking-tight">{value.title}</h3>
                    <p className="mt-3 text-[0.975rem] leading-7 text-muted">{value.description}</p>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="shell grid gap-14 py-24 lg:grid-cols-12 lg:gap-6 lg:py-32">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-muted">
              <span className="text-blue">(05)</span>
              <span>Where we work</span>
            </p>
            <h2 className="mt-6 text-headline font-medium">
              Head office and factory, <span className="text-ink/50">both in Lahore.</span>
            </h2>
            <dl className="mt-12 border-t border-line">
              <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr]">
                <dt className="eyebrow pt-1 text-muted">Head office</dt>
                <dd className="text-[1.05rem] leading-7">{profile.head_office_address}</dd>
              </div>
              <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr]">
                <dt className="eyebrow pt-1 text-muted">Factory</dt>
                <dd className="text-[1.05rem] leading-7">{profile.factory_address}</dd>
              </div>
              <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr]">
                <dt className="eyebrow pt-1 text-muted">Hours</dt>
                <dd className="text-[1.05rem] leading-7">
                  {profile.hours_weekday}
                  <br />
                  {profile.hours_sunday}
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <Photo
              src="/media/projects/water-trailer/04.jpg"
              alt="Tank fabrication for the water trailer project, from ASCOM's published project photographs."
              frame
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3]"
            />
            <p className="eyebrow mt-4 flex gap-3 text-muted">
              <span className="text-blue">Fig. 01</span>
              <span>Tank fabrication, water trailer project</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-foam">
        <div className="shell py-20 lg:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="eyebrow flex items-center gap-3 text-muted">
              <span className="text-blue">(06)</span>
              <span>Businesses</span>
            </p>
            <Link href="/businesses" className="link-underline w-fit text-sm font-medium">
              All businesses
            </Link>
          </div>
          <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {divisions.map((division, index) => (
              <li key={division.slug}>
                <Link href={`/businesses/${division.slug}`} className="group flex h-full items-center justify-between gap-6 bg-white px-6 py-6 transition-colors hover:bg-paper">
                  <span className="flex items-baseline gap-4">
                    <span className="eyebrow text-muted">{pad(index + 1)}</span>
                    <span className="text-lg font-medium tracking-tight transition-colors group-hover:text-blue">{division.name}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/30 transition-[transform,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue" strokeWidth={1.5} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <InquiryBand />
    </>
  );
}
