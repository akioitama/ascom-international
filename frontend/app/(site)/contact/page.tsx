import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";
import { Crumbs } from "@/components/site/crumbs";
import { getCompany } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ASCOM International in Lahore. Head office, Sundar factory, phone and inquiry form.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const { profile: company } = getCompany();
  const lat = company?.map_factory_lat || "31.2863456";
  const lng = company?.map_factory_lng || "74.1736062";
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${Number(lng) - 0.02}%2C${Number(lat) - 0.01}%2C${Number(lng) + 0.02}%2C${Number(lat) + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  const officeMap = company.map_office_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.head_office_address)}`;
  const factoryMap = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
  const lines = [
    { label: "Office", value: company.phone_primary, href: `tel:${company.phone_primary.replace(/\s/g, "")}` },
    { label: "Mobile", value: company.phone_mobile, href: `tel:${company.phone_mobile.replace(/\s/g, "")}` },
    ...(company.phone_secondary ? [{ label: "Office 2", value: company.phone_secondary, href: `tel:${company.phone_secondary.replace(/\s/g, "")}` }] : []),
    { label: "Email", value: company.email_primary, href: `mailto:${company.email_primary}` },
    { label: "Careers", value: company.email_careers, href: `mailto:${company.email_careers}` },
  ];

  return (
    <>
      <section className="@container bg-white">
        <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="shell-start relative isolate overflow-hidden bg-navy pb-16 pr-5 pt-8 text-white sm:pr-8 lg:pb-24 lg:pr-16 lg:pt-10">
            <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
            <Crumbs tone="dark" items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
            <p className="eyebrow mt-20 flex animate-rise items-center gap-3 text-white/60 lg:mt-28">
              <span className="inline-block h-px w-8 bg-bright" />
              <span className="text-bright">(01)</span>
              <span>Contact</span>
            </p>
            <h1 className="mt-6 animate-rise text-display font-medium [animation-delay:80ms]">
              Talk to <span className="text-white/45">the team.</span>
            </h1>
            <p className="mt-7 max-w-md animate-rise text-lead text-white/65 [animation-delay:160ms]">Call, email, or send the form. The form opens your email program with the details filled in.</p>

            <ul className="mt-14 border-t border-white/12">
              {lines.map((line) => (
                <li key={line.label} className="border-b border-white/12">
                  <a href={line.href} className="group flex items-center gap-6 py-5">
                    <span className="eyebrow w-20 shrink-0 text-white/45">{line.label}</span>
                    <span className="mr-auto break-all text-lg font-medium tracking-tight sm:text-xl">{line.value}</span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-white/35 transition-[transform,color] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bright" strokeWidth={1.5} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>

            <dl className="mt-12 grid gap-10 text-[0.95rem] leading-7 text-white/70 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-white/45">Head office</dt>
                <dd className="mt-3">{company.head_office_address}</dd>
                <dd className="mt-3">
                  <a href={officeMap} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white">
                    <MapPin className="h-4 w-4 text-bright" strokeWidth={1.75} aria-hidden />
                    <span className="link-underline">Directions</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-white/45">Factory</dt>
                <dd className="mt-3">{company.factory_address}</dd>
                <dd className="mt-3">
                  <a href={factoryMap} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white">
                    <MapPin className="h-4 w-4 text-bright" strokeWidth={1.75} aria-hidden />
                    <span className="link-underline">Open the map</span>
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="eyebrow text-white/45">Hours</dt>
                <dd className="mt-3">
                  {company.hours_weekday}
                  <br />
                  {company.hours_sunday}
                </dd>
              </div>
            </dl>
          </div>

          <div className="shell-end bg-white pb-20 pl-5 pt-16 sm:pl-8 lg:pb-24 lg:pl-16 lg:pt-[9.5rem]">
            <p className="eyebrow flex items-center gap-3 text-muted">
              <span className="text-blue">(02)</span>
              <span>Inquiry</span>
            </p>
            <h2 className="mt-5 text-title font-medium">Send an inquiry</h2>
            <p className="mt-3 max-w-lg text-[0.95rem] leading-7 text-muted">Fields marked with an asterisk are required. Choose a category so the message reaches the right part of the company.</p>
            <div className="mt-12">
              <ContactForm category={params.category || "General"} subject={params.subject || ""} email={company.email_primary} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-foam">
        <div className="shell py-20 lg:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-3 text-muted">
                <span className="text-blue">(03)</span>
                <span>Factory location</span>
              </p>
              <h2 className="mt-5 text-title font-medium">Sundar Industrial Estate</h2>
            </div>
            <a href={factoryMap} target="_blank" rel="noreferrer" className="link-underline w-fit text-sm font-medium">
              Open in OpenStreetMap
            </a>
          </div>
          <iframe title="Map of Sundar Industrial Estate" src={map} loading="lazy" className="mt-10 h-[440px] w-full border border-line grayscale-[0.7] contrast-[1.05]" />
          <p className="mt-4 text-xs text-muted">{company?.map_factory_note}</p>
        </div>
      </section>
    </>
  );
}
