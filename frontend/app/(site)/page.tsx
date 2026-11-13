import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Cog,
  Compass,
  Factory,
  Layers,
  MapPin,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Signpost,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { DivisionIndex } from "@/components/site/division-index";
import { GridFill } from "@/components/site/grid-fill";
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

const valueIcons: Record<string, LucideIcon> = {
  refresh: RefreshCw,
  compass: Compass,
  badge: BadgeCheck,
  users: Users,
  message: MessageSquare,
  shield: ShieldCheck,
};

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

export default function HomePage() {
  const { profile, settings, values, divisions, highlights, projects, industries, organizations, statistics } = getHome();
  const byOrder = (a: { sort_order?: number }, b: { sort_order?: number }) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
  const reasons = highlights.filter((item) => item.group_key === "why").sort(byOrder);
  const clients = organizations.filter((item) => item.kind === "client");
  const registrations = organizations.filter((item) => item.kind === "registration");
  const featured = [
    ...featuredOrder.map((slug) => projects.find((item) => item.slug === slug)).filter((item): item is (typeof projects)[number] => Boolean(item)),
    ...projects.filter((item) => !featuredOrder.includes(item.slug)),
  ].slice(0, 4);
  const [leadProject, ...supportProjects] = featured;
  const allProjectCount = getProjects().length;
  const introImage = projects.find((item) => item.slug === "wildlife-vehicle-branding") ?? projects[0];
  const [titleLead, titleRest] = splitTitle(settings.hero_title);
  const office = profile.head_office_address.split(",").slice(1, 3).join(",").trim();
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
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy text-white lg:min-h-[max(720px,100svh)]">
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

        <div className="shell flex flex-1 flex-col justify-end pb-12 pt-[132px] lg:pb-16 lg:pt-[152px]">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-9 xl:col-span-8">
              <p className="eyebrow flex animate-rise items-center gap-3 text-white/70">
                <span className="inline-block h-px w-10 bg-bright" />
                {settings.hero_kicker}
              </p>
              <h1 className="mt-6 animate-rise text-display font-medium [animation-delay:120ms]">
                <span className="block">{titleLead}</span>
                {titleRest ? <span className="block text-white/55">{titleRest}</span> : null}
              </h1>
              <p className="mt-6 max-w-xl animate-rise text-lead text-white/75 [animation-delay:240ms]">{settings.hero_text}</p>
              <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
                <Button href="/businesses" variant="light" size="lg">
                  Explore Our Capabilities
                </Button>
                <Button href="/contact" variant="ghost" size="lg">
                  Contact Our Team
                </Button>
              </div>
            </div>
            <dl className="hidden animate-rise gap-5 border-l border-white/15 pl-6 [animation-delay:480ms] lg:col-span-3 lg:col-start-10 lg:grid xl:col-start-10">
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
                  className={cn("group flex h-full w-44 flex-col gap-2 py-4 transition-colors hover:bg-white/[0.04] lg:w-auto", index === 0 ? "pr-4" : "px-4")}
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
                  "flex flex-col-reverse justify-end gap-2.5 border-line py-7 lg:py-10",
                  index % 2 === 1 && "border-l pl-5 lg:pl-8",
                  index > 1 && "border-t lg:border-t-0",
                  index > 0 && "lg:border-l lg:pl-8",
                )}
              >
                <dt className="eyebrow text-muted">{fact.label}</dt>
                <dd className="text-[2.35rem] font-medium leading-none tracking-[-0.045em] text-ink lg:text-[3.25rem]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="bg-paper">
        <div className="shell py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6 lg:items-start">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow flex items-center gap-3 text-muted">
                <span className="text-blue">(01)</span>
                <span>{settings.intro_kicker}</span>
              </p>
              <h2 className="mt-5 max-w-2xl text-headline font-medium">{settings.intro_title}</h2>
              <div className="mt-6 space-y-4">
                {intro.map((paragraph, index) => (
                  <p key={paragraph.slice(0, 40)} className={index === 0 ? "text-lead text-ink" : "text-[1.02rem] leading-[1.7] text-ink/70"}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button href="/about" variant="line" className="mt-7">
                Read More
              </Button>
            </Reveal>

            {introImage ? (
              <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.08}>
                <Link href={`/projects/${introImage.slug}`} className="group block">
                  <Photo
                    src={introImage.images?.[2]?.url ?? introImage.cover_image}
                    alt={introImage.images?.[2]?.alt ?? introImage.title}
                    zoom
                    frame
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="aspect-[16/11]"
                  />
                  <p className="eyebrow mt-3 flex gap-3 text-muted">
                    <span className="text-blue">Selected work</span>
                    <span className="transition-colors group-hover:text-ink">{introImage.title}</span>
                  </p>
                </Link>
              </Reveal>
            ) : null}
          </div>

          {reasons.length > 0 ? (
            <Reveal className="mt-12 lg:mt-14">
              <h3 className="eyebrow text-ink">Why work with ASCOM</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-5 sm:gap-x-8 lg:grid-cols-3">
                {reasons.map((item) => {
                  const Icon = reasonIcon(item.title);
                  return (
                    <li key={item.id} className="flex flex-col gap-3 border-t border-ink/15 py-4 sm:flex-row sm:gap-4 sm:py-5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center bg-white text-blue">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      </span>
                      <div>
                        <h4 className="text-[0.95rem] font-medium leading-snug tracking-tight sm:text-[1.02rem]">{item.title}</h4>
                        <p className="mt-1 hidden text-sm leading-6 text-muted sm:block">{item.summary}</p>
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
        <div className="shell py-16 lg:py-20">
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

      {featured.length > 0 ? (
        <section className="bg-white">
          <div className="shell py-16 lg:py-20">
            <Reveal>
              <SectionHeading
                index="03"
                label="Featured projects"
                title={
                  <>
                    Selected work, <span className="text-ink/50">across ASCOM&apos;s businesses.</span>
                  </>
                }
                action={{ href: "/projects", label: `View all ${allProjectCount} projects` }}
              />
            </Reveal>
            <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-6 lg:items-start">
              {leadProject ? (
                <Reveal className="lg:col-span-7">
                  <ProjectCard
                    project={leadProject}
                    index={pad(1)}
                    ratio="aspect-[16/10]"
                    size="lg"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                  />
                </Reveal>
              ) : null}
              <div className="grid gap-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:gap-0 lg:border-t lg:border-line">
                {supportProjects.map((project, index) => (
                  <Reveal key={project.slug} delay={0.06 * (index + 1)}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group grid gap-4 border-b border-line py-5 sm:border-b-0 sm:border-t-0 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:items-center lg:gap-5 lg:border-b lg:border-line lg:py-4"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-mist lg:aspect-square">
                        <Photo src={project.cover_image} alt={project.title} zoom sizes="(min-width: 1024px) 120px, 30vw" className="absolute inset-0" />
                      </div>
                      <div className="min-w-0">
                        <p className="eyebrow flex flex-wrap gap-x-3 text-muted">
                          <span className="text-blue">{pad(index + 2)}</span>
                          {project.division?.name ? <span className="truncate">{project.division.name}</span> : null}
                        </p>
                        <h3 className="mt-2 text-[1.15rem] font-medium leading-snug tracking-tight transition-colors duration-300 group-hover:text-blue sm:text-[1.25rem]">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted">{project.summary}</p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-paper">
        <div className="shell py-16 lg:py-20">
          <Reveal>
            <SectionHeading
              index="04"
              label="Industries and organisations"
              title={
                <>
                  Markets served, <span className="text-ink/50">registrations and clients.</span>
                </>
              }
              intro={settings.organization_note}
              action={{ href: "/industries", label: "All industries" }}
            />
          </Reveal>

          <Reveal className="mt-10 lg:mt-12">
            <ul className="flex flex-col gap-y-2 border-t border-ink/15 pt-8 text-[clamp(1.2rem,0.7rem+1.4vw,2.1rem)] font-medium leading-[1.15] tracking-[-0.035em] sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3.5 lg:pt-10">
              {industries.map((industry, index) => (
                <li key={industry.slug} className="flex items-baseline gap-3.5">
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

          <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h3 className="eyebrow text-ink">Registrations</h3>
              <p className="mt-2 text-sm text-muted">{registrations.length} registration bodies</p>
            </div>
            <LogoGrid items={registrations} cols={{ base: 3, sm: 4, xl: 7 }} className="sm:grid-cols-4 lg:col-span-9 xl:grid-cols-7" />
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h3 className="eyebrow text-ink">Clients</h3>
              <p className="mt-2 text-sm text-muted">{clients.length} organisations</p>
            </div>
            <LogoGrid items={clients} cols={{ base: 3, md: 4, lg: 6 }} className="md:grid-cols-4 lg:col-span-9 lg:grid-cols-6" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="shell py-16 lg:py-20">
          <Reveal>
            <SectionHeading
              index="05"
              label="Values"
              title={
                <>
                  The values <span className="text-ink/50">ASCOM works by.</span>
                </>
              }
            />
          </Reveal>
          <Reveal className="mt-10 lg:mt-12">
            <ol className="grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              {values.map((value, index) => {
                const Icon = valueIcons[value.icon_key] ?? ShieldCheck;
                return (
                  <li key={value.id} className="flex flex-col bg-white p-5 transition-colors duration-500 hover:bg-paper lg:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid h-9 w-9 place-items-center border border-ink/15 text-blue">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="eyebrow text-muted">{pad(index + 1)}</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium leading-snug tracking-tight lg:mt-10">{value.title}</h3>
                    <p className="mt-2.5 text-sm leading-6 text-muted">{value.description}</p>
                  </li>
                );
              })}
            </ol>
          </Reveal>
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
        <li key={item.id} className="group flex min-h-24 flex-col items-center justify-center gap-2 bg-white px-2 py-3 sm:min-h-28 sm:px-3 sm:py-3.5">
          {item.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.logo_url}
              alt={item.name}
              loading="lazy"
              className="h-9 w-full object-contain transition-[filter,opacity] duration-500 sm:h-11 lg:opacity-80 lg:grayscale lg:group-hover:opacity-100 lg:group-hover:grayscale-0"
            />
          ) : (
            <span aria-hidden className="grid h-9 w-full place-items-center sm:h-11">
              <Building2 className="h-6 w-6 text-ink/20 sm:h-7 sm:w-7" strokeWidth={1.25} />
            </span>
          )}
          <span className="text-center text-[0.625rem] leading-[0.9rem] text-muted sm:text-[0.6875rem] sm:leading-4">{item.name}</span>
        </li>
      ))}
      <GridFill count={items.length} cols={cols} />
    </ul>
  );
}
