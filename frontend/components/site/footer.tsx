import Link from "next/link";
import type { Company, Division } from "@/lib/types";

export function Footer({ company, divisions }: { company: Company; divisions: Division[] }) {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/ascom-logo.png" alt="" className="h-12 w-auto brightness-0 invert" />
          <p className="mt-5 text-sm leading-6 text-white/75">{company.summary}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-bright">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/about", "About Us"],
              ["/businesses", "Businesses"],
              ["/products", "Products & Solutions"],
              ["/projects", "Projects"],
              ["/industries", "Industries"],
              ["/resources", "Resources"],
              ["/careers", "Careers"],
              ["/contact", "Contact"],
              ["/code-of-conduct", "Code of conduct"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-white/80 hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-bright">Businesses</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {divisions
              .filter((item) => item.show_in_navigation !== false)
              .map((item) => (
                <li key={item.slug}>
                  <Link href={`/businesses/${item.slug}`} className="text-white/80 hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div className="text-sm leading-6 text-white/80">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-bright">Contact</h2>
          <p className="mt-4">
            <span className="block text-white">Head office</span>
            {company.head_office_address}
          </p>
          <p className="mt-4">
            <span className="block text-white">Factory</span>
            {company.factory_address}
          </p>
          <p className="mt-4">
            <a href={`tel:${company.phone_primary.replace(/\s/g, "")}`}>{company.phone_primary}</a>
            <br />
            <a href={`tel:${company.phone_mobile.replace(/\s/g, "")}`}>{company.phone_mobile}</a>
            <br />
            <a href={`mailto:${company.email_primary}`}>{company.email_primary}</a>
          </p>
          <p className="mt-4">
            {company.hours_weekday}
            <br />
            {company.hours_sunday}
          </p>
          <p className="mt-4">
            Careers: <a href={`mailto:${company.email_careers}`}>{company.email_careers}</a>
          </p>
          {company.facebook_url ? (
            <p className="mt-4">
              <a href={company.facebook_url} rel="noreferrer" target="_blank">
                Facebook
              </a>
            </p>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1280px] px-5 py-4 text-xs text-white/60">© {new Date().getFullYear()} ASCOM International. All rights reserved.</p>
      </div>
    </footer>
  );
}
