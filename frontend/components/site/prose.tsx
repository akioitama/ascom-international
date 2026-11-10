import { cn, paragraphs } from "@/lib/utils";

export function Prose({
  text,
  className = "",
  lead = false,
  headings = false,
}: {
  text?: string | null;
  className?: string;
  lead?: boolean;
  headings?: boolean;
}) {
  const items = paragraphs(text);
  return (
    <div className={cn("max-w-[68ch] space-y-6 text-[1.0625rem] leading-[1.75] text-ink/80", className)}>
      {items.map((paragraph, index) => {
        if (headings && isHeading(paragraph)) {
          return (
            <h2 key={paragraph.slice(0, 48)} id={slug(paragraph)} className="scroll-mt-32 pt-6 text-2xl font-medium tracking-tight text-ink first:pt-0">
              {paragraph}
            </h2>
          );
        }
        if (lead && index === 0) {
          return (
            <p key={paragraph.slice(0, 48)} className="text-lead text-ink">
              {paragraph}
            </p>
          );
        }
        return <p key={paragraph.slice(0, 48)}>{paragraph}</p>;
      })}
    </div>
  );
}

export function isHeading(paragraph: string) {
  return paragraph.length < 64 && !/[.:;,!?]$/.test(paragraph) && !paragraph.includes("\n");
}

export function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
