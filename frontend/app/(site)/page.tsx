import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Cog, Factory, Layers, MapPin, ShieldCheck, Signpost, Truck, type LucideIcon } from "lucide-react";
import { DivisionIndex } from "@/components/site/division-index";
import { GridFill } from "@/components/site/grid-fill";
import { InquiryBand } from "@/components/site/inquiry-band";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { getHome, getProducts, getProjects } from "@/lib/content";
import type { HomePayload } from "@/lib/types";
import { cn, numberWord, pad, paragraphs } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Securing Trade, Safeguarding Every Journey.",
  description: "ASCOM International supplies signage, materials, equipment and road safety, and also manufactures, builds and supplies technology.",
  alternates: { canonical: "/" },
};

const factoryWork = [
  "Metal, plastic and electrical goods",
  "CNC machining and fabrication",
  "Injection molding and plastic processing",
  "Powder coating, polishing and plating",
  "Assembly, private labelling, OEM and ODM",
  "In-house quality testing and packaging",
];

function splitTitle(title: string) {
  const index = title.indexOf(", ");
  if (index < 0) return [title, ""] as const;
  return [title.slice(0, index + 1), title.slice(index + 2)] as const;
}

function reasonIcon(title: string): LucideIcon {
  const value = title.toLowerCase();
  if (value.includes("signage")) return Signpost;
  if (value.includes("discipline")) return Layers;
  if (value.includes("oem")) return Cog;
  if (value.includes("vehicle")) return Truck;
  if (value.includes("factory")) return MapPin;
  if (value.includes("manufactur")) return Factory;
  return ShieldCheck;
}

function coordinate(value: string | null, positive: string, negative: string) {
  const number = Number(value);
  if (!value || Number.isNaN(number)) return null;
  return `${Math.abs(number).toFixed(4)}° ${number >= 0 ? positive : negative}`;
}

