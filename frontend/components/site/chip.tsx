import Link from "next/link";
import { cn } from "@/lib/utils";

export function Chip({ href, active = false, count, children }: { href: string; active?: boolean; count?: number; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2.5 border px-4 text-[0.8125rem] font-medium transition-colors duration-300",
        active ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:border-ink/50",
      )}
    >
      {children}
      {count !== undefined ? <span className={cn("eyebrow text-[0.625rem]", active ? "text-white/55" : "text-muted")}>{count}</span> : null}
    </Link>
  );
}
