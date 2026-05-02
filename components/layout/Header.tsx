"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Phone, Mail } from "lucide-react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";

const navLinks = [
  { label: "Tours", href: "/tours" },
  { label: "Destinations", href: "/destinations" },
  { label: "Private Trips", href: "/private-trips" },
  { label: "Gear Rental", href: "/gear" },
  { label: "About", href: "/about" },
];

// Pages where a full-bleed dark hero sits directly under the header
const HERO_PAGES = ["/", "/peaks-of-the-balkans", "/private-trips", "/about"];

function LogoMark({ dark }: { dark: boolean }) {
  return (
    <span className="flex items-center gap-2 no-underline">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark ? "/logo.svg" : "/logo-white.svg"}
        alt="Summit Balkans"
        width={148}
        height={36}
        className="h-8 w-auto"
        style={{ color: dark ? "#0E1310" : "#ffffff" }}
      />
    </span>
  );
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isBookingPage = pathname.startsWith("/tours/book");
  const isHeroPage = HERO_PAGES.includes(pathname);
  // On hero pages before scroll: transparent white. On scroll or non-hero: solid bone.
  const solidState = scrolled || !isHeroPage;

  // GSAP scroll animation
  useEffect(() => {
    if (!headerRef.current) return;
    const initialH = isHeroPage ? 96 : 64;
    gsap.set(headerRef.current, { height: initialH });

    const onScroll = () => {
      const past = window.scrollY > 80;
      if (past === scrolled) return;
      setScrolled(past);
      gsap.to(headerRef.current, {
        height: past ? 64 : initialH,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHeroPage]);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (isBookingPage) return null;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10",
          "transition-colors duration-300",
          solidState
            ? "bg-bone/95 backdrop-blur-md border-b border-mist/60"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" aria-label="Summit Balkans home">
          <LogoMark dark={solidState} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide no-underline transition-colors duration-200",
                solidState
                  ? pathname === link.href
                    ? "text-brand font-semibold"
                    : "text-ink/75 hover:text-ink"
                  : pathname === link.href
                  ? "text-white font-semibold"
                  : "text-white/80 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/tours"
            className="bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-lg no-underline hover:bg-brand-700 transition-colors"
          >
            Book a Trip
          </Link>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-lg no-underline border transition-all",
              solidState
                ? "text-ink border-mist hover:border-ink"
                : "text-white border-white/35 hover:border-white/65 hover:bg-white/6"
            )}
          >
            WhatsApp
          </a>
        </div>

        {/* Hamburger — always 44×44 tap target */}
        <button
          className={cn(
            "lg:hidden w-11 h-11 flex items-center justify-center rounded-lg transition-colors",
            "bg-transparent border-none cursor-pointer",
            solidState ? "text-ink hover:bg-ink/5" : "text-white hover:bg-white/10"
          )}
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <Menu className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </header>

      {/* ── Mobile full-screen overlay ────────────────────────────────────── */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-0 z-[500] bg-ink flex flex-col",
          "transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
          <Link href="/" onClick={() => setMobileOpen(false)} aria-label="Summit Balkans home">
            <LogoMark dark={false} />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-0.5 overflow-y-auto">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-fraunces text-[2.25rem] leading-tight font-bold no-underline py-3 border-b border-white/8",
                "flex items-center justify-between group",
                "transition-all duration-300",
                pathname === link.href ? "text-white" : "text-white/30 hover:text-white",
                mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transitionDelay: mobileOpen ? `${0.05 + i * 0.055}s` : "0s" }}
            >
              {link.label}
              <ArrowRight
                className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
                strokeWidth={1.5}
              />
            </Link>
          ))}
        </nav>

        {/* Bottom contact strip */}
        <div className="px-8 pb-8 pt-4 border-t border-white/8 shrink-0 space-y-3">
          <div className="flex gap-3">
            <Link
              href="/tours"
              onClick={() => setMobileOpen(false)}
              className="flex-1 bg-brand text-white text-center py-4 rounded-xl font-semibold text-sm no-underline hover:bg-brand-700 transition-colors"
            >
              Book a Trip
            </Link>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border-2 border-white/20 text-white text-center py-4 rounded-xl font-medium text-sm no-underline hover:border-white/40 transition-colors"
            >
              WhatsApp
            </a>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <a href={CONTACT.phoneLink} className="flex items-center gap-2 text-sm text-white/45 no-underline hover:text-white/70 transition-colors">
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
              {CONTACT.phone}
            </a>
            <a href={CONTACT.emailLink} className="flex items-center gap-2 text-sm text-white/45 no-underline hover:text-white/70 transition-colors">
              <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
              {CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
