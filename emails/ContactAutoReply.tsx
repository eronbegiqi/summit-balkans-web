import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";

const brand = { bone: "#F5F2EC", ink: "#0E1310", terra: "#B45D3C", forest: "#3B4A2E", divider: "#C9CFC8" };

const subjectLabels: Record<string, string> = {
  booking: "Tour booking question",
  private: "Private trip enquiry",
  gear: "Gear rental",
  general: "General question",
};

interface ContactAutoReplyProps {
  name: string;
  subject: string;
  message: string;
}

export function ContactAutoReply({ name, subject, message }: ContactAutoReplyProps) {
  const firstName = name.split(" ")[0];
  return (
    <Html>
      <Head />
      <Preview>We got your message — we'll reply within 24 hours</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: "Georgia, serif", margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: brand.terra }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 40px" }}>
            <Text style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: 0 }}>Summit Balkans</Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: brand.bone }}>
          <Section style={{ padding: "40px 40px 24px" }}>
            <Heading style={{ color: brand.ink, fontSize: "30px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1.1", margin: "0 0 12px" }}>
              Thanks {firstName}, we got your message.
            </Heading>
            <Text style={{ color: `${brand.ink}99`, fontSize: "15px", lineHeight: "1.65", margin: 0 }}>
              We reply to every message within 24 hours — usually much faster. In the meantime here&apos;s a copy of what you sent us.
            </Text>
          </Section>

          <Section style={{ padding: "0 40px 32px" }}>
            <div style={{ backgroundColor: "#fff", border: `2px solid ${brand.divider}`, borderRadius: "12px", padding: "20px 24px" }}>
              <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>
                {subjectLabels[subject] ?? subject}
              </Text>
              <Text style={{ color: brand.ink, fontSize: "14px", lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap" }}>{message}</Text>
            </div>
          </Section>

          <Hr style={{ borderColor: brand.divider, margin: "0 40px" }} />

          <Section style={{ padding: "28px 40px" }}>
            <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "600", margin: "0 0 6px" }}>Prefer to chat directly?</Text>
            <Text style={{ color: `${brand.ink}77`, fontSize: "14px", margin: "0 0 16px" }}>WhatsApp is the fastest way to reach us.</Text>
            <Link href="https://wa.me/38349123456" style={{ backgroundColor: "#25D366", color: "#fff", padding: "11px 24px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", textDecoration: "none", display: "inline-block" }}>
              Message on WhatsApp
            </Link>
          </Section>

          <Section style={{ backgroundColor: brand.ink, padding: "24px 40px" }}>
            <Text style={{ color: "#ffffff55", fontSize: "12px", fontFamily: "monospace", margin: 0 }}>
              Summit Balkans · Prishtina, Kosovo · hello@summitbalkans.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactAutoReply;
