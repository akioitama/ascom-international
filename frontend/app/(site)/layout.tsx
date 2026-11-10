import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { OrganizationJson } from "@/components/site/organization-json";
import { getCategories, getCompany, getDivisions } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { profile: company } = getCompany();
  const divisions = getDivisions();
  const categories = getCategories();
  const site = siteUrl();

  return (
    <>
      <OrganizationJson company={company} site={site} />
      <Header
        phone={company.phone_primary}
        email={company.email_primary}
        divisions={divisions.filter((item) => item.show_in_navigation !== false).map((item) => ({ href: `/businesses/${item.slug}`, label: item.name }))}
        categories={categories.map((item) => ({ href: `/products?category=${item.slug}`, label: item.name }))}
      />
      <main id="content">{children}</main>
      <Footer company={company} divisions={divisions} />
    </>
  );
}
