import { Photo } from "@/components/site/photo";

export function PageHero({
  kicker,
  title,
  text,
  image,
  alt,
  company = true,
}: {
  kicker: string;
  title: string;
  text?: string;
  image?: string | null;
  alt: string;
  company?: boolean;
}) {
  return (
    <section className="grid min-h-[420px] bg-navy text-white lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col justify-end px-5 py-14 md:px-10 lg:px-16 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bright">{kicker}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
        {text ? <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{text}</p> : null}
      </div>
      <Photo src={image} alt={alt} company={company} className="min-h-[280px]" priority />
    </section>
  );
}
