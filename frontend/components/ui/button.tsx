import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "group/button relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap text-[0.8125rem] font-medium tracking-[0.01em] transition-[background-color,color,border-color,box-shadow] duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue text-white hover:bg-navy",
        dark: "bg-navy text-white hover:bg-blue",
        light: "bg-white text-ink hover:bg-paper",
        ghost: "border border-white/30 text-white hover:border-white hover:bg-white hover:text-ink",
        line: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
        text: "px-0 py-0 text-ink hover:text-blue",
      },
      size: {
        md: "h-12 px-6",
        lg: "h-14 px-7 text-sm",
        sm: "h-10 px-4",
      },
    },
    compoundVariants: [{ variant: "text", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = VariantProps<typeof buttonStyles> & {
  href?: string;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  arrow?: boolean;
};

export function Button({ href, variant, size, className, children, type = "button", arrow = true }: Props) {
  const classes = cn(buttonStyles({ variant, size }), className);
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <ArrowRight aria-hidden className="h-4 w-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover/button:translate-x-1" strokeWidth={1.75} /> : null}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={classes}>
      {content}
    </button>
  );
}
