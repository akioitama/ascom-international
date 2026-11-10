import type { Company } from "@/lib/types";

export function OrganizationJson({ company, site }: { company: Company; site: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legal_name,
    url: site,
    email: company.email_primary,
    telephone: company.phone_primary,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.head_office_address,
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    logo: `${site}/media/brand/ascom-logo.png`,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
