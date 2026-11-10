import type { Metadata } from "next";
import Link from "next/link";
import { InquiryBand } from "@/components/site/inquiry-band";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { getHome } from "@/lib/content";
import type { HomePayload } from "@/lib/types";
import { paragraphs } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Securing Trade, Safeguarding Every Journey.",
  description: "ASCOM International supplies signage, materials, equipment and road safety, and also manufactures, builds and supplies technology.",
  alternates: { canonical: "/" },
};

const icons = ["01", "02", "03", "04", "05", "06"];

export default function HomePage() {
  const { profile, settings, values, divisions, highlights, projects, industries, organizations, statistics } = getHome();
  const byOrder = (a: { sort_order?: number }, b: { sort_order?: number }) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
  const capabilities = highlights.filter((item) => item.group_key === "capability").sort(byOrder);
  const reasons = highlights.filter((item) => item.group_key === "why").sort(byOrder);
  const mainDivisions = divisions.filter((item) => ["creative-solutions", "construction", "manufacturing", "technology-solutions"].includes(item.slug));
  const clients = organizations.filter((item) => item.kind === "client");
  const registrations = organizations.filter((item) => item.kind === "registration");

  return (
    <>
      <section className="relative min-h-[88vh] bg-navy text-white">
        <Photo
          src="/media/brand/hero-journey.jpg"
          alt="Freight trucks on a lit highway beneath overhead sign panels. Homepage visual for trade and safer journeys, not one ASCOM project."
          priority
          className="absolute inset-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/45 to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-[1280px] flex-col justify-end px-5 pb-16 pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bright">{settings.hero_kicker}</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">{settings.hero_title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">{settings.hero_text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/businesses" variant="light">
              Explore Our Capabilities
            </Button>
            <Button href="/contact" variant="ghost">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">{settings.intro_kicker}</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">{settings.intro_title}</h2>
        </Reveal>
        <Reveal>
          <div className="space-y-5 text-lg leading-8">
            {paragraphs(settings.intro_body).map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Head office</dt>
              <dd className="mt-2 text-sm">Lahore, Pakistan</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Factory</dt>
              <dd className="mt-2 text-sm">Sundar Industrial Estate</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Signage media</dt>
              <dd className="mt-2 text-sm">Since {profile.signage_since_year}</dd>
            </div>
          </dl>
          <Button href="/about" variant="line" className="mt-8">
            Read More
          </Button>
        </Reveal>
      </section>

      {statistics.length > 0 ? (
        <section className="border-y border-line bg-white">
          <dl className="mx-auto grid max-w-[1180px] gap-8 px-5 py-10 sm:grid-cols-3">
            {statistics.map((item) => (
              <div key={item.id}>
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="mt-2 font-display text-4xl font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-semibold">Businesses</h2>
            <Link href="/businesses" className="text-sm font-semibold text-blue">
              All businesses
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {mainDivisions.map((division) => (
              <Link key={division.slug} href={`/businesses/${division.slug}`} className="group relative min-h-[320px] overflow-hidden bg-navy text-white">
                <Photo src={division.hero_image} alt={division.hero_caption || division.name} company={division.hero_is_company_photo} className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-transparent" />
                <div className="relative flex h-full min-h-[320px] flex-col justify-end p-7">
                  <h3 className="font-display text-3xl font-semibold">{division.name}</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/80">{division.summary}</p>
                  <span className="mt-5 text-sm font-semibold">Explore More</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20">
        <h2 className="font-display text-4xl font-semibold">Capabilities</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {capabilities.map((item, index) => (
            <Link key={item.id} href={item.href || "/businesses"} className="grid gap-3 py-6 md:grid-cols-[80px_1fr_1.4fr] md:items-baseline">
              <span className="font-display text-sm text-blue">{icons[index] || String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
              <p className="text-muted">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-4xl font-semibold">Featured projects</h2>
            <Link href="/projects" className="text-sm font-semibold text-blue">
              View all
            </Link>
          </div>
          <div className="mt-8 space-y-6">
            {projects.slice(0, 4).map((project) => (
              <article key={project.slug} className="grid overflow-hidden border border-line lg:grid-cols-[1.3fr_0.7fr]">
                <Photo src={project.cover_image} alt={project.title} className="min-h-[280px]" />
                <div className="flex flex-col justify-between p-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-blue">{project.division?.name}</p>
                    <h3 className="mt-3 font-display text-3xl font-semibold">{project.title}</h3>
                    <p className="mt-4 text-muted">{project.summary}</p>
                  </div>
                  <Button href={`/projects/${project.slug}`} variant="line" className="mt-8 w-fit">
                    View Project
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20">
        <h2 className="font-display text-4xl font-semibold">Industries served</h2>
        <div className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <Link key={industry.slug} href={`/industries/${industry.slug}`} className="bg-foam p-6 hover:bg-white">
              <h3 className="font-display text-xl font-semibold">{industry.name}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{industry.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid bg-navy text-white lg:grid-cols-2">
        <Photo src="/media/projects/firefighting-cylinders/01.jpg" alt="Firefighting cylinders in a workshop, from ASCOM's published photographs." className="min-h-[360px]" />
        <div className="px-6 py-16 md:px-12">
          <p className="text-xs uppercase tracking-[0.2em] text-bright">Manufacturing facilities</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">Sundar Industrial Estate</h2>
          <p className="mt-5 text-white/75">{profile.factory_address}</p>
          <ul className="mt-8 space-y-3 text-sm">
            {["Metal, plastic and electrical goods", "CNC machining and fabrication", "Injection molding and plastic processing", "Powder coating, polishing and plating", "Assembly, private labelling, OEM and ODM", "In-house quality testing and packaging"].map((item) => (
              <li key={item} className="border-b border-white/10 pb-3">
                {item}
              </li>
            ))}
          </ul>
          <Button href="/businesses/manufacturing" variant="light" className="mt-8">
            Manufacturing
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20">
        <h2 className="font-display text-4xl font-semibold">Why ASCOM</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item) => (
            <article key={item.id}>
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-16">
          <h2 className="font-display text-3xl font-semibold">Organisations</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted">{settings.organization_note}</p>
          <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Registration marks</h3>
          <LogoGrid items={registrations} />
          <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Client marks</h3>
          <LogoGrid items={clients} />
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20">
        <h2 className="font-display text-4xl font-semibold">Values</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <article key={value.id} className="border-t border-navy pt-4">
              <p className="text-xs text-blue">0{index + 1}</p>
              <h3 className="mt-2 font-display text-xl font-semibold">{value.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <InquiryBand title={settings.cta_title} text={settings.cta_text} />
    </>
  );
}

function LogoGrid({ items }: { items: HomePayload["organizations"] }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <li key={item.id} className="flex min-h-32 flex-col items-center justify-center gap-2 bg-white p-4">
          {item.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.logo_url} alt={item.name} className="h-16 w-full object-contain" />
          ) : null}
          <span className="text-center text-[11px] leading-4 text-ink">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
