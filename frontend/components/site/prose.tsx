import { paragraphs } from "@/lib/utils";

export function Prose({ text, className = "" }: { text?: string | null; className?: string }) {
  return (
    <div className={`space-y-5 text-base leading-7 text-ink/90 ${className}`}>
      {paragraphs(text).map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}
