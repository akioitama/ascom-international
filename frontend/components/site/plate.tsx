import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Plate({
  icon: Icon,
  label,
  title,
  index,
  tone = "light",
  compact = false,
  className,
}: {
  icon?: LucideIcon;
  label?: string;
  title?: string;
  index?: string;
  tone?: "light" | "dark";
  compact?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  if (compact && Icon) {
    return (
      <div aria-hidden className={cn("relative grid place-items-center overflow-hidden", dark ? "bg-deep bg-blueprint text-bright" : "bg-paper bg-blueprint-ink text-blue", className)}>
        <Corners dark={dark} />
        <Icon className="relative h-7 w-7" strokeWidth={1.25} />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex flex-col justify-between overflow-hidden p-5",
        dark ? "bg-deep bg-blueprint text-white" : "bg-paper bg-blueprint-ink text-ink",
        className,
      )}
    >
      <Corners dark={dark} />
      <div className="relative flex items-start justify-between gap-4">
        {label ? <span className={cn("eyebrow", dark ? "text-white/55" : "text-muted")}>{label}</span> : <span />}
        {index ? <span className={cn("eyebrow", dark ? "text-white/40" : "text-muted/70")}>{index}</span> : null}
      </div>
      {Icon ? (
        <div className="relative flex flex-1 items-center justify-center py-6">
          <span className={cn("absolute h-28 w-28 rounded-full border", dark ? "border-white/10" : "border-ink/10")} />
          <span className={cn("absolute h-px w-40", dark ? "bg-white/10" : "bg-ink/10")} />
          <span className={cn("absolute h-40 w-px", dark ? "bg-white/10" : "bg-ink/10")} />
          <Icon className={cn("relative h-12 w-12", dark ? "text-bright" : "text-blue")} strokeWidth={1.1} />
        </div>
      ) : (
        <div className="flex-1" />
      )}
      {title ? <span className={cn("relative block max-w-[16ch] text-lg font-medium leading-tight tracking-tight", dark ? "text-white/85" : "text-ink/80")}>{title}</span> : null}
    </div>
  );
}

function Corners({ dark }: { dark: boolean }) {
  const color = dark ? "border-white/25" : "border-ink/25";
  return (
    <>
      <span className={cn("absolute left-2 top-2 h-3 w-3 border-l border-t", color)} />
      <span className={cn("absolute right-2 top-2 h-3 w-3 border-r border-t", color)} />
      <span className={cn("absolute bottom-2 left-2 h-3 w-3 border-b border-l", color)} />
      <span className={cn("absolute bottom-2 right-2 h-3 w-3 border-b border-r", color)} />
    </>
  );
}
