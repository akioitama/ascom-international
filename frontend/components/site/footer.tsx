import { ArrowUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Company, Division } from "@/lib/types";

const companyLinks = [
  ["/about", "About Us"],
  ["/businesses", "Businesses"],
  ["/products", "Products & Solutions"],
  ["/projects", "Projects"],
  ["/industries", "Industries"],
  ["/resources", "Resources"],
  ["/careers", "Careers"],
  ["/contact", "Contact"],
  ["/code-of-conduct", "Code of conduct"],
];

export function Footer({ company, divisions }: { company: Company; divisions: Division[] }) {
  return (
    <footer className="relative isolate overflow-hidden bg-midnight text-white">
      <div className="shell pt-20 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 border-b border-white/10 pb-16 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4 lg:pr-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/brand/ascom-logo.png" alt="ASCOM International" className="h-11 w-auto brightness-0 invert" />
            <p className="mt-8 max-w-sm text-[0.95rem] leading-7 text-white/60">{company.summary}</p>
            <Link href="/contact" className="group/cta mt-8 inline-flex items-center gap-3 border-b border-white/30 pb-1 text-sm font-medium transition-colors hover:border-white">
              Request an Inquiry
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>

          <FooterList title="Company" className="col-span-1 lg:col-span-2">
            {companyLinks.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="link-underline text-white/70 transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </FooterList>

          <FooterList title="Businesses" className="col-span-1 lg:col-span-3">
            {divisions
              .filter((item) => item.show_in_navigation !== false)
              .map((item) => (
                <li key={item.slug}>
                  <Link href={`/businesses/${item.slug}`} className="link-underline text-white/70 transition-colors hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
          </FooterList>

          <div className="col-span-2 text-sm leading-6 text-white/65 lg:col-span-3">
            <h2 className="eyebrow text-white/40">Contact</h2>
            <dl className="mt-5 grid gap-5">
              <div>
                <dt className="text-white">Head office</dt>
                <dd className="mt-1">{company.head_office_address}</dd>
              </div>
              <div>
                <dt className="text-white">Factory</dt>
                <dd className="mt-1">{company.factory_address}</dd>
              </div>
              <div>
                <dt className="sr-only">Phone and email</dt>
                <dd className="grid">
                  <a href={`tel:${company.phone_primary.replace(/\s/g, "")}`} className="link-underline w-fit text-white">
                    {company.phone_primary}
                  </a>
                  <a href={`tel:${company.phone_mobile.replace(/\s/g, "")}`} className="link-underline w-fit text-white">
                    {company.phone_mobile}
                  </a>
                  <a href={`mailto:${company.email_primary}`} className="link-underline w-fit text-white">
                    {company.email_primary}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-white">Hours</dt>
                <dd className="mt-1">
                  {company.hours_weekday}
                  <br />
                  {company.hours_sunday}
                </dd>
              </div>
              <div>
                <dt className="text-white">Careers</dt>
                <dd className="mt-1">
                  <a href={`mailto:${company.email_careers}`} className="link-underline">
                    {company.email_careers}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ASCOM International. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {company.facebook_url ? (
              <a href={company.facebook_url} rel="noreferrer" target="_blank" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                Facebook
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </a>
            ) : null}
            <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              Back to top
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </div>
      </div>
      <div aria-hidden className="shell pointer-events-none select-none overflow-hidden">
        <p className="-mb-[3.2vw] font-display text-[19vw] font-semibold leading-[0.8] tracking-[-0.065em] text-white/[0.04] xl:text-[17rem] xl:-mb-11">ASCOM</p>
      </div>
    </footer>
  );
}

function FooterList({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h2 className="eyebrow text-white/40">{title}</h2>
      <ul className="mt-5 grid gap-2.5 text-[0.95rem]">{children}</ul>
    </div>
  );
}
