import { Button } from "@/components/ui/button";

export function InquiryBand({
  title = "Have a Project in Mind?",
  text = "Connect with our team to discuss your engineering, manufacturing or infrastructure requirements.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-5 py-20 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bright">Inquiry</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">{title}</h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">{text}</p>
        </div>
        <Button href="/contact" variant="light">
          Get in Touch
        </Button>
      </div>
    </section>
  );
}
