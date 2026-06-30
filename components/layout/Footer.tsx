import Link from "next/link";
import { MapPin, Phone, Mail, Navigation, Instagram, Facebook, Youtube } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";

const exploreLinks = [
  { label: "All Tours", href: "/tours" },
  { label: "Destinations", href: "/destinations" },
  { label: "Private Trips", href: "/private-trips" },
  { label: "Gear Rental", href: "/gear" },
  { label: "Offers & Discounts", href: "/offers" },
  { label: "Blog", href: "/blog" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Guides", href: "/guides" },
  { label: "Before You Visit", href: "/before-you-visit" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <>
      {/* Parallax photo strip */}
      {/* <div className="h-[200px] overflow-hidden relative"> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=70"
          alt=""
          className="w-full h-[300px] object-cover block -mt-[50px] brightness-50"
          loading="lazy"
          aria-hidden="true"
        /> */}
      {/* </div> */}

      <footer className="bg-ink text-white relative overflow-hidden" aria-label="Site footer">
        {/* Topo overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cpath d='M0,200 C60,160 120,180 180,200 C240,220 300,160 360,200 C420,240 480,180 540,200 C560,208 580,210 600,200' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,240 C60,200 120,220 180,240 C240,260 300,200 360,240 C420,280 480,220 540,240 C560,248 580,250 600,240' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0,160 C60,120 120,140 180,160 C240,180 300,120 360,160 C420,200 480,140 540,160 C560,168 580,170 600,160' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative z-10 max-w-content mx-auto px-5 md:px-10 pt-16 pb-8">
          {/* 4-column grid — stacks on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

            {/* Col 1 — Brand */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-white.svg" alt="Summit Balkans" width={148} height={36} className="h-8 w-auto mb-4" loading="lazy" />
              <p className="text-sm text-white/45 leading-relaxed max-w-[260px] mb-6">
                Walk the Balkans with people who live here. Small groups, local guides, real trails.
              </p>
              <div className="flex gap-3">
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-9 h-9 border border-white/15 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/35 transition-[color,border-color]">
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-9 h-9 border border-white/15 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/35 transition-[color,border-color]">
                  <Facebook className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <a href={CONTACT.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  className="w-9 h-9 border border-white/15 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/35 transition-[color,border-color]">
                  <Youtube className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Col 2 — Explore */}
            <div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/30 mb-5">Explore</div>
              <ul className="list-none flex flex-col gap-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/55 no-underline hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Company */}
            <div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/30 mb-5">Company</div>
              <ul className="list-none flex flex-col gap-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/55 no-underline hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Get in Touch */}
            <div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/30 mb-5">Get in Touch</div>
              <div className="flex flex-col gap-3.5 mb-5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-white/55 leading-relaxed">{CONTACT.address}</span>
                </div>
                <a href={CONTACT.phoneLink} className="flex items-center gap-2.5 text-sm text-white/55 no-underline hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-white/30 flex-shrink-0" strokeWidth={1.5} />
                  {CONTACT.phone}
                </a>
                <a href={CONTACT.emailLink} className="flex items-center gap-2.5 text-sm text-white/55 no-underline hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-white/30 flex-shrink-0" strokeWidth={1.5} />
                  {CONTACT.email}
                </a>
              </div>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-semibold no-underline hover:bg-brand-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" strokeWidth={1.5} />
                Get Directions
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/25 font-mono order-2 sm:order-1">
              © {new Date().getFullYear()} Summit Balkans. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 order-1 sm:order-2 items-center">
              <Link href="/legal/booking-terms" className="text-xs text-white/25 no-underline hover:text-white/55 transition-colors font-mono">
                Booking Terms
              </Link>
              <Link href="/legal/privacy-policy" className="text-xs text-white/25 no-underline hover:text-white/55 transition-colors font-mono">
                Privacy Policy
              </Link>
              <Link href="/legal/cookie-policy" className="text-xs text-white/25 no-underline hover:text-white/55 transition-colors font-mono">
                Cookie Policy
              </Link>
              <CookieSettingsButton />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
