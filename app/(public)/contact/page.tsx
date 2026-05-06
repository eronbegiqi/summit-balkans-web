import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Navigation, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Summit Balkans — booking questions, private trip enquiries, or general questions about hiking in the Balkans. We reply within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero — light bone */}
      <section className="bg-bone border-b-2 border-divider pt-[72px]">
        <div className="max-w-content mx-auto px-4 md:px-10 py-12 md:py-16">
          <SectionLabel>Get in Touch</SectionLabel>
          <h1
            className="font-fraunces font-bold tracking-tight leading-[1.05]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", fontVariationSettings: "'opsz' 48" }}
          >
            Let&apos;s talk.
          </h1>
          <p className="text-lg md:text-xl text-ink/55 mt-3">We reply within 24 hours.</p>
        </div>
      </section>

      {/* Two-column layout — stacks on mobile */}
      <section className="py-16 md:py-24">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">

            {/* Left — Contact form */}
            <div>
              <h2 className="font-fraunces text-2xl font-bold tracking-tight mb-8">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            {/* Right — Direct contact info */}
            <div className="space-y-4">
              {/* WhatsApp card */}
              <div className="bg-[#25D366]/8 border-2 border-[#25D366]/30 rounded-card-hero p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-fraunces text-lg font-bold mb-1">Chat directly on WhatsApp</h3>
                    <p className="text-sm text-ink/60 mb-3 leading-relaxed">The fastest way to reach us. We usually reply in under an hour.</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 bg-[#25D366]/15 text-[#1a7a47] text-xs font-mono font-medium px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" strokeWidth={1.5} />
                        Usually under 1 hour
                      </span>
                    </div>
                    <a
                      href={CONTACT.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-semibold text-sm no-underline hover:bg-[#1da851] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                      Open WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact details */}
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value: CONTACT.address,
                  href: CONTACT.mapsUrl,
                  external: true,
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: CONTACT.phone,
                  href: CONTACT.phoneLink,
                  external: false,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: CONTACT.email,
                  href: CONTACT.emailLink,
                  external: false,
                },
              ].map((item) => {
                const Icon = item.icon;
                const inner = (
                  <div className="flex items-start gap-4 p-5 border-2 border-divider rounded-card bg-white hover:border-brand transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-bone border-2 border-divider flex items-center justify-center flex-shrink-0 group-hover:border-brand/40 transition-colors">
                      <Icon className="w-4 h-4 text-brand" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] text-ink/40 tracking-[0.08em] uppercase mb-0.5">{item.label}</div>
                      <div className="text-sm font-semibold text-ink leading-relaxed">{item.value}</div>
                    </div>
                  </div>
                );

                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="block no-underline"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={item.label}>{inner}</div>
                );
              })}

              {/* Get directions button */}
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-brand text-white px-5 py-3.5 rounded-xl font-semibold text-sm no-underline hover:bg-brand-700 transition-colors"
              >
                <Navigation className="w-4 h-4" strokeWidth={1.5} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Google Map — full width */}
      <section className="border-t-2 border-divider" aria-label="Map showing Summit Balkans location">
        <iframe
          src={CONTACT.mapsEmbed}
          width="100%"
          height="400"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Summit Balkans location on Google Maps"
        />
      </section>
    </>
  );
}
