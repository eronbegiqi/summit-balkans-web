import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";

const brand = { bone: "#F5F2EC", ink: "#0E1310", terra: "#2e8a57", forest: "#3B4A2E", divider: "#C9CFC8" };

interface PrivateTripAutoReplyProps {
  name: string;
  destinations: string[];
  groupSize: number;
  experiences: string[];
  dateOption: string;
}

export function PrivateTripAutoReply({ name, destinations, groupSize, experiences, dateOption }: PrivateTripAutoReplyProps) {
  const firstName = name.split(" ")[0];
  return (
    <Html>
      <Head />
      <Preview>We've got your private trip enquiry — reply within 24 hours</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: "Georgia, serif", margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: brand.terra }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 40px" }}>
            <Text style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: 0 }}>Summit Balkans</Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: brand.bone }}>
          <Section style={{ padding: "40px 40px 24px" }}>
            <Heading style={{ color: brand.ink, fontSize: "30px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1.1", margin: "0 0 12px" }}>
              We&apos;ll design your route, {firstName}.
            </Heading>
            <Text style={{ color: `${brand.ink}99`, fontSize: "15px", lineHeight: "1.65", margin: 0 }}>
              Your private trip enquiry is with us. We&apos;ll send a custom itinerary proposal within 24 hours — usually much sooner.
            </Text>
          </Section>

          <Section style={{ padding: "0 40px 32px" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>
              Your Enquiry Summary
            </Text>
            <div style={{ backgroundColor: "#fff", border: `2px solid ${brand.divider}`, borderRadius: "12px", overflow: "hidden" }}>
              {[
                ["Destinations", destinations.join(", ") || "Flexible"],
                ["Group size", `${groupSize} people`],
                ["When", dateOption || "Flexible"],
                ["Experience type", experiences.length ? experiences.join(", ") : "To discuss"],
              ].map(([k, v], i, arr) => (
                <div key={k} style={{ padding: "12px 20px", borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : "none", display: "flex" }}>
                  <Text style={{ color: `${brand.ink}66`, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, width: "140px", flexShrink: 0 }}>{k}</Text>
                  <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "600", margin: 0 }}>{v}</Text>
                </div>
              ))}
            </div>
          </Section>

          <Hr style={{ borderColor: brand.divider, margin: "0 40px" }} />

          <Section style={{ padding: "28px 40px" }}>
            <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "600", margin: "0 0 6px" }}>Want to talk it through now?</Text>
            <Text style={{ color: `${brand.ink}77`, fontSize: "14px", margin: "0 0 16px" }}>Book a free 15-minute call with our trip planning team.</Text>
            <Link href="https://wa.me/38348300155" style={{ backgroundColor: "#25D366", color: "#fff", padding: "11px 24px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", textDecoration: "none", display: "inline-block" }}>
              Chat on WhatsApp
            </Link>
          </Section>

          <Section style={{ backgroundColor: brand.ink, padding: "24px 40px" }}>
            <Text style={{ color: "#ffffff55", fontSize: "12px", fontFamily: "monospace", margin: 0 }}>
              Summit Balkans · Evlia Qelebia, Mitrovica e Veriut 40000, Kosovo · info@summitbalkans.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default PrivateTripAutoReply;
