import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Photo } from "@/components/site/photo";
import type { ProjectCard as Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
  image,
  ratio = "aspect-[4/3]",
  size = "md",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  tone = "light",
  priority = false,
  className,
}: {
  project: Project;
  index?: string;
  image?: string | null;
  ratio?: string;
  size?: "md" | "lg";
  sizes?: string;
  tone?: "light" | "dark";
  priority?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <article className={cn("group", className)}>
      <Link href={`/projects/${project.slug}`} className="block">
        <div className={cn("relative overflow-hidden", dark ? "bg-deep" : "bg-mist", ratio)}>
          <Photo src={image ?? project.cover_image} alt={project.title} zoom sizes={sizes} priority={priority} className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/45 via-navy/0 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <div className={cn("pointer-events-none absolute inset-0 ring-1 ring-inset", dark ? "ring-white/10" : "ring-ink/[0.07]")} />
          <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-2 place-items-center bg-white text-ink opacity-0 transition-[opacity,transform] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </span>
        </div>
        <div className="mt-5 grid gap-2.5">
          <div className={cn("eyebrow grid gap-1", dark ? "text-white/50" : "text-muted")}>
            <p className="flex gap-3">
              {index ? <span className={dark ? "text-bright" : "text-blue"}>{index}</span> : null}
              {project.division?.name ? <span className="truncate">{project.division.name}</span> : null}
            </p>
            <p aria-hidden={!project.client_name} className={cn("truncate", dark ? "text-white/35" : "text-muted/70")}>
              {project.client_name || "\u00a0"}
            </p>
          </div>
          <h3
            className={cn(
              "font-medium tracking-tight transition-colors duration-300",
              dark ? "text-white group-hover:text-bright" : "group-hover:text-blue",
              size === "lg" ? "text-[1.9rem] leading-[1.08] md:text-[2.5rem]" : "text-[1.5rem] leading-[1.15]",
            )}
          >
            {project.title}
          </h3>
          <p className={cn("max-w-xl", dark ? "text-white/60" : "text-muted", size === "lg" ? "text-base leading-7" : "text-sm leading-6")}>{project.summary}</p>
        </div>
      </Link>
    </article>
  );
}
