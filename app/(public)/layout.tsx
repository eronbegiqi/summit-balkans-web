import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppFAB />
      <CookieBanner />
    </>
  );
}
