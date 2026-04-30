import type { Metadata } from "next";
import { MapPin, MessageCircle, Clock, Mail } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Summit Balkans — booking questions, private trip enquiries, or general questions about hiking in the Balkans.",
};

const contactItems = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+383 49 123 456",
    sub: "Fastest response",
    href: "https://wa.me/38349123456",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@summitbalkans.com",
    sub: "Response within 24h",
    href: "mailto:hello@summitbalkans.com",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Prishtina, Kosovo",
    sub: "Operating in ALB · MNE · XK",
    href: null,
  },
  {
    icon: Clock,
    label: "Office hours",
    value: "Mon–Fri 09:00–18:00 CET",
    sub: "WhatsApp available weekends",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Light hero */}
      <section className="pt-[72px] pb-0 bg-bone border-b-2 border-divider">
        <div className="max-w-content mx-auto px-10 py-16">
          <SectionLabel>Get in Touch</SectionLabel>
          <h1
            className="font-fraunces font-bold tracking-tight leading-[1.05] max-w-[640px]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", fontVariationSettings: "'opsz' 48" }}
          >
            We reply within 24 hours, usually much faster.
          </h1>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-content mx-auto px-10">
          <div className="grid gap-24 items-start" style={{ gridTemplateColumns: "1fr 400px" }}>
            {/* Form */}
            <div>
              <h2 className="font-fraunces text-2xl font-bold tracking-tight mb-8">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            {/* Contact details */}
            <div>
              <h2 className="font-fraunces text-2xl font-bold tracking-tight mb-8">
                Other ways to reach us
              </h2>
              <div className="flex flex-col gap-4">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const inner = (
                    <div className="flex items-start gap-4 p-5 border-2 border-divider rounded-card bg-white hover:border-forest transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-bone border-2 border-divider flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4.5 h-4.5 text-forest" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="font-mono text-[11px] text-ink/40 tracking-[0.08em] uppercase mb-0.5">
                          {item.label}
                        </div>
                        <div className="text-sm font-semibold">{item.value}</div>
                        <div className="text-xs text-ink/45 mt-0.5">{item.sub}</div>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="no-underline block">
                      {inner}
                    </a>
                  ) : (
                    <div key={item.label}>{inner}</div>
                  );
                })}
              </div>

              {/* Quick WhatsApp CTA */}
              <div className="mt-8 bg-dark rounded-xl p-6">
                <div className="font-fraunces text-xl font-bold text-white mb-2">
                  Prefer to message directly?
                </div>
                <p className="text-sm text-white/55 mb-4 leading-relaxed">
                  WhatsApp is the fastest way to reach us for quick questions, booking confirmations, or anything urgent.
                </p>
                <a
                  href="https://wa.me/38349123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-sm font-semibold no-underline hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  Open WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
