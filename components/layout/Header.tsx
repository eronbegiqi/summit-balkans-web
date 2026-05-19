"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Phone, Mail, ChevronDown, Instagram, Facebook } from "lucide-react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";
import { MegaMenuPanel } from "@/components/layout/MegaMenuPanel";
import type { MegaMenuData } from "@/components/layout/MegaMenuPanel";

// Pages where a full-bleed dark hero sits directly under the header
const HERO_PAGES = ["/", "/peaks-of-the-balkans", "/private-trips", "/about"];

// ── Nav data ──────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  submenu?: MegaMenuData;
}

const navItems: NavItem[] = [
  {
    label: "Tours",
    href: "/tours",
    submenu: {
      columns: [
        {
          heading: "Tour Types",
          links: [
            { label: "Group Tours", href: "/tours" },
            { label: "Peaks of the Balkans", href: "/peaks-of-the-balkans", featured: true },
            { label: "Private Trips", href: "/private-trips" },
            { label: "Day Hikes", href: "/tours" },
            { label: "All Departures", href: "/tours" },
          ],
        },
      ],
      featured: {
        title: "Peaks of the Balkans",
        tagline: "192 km · 3 countries · 10–13 days",
        href: "/peaks-of-the-balkans",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
      },
      stats: {
        items: [
          { value: "60+", label: "Routes" },
          { value: "200+", label: "Travellers" },
          { value: "4.9★", label: "Average rating" },
        ],
      },
    },
  },
  {
    label: "Destinations",
    href: "/destinations",
    submenu: {
      columns: [
        {
          heading: "Countries",
          links: [
            { label: "Albania", href: "/destinations" },
            { label: "Montenegro", href: "/destinations" },
            { label: "Kosovo", href: "/destinations" },
            { label: "Compare Destinations", href: "/destinations" },
          ],
        },
      ],
    },
  },
  {
    label: "Plan",
    href: "/private-trips",
    submenu: {
      columns: [
        {
          heading: "Trip Planning",
          links: [
            { label: "Plan a Private Trip", href: "/private-trips" },
            { label: "Gear Rental", href: "/gear" },
            { label: "Group Bookings (8+)", href: "/contact" },
          ],
        },
      ],
    },
  },
  {
    label: "About",
    href: "/about",
    submenu: {
      columns: [
        {
          heading: "Company",
          links: [
            { label: "Our Story", href: "/about" },
            { label: "Our Guides", href: "/guides" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ],
    },
  },
  {
    label: "Resources",
    href: "/blog",
    submenu: {
      columns: [
        {
          heading: "Useful Links",
          links: [
            { label: "Blog", href: "/blog" },
            { label: "Before You Visit", href: "/before-you-visit" },
            { label: "FAQ", href: "/before-you-visit" },
          ],
        },
      ],
    },
  },
];

// ── Logo ──────────────────────────────────────────────────────────────────────

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
      />
    </span>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const isBookingPage = pathname.startsWith("/tours/book");
  const isHeroPage = HERO_PAGES.includes(pathname);
  const solidState = scrolled || !isHeroPage;

  // GSAP scroll animation — use a ref to avoid stale closure on scrolled state
  const scrolledRef = useRef(false);

  useEffect(() => {
    if (!headerRef.current) return;
    const initialH = isHeroPage ? 96 : 64;

    // Sync with actual scroll position on mount (browser may restore scroll)
    const alreadyScrolled = window.scrollY > 80;
    scrolledRef.current = alreadyScrolled;
    setScrolled(alreadyScrolled);
    gsap.set(headerRef.current, { height: alreadyScrolled ? 64 : initialH });

    const onScroll = () => {
      const past = window.scrollY > 80;
      if (past === scrolledRef.current) return;
      scrolledRef.current = past;
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
  }, [isHeroPage]);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close mega menu on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Escape key closes mega menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openPanel = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

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
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Main navigation"
          onMouseLeave={scheduleClose}
        >
          {navItems.map((item) => {
            const hasSubmenu = !!item.submenu;
            const isOpen = openMenu === item.label;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasSubmenu && openPanel(item.label)}
                onMouseLeave={hasSubmenu ? scheduleClose : undefined}
                onFocus={() => hasSubmenu && openPanel(item.label)}
              >
                <Link
                  href={item.href}
                  aria-haspopup={hasSubmenu ? "true" : undefined}
                  aria-expanded={hasSubmenu ? isOpen : undefined}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium tracking-wide no-underline px-3 py-2 rounded-lg transition-colors duration-200",
                    solidState
                      ? isActive
                        ? "text-brand font-semibold"
                        : "text-ink/75 hover:text-ink hover:bg-ink/4"
                      : isActive
                      ? "text-white font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/8"
                  )}
                >
                  {item.label}
                  {hasSubmenu && (
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                      strokeWidth={1.5}
                    />
                  )}
                </Link>

                {/* Mega panel */}
                {hasSubmenu && item.submenu && (
                  <div onMouseEnter={cancelClose}>
                    <MegaMenuPanel data={item.submenu} visible={isOpen} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Phone — desktop only */}
          <a
            href={CONTACT.phoneLink}
            aria-label={`Call us at ${CONTACT.phone}`}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
              solidState
                ? "text-ink/50 hover:text-ink hover:bg-ink/5"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <Phone className="w-4 h-4" strokeWidth={1.5} />
          </a>

          <Link
            href="/tours"
            className="bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-lg no-underline hover:bg-brand/90 transition-colors"
          >
            Book
          </Link>
        </div>

        {/* Hamburger */}
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

      {/* ── Mobile full-screen overlay ─────────────────────────────────────── */}
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 shrink-0">
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

        {/* Nav links — accordion */}
        <nav className="flex-1 flex flex-col px-5 pt-3 overflow-y-auto">
          {navItems.map((item, i) => {
            const isExpanded = mobileExpanded === item.label;
            const hasSubmenu = !!item.submenu;

            return (
              <div key={item.label} className="border-b border-white/20">
                <div
                  className={cn(
                    "flex items-center justify-between py-4 gap-3",
                    "transition-all duration-300",
                    mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  )}
                  style={{ transitionDelay: mobileOpen ? `${0.05 + i * 0.05}s` : "0s" }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "font-fraunces text-[2rem] leading-tight font-bold no-underline flex-1",
                      pathname === item.href ? "text-white" : "text-white/35 hover:text-white"
                    )}
                  >
                    {item.label === "Tours" ? (
                      <span className="flex items-center gap-2">Tours</span>
                    ) : (
                      item.label
                    )}
                  </Link>
                  {hasSubmenu && (
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                      className="w-9 h-9 flex items-center justify-center text-white/35 hover:text-white bg-transparent border-none cursor-pointer flex-shrink-0"
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label} submenu`}
                    >
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                        strokeWidth={1.5}
                      />
                    </button>
                  )}
                </div>

                {/* Accordion sub-links */}
                {hasSubmenu && isExpanded && (
                  <div className="pb-4 pl-2 space-y-0.5">
                    {item.submenu!.columns.flatMap((col, colIndex) =>
                      col.links.map((link, linkIndex) => (
                        <Link
                          key={`${item.label}-${colIndex}-${link.label}-${link.href}-${linkIndex}`}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-2 py-2 text-[15px] no-underline transition-colors",
                            link.featured ? "text-brand font-semibold" : "text-white/55 hover:text-white"
                          )}
                        >
                          {link.featured && <span className="text-gold text-xs">★</span>}
                          {link.label}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom strip */}
        <div className="px-5 pb-8 pt-4 border-t border-white/20 shrink-0 space-y-4">
          <div className="flex gap-3">
            <Link
              href="/tours"
              onClick={() => setMobileOpen(false)}
              className="flex-1 bg-brand text-white text-center py-4 rounded-xl font-semibold text-sm no-underline hover:bg-brand/90 transition-colors"
            >
              Book a Trip
            </Link>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-2">
            <a href={CONTACT.phoneLink} className="flex items-center gap-2 text-sm text-white/45 no-underline hover:text-white/70 transition-colors">
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
              {CONTACT.phone}
            </a>
            <a href={CONTACT.emailLink} className="flex items-center gap-2 text-sm text-white/45 no-underline hover:text-white/70 transition-colors">
              <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
              {CONTACT.email}
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 pt-1">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/30 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" strokeWidth={1.5} />
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/30 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
