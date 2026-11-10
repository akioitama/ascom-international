import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue text-white hover:bg-ink",
        light: "bg-white text-navy hover:bg-mist",
        ghost: "border border-white/40 text-white hover:bg-white hover:text-navy",
        line: "border border-navy text-navy hover:bg-navy hover:text-white",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type Props = VariantProps<typeof buttonStyles> & {
  href?: string;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
};

export function Button({ href, variant, className, children, type = "button" }: Props) {
  const classes = cn(buttonStyles({ variant }), className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
