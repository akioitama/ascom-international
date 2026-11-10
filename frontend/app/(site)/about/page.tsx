import type { Metadata } from "next";
import { InquiryBand } from "@/components/site/inquiry-band";
import { PageHero } from "@/components/site/page-hero";
import { Prose } from "@/components/site/prose";
import { getCompany } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "ASCOM International is a Lahore company working across engineering, manufacturing, construction, signage and road safety.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { profile, values } = getCompany();
  return (
    <>
      <PageHero kicker="About ASCOM" title={profile.legal_name} text={profile.summary} image="/media/projects/sundar-prefabricated-site/01.jpg" alt="Crew at the prefabricated site at Sundar Industrial Estate." />
      <article className="mx-auto grid max-w-[1100px] gap-12 px-5 py-16 lg:grid-cols-[1fr_280px]">
        <div>
          <Prose text={profile.about} />
          {profile.mission ? (
            <div className="mt-10 border-t border-line pt-8">
              <h2 className="font-display text-2xl font-semibold">Mission</h2>
              <p className="mt-3 leading-7">{profile.mission}</p>
            </div>
          ) : null}
          {profile.vision ? (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-semibold">Vision</h2>
              <p className="mt-3 leading-7">{profile.vision}</p>
            </div>
          ) : null}
        </div>
        <aside className="space-y-6 text-sm">
          <p>
            <span className="block text-xs uppercase tracking-[0.16em] text-muted">Head office</span>
            {profile.head_office_address}
          </p>
          <p>
            <span className="block text-xs uppercase tracking-[0.16em] text-muted">Factory</span>
            {profile.factory_address}
          </p>
          <p>
            <span className="block text-xs uppercase tracking-[0.16em] text-muted">Signage media</span>
            Since {profile.signage_since_year}
          </p>
        </aside>
      </article>
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1100px] gap-6 px-5 py-16 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <article key={value.id} className="border-t-2 border-navy bg-white p-5">
              <h2 className="font-display text-xl font-semibold">{value.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{value.description}</p>
            </article>
          ))}
        </div>
      </section>
      <InquiryBand />
    </>
  );
}
