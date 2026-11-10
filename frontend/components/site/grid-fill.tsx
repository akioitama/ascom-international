import { cn } from "@/lib/utils";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";

const order: Breakpoint[] = ["base", "sm", "md", "lg", "xl"];
const show: Record<Breakpoint, string> = { base: "block", sm: "sm:block", md: "md:block", lg: "lg:block", xl: "xl:block" };
const hide: Record<Breakpoint, string> = { base: "hidden", sm: "sm:hidden", md: "md:hidden", lg: "lg:hidden", xl: "xl:hidden" };

export function GridFill({ count, cols, className }: { count: number; cols: Partial<Record<Breakpoint, number>>; className?: string }) {
  let current = 1;
  const columns = order.map((breakpoint) => (current = cols[breakpoint] ?? current));
  const needed = columns.map((value) => (value - (count % value)) % value);
  const total = Math.max(0, ...needed);
  return (
    <>
      {Array.from({ length: total }, (_, index) => (
        <li
          key={`fill-${index}`}
          aria-hidden
          className={cn("bg-paper bg-blueprint-ink", order.map((breakpoint, position) => (index < needed[position] ? show[breakpoint] : hide[breakpoint])), className)}
        />
      ))}
    </>
  );
}
