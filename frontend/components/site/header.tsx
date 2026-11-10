"use client";

import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Item = { href: string; label: string };

export function Header({
  phone,
  email,
  divisions,
  categories,
}: {
  phone: string;
  email: string;
  divisions: Item[];
  categories: Item[];
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const officeMap = "https://www.google.com/maps/dir/?api=1&destination=C7R9%2BJ67%2C+Iqbal+Avenue+Cooperative+Housing+Society+-+Phase+I+Airline+Society%2C+Lahore";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-2 text-xs tracking-wide">
          <div className="flex items-center gap-3">
            <a href={`tel:${phone.replace(/\s/g, "")}`} aria-label={`Call ${phone}`} className="inline-flex items-center gap-1.5 hover:text-bright">
              <Phone className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">{phone}</span>
            </a>
            <a href={`mailto:${email}`} aria-label={`Email ${email}`} className="inline-flex items-center gap-1.5 hover:text-bright">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">{email}</span>
            </a>
          </div>
          <a href={officeMap} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-bright">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            Lahore, Pakistan
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-5 py-3">
        <Link href="/" className="shrink-0" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/ascom-logo.png" alt="ASCOM International" className="h-10 w-auto md:h-12" />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <MenuLink label="Businesses" href="/businesses" items={divisions} />
          <MenuLink label="Products & Solutions" href="/products" items={categories} />
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/industries">Industries</NavLink>
          <MenuLink
            label="Resources"
            href="/resources"
            items={[
              { href: "/resources", label: "Resource centre" },
              { href: "/code-of-conduct", label: "Code of conduct" },
            ]}
          />
          <NavLink href="/careers">Careers</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Button href="/contact" className="hidden sm:inline-flex">
            Request an Inquiry
          </Button>
          <button type="button" className="p-2 lg:hidden" aria-expanded={open} aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto border-t border-line bg-white px-5 py-4 lg:hidden">
          <MobileLink href="/" onClick={close}>Home</MobileLink>
          <MobileLink href="/about" onClick={close}>About Us</MobileLink>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Businesses</p>
          {divisions.map((item) => (
            <MobileLink key={item.href} href={item.href} onClick={close}>
              {item.label}
            </MobileLink>
          ))}
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Products</p>
          {categories.map((item) => (
            <MobileLink key={item.href} href={item.href} onClick={close}>
              {item.label}
            </MobileLink>
          ))}
          <MobileLink href="/projects" onClick={close}>Projects</MobileLink>
          <MobileLink href="/industries" onClick={close}>Industries</MobileLink>
          <MobileLink href="/resources" onClick={close}>Resources</MobileLink>
          <MobileLink href="/code-of-conduct" onClick={close}>Code of conduct</MobileLink>
          <MobileLink href="/careers" onClick={close}>Careers</MobileLink>
          <MobileLink href="/contact" onClick={close}>Contact</MobileLink>
          <Button href="/contact" className="mt-4 w-full">
            Request an Inquiry
          </Button>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-2.5 py-2 text-sm font-medium text-ink hover:text-blue">
      {children}
    </Link>
  );
}

function MenuLink({ label, href, items }: { label: string; href: string; items: Item[] }) {
  return (
    <div className="group relative">
      <Link href={href} className="inline-flex px-2.5 py-2 text-sm font-medium text-ink hover:text-blue">
        {label}
      </Link>
      <div className="invisible absolute left-0 top-full z-20 min-w-64 border border-line bg-white py-2 opacity-0 shadow-none transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm hover:bg-paper">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block border-b border-line py-3 text-base">
      {children}
    </Link>
  );
}
