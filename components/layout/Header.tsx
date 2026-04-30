"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain, MessageCircle, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Tours", href: "/tours" },
  { label: "Where We Go", href: "/destinations" },
  { label: "Private Trips", href: "/private-trips" },
  { label: "Gear Rental", href: "/gear" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isBookingPage = pathname.startsWith("/tours/book");
  const isLightPage =
    pathname === "/contact" ||
    pathname === "/before-you-visit" ||
    pathname === "/destinations" ||
    pathname === "/about" ||
    pathname === "/blog" ||
    pathname === "/guides";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (isBookingPage) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-[72px] px-10 transition-all duration-300",
          "border-b border-white/8",
          scrolled
            ? "bg-dark/92 backdrop-blur-xl"
            : isLightPage
            ? "bg-dark/85 backdrop-blur-xl"
            : "bg-dark/55 backdrop-blur-xl"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-fraunces text-xl font-bold text-white tracking-tight no-underline">
          <span className="w-8 h-8 bg-terra rounded-lg flex items-center justify-center flex-shrink-0">
            <Mountain className="w-4 h-4 text-white" strokeWidth={1.5} />
          </span>
          Summit Balkans
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex" aria-label="Main navigation">
          <ul className="flex gap-8 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide no-underline transition-colors duration-200",
                    pathname === link.href
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/tours"
            className="bg-terra text-white text-sm font-semibold px-5 py-2.5 rounded-lg no-underline hover:opacity-90 transition-opacity"
          >
            Upcoming Tours
          </Link>
          <a
            href="https://wa.me/38349123456"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white border border-white/35 text-sm font-medium px-4 py-2 rounded-lg no-underline hover:border-white/65 hover:bg-white/6 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            WhatsApp
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden bg-transparent border-none text-white cursor-pointer p-1"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile nav overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[500] bg-dark flex flex-col transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between px-6 py-[18px] border-b border-white/8">
          <Link
            href="/"
            className="flex items-center gap-2 font-fraunces text-[17px] font-bold text-white no-underline"
            onClick={() => setMobileOpen(false)}
          >
            <span className="w-[30px] h-[30px] bg-terra rounded-lg flex items-center justify-center flex-shrink-0">
              <Mountain className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
            </span>
            Summit Balkans
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="bg-transparent border-none text-white/55 cursor-pointer p-1"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-fraunces text-4xl font-bold text-white/25 no-underline py-2.5 border-b border-white/5",
                "flex items-center justify-between hover:text-white transition-all duration-300",
                mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transitionDelay: `${0.05 + i * 0.06}s` }}
            >
              {link.label}
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </Link>
          ))}
        </nav>

        <div className="px-8 py-5 border-t border-white/8 flex gap-3">
          <Link
            href="/tours"
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-terra text-white text-center py-4 rounded-xl font-semibold text-sm no-underline"
          >
            View Tours
          </Link>
          <a
            href="https://wa.me/38349123456"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border-2 border-white/20 text-white text-center py-4 rounded-xl font-medium text-sm no-underline"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
