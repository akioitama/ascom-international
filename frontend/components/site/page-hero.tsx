import { Crumbs } from "@/components/site/crumbs";
import { Photo } from "@/components/site/photo";
import { cn } from "@/lib/utils";

type Crumb = { href?: string; label: string };
export type Fact = { label: string; value: React.ReactNode };

export function PageHero({
  kicker,
  title,
  text,
  image,
  alt = "",
  company = true,
  crumbs,
  facts,
  index,
  variant = "split",
  position,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  image?: string | null;
  alt?: string;
  company?: boolean;
  crumbs?: Crumb[];
  facts?: Fact[];
  index?: string;
  variant?: "split" | "cover" | "plain";
  position?: string;
  children?: React.ReactNode;
}) {
  const eyebrow = (dark: boolean) => (
    <p className={cn("eyebrow flex items-center gap-3", dark ? "text-white/60" : "text-muted")}>
      <span className={cn("inline-block h-px w-8", dark ? "bg-bright" : "bg-blue")} />
      {index ? <span className={dark ? "text-bright" : "text-blue"}>({index})</span> : null}
      <span>{kicker}</span>
    </p>
  );

  if (variant === "cover") {
    return (
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Photo src={image} alt={alt} company={company} priority sizes="100vw" position={position} tag="bottom-right" className="absolute inset-0 -z-10" imgClassName="animate-hero-zoom" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/60 to-navy/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/80 via-navy/30 to-transparent" />
        <div className="shell flex min-h-[min(76vh,760px)] flex-col justify-between pb-12 pt-8 lg:pb-16 lg:pt-10">
          {crumbs ? <Crumbs items={crumbs} tone="dark" /> : <span />}
          <div className="mt-28 max-w-5xl">
            <div className="animate-rise">{eyebrow(true)}</div>
            <h1 className="mt-6 animate-rise text-display font-medium [animation-delay:80ms]">{title}</h1>
            {text ? <div className="mt-7 max-w-2xl animate-rise text-lead text-white/75 [animation-delay:160ms]">{text}</div> : null}
            {children ? <div className="mt-9 animate-rise [animation-delay:240ms]">{children}</div> : null}
          </div>
        </div>
        {facts ? <FactStrip facts={facts} tone="dark" /> : null}
      </section>
    );
  }

  if (variant === "plain") {
    return (
      <section className="border-b border-line bg-paper">
        <div className="shell pb-14 pt-8 lg:pb-20 lg:pt-10">
          {crumbs ? <Crumbs items={crumbs} /> : null}
          <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-12 lg:gap-x-6">
            <div className="lg:col-span-8">
              <div className="animate-rise">{eyebrow(false)}</div>
              <h1 className="mt-6 max-w-5xl animate-rise text-display font-medium [animation-delay:80ms]">{title}</h1>
            </div>
            {text || children ? (
              <div className="animate-rise self-end [animation-delay:160ms] lg:col-span-4">
                {text ? <div className="text-lead text-muted">{text}</div> : null}
                {children ? <div className={text ? "mt-8" : ""}>{children}</div> : null}
              </div>
            ) : null}
          </div>
        </div>
        {facts ? <FactStrip facts={facts} tone="light" /> : null}
      </section>
    );
  }

  return (
    <section className="@container bg-navy text-white">
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="shell-start flex flex-col pb-14 pr-5 pt-8 sm:pr-8 lg:pb-20 lg:pr-16 lg:pt-10">
          {crumbs ? <Crumbs items={crumbs} tone="dark" /> : null}
          <div className="mt-20 lg:mt-auto lg:pt-32">
            <div className="animate-rise">{eyebrow(true)}</div>
            <h1 className="mt-6 max-w-4xl animate-rise text-display font-medium [animation-delay:80ms]">{title}</h1>
            {text ? <div className="mt-7 max-w-xl animate-rise text-lead text-white/70 [animation-delay:160ms]">{text}</div> : null}
            {children ? <div className="mt-9 animate-rise [animation-delay:240ms]">{children}</div> : null}
          </div>
        </div>
        <Photo src={image} alt={alt} company={company} priority sizes="(min-width: 1024px) 45vw, 100vw" position={position} className="aspect-[4/3] lg:aspect-auto lg:min-h-[600px]" imgClassName="animate-hero-zoom" />
      </div>
      {facts ? <FactStrip facts={facts} tone="dark" /> : null}
    </section>
  );
}

export function FactStrip({ facts, tone = "light" }: { facts: Fact[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={cn("relative border-t", dark ? "border-white/12 bg-navy/70 backdrop-blur-md" : "border-line bg-white")}>
      <dl className={cn("shell grid grid-cols-2", facts.length >= 4 ? "lg:grid-cols-4" : facts.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={cn(
              "py-5 pr-4 lg:py-6",
              index > 0 && "lg:border-l lg:pl-6",
              index % 2 === 1 && "max-lg:border-l max-lg:pl-4",
              index > 1 && "max-lg:border-t",
              dark ? "border-white/12" : "border-line",
            )}
          >
            <dt className={cn("eyebrow", dark ? "text-white/50" : "text-muted")}>{fact.label}</dt>
            <dd className={cn("mt-2 text-[0.95rem] leading-snug", dark ? "text-white" : "text-ink")}>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
