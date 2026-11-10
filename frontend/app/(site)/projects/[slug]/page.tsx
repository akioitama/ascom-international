import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/site/crumbs";
import { InquiryBand } from "@/components/site/inquiry-band";
import { Photo } from "@/components/site/photo";
import { Prose } from "@/components/site/prose";
import { getProject } from "@/lib/content";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return { title: project.seo_title || project.title, description: project.seo_description || project.summary, alternates: { canonical: `/projects/${slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <>
      <article className="mx-auto max-w-[1180px] px-5 py-14">
        <Crumbs items={[{ href: "/", label: "Home" }, { href: "/projects", label: "Projects" }, { label: project.title }]} />
        <p className="text-xs uppercase tracking-[0.16em] text-blue">{project.division?.name}</p>
        <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold">{project.title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">{project.summary}</p>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          {project.client_name ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">Named on the project page</dt>
              <dd className="mt-1">{project.client_name}</dd>
            </div>
          ) : null}
          {project.location ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted">Location as published</dt>
              <dd className="mt-1">{project.location}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-8">
          <Prose text={project.description} />
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {project.images?.map((image) => (
            <Photo key={image.id} src={image.url} alt={image.alt} company={image.is_company_photo} className="min-h-72" />
          ))}
        </div>
        {project.products && project.products.length > 0 ? (
          <div className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Related products</h2>
            <ul className="mt-3 space-y-2">
              {project.products.map((product) => (
                <li key={product.slug}>
                  <Link className="text-blue" href={`/products/${product.slug}`}>
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>
      <InquiryBand />
    </>
  );
}
