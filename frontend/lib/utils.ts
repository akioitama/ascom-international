import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const deployment = process.env.VERCEL_URL?.trim();
  const host = process.env.VERCEL_ENV === "production" ? production || deployment : deployment || production;
  if (host) return `https://${host}`;
  return "http://localhost:3000";
}

export function mediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_UPLOADS_URL?.trim().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

export function paragraphs(value?: string | null) {
  return (value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
