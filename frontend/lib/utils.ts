import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/media")) return path;
  const base = process.env.NEXT_PUBLIC_UPLOADS_URL || "http://localhost:8000";
  return `${base}${path}`;
}

export function paragraphs(value?: string | null) {
  return (value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
