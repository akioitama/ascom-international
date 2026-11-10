import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@/components/site/prose";
import { getResource } from "@/lib/content";

export const metadata: Metadata = {
  title: "Code of conduct",
  description: "ASCOM International standards for ethical conduct, anti-bribery and raising a concern.",
  alternates: { canonical: "/code-of-conduct" },
};

export default async function ConductPage() {
  const resource = getResource("code-of-conduct");
  if (!resource) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">Governance</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">{resource.title}</h1>
      <p className="mt-4 text-lg text-muted">{resource.summary}</p>
      <div className="mt-8">
        <Prose text={resource.body} />
      </div>
    </article>
  );
}
