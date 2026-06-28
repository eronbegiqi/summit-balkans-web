import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "@/styles/globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Summit Balkans — Walk the Balkans with people who live here",
    template: "%s — Summit Balkans",
  },
  description:
    "Small group guided hiking tours in Albania, Montenegro & Kosovo. Local guides, real trails, no hidden costs.",
  openGraph: {
    siteName: "Summit Balkans",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Summit Balkans hiking in the Balkans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "XtiAN5eYbBB4_z9vyFJqPV7kZ2e7yr1Iiz81eZfztFo",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
        <Analytics />
        {/* Load Google Analytics only once the page is idle so it never blocks
            the main thread during initial render / LCP. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MCDEJ36XL7"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MCDEJ36XL7');`}
        </Script>
      </body>
    </html>
  );
}
