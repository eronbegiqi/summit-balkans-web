import type { Metadata } from "next";
import { CONTACT } from "@/lib/constants";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.summitbalkans.com";

// Next replaces a parent's `openGraph` wholesale when a page sets its own, so
// every page spreads this back in instead of losing site_name/type/locale.
// Pages that pass their own `images` replace this default share image.
export const ogBase = {
  siteName: "Summit Balkans",
  locale: "en_GB",
  type: "website" as const,
  images: [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Hikers with backpacks walking toward snow-capped peaks in the Accursed Mountains, Albania",
    },
  ],
};

/** Canonical + og:url for a public page path, e.g. pageSeo("/about"). */
export function pageSeo(path: string): Pick<Metadata, "alternates" | "openGraph"> {
  return { alternates: { canonical: path }, openGraph: { ...ogBase, url: path } };
}

/** DB-authored SEO titles often already carry the brand — skip the layout template for those. */
export function brandTitle(title: string): Metadata["title"] {
  return title.includes("Summit Balkans") ? { absolute: title } : title;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: "Summit Balkans",
    url: SITE_URL,
    // Google rejects SVG logos for rich results — use the raster app icon.
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      "Small group guided hiking tours in Albania, Montenegro & Kosovo. Local guides, real trails, no hidden costs.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Evlia Qelebia",
      addressLocality: "Mitrovica e Veriut",
      postalCode: "40000",
      addressCountry: "XK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONTACT.coords.lat,
      longitude: CONTACT.coords.lng,
    },
    telephone: CONTACT.phone,
    email: CONTACT.email,
    priceRange: "€€",
    sameAs: [CONTACT.instagram, CONTACT.facebook, CONTACT.youtube, CONTACT.googleReviewsUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Summit Balkans",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function toISODate(value: Date | string): string {
  return (value instanceof Date ? value : new Date(value)).toISOString().slice(0, 10);
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
