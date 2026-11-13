"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/site/photo";
import { cn, pad } from "@/lib/utils";

type Entry = { slug: string; name: string; summary: string; image: string | null; caption: string | null; company: boolean };

export function DivisionIndex({ items, header }: { items: Entry[]; header?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
      <div className="lg:col-span-5">
        {header}
        <div className="relative mt-10 hidden aspect-[3/2] overflow-hidden bg-deep lg:block">
          {items.map((item, index) => (
            <div key={item.slug} className={cn("absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-out-expo", index === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0")}>
              <Photo src={item.image} alt={item.caption || item.name} company={item.company} sizes="(min-width: 1024px) 38vw, 1px" tag="top" className="absolute inset-0" />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5">
            <p className="max-w-[32ch] text-sm leading-6 text-white/75">{current?.caption}</p>
            <span className="eyebrow shrink-0 text-white/60">
              {pad(active + 1)} / {pad(items.length)}
            </span>
          </div>
        </div>
      </div>
      <ol className="border-t border-white/12 lg:col-span-6 lg:col-start-7">
        {items.map((item, index) => {
          const on = index === active;
          return (
            <li key={item.slug} className="border-b border-white/12">
              <Link
                href={`/businesses/${item.slug}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className="group/row grid grid-cols-[2.5rem_minmax(0,1fr)_3rem] items-center gap-4 py-3 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:py-3.5 lg:items-start"
              >
                <span className={cn("eyebrow transition-colors lg:pt-2.5", on ? "text-bright" : "text-white/35")}>{pad(index + 1)}</span>
                <span className="min-w-0">
                  <span className={cn("block text-[1.3rem] font-medium leading-tight tracking-tight transition-colors duration-500 sm:text-[1.625rem] lg:text-[1.75rem]", on ? "text-white" : "text-white/80 lg:text-white/40")}>
                    {item.name}
                  </span>
                  <span className={cn("hidden transition-[grid-template-rows,opacity] duration-700 ease-out-expo lg:grid", on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <span className="overflow-hidden">
                      <span className="block max-w-lg pt-1.5 text-sm leading-6 text-white/60">{item.summary}</span>
                    </span>
                  </span>
                </span>
                <span className="relative block aspect-square w-12 overflow-hidden sm:hidden">
                  <Photo src={item.image} alt="" company sizes="48px" className="absolute inset-0" />
                </span>
                <ArrowUpRight
                  className={cn(
                    "hidden h-6 w-6 self-center transition-[transform,color,opacity] duration-500 ease-out-expo sm:block",
                    on ? "translate-x-0 text-bright opacity-100" : "-translate-x-2 text-white/40 opacity-60 lg:opacity-0",
                  )}
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
