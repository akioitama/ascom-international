import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
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
  const officeQuery = encodeURIComponent(company?.head_office_address || "333 Block B Iqbal Avenue Khayaban-e-Jinnah Lahore");
  return (
    <section className="mx-auto grid max-w-[1180px] gap-12 px-5 py-14 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">Contact</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Talk to the team</h1>
        <div className="mt-8 space-y-6 text-sm leading-6">
          <p>
            <span className="block text-xs uppercase tracking-[0.14em] text-muted">Head office</span>
            {company?.head_office_address}
            <a className="mt-1 block text-blue" href={`https://www.openstreetmap.org/search?query=${officeQuery}`}>
              Search this address on the map
            </a>
          </p>
          <p>
            <span className="block text-xs uppercase tracking-[0.14em] text-muted">Factory</span>
            {company?.factory_address}
          </p>
          <p>
            <a href={`tel:${(company?.phone_primary || "").replace(/\s/g, "")}`}>{company?.phone_primary}</a>
            <br />
            <a href={`tel:${(company?.phone_mobile || "").replace(/\s/g, "")}`}>{company?.phone_mobile}</a>
            {company?.phone_secondary ? (
              <>
                <br />
                <a href={`tel:${company.phone_secondary.replace(/\s/g, "")}`}>{company.phone_secondary}</a>
              </>
            ) : null}
            <br />
            <a href={`mailto:${company?.email_primary}`}>{company?.email_primary}</a>
          </p>
          <p>
            {company?.hours_weekday}
            <br />
            {company?.hours_sunday}
          </p>
          <p>
            Careers: <a href={`mailto:${company?.email_careers}`}>{company?.email_careers}</a>
          </p>
        </div>
        <iframe title="Map of Sundar Industrial Estate" src={map} className="mt-8 h-72 w-full border border-line" />
        <p className="mt-2 text-xs text-muted">{company?.map_factory_note}</p>
      </div>
      <div className="bg-white p-6">
        <h2 className="font-display text-3xl font-semibold">Inquiry</h2>
        <div className="mt-6">
          <ContactForm category={params.category || "General"} subject={params.subject || ""} email={company.email_primary} />
        </div>
      </div>
    </section>
  );
}
