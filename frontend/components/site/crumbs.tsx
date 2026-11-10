import Link from "next/link";
import { cn } from "@/lib/utils";

export function Crumbs({ items, tone = "light", className }: { items: { href?: string; label: string }[]; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("eyebrow", dark ? "text-white/50" : "text-muted", className)}>
        <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2.5">
              {index > 0 ? (
                <span aria-hidden className={dark ? "text-white/25" : "text-ink/25"}>
                  /
                </span>
              ) : null}
              {item.href ? (
                <Link href={item.href} className={cn("transition-colors", dark ? "hover:text-white" : "hover:text-ink")}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={dark ? "text-white/85" : "text-ink"}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