export default function HomePage() {
  const { profile, settings, divisions, highlights, industries, organizations, statistics } = getHome();
  const byOrder = (a: { sort_order?: number }, b: { sort_order?: number }) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
  const reasons = highlights.filter((item) => item.group_key === "why").sort(byOrder);
  const clients = organizations.filter((item) => item.kind === "client");
  const registrations = organizations.filter((item) => item.kind === "registration");
  const [titleLead, titleRest] = splitTitle(settings.hero_title);
  const office = profile.head_office_address.split(",").slice(1, 3).join(",").trim();
  const latitude = coordinate(profile.map_factory_lat, "N", "S");
  const longitude = coordinate(profile.map_factory_lng, "E", "W");
  const facts = [
    { label: "Signage media since", value: String(profile.signage_since_year ?? "") },
    { label: "Business divisions", value: pad(divisions.length) },
    { label: "Documented projects", value: pad(getProjects().length) },
    { label: "Catalogued products and solutions", value: String(getProducts().length) },
    ...statistics.map((item) => ({ label: item.label, value: item.value })),
  ].filter((item) => item.value);
  const intro = paragraphs(settings.intro_body);
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy text-white lg:min-h-[max(760px,100svh)]">
        <Photo
          src="/media/brand/hero-journey.jpg"
          alt="Freight trucks on a lit highway beneath overhead sign panels. Homepage visual for trade and safer journeys, not one ASCOM project."
          priority
          grade={false}
          sizes="100vw"
          position="62% 50%"
          className="absolute inset-0 -z-20"
          imgClassName="animate-hero-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/60 to-navy/0" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/0 to-navy/60" />

        <div className="shell flex flex-1 flex-col justify-end pb-14 pt-[140px] lg:pb-20 lg:pt-[168px]">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-9 xl:col-span-8">
              <p className="eyebrow flex animate-rise items-center gap-3 text-white/70">
                <span className="inline-block h-px w-10 bg-bright" />
                {settings.hero_kicker}
              </p>
              <h1 className="mt-7 animate-rise text-display font-medium [animation-delay:120ms]">
                <span className="block">{titleLead}</span>
                {titleRest ? <span className="block text-white/55">{titleRest}</span> : null}
              </h1>
              <p className="mt-8 max-w-xl animate-rise text-lead text-white/75 [animation-delay:240ms]">{settings.hero_text}</p>
              <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
                <Button href="/businesses" variant="light" size="lg">
                  Explore Our Capabilities
                </Button>
                <Button href="/contact" variant="ghost" size="lg">
                  Contact Our Team
                </Button>
              </div>
            </div>
            <dl className="hidden animate-rise gap-6 border-l border-white/15 pl-6 [animation-delay:480ms] lg:col-span-3 lg:col-start-10 lg:grid xl:col-start-10">
              <div>
                <dt className="eyebrow text-white/45">Head office</dt>
                <dd className="mt-1.5 text-sm text-white/85">{office || "Lahore, Pakistan"}</dd>
              </div>
              <div>
                <dt className="eyebrow text-white/45">Factory</dt>
                <dd className="mt-1.5 text-sm text-white/85">Sundar Industrial Estate</dd>
              </div>
              <div>
                <dt className="eyebrow text-white/45">Signage media</dt>
                <dd className="mt-1.5 text-sm text-white/85">Since {profile.signage_since_year}</dd>
              </div>
            </dl>
          </div>
        </div>

        <nav aria-label="Businesses" className="relative border-t border-white/12 bg-navy/45 backdrop-blur-md">
          <ul className="shell no-scrollbar flex overflow-x-auto lg:grid lg:grid-cols-8 lg:overflow-visible">
            {divisions.map((division, index) => (
              <li key={division.slug} className={cn("shrink-0 lg:min-w-0", index > 0 && "border-l border-white/10")}>
                <Link
                  href={`/businesses/${division.slug}`}
                  className={cn("group flex h-full w-44 flex-col gap-2 py-5 transition-colors hover:bg-white/[0.04] lg:w-auto", index === 0 ? "pr-4" : "px-4")}
                >
                  <span className="eyebrow text-white/40 transition-colors group-hover:text-bright">{pad(index + 1)}</span>
                  <span className="text-[0.8125rem] font-medium leading-snug text-white/75 transition-colors group-hover:text-white">{division.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {facts.length > 0 ? (
        <section className="border-b border-line bg-white">
          <dl className={cn("shell grid grid-cols-2", facts.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={cn(
                  "flex flex-col-reverse justify-end gap-3 border-line py-8 lg:py-12",
                  index % 2 === 1 && "border-l pl-5 lg:pl-8",
                  index > 1 && "border-t lg:border-t-0",
                  index > 0 && "lg:border-l lg:pl-8",
                )}
              >
                <dt className="eyebrow text-muted">{fact.label}</dt>
                <dd className="text-[2.6rem] font-medium leading-none tracking-[-0.045em] text-ink lg:text-[3.75rem]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="bg-paper">
        <div className="shell py-20 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-6">
              <p className="eyebrow flex items-center gap-3 text-muted">
                <span className="text-blue">(01)</span>
                <span>{settings.intro_kicker}</span>
              </p>
              <h2 className="mt-6 max-w-2xl text-headline font-medium">{settings.intro_title}</h2>
            </Reveal>
            <Reveal className="lg:col-span-5 lg:col-start-8 lg:pt-10" delay={0.1}>
              <div className="space-y-5">
                {intro.map((paragraph, index) => (
                  <p key={paragraph.slice(0, 40)} className={index === 0 ? "text-lead text-ink" : "text-[1.0625rem] leading-[1.75] text-ink/70"}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button href="/about" variant="line" className="mt-8">
                Read More
              </Button>
            </Reveal>
          </div>

          {reasons.length > 0 ? (
            <Reveal className="mt-16 lg:mt-20">
              <h3 className="eyebrow text-ink">Why work with ASCOM</h3>
              <ul className="mt-5 grid grid-cols-2 gap-x-5 sm:gap-x-8 lg:grid-cols-3">
                {reasons.map((item) => {
                  const Icon = reasonIcon(item.title);
                  return (
                    <li key={item.id} className="flex flex-col gap-4 border-t border-ink/15 py-5 sm:flex-row sm:gap-5 sm:py-6">
                      <span className="grid h-10 w-10 shrink-0 place-items-center bg-white text-blue">
                        <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden />
                      </span>
                      <div>
                        <h4 className="text-[0.975rem] font-medium leading-snug tracking-tight sm:text-[1.0625rem]">{item.title}</h4>
                        <p className="mt-1.5 hidden text-sm leading-6 text-muted sm:block">{item.summary}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="shell py-20 lg:py-28">
          <DivisionIndex
            header={
              <Reveal>
                <SectionHeading
                  tone="dark"
                  index="02"
                  label="Businesses"
                  layout="stack"
                  className="lg:flex-col lg:items-start lg:justify-start"
                  title={
                    <>
                      {numberWord(divisions.length)} businesses, <span className="text-white/45">one company.</span>
                    </>
                  }
                  action={{ href: "/businesses", label: "All businesses" }}
                />
              </Reveal>
            }
            items={divisions.map((division) => ({
              slug: division.slug,
              name: division.name,
              summary: division.summary,
              image: division.hero_image,
              caption: division.hero_caption,
              company: division.hero_is_company_photo,
            }))}
          />
        </div>
      </section>

      <section className="bg-paper">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <SectionHeading
              index="03"
              label="Industries served"
              title={
                <>
                  From the public sector <span className="text-ink/50">to general industry.</span>
                </>
              }
              action={{ href: "/industries", label: "All industries" }}
            />
          </Reveal>
          <Reveal className="mt-12 lg:mt-14">
            <ul className="flex flex-col gap-y-2.5 border-t border-ink/15 pt-10 text-[clamp(1.35rem,0.8rem+1.75vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.035em] sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4 lg:pt-12">
              {industries.map((industry, index) => (
                <li key={industry.slug} className="flex items-baseline gap-4">
                  <Link href={`/industries/${industry.slug}`} className="group inline-flex items-baseline gap-2 text-ink transition-colors duration-300 hover:text-blue">
                    <span className="eyebrow translate-y-[-1.1em] text-[0.625rem] text-muted transition-colors group-hover:text-blue">{pad(index + 1)}</span>
                    <span className="link-underline">{industry.name}</span>
                  </Link>
                  {index < industries.length - 1 ? (
                    <span aria-hidden className="text-ink/15 max-sm:hidden">
                      /
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Photo
          src="/media/projects/firefighting-cylinders/04.jpg"
          alt="Rows of firefighting cylinders in a workshop."
          sizes="100vw"
          position="75% 50%"
          className="absolute inset-0 -z-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/90 to-navy/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
        <div className="shell grid gap-14 py-20 lg:grid-cols-12 lg:gap-6 lg:py-28">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-white/55">
              <span className="text-bright">(04)</span>
              <span>Manufacturing facilities</span>
            </p>
            <h2 className="mt-6 text-headline font-medium">Sundar Industrial Estate</h2>
            <p className="mt-6 max-w-md text-lead text-white/70">{profile.factory_address}</p>
            {latitude && longitude ? (
              <p className="eyebrow mt-8 flex items-center gap-3 text-white/45">
                <MapPin className="h-3.5 w-3.5 text-bright" strokeWidth={1.75} aria-hidden />
                {latitude} · {longitude}
              </p>
            ) : null}
            <Button href="/businesses/manufacturing" variant="light" className="mt-10">
              Manufacturing
            </Button>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7 lg:self-end" delay={0.1}>
            <ul className="grid border-t border-white/15 sm:grid-cols-2 sm:gap-x-8">
              {factoryWork.map((item, index) => (
                <li key={item} className="flex items-baseline gap-4 border-b border-white/15 py-5">
                  <span className="eyebrow text-bright">{pad(index + 1)}</span>
                  <span className="text-[1.02rem] leading-snug text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <SectionHeading
              index="05"
              label="Organisations"
              title={
                <>
                  Registrations <span className="text-ink/50">and clients.</span>
                </>
              }
              intro={settings.organization_note}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h3 className="eyebrow text-ink">Registrations</h3>
              <p className="mt-2 text-sm text-muted">{registrations.length} registration bodies</p>
            </div>
            <LogoGrid items={registrations} cols={{ base: 3, sm: 4, xl: 7 }} className="sm:grid-cols-4 lg:col-span-9 xl:grid-cols-7" />
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h3 className="eyebrow text-ink">Clients</h3>
              <p className="mt-2 text-sm text-muted">{clients.length} organisations</p>
            </div>
            <LogoGrid items={clients} cols={{ base: 3, md: 4, lg: 6 }} className="md:grid-cols-4 lg:col-span-9 lg:grid-cols-6" />
          </div>
        </div>
      </section>

      <InquiryBand title={settings.cta_title} text={settings.cta_text} />
    </>
  );
}

function LogoGrid({ items, cols, className }: { items: HomePayload["organizations"]; cols: React.ComponentProps<typeof GridFill>["cols"]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-3 gap-px border border-line bg-line", className)}>
      {items.map((item) => (
        <li key={item.id} className="group flex min-h-28 flex-col items-center justify-center gap-2.5 bg-white px-2 py-3.5 sm:min-h-32 sm:px-4 sm:py-4">
          {item.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.logo_url}
              alt={item.name}
              loading="lazy"
              className="h-10 w-full object-contain transition-[filter,opacity] duration-500 sm:h-12 lg:opacity-80 lg:grayscale lg:group-hover:opacity-100 lg:group-hover:grayscale-0"
            />
          ) : (
            <span aria-hidden className="grid h-10 w-full place-items-center sm:h-12">
              <Building2 className="h-7 w-7 text-ink/20 sm:h-8 sm:w-8" strokeWidth={1.25} />
            </span>
          )}
          <span className="text-center text-[0.625rem] leading-[0.9rem] text-muted sm:text-[0.6875rem] sm:leading-4">{item.name}</span>
        </li>
      ))}
      <GridFill count={items.length} cols={cols} />
    </ul>
  );
}
