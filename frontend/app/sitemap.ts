import type { MetadataRoute } from "next";
import { getDivisions, getIndustries, getProducts, getProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = [
    "",
    "/about",
    "/businesses",
    "/products",
    "/projects",
    "/industries",
    "/resources",
    "/careers",
    "/contact",
    "/code-of-conduct",
    ...getDivisions().map((item) => `/businesses/${item.slug}`),
    ...getProducts().map((item) => `/products/${item.slug}`),
    ...getProjects().map((item) => `/projects/${item.slug}`),
    ...getIndustries().map((item) => `/industries/${item.slug}`),
  ];
  return paths.map((path) => ({ url: `${site}${path || "/"}` }));
}
