import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Cog, Factory, Layers, MapPin, ShieldCheck, Signpost, Truck, type LucideIcon } from "lucide-react";
import { DivisionIndex } from "@/components/site/division-index";
import { InquiryBand } from "@/components/site/inquiry-band";
import { Photo } from "@/components/site/photo";
import { ProjectCard } from "@/components/site/project-card";
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

const featuredOrder = ["fire-crash-truck", "mobile-foam-unit", "rwmc-vehicle-branding", "cycle-boats", "wildlife-vehicle-back-body"];
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
  const { profile, settings, values, divisions, highlights, projects, industries, organizations, statistics } = getHome();
  const byOrder = (a: { sort_order?: number }, b: { sort_order?: number }) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
  const capabilities = highlights.filter((item) => item.group_key === "capability").sort(byOrder);
  const reasons = highlights.filter((item) => item.group_key === "why").sort(byOrder);
  const clients = organizations.filter((item) => item.kind === "client");
  const registrations = organizations.filter((item) => item.kind === "registration");
  const featured = [
    ...featuredOrder.map((slug) => projects.find((item) => item.slug === slug)).filter((item): item is (typeof projects)[number] => Boolean(item)),
    ...projects.filter((item) => !featuredOrder.includes(item.slug)),
  ].slice(0, 5);
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
  const brandingFigure = projects.find((item) => item.slug === "wildlife-vehicle-branding");
  const foamFigure = projects.find((item) => item.slug === "mobile-foam-unit");

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
          <ul className="shell no-scrollbar flex overflow-x-auto lg:grid lg:grid-cols-9 lg:overflow-visible">
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
        <div className="shell py-24 lg:py-36">
          <Reveal>
            <SectionHeading index="01" label={settings.intro_kicker} title={settings.intro_title} />
          </Reveal>
          <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-5 lg:col-start-4">
              <div className="space-y-6">
                {intro.map((paragraph, index) => (
                  <p key={paragraph.slice(0, 40)} className={index === 0 ? "text-lead text-ink" : "text-[1.0625rem] leading-[1.75] text-ink/70"}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal className="lg:col-span-3 lg:col-start-10" delay={0.1}>
              <dl className="border-t border-ink/15">
                {[
                  ["Head office", "Lahore, Pakistan"],
                  ["Factory", "Sundar Industrial Estate"],
                  ["Signage media", `Since ${profile.signage_since_year}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-ink/15 py-4">
                    <dt className="eyebrow text-muted">{label}</dt>
                    <dd className="text-right text-sm text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button href="/about" variant="line" className="mt-8">
                Read More
              </Button>
            </Reveal>
          </div>

          <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-12 lg:gap-6">
            {brandingFigure ? (
              <Reveal className="lg:col-span-7">
                <Link href={`/projects/${brandingFigure.slug}`} className="group block">
                  <Photo
                    src={brandingFigure.images?.[2]?.url ?? brandingFigure.cover_image}
                    alt={brandingFigure.images?.[2]?.alt ?? brandingFigure.title}
                    zoom
                    frame
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="aspect-[16/10]"
                  />
                  <p className="eyebrow mt-4 flex gap-3 text-muted">
                    <span className="text-blue">Fig. 01</span>
                    <span className="transition-colors group-hover:text-ink">{brandingFigure.title}</span>
                  </p>
                </Link>
              </Reveal>
            ) : null}
            {foamFigure ? (
              <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.12}>
                <Link href={`/projects/${foamFigure.slug}`} className="group flex h-full flex-col">
                  <Photo
                    src={foamFigure.images?.[1]?.url ?? foamFigure.cover_image}
                    alt={foamFigure.images?.[1]?.alt ?? foamFigure.title}
                    zoom
                    frame
                    sizes="(min-width: 1024px) 32vw, 100vw"
                    className="aspect-[4/5] lg:aspect-auto lg:min-h-0 lg:flex-1"
                  />
                  <p className="eyebrow mt-4 flex gap-3 text-muted">
                    <span className="text-blue">Fig. 02</span>
                    <span className="transition-colors group-hover:text-ink">{foamFigure.title}</span>
                  </p>
                </Link>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="shell py-24 lg:py-36">
          <Reveal>
            <SectionHeading
              tone="dark"
              index="02"
              label="Businesses"
              title={
                <>
                  {numberWord(divisions.length)} businesses, <span className="text-white/45">one company.</span>
                </>
              }
              intro="Signage and branding lead. Manufacturing, vehicles, road safety, technology and construction are part of the same company."
              action={{ href: "/businesses", label: "All businesses" }}
            />
          </Reveal>
          <div className="mt-16 lg:mt-20">
            <DivisionIndex
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
        </div>
      </section>

      <section className="bg-white">
        <div className="shell py-24 lg:py-36">
          <Reveal>
            <SectionHeading
              index="03"
              label="Featured projects"
              title={
                <>
                  Selected work, <span className="text-ink/50">across ASCOM&apos;s businesses.</span>
                </>
              }
              action={{ href: "/projects", label: "View all projects" }}
            />
          </Reveal>
          <div className="mt-16 grid gap-x-6 gap-y-16 lg:mt-20 lg:grid-cols-12 lg:gap-y-24">
            {featured.map((project, index) => {
              const layout = [
                { className: "lg:col-span-8", ratio: "aspect-[16/10]", size: "lg" as const, sizes: "(min-width: 1024px) 62vw, 100vw" },
                { className: "lg:col-span-4", ratio: "aspect-[4/5] lg:aspect-[7/9]", size: "md" as const, sizes: "(min-width: 1024px) 30vw, 100vw" },
                { className: "lg:col-span-4", ratio: "aspect-[4/3]", size: "md" as const, sizes: "(min-width: 1024px) 30vw, 100vw" },
                { className: "lg:col-span-4", ratio: "aspect-[4/3]", size: "md" as const, sizes: "(min-width: 1024px) 30vw, 100vw" },
                { className: "lg:col-span-4", ratio: "aspect-[4/3]", size: "md" as const, sizes: "(min-width: 1024px) 30vw, 100vw" },
              ][index];
              return (
                <Reveal key={project.slug} className={layout.className} delay={index % 3 === 0 ? 0 : 0.08 * (index % 3)}>
                  <ProjectCard project={project} index={pad(index + 1)} ratio={layout.ratio} size={layout.size} sizes={layout.sizes} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="shell py-24 lg:py-36">
          <Reveal>
            <SectionHeading
              index="04"
              label="Capabilities"
              title={
                <>
                  What ASCOM <span className="text-ink/50">makes, builds and supplies.</span>
                </>
              }
            />
          </Reveal>
          <ul className="mt-16 border-t border-ink/15 lg:mt-20">
            {capabilities.map((item, index) => (
              <li key={item.id} className="border-b border-ink/15">
                <Link href={item.href || "/businesses"} className="group relative grid gap-3 py-7 lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-9">
                  <span aria-hidden className="absolute inset-y-0 -left-5 w-0.5 origin-top scale-y-0 bg-signal transition-transform duration-500 ease-out-expo group-hover:scale-y-100 sm:-left-8 lg:-left-12 xl:-left-16" />
                  <span className="eyebrow text-blue lg:col-span-1">{pad(index + 1)}</span>
                  <h3 className="text-[1.65rem] font-medium leading-tight tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2 lg:col-span-5 lg:text-[2.25rem]">{item.title}</h3>
                  <p className="max-w-xl text-[0.975rem] leading-7 text-muted lg:col-span-5">{item.summary}</p>
                  <span className="hidden lg:col-span-1 lg:flex lg:justify-end">
                    <span className="grid h-12 w-12 place-items-center border border-ink/15 transition-colors duration-300 group-hover:border-navy group-hover:bg-navy group-hover:text-white">
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
        <div className="shell grid gap-16 py-24 lg:grid-cols-12 lg:gap-6 lg:py-36">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-white/55">
              <span className="text-bright">(05)</span>
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
        <div className="shell grid gap-14 py-24 lg:grid-cols-12 lg:gap-6 lg:py-36">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow flex items-center gap-3 text-muted">
                <span className="text-blue">(06)</span>
                <span>Why ASCOM</span>
              </p>
              <h2 className="mt-6 text-headline font-medium">
                Why work <span className="text-ink/50">with ASCOM.</span>
              </h2>
              <p className="mt-6 max-w-sm text-lead text-muted">{numberWord(reasons.length)} points that set the company apart.</p>
            </div>
          </Reveal>
          <div className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {reasons.map((item, index) => {
              const Icon = reasonIcon(item.title);
              return (
                <Reveal key={item.id} delay={(index % 2) * 0.08}>
                  <article className="border-t border-ink/15 py-8">
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center bg-paper text-blue">
                        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="eyebrow text-muted/70">{pad(index + 1)}</span>
                    </div>
                    <h3 className="mt-8 text-xl font-medium tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-7 text-muted">{item.summary}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="shell py-24 lg:py-36">
          <Reveal>
            <SectionHeading
              index="07"
              label="Industries served"
              title={
                <>
                  Industries served, <span className="text-ink/50">from the public sector to general industry.</span>
                </>
              }
              action={{ href: "/industries", label: "All industries" }}
            />
          </Reveal>
          <Reveal className="mt-16 lg:mt-20">
            <ul className="flex flex-col gap-y-3 border-t border-ink/15 pt-12 text-[clamp(1.6rem,0.9rem+2.3vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.035em] sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
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

      <section className="border-t border-line bg-white">
        <div className="shell py-24 lg:py-36">
          <Reveal>
            <SectionHeading
              index="08"
              label="Organisations"
              title={
                <>
                  Registrations <span className="text-ink/50">and clients.</span>
                </>
              }
              intro={settings.organization_note}
            />
          </Reveal>
          <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h3 className="eyebrow text-ink">Registrations</h3>
              <p className="mt-2 text-sm text-muted">{registrations.length} registration bodies</p>
            </div>
            <LogoGrid items={registrations} className="lg:col-span-9 lg:grid-cols-6" />
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h3 className="eyebrow text-ink">Clients</h3>
              <p className="mt-2 text-sm text-muted">{clients.length} organisations</p>
            </div>
            <LogoGrid items={clients} className="md:grid-cols-4 lg:col-span-9 lg:grid-cols-6" />
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="shell py-24 lg:py-36">
          <Reveal>
            <SectionHeading
              index="09"
              label="Values"
              title={
                <>
                  The values <span className="text-ink/50">ASCOM works by.</span>
                </>
              }
            />
          </Reveal>
          <Reveal className="mt-16 lg:mt-20">
            <ol className="grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              {values.map((value, index) => (
                <li key={value.id} className="flex flex-col bg-paper p-6 transition-colors duration-500 hover:bg-white lg:p-8">
                  <span className="eyebrow text-blue">{pad(index + 1)}</span>
                  <h3 className="mt-10 text-xl font-medium leading-snug tracking-tight lg:mt-14">{value.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-7 text-muted">{value.description}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <InquiryBand title={settings.cta_title} text={settings.cta_text} />
    </>
  );
}

function LogoGrid({ items, className }: { items: HomePayload["organizations"]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-3 gap-px border border-line bg-line", className)}>
      {items.map((item) => (
        <li key={item.id} className="group flex min-h-32 flex-col items-center justify-center gap-2.5 bg-white px-2 py-4 transition-colors duration-300 hover:bg-foam sm:min-h-36 sm:gap-3 sm:px-4 sm:py-5">
          {item.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.logo_url}
              alt={item.name}
              loading="lazy"
              className="h-11 w-full object-contain transition-[filter,opacity] duration-500 sm:h-14 lg:opacity-80 lg:grayscale lg:group-hover:opacity-100 lg:group-hover:grayscale-0"
            />
          ) : null}
          <span className="text-center text-[0.625rem] leading-[0.9rem] text-muted sm:text-[0.6875rem] sm:leading-4">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
