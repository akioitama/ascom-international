import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCompany } from "@/lib/content";

export function InquiryBand({
  title = "Have a Project in Mind?",
  text = "Connect with our team to discuss your engineering, manufacturing or infrastructure requirements.",
}: {
  title?: string;
  text?: string;
}) {
  const { profile } = getCompany();
  const rows = [
    { label: "Office", value: profile.phone_primary, href: `tel:${profile.phone_primary.replace(/\s/g, "")}` },
    { label: "Mobile", value: profile.phone_mobile, href: `tel:${profile.phone_mobile.replace(/\s/g, "")}` },
    { label: "Email", value: profile.email_primary, href: `mailto:${profile.email_primary}` },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-blueprint [mask-image:linear-gradient(to_bottom,black_10%,transparent_90%)]" />
      <div aria-hidden className="absolute -right-48 -top-40 -z-10 h-[560px] w-[560px] rounded-full bg-signal/20 blur-[140px]" />
      <div className="shell grid gap-14 py-20 lg:grid-cols-12 lg:gap-6 lg:py-28">
        <div className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-3 text-white/55">
            <span className="inline-block h-px w-8 bg-bright" />
            Inquiry
          </p>
          <h2 className="mt-6 max-w-3xl text-headline font-medium">{title}</h2>
          <p className="mt-6 max-w-xl text-lead text-white/65">{text}</p>
          <Button href="/contact" variant="light" size="lg" className="mt-10">
            Get in Touch
          </Button>
        </div>
        <ul className="border-t border-white/12 lg:col-span-5 lg:self-end">
          {rows.map((row) => (
            <li key={row.label} className="border-b border-white/12">
              <a href={row.href} className="group/row flex items-center justify-between gap-6 py-5">
                <span className="eyebrow w-16 shrink-0 text-white/45">{row.label}</span>
                <span className="mr-auto text-lg font-medium tracking-tight sm:text-xl">{row.value}</span>
                <ArrowUpRight className="h-5 w-5 text-white/40 transition-[transform,color] duration-500 ease-out-expo group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-bright" strokeWidth={1.5} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
