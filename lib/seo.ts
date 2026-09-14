import { CONTACT } from "@/lib/constants";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://summitbalkans.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: "Summit Balkans",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/logo.svg`,
    description:
      "Small group guided hiking tours in Albania, Montenegro & Kosovo. Local guides, real trails, no hidden costs.",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address,
      addressCountry: "Kosovo",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONTACT.coords.lat,
      longitude: CONTACT.coords.lng,
    },
    telephone: CONTACT.phone,
    email: CONTACT.email,
    sameAs: [CONTACT.instagram, CONTACT.facebook, CONTACT.youtube, CONTACT.googleReviewsUrl],
  };
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
