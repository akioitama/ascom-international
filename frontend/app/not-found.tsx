import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="shell grid gap-10 py-24 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-3 text-white/60">
            <span className="inline-block h-px w-8 bg-bright" />
            <span className="text-bright">404</span>
            <span>Page not found</span>
          </p>
          <h1 className="mt-6 text-display font-medium">
            That page is <span className="text-white/45">not available.</span>
          </h1>
          <p className="mt-7 max-w-md text-lead text-white/65">The address does not match a published page.</p>
          <Link href="/" className="group mt-10 inline-flex h-12 items-center gap-3 bg-white px-6 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-paper">
            <ArrowLeft className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" strokeWidth={1.75} aria-hidden />
            Back to the homepage
          </Link>
        </div>
        <p aria-hidden className="select-none self-end text-[clamp(8rem,22vw,20rem)] font-semibold leading-none tracking-[-0.06em] text-white/[0.06] lg:col-span-5 lg:text-right">
          404
        </p>
      </div>
    </section>
  );
}
