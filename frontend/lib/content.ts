import site from "@/content/site.json";
import type { Category, Company, Division, Highlight, HomePayload, Industry, Job, Organization, ProductCard, ProjectCard, Resource, Value } from "@/lib/types";

type RawDivision = Division & { offerings: { id: string; title: string; description: string }[]; is_active: boolean };
type RawProduct = ProductCard & {
  category_slug: string;
  division_slug: string;
  project_slugs: string[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};
type RawProject = ProjectCard & { division_slug: string; is_active: boolean; is_featured: boolean; sort_order: number; images: ProjectCard["images"] };

const data = site as unknown as {
  profile: Company;
  settings: Record<string, string>;
  values: Value[];
  divisions: RawDivision[];
  categories: Category[];
  products: RawProduct[];
  projects: RawProject[];
  industries: Industry[];
  highlights: Highlight[];
  organizations: Organization[];
  resources: Resource[];
  jobs: Job[];
};

function projectCard(project: RawProject): ProjectCard {
  return project;
}

export function getCompany() {
  return { profile: data.profile, values: data.values };
}

export function getDivisions() {
  return data.divisions.filter((item) => item.is_active);
}

export function getDivision(slug: string) {
  const division = data.divisions.find((item) => item.slug === slug && item.is_active);
  if (!division) return null;
  return {
    ...division,
    projects: data.projects.filter((item) => item.division_slug === slug && item.is_active).map(projectCard),
  };
}

export function getCategories() {
  return data.categories;
}

export function getProducts(options: { q?: string; category?: string; division?: string } = {}) {
  const query = options.q?.trim().toLowerCase();
  return data.products
    .filter((item) => item.is_active)
    .filter((item) => (options.category ? item.category_slug === options.category : true))
    .filter((item) => (options.division ? item.division_slug === options.division : true))
    .filter((item) => (query ? `${item.name} ${item.summary}`.toLowerCase().includes(query) : true))
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order);
}

export function getProduct(slug: string) {
  const product = data.products.find((item) => item.slug === slug && item.is_active);
  if (!product) return null;
  const projects = data.projects.filter((item) => product.project_slugs.includes(item.slug)).map(projectCard);
  const related = data.products.filter((item) => item.category_slug === product.category_slug && item.slug !== slug && item.is_active).slice(0, 4);
  return { ...product, projects, related_products: related };
}

export function getProjects(options: { q?: string; division?: string } = {}) {
  const query = options.q?.trim().toLowerCase();
  return data.projects
    .filter((item) => item.is_active)
    .filter((item) => (options.division ? item.division_slug === options.division : true))
    .filter((item) => (query ? `${item.title} ${item.summary}`.toLowerCase().includes(query) : true))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(projectCard);
}

export function getProject(slug: string) {
  const project = data.projects.find((item) => item.slug === slug && item.is_active);
  if (!project) return null;
  const products = data.products.filter((item) => item.project_slugs.includes(slug) && item.is_active);
  return { ...projectCard(project), products };
}

export function getIndustries() {
  return data.industries;
}

export function getIndustry(slug: string) {
  return data.industries.find((item) => item.slug === slug) ?? null;
}

export function getResources(category?: string) {
  return data.resources.filter((item) => (category ? item.category === category : true));
}

export function getResource(slug: string) {
  return data.resources.find((item) => item.slug === slug) ?? null;
}

export function getJobs() {
  return data.jobs;
}

export function getJob(slug: string) {
  return data.jobs.find((item) => item.slug === slug) ?? null;
}

export function getHome(): HomePayload {
  return {
    profile: data.profile,
    settings: data.settings,
    values: data.values,
    divisions: getDivisions(),
    highlights: data.highlights,
    projects: data.projects.filter((item) => item.is_featured).map(projectCard),
    industries: data.industries,
    organizations: data.organizations,
    statistics: [],
  };
}
