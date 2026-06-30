import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Row, Column, Section, Text,
} from "@react-email/components";

const brand = {
  bone: "#F5F2EC",
  ink: "#0E1310",
  terra: "#2e8a57",
  forest: "#3B4A2E",
  gold: "#E8B254",
  divider: "#C9CFC8",
  amber: "#FFF3CD",
  amberBorder: "#E8B254",
};

export interface PaymentReminderProps {
  bookingRef: string;
  firstName: string;
  tourName: string;
  departureDate: string;
  dueDate: string;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  adminWhatsApp?: string;
}

export function PaymentReminder({
  bookingRef,
  firstName,
  tourName,
  departureDate,
  dueDate,
  totalPrice,
  paidAmount,
  remainingAmount,
  adminWhatsApp = "38348300155",
}: PaymentReminderProps) {
  const previewText = `Action required — final payment of €${remainingAmount.toLocaleString()} due in 7 days · ${bookingRef}`;

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
              Final payment due soon, {firstName}.
            </Heading>
            <Text style={{ color: `${brand.ink}99`, fontSize: "16px", lineHeight: "1.6", margin: "0 0 32px" }}>
              Your trip is coming up in 37 days. Full payment is required 30 days before departure — please settle your remaining balance by <strong style={{ color: brand.ink }}>{dueDate}</strong>.
            </Text>
          </Section>

          {/* Due date callout */}
          <Section style={{ padding: "0 40px 32px" }}>
            <div style={{ backgroundColor: brand.amber, border: `2px solid ${brand.amberBorder}`, borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "flex-start" }}>
              <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "600", margin: 0, lineHeight: "1.5" }}>
                Payment deadline: <span style={{ color: brand.forest }}>{dueDate}</span>
                <br />
                <span style={{ fontWeight: "400", color: `${brand.ink}99`, fontSize: "13px" }}>
                  This is 30 days before your {tourName} departure.
                </span>
              </Text>
            </div>
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
                Quote this reference when making payment
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

          {/* Payment breakdown */}
          <Section style={{ padding: "24px 40px 8px" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
              Payment Summary
            </Text>
            <div style={{ backgroundColor: "#fff", border: `2px solid ${brand.divider}`, borderRadius: "12px", overflow: "hidden" }}>
              <Row style={{ borderBottom: `1px solid ${brand.divider}` }}>
                <Column style={{ padding: "14px 20px" }}>
                  <Text style={{ color: `${brand.ink}88`, fontSize: "13px", margin: 0 }}>Total booking value</Text>
                </Column>
                <Column style={{ padding: "14px 20px", textAlign: "right" }}>
                  <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    €{totalPrice.toLocaleString()}
                  </Text>
                </Column>
              </Row>
              <Row style={{ borderBottom: `2px solid ${brand.divider}` }}>
                <Column style={{ padding: "14px 20px" }}>
                  <Text style={{ color: `${brand.ink}88`, fontSize: "13px", margin: 0 }}>Already paid</Text>
                </Column>
                <Column style={{ padding: "14px 20px", textAlign: "right" }}>
                  <Text style={{ color: brand.terra, fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    − €{paidAmount.toLocaleString()}
                  </Text>
                </Column>
              </Row>
              <Row style={{ backgroundColor: `${brand.gold}18` }}>
                <Column style={{ padding: "18px 20px" }}>
                  <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "700", margin: 0 }}>Remaining balance</Text>
                </Column>
                <Column style={{ padding: "18px 20px", textAlign: "right" }}>
                  <Text style={{ color: brand.forest, fontSize: "22px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: "-0.02em", margin: 0 }}>
                    €{remainingAmount.toLocaleString()}
                  </Text>
                </Column>
              </Row>
            </div>
          </Section>

          <Hr style={{ borderColor: brand.divider, margin: "24px 40px" }} />

          {/* How to pay */}
          <Section style={{ padding: "0 40px 24px" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
              How to Pay
            </Text>
            {[
              ["1", "Message us on WhatsApp with your booking reference."],
              ["2", "We'll confirm the payment details and method that works best for you."],
              ["3", "Once received, we'll send you a confirmation and you're all set for departure."],
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
              Ready to pay? Message us now.
            </Text>
            <Text style={{ color: `${brand.ink}77`, fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px" }}>
              The fastest way to settle your balance is via WhatsApp. We&apos;re available 7 days a week.
            </Text>
            <Link
              href={`https://wa.me/${adminWhatsApp}?text=Hi%2C%20I%27d%20like%20to%20pay%20my%20remaining%20balance%20for%20booking%20${bookingRef}`}
              style={{ backgroundColor: "#25D366", color: "#fff", padding: "13px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", textDecoration: "none", display: "inline-block" }}
            >
              Pay via WhatsApp
            </Link>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: brand.ink, padding: "28px 40px" }}>
            <Text style={{ color: "#ffffff55", fontSize: "12px", fontFamily: "monospace", margin: 0, lineHeight: "1.6" }}>
              Summit Balkans · Evlia Qelebia, Mitrovica e Veriut 40000, Kosovo · info@summitbalkans.com
            </Text>
            <Text style={{ color: "#ffffff33", fontSize: "11px", margin: "8px 0 0" }}>
              You received this because you have an upcoming booking on summitbalkans.com
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export default PaymentReminder;
