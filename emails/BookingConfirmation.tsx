import {
  Body, Container, Head, Heading, Hr, Html, Img,
  Link, Preview, Row, Column, Section, Text,
} from "@react-email/components";

const brand = {
  bone: "#F5F2EC",
  ink: "#0E1310",
  terra: "#B45D3C",
  forest: "#3B4A2E",
  gold: "#E8B254",
  divider: "#C9CFC8",
};

export interface BookingConfirmationProps {
  bookingRef: string;
  firstName: string;
  tourName: string;
  departureDate: string;
  returnDate: string;
  guide: string;
  adults: number;
  children: number;
  addOns: string[];
  totalPrice: number;
  adminWhatsApp?: string;
}

export function BookingConfirmation({
  bookingRef,
  firstName,
  tourName,
  departureDate,
  returnDate,
  guide,
  adults,
  children,
  addOns,
  totalPrice,
  adminWhatsApp = "38349279136",
}: BookingConfirmationProps) {
  const previewText = `Booking confirmed — ${tourName} · Ref ${bookingRef}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: "Georgia, serif", margin: 0, padding: 0 }}>

        {/* Hero bar */}
        <Section style={{ backgroundColor: brand.terra, padding: "0" }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 40px" }}>
            <Text style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: 0, letterSpacing: "-0.02em" }}>
              Summit Balkans
            </Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: brand.bone }}>

          {/* Heading */}
          <Section style={{ padding: "40px 40px 0" }}>
            <Heading style={{ color: brand.ink, fontSize: "36px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-0.025em", margin: "0 0 12px" }}>
              You&apos;re confirmed, {firstName}.
            </Heading>
            <Text style={{ color: `${brand.ink}99`, fontSize: "16px", lineHeight: "1.6", margin: "0 0 32px" }}>
              We&apos;re looking forward to taking you through the Balkans. Here&apos;s everything you need for the trip.
            </Text>
          </Section>

          {/* Booking ref block */}
          <Section style={{ padding: "0 40px 32px" }}>
            <div style={{ backgroundColor: brand.ink, borderRadius: "12px", padding: "24px 28px" }}>
              <Text style={{ color: `${brand.gold}`, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 6px" }}>
                Booking Reference
              </Text>
              <Text style={{ color: "#fff", fontSize: "28px", fontFamily: "monospace", fontWeight: "700", letterSpacing: "0.05em", margin: 0 }}>
                {bookingRef}
              </Text>
              <Text style={{ color: "#ffffff66", fontSize: "12px", fontFamily: "monospace", margin: "4px 0 0" }}>
                Keep this for your records
              </Text>
            </div>
          </Section>

          {/* Trip details */}
          <Section style={{ padding: "0 40px 8px" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
              Trip Details
            </Text>
            <div style={{ backgroundColor: "#fff", border: `2px solid ${brand.divider}`, borderRadius: "12px", overflow: "hidden" }}>
              {[
                ["Tour", tourName],
                ["Departure", departureDate],
                ["Return", returnDate],
                ["Your guide", guide],
                ["Travellers", `${adults} adult${adults !== 1 ? "s" : ""}${children > 0 ? ` + ${children} child${children !== 1 ? "ren" : ""}` : ""}`],
              ].map(([label, value], i, arr) => (
                <Row key={label} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : "none" }}>
                  <Column style={{ padding: "14px 20px", width: "140px" }}>
                    <Text style={{ color: `${brand.ink}66`, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                      {label}
                    </Text>
                  </Column>
                  <Column style={{ padding: "14px 20px" }}>
                    <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "600", margin: 0 }}>
                      {value}
                    </Text>
                  </Column>
                </Row>
              ))}
            </div>
          </Section>

          {/* Add-ons */}
          {addOns.length > 0 && (
            <Section style={{ padding: "24px 40px 8px" }}>
              <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Add-ons Included
              </Text>
              {addOns.map((addon) => (
                <Text key={addon} style={{ color: brand.ink, fontSize: "14px", margin: "0 0 6px", display: "flex", alignItems: "center" }}>
                  ✓ {addon}
                </Text>
              ))}
            </Section>
          )}

          {/* Total */}
          <Section style={{ padding: "24px 40px" }}>
            <div style={{ borderTop: `2px solid ${brand.ink}`, paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Text style={{ color: brand.ink, fontSize: "16px", fontWeight: "700", margin: 0 }}>Total paid</Text>
              <Text style={{ color: brand.ink, fontSize: "28px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: "-0.02em", margin: 0 }}>
                €{totalPrice.toLocaleString()}
              </Text>
            </div>
          </Section>

          <Hr style={{ borderColor: brand.divider, margin: "0 40px" }} />

          {/* Next steps */}
          <Section style={{ padding: "32px 40px" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
              What Happens Next
            </Text>
            {[
              ["1", "We'll send your full pre-trip information pack within 48 hours."],
              ["2", "Your guide will message you on WhatsApp to introduce themselves."],
              ["3", "Two weeks before departure you'll receive a final logistics briefing."],
              ["4", "Show up, walk, and let us handle the rest."],
            ].map(([num, text]) => (
              <Row key={num} style={{ marginBottom: "12px" }}>
                <Column style={{ width: "32px", verticalAlign: "top", paddingTop: "2px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: brand.forest, color: "#fff", fontSize: "11px", fontFamily: "monospace", fontWeight: "700", display: "inline-flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: "22px" }}>
                    {num}
                  </div>
                </Column>
                <Column>
                  <Text style={{ color: `${brand.ink}bb`, fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{text}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: brand.divider, margin: "0 40px" }} />

          {/* WhatsApp CTA */}
          <Section style={{ padding: "32px 40px" }}>
            <Text style={{ color: brand.ink, fontSize: "15px", fontWeight: "600", margin: "0 0 8px" }}>
              Questions? We&apos;re on WhatsApp.
            </Text>
            <Text style={{ color: `${brand.ink}77`, fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px" }}>
              Your guide and our team are available 7 days a week. The fastest way to reach us is WhatsApp.
            </Text>
            <Link
              href={`https://wa.me/${adminWhatsApp}`}
              style={{ backgroundColor: "#25D366", color: "#fff", padding: "13px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", textDecoration: "none", display: "inline-block" }}
            >
              Message on WhatsApp
            </Link>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: brand.ink, padding: "28px 40px", borderRadius: "0 0 0 0" }}>
            <Text style={{ color: "#ffffff55", fontSize: "12px", fontFamily: "monospace", margin: 0, lineHeight: "1.6" }}>
              Summit Balkans · Evlia Qelebia, Mitrovica e Veriut 40000, Kosovo · info@summitbalkans.com
            </Text>
            <Text style={{ color: "#ffffff33", fontSize: "11px", margin: "8px 0 0" }}>
              You received this because you made a booking on summitbalkans.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingConfirmation;
