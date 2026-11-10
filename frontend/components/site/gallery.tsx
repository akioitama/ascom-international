"use client";

import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Photo } from "@/components/site/photo";
import { cn, mediaUrl, pad } from "@/lib/utils";

type Item = { id: string; url: string; alt: string; is_company_photo: boolean };

const layouts = ["sm:col-span-2 aspect-[16/9]", "aspect-[4/3]", "aspect-[4/3]", "aspect-[4/3]", "aspect-[4/3]"];

export function Gallery({ images, title }: { images: Item[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const count = images.length;

  const step = useCallback(
    (delta: number) => {
      setOpen((value) => (value === null ? value : (value + delta + count) % count));
    },
    [count],
  );

  useEffect(() => {
    if (open === null) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  const lastAlone = count > 1 && (count - 1) % 2 === 1;
  const current = open === null ? null : images[open];

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4">
        {images.map((image, index) => {
          const last = index === count - 1 && lastAlone;
          return (
            <li key={image.id} className={cn(layouts[index] ?? "aspect-[4/3]", last && "sm:col-span-2 sm:aspect-[16/9]")}>
              <button type="button" onClick={() => setOpen(index)} className="group relative block h-full w-full overflow-hidden text-left" aria-label={`Open photograph ${index + 1} of ${count}`}>
                <Photo src={image.url} alt={image.alt} company={image.is_company_photo} zoom sizes={index === 0 || last ? "(min-width: 1024px) 80vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"} className="absolute inset-0" />
                <span className="pointer-events-none absolute inset-0 bg-navy/0 transition-colors duration-500 group-hover:bg-navy/20" />
                <span className="eyebrow absolute left-4 top-4 bg-white/90 px-2 py-1 text-ink">
                  {pad(index + 1)} / {pad(count)}
                </span>
                <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center bg-white text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {current && open !== null ? (
        <div role="dialog" aria-modal="true" aria-label={`${title}, photograph ${open + 1} of ${count}`} className="fixed inset-0 z-[70] flex animate-fade-in flex-col bg-midnight/95 text-white backdrop-blur-sm">
          <div className="shell flex h-16 shrink-0 items-center justify-between">
            <p className="eyebrow text-white/60">
              {title} · {pad(open + 1)} / {pad(count)}
            </p>
            <button type="button" onClick={() => setOpen(null)} className="-mr-2 grid h-11 w-11 place-items-center text-white/80 hover:text-white" aria-label="Close">
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
          <div className="relative flex-1" onClick={() => setOpen(null)}>
            <Image key={current.id} src={mediaUrl(current.url)} alt={current.alt} fill sizes="100vw" className="animate-fade-in object-contain p-4 sm:p-10" />
          </div>
          <div className="shell flex h-20 shrink-0 items-center justify-between gap-6">
            <p className="line-clamp-2 max-w-2xl text-sm text-white/60">{current.alt}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} className="grid h-12 w-12 place-items-center border border-white/20 transition-colors hover:border-white hover:bg-white hover:text-ink" aria-label="Previous photograph">
                <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => step(1)} className="grid h-12 w-12 place-items-center border border-white/20 transition-colors hover:border-white hover:bg-white hover:text-ink" aria-label="Next photograph">
                <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
