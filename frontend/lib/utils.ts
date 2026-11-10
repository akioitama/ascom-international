import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "headline", "title", "lead"] }],
      "bg-image": [{ bg: ["blueprint", "blueprint-ink"] }],
    },
  },
});

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

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

export function numberWord(value: number) {
  return numberWords[value] ?? String(value);
}

export function paragraphs(value?: string | null) {
  return (value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
