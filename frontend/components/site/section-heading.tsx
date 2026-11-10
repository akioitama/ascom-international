import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  label,
  title,
  intro,
  action,
  tone = "light",
  layout = "split",
  className,
}: {
  index?: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: { href: string; label: string };
  tone?: "light" | "dark";
  layout?: "split" | "stack";
  className?: string;
}) {
  const dark = tone === "dark";
  const eyebrow = (
    <p className={cn("eyebrow flex items-center gap-3", dark ? "text-white/55" : "text-muted")}>
      {index ? <span className={dark ? "text-bright" : "text-blue"}>({index})</span> : null}
      <span>{label}</span>
    </p>
  );
  const link = action ? (
    <Link
      href={action.href}
      className={cn(
        "group/action inline-flex shrink-0 items-center gap-3 border-b pb-1 text-sm font-medium transition-colors",
        dark ? "border-white/30 text-white hover:border-white" : "border-ink/25 text-ink hover:border-ink",
      )}
    >
      {action.label}
      <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/action:translate-x-1" strokeWidth={1.75} />
    </Link>
  ) : null;

  if (layout === "stack") {
    return (
      <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
        <div className="max-w-4xl">
          {eyebrow}
          <h2 className="mt-5 text-headline font-medium">{title}</h2>
          {intro ? <div className={cn("mt-6 max-w-2xl text-lead", dark ? "text-white/65" : "text-muted")}>{intro}</div> : null}
        </div>
        {link}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6 lg:grid-cols-12 lg:gap-x-6", className)}>
      <div className="pt-2 lg:col-span-3">{eyebrow}</div>
      <div className="lg:col-span-9">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 className="max-w-4xl text-headline font-medium">{title}</h2>
          {link}
        </div>
        {intro ? <div className={cn("mt-6 max-w-2xl text-lead", dark ? "text-white/65" : "text-muted")}>{intro}</div> : null}
      </div>
    </div>
  );
}
