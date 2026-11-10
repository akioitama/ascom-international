"use client";

import { ArrowRight, ArrowUpRight, ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categoryIcon } from "@/lib/icons";
import { cn, mediaUrl, numberWord, pad } from "@/lib/utils";

type Item = { href: string; label: string; note?: string; image?: string | null; slug?: string };
type MenuKey = "businesses" | "products" | "resources" | null;

const resources: Item[] = [
  { href: "/resources", label: "Resource centre", note: "Documents published by the company." },
  { href: "/code-of-conduct", label: "Code of conduct", note: "Ethics, anti-bribery and raising a concern." },
];
export function Header({
  phone,
  email,
  officeMap,
  divisions,
  categories,
}: {
  phone: string;
  email: string;
  officeMap: string;
  divisions: Item[];
  categories: Item[];
}) {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [preview, setPreview] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const close = () => {
    setOpen(false);
    setMenu(null);
  };
  const solid = !overlay || scrolled || open || menu !== null;
  const lifted = scrolled && !open;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const previewItem = divisions[preview] ?? divisions[0];

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,box-shadow] duration-500 ease-out-expo",
          lifted && "-translate-y-9",
          solid ? "bg-white/95 text-ink shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent text-white",
        )}
      >
        <div className={cn("h-9 border-b text-white/70 transition-colors duration-500", solid ? "border-transparent bg-midnight" : "border-white/10 bg-transparent")}>
          <div className="shell flex h-full items-center justify-between gap-4 text-[0.75rem] tracking-wide">
            <div className="flex items-center gap-5">
              <a href={`tel:${phone.replace(/\s/g, "")}`} aria-label={`Call ${phone}`} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                <Phone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                <span className="hidden sm:inline">{phone}</span>
              </a>
              <a href={`mailto:${email}`} aria-label={`Email ${email}`} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                <span className="hidden sm:inline">{email}</span>
              </a>
            </div>
            <a href={officeMap} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-white">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Lahore, Pakistan
            </a>
          </div>
        </div>

        <div className="shell flex h-16 items-center justify-between gap-6 lg:h-[76px]">
          <Link href="/" className="shrink-0" onClick={close} aria-label="ASCOM International, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/brand/ascom-logo.png"
              alt="ASCOM International"
              className={cn("h-9 w-auto transition-[filter] duration-500 lg:h-10 xl:h-11", !solid && "brightness-0 invert")}
            />
          </Link>

          <nav aria-label="Primary" className="hidden h-full items-stretch lg:flex">
            <NavLink href="/" active={isActive("/")} onClick={close}>
              Home
            </NavLink>
            <NavLink href="/about" active={isActive("/about")} onClick={close}>
              About Us
            </NavLink>
            <MenuTrigger id="businesses" label="Businesses" href="/businesses" menu={menu} setMenu={setMenu} active={isActive("/businesses")} onNavigate={close}>
              <div className="shell grid grid-cols-12 gap-6 py-10">
                <div className="col-span-3 flex flex-col">
                  <p className="eyebrow text-muted">Businesses</p>
                  <p className="mt-4 max-w-[16ch] text-[1.6rem] font-medium leading-tight tracking-tight">
                    {numberWord(divisions.length)} businesses, <span className="text-ink/50">one company.</span>
                  </p>
                  <Link href="/businesses" onClick={close} className="group/link mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-blue">
                    All businesses
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/link:translate-x-1" strokeWidth={1.75} aria-hidden />
                  </Link>
                </div>
                <ul className="col-span-6 grid grid-cols-2 content-start gap-x-8">
                  {divisions.map((item, index) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        onMouseEnter={() => setPreview(index)}
                        onFocus={() => setPreview(index)}
                        className="group/item flex items-baseline gap-4 border-b border-line py-3.5"
                      >
                        <span className="eyebrow text-muted/80">{pad(index + 1)}</span>
                        <span className="text-[0.95rem] font-medium transition-colors group-hover/item:text-blue">{item.label}</span>
                        <ArrowUpRight className="ml-auto h-4 w-4 self-center text-blue opacity-0 transition-opacity group-hover/item:opacity-100" strokeWidth={1.75} aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="col-span-3">
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                    {previewItem?.image ? (
                      <Image key={previewItem.href} src={mediaUrl(previewItem.image)} alt="" fill sizes="24vw" className="img-grade animate-fade-in object-cover" />
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm font-medium">{previewItem?.label}</p>
                  {previewItem?.note ? <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted">{previewItem.note}</p> : null}
                </div>
              </div>
            </MenuTrigger>
            <MenuTrigger id="products" label="Products & Solutions" href="/products" menu={menu} setMenu={setMenu} active={isActive("/products")} onNavigate={close}>
              <div className="shell grid grid-cols-12 gap-6 py-10">
                <div className="col-span-3 flex flex-col">
                  <p className="eyebrow text-muted">Products & Solutions</p>
                  <p className="mt-4 max-w-[18ch] text-[1.6rem] font-medium leading-tight tracking-tight">
                    The catalogue, <span className="text-ink/50">by category.</span>
                  </p>
                  <Link href="/products" onClick={close} className="group/link mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-blue">
                    Full catalogue
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/link:translate-x-1" strokeWidth={1.75} aria-hidden />
                  </Link>
                </div>
                <ul className="col-span-9 grid grid-cols-3 content-start gap-x-8">
                  {categories.map((item) => {
                    const Icon = categoryIcon(item.slug ?? "");
                    return (
                      <li key={item.href}>
                        <Link href={item.href} onClick={close} className="group/item flex items-center gap-4 border-b border-line py-3.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center border border-line text-blue transition-colors group-hover/item:border-blue group-hover/item:bg-blue group-hover/item:text-white">
                            <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                          </span>
                          <span className="text-[0.95rem] font-medium transition-colors group-hover/item:text-blue">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </MenuTrigger>
            <NavLink href="/projects" active={isActive("/projects")} onClick={close}>
              Projects
            </NavLink>
            <NavLink href="/industries" active={isActive("/industries")} onClick={close}>
              Industries
            </NavLink>
            <MenuTrigger id="resources" label="Resources" href="/resources" menu={menu} setMenu={setMenu} active={isActive("/resources") || isActive("/code-of-conduct")} onNavigate={close} compact>
              <ul className="w-80 py-2">
                {resources.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={close} className="group/item block px-5 py-3.5 transition-colors hover:bg-paper">
                      <span className="block text-[0.95rem] font-medium group-hover/item:text-blue">{item.label}</span>
                      <span className="mt-0.5 block text-sm text-muted">{item.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </MenuTrigger>
            <NavLink href="/careers" active={isActive("/careers")} onClick={close}>
              Careers
            </NavLink>
            <NavLink href="/contact" active={isActive("/contact")} onClick={close}>
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              onClick={close}
              className={cn(
                "group/cta hidden h-11 items-center gap-3 px-5 text-[0.8125rem] font-medium transition-colors duration-300 sm:inline-flex",
                solid ? "bg-navy text-white hover:bg-blue" : "bg-white text-ink hover:bg-paper",
              )}
            >
              Request an Inquiry
              <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-1" strokeWidth={1.75} aria-hidden />
            </Link>
            <button
              type="button"
              className="-mr-2 grid h-11 w-11 place-items-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {open ? (
          <div id="mobile-menu" className="absolute inset-x-0 top-full h-[calc(100dvh-100px)] animate-menu-in overflow-y-auto border-t border-line bg-white text-ink lg:hidden">
            <nav aria-label="Mobile" className="shell flex min-h-full flex-col pb-8 pt-4">
              <ul className="border-b border-line">
                <MobileLink href="/" onClick={close} active={isActive("/")}>
                  Home
                </MobileLink>
                <MobileLink href="/about" onClick={close} active={isActive("/about")}>
                  About Us
                </MobileLink>
                <MobileGroup label="Businesses" all={{ href: "/businesses", label: "All businesses" }} items={divisions} onClick={close} />
                <MobileGroup label="Products & Solutions" all={{ href: "/products", label: "Full catalogue" }} items={categories} onClick={close} />
                <MobileLink href="/projects" onClick={close} active={isActive("/projects")}>
                  Projects
                </MobileLink>
                <MobileLink href="/industries" onClick={close} active={isActive("/industries")}>
                  Industries
                </MobileLink>
                <MobileGroup label="Resources" items={resources} onClick={close} />
                <MobileLink href="/careers" onClick={close} active={isActive("/careers")}>
                  Careers
                </MobileLink>
                <MobileLink href="/contact" onClick={close} active={isActive("/contact")}>
                  Contact
                </MobileLink>
              </ul>
              <div className="mt-auto grid gap-5 pt-10">
                <div className="grid gap-1 text-sm text-muted">
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-ink">
                    {phone}
                  </a>
                  <a href={`mailto:${email}`} className="text-ink">
                    {email}
                  </a>
                </div>
                <Link href="/contact" onClick={close} className="inline-flex h-12 items-center justify-between bg-navy px-5 text-sm font-medium text-white">
                  Request an Inquiry
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>
      {!overlay ? <div aria-hidden className="h-[100px] lg:h-[112px]" /> : null}
    </>
  );
}

function NavLink({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="group/nav relative flex items-center px-3 text-[0.875rem] font-medium xl:px-3.5"
    >
      <span className="opacity-90 transition-opacity group-hover/nav:opacity-100">{children}</span>
      <span className={cn("absolute inset-x-3 bottom-0 h-0.5 origin-left bg-signal transition-transform duration-500 ease-out-expo xl:inset-x-3.5", active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100")} />
    </Link>
  );
}

function MenuTrigger({
  id,
  label,
  href,
  menu,
  setMenu,
  active,
  compact = false,
  onNavigate,
  children,
}: {
  id: Exclude<MenuKey, null>;
  label: string;
  href: string;
  menu: MenuKey;
  setMenu: (value: MenuKey) => void;
  active: boolean;
  compact?: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  const expanded = menu === id;
  return (
    <div
      className={cn("flex", compact && "relative")}
      onMouseEnter={() => setMenu(id)}
      onMouseLeave={() => setMenu(null)}
      onFocus={() => setMenu(id)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenu(null);
      }}
    >
      <Link
        href={href}
        onClick={onNavigate}
        aria-expanded={expanded}
        aria-current={active ? "page" : undefined}
        className="group/nav relative flex items-center gap-1.5 px-3 text-[0.875rem] font-medium xl:px-3.5"
      >
        <span className="opacity-90 transition-opacity group-hover/nav:opacity-100">{label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 opacity-60 transition-transform duration-300", expanded && "rotate-180")} strokeWidth={1.75} aria-hidden />
        <span className={cn("absolute inset-x-3 bottom-0 h-0.5 origin-left bg-signal transition-transform duration-500 ease-out-expo xl:inset-x-3.5", active || expanded ? "scale-x-100" : "scale-x-0")} />
      </Link>
      {expanded ? (
        <div
          className={cn(
            "animate-menu-in bg-white text-ink shadow-[0_30px_60px_-30px_rgba(10,22,33,0.35)]",
            compact ? "absolute left-0 top-full border border-line" : "absolute inset-x-0 top-full border-t border-line",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function MobileLink({ href, children, onClick, active }: { href: string; children: React.ReactNode; onClick: () => void; active: boolean }) {
  return (
    <li className="border-t border-line first:border-t-0">
      <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined} className="flex items-center justify-between py-4 text-[1.35rem] font-medium tracking-tight">
        {children}
        {active ? <span className="h-1.5 w-1.5 bg-signal" aria-hidden /> : null}
      </Link>
    </li>
  );
}

function MobileGroup({ label, all, items, onClick }: { label: string; all?: Item; items: Item[]; onClick: () => void }) {
  return (
    <li className="border-t border-line">
      <details className="group/details">
        <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[1.35rem] font-medium tracking-tight [&::-webkit-details-marker]:hidden">
          {label}
          <ChevronDown className="h-5 w-5 text-muted transition-transform duration-300 group-open/details:rotate-180" strokeWidth={1.5} aria-hidden />
        </summary>
        <ul className="grid gap-0.5 pb-4">
          {items.map((item, index) => (
            <li key={item.href}>
              <Link href={item.href} onClick={onClick} className="flex items-baseline gap-4 py-2 text-[0.975rem] text-ink/80">
                <span className="eyebrow w-6 text-muted/70">{pad(index + 1)}</span>
                {item.label}
              </Link>
            </li>
          ))}
          {all ? (
            <li>
              <Link href={all.href} onClick={onClick} className="mt-2 inline-flex items-center gap-2 py-2 pl-10 text-[0.975rem] font-medium text-blue">
                {all.label}
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </li>
          ) : null}
        </ul>
      </details>
    </li>
  );
}
