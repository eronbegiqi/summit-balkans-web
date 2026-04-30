import Link from "next/link";
import { Mountain, MapPin, MessageCircle, Instagram, Facebook } from "lucide-react";

const exploreLinks = [
  { label: "All Tours", href: "/tours" },
  { label: "Peaks of the Balkans", href: "/tours/peaks-of-the-balkans" },
  { label: "Private Trips", href: "/private-trips" },
  { label: "Gear Rental", href: "/gear" },
  { label: "Before You Visit", href: "/before-you-visit" },
  { label: "Blog", href: "/blog" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Guides", href: "/guides" },
  { label: "Where We Go", href: "/destinations" },
  { label: "Contact Us", href: "/contact" },
];

export function Footer() {
  return (
    <>
      {/* Parallax photo strip */}
      <div className="h-[260px] overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=70"
          alt=""
          className="w-full h-[360px] object-cover block -mt-[50px] brightness-50"
          loading="lazy"
        />
      </div>

      <footer className="bg-dark pt-16 pb-10 border-t border-white/7">
        <div className="max-w-content mx-auto px-10">
          {/* Three-column grid */}
          <div className="grid grid-template-cols-[1.5fr_1fr_1fr] gap-16 mb-14"
            style={{ gridTemplateColumns: "1.5fr 1fr 1fr" }}>

            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5 font-fraunces text-[22px] font-bold text-white mb-3.5">
                <span className="w-8 h-8 bg-terra rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mountain className="w-4 h-4 text-white" strokeWidth={1.5} />
                </span>
                Summit Balkans
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-[280px]">
                Small group guided hiking & camping tours in Albania, Montenegro &
                Kosovo. Local guides, real trails, no hidden costs.
              </p>
            </div>

            {/* Explore */}
            <div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/30 mb-5">
                Explore
              </div>
              <ul className="list-none flex flex-col gap-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 no-underline hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/30 mb-5">
                Contact
              </div>

              <div className="flex items-start gap-2.5 text-sm text-white/55 mb-3">
                <MapPin className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                Prishtina, Kosovo
              </div>

              <a
                href="https://wa.me/38349123456"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/55 no-underline hover:text-white transition-colors mb-3"
              >
                <MessageCircle className="w-4 h-4 text-white/30 flex-shrink-0" strokeWidth={1.5} />
                WhatsApp
              </a>

              <a
                href="mailto:hello@summitbalkans.com"
                className="flex items-center gap-2.5 text-sm text-white/55 no-underline hover:text-white transition-colors mb-5"
              >
                <svg className="w-4 h-4 text-white/30 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                hello@summitbalkans.com
              </a>

              <div className="flex gap-3">
                <a href="https://instagram.com/summitbalkans" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/15 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <a href="https://facebook.com/summitbalkans" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/15 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <Facebook className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/7 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/25 font-mono">
              © {new Date().getFullYear()} Summit Balkans. All rights reserved.
            </p>
            <div className="flex gap-5">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-white/25 no-underline hover:text-white/55 transition-colors font-mono"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
