import {
  Body, Container, Head, Heading, Html, Preview,
  Row, Column, Section, Text, Hr,
} from "@react-email/components";
import type { BookingConfirmationProps } from "./BookingConfirmation";

const brand = { bone: "#F5F2EC", ink: "#0E1310", terra: "#2e8a57", forest: "#3B4A2E", divider: "#C9CFC8", gold: "#E8B254" };

interface AdminBookingAlertProps extends BookingConfirmationProps {
  email: string;
  phone?: string;
  dietary?: string;
  fitness?: string;
  emergencyName?: string;
  emergencyPhone?: string;
}

export function AdminBookingAlert({ bookingRef, firstName, email, phone, tourName, departureDate, returnDate, guide, adults, children, addOns, totalPrice, paymentOption, paymentAmount, dietary, fitness, emergencyName, emergencyPhone }: AdminBookingAlertProps) {
  const amountDue = paymentAmount ?? (paymentOption === "full" ? totalPrice : Math.ceil(totalPrice * 0.2));
  const paymentLabel = paymentOption === "full" ? "Full payment" : "Deposit (20%)";
  return (
    <Html>
      <Head />
      <Preview>New booking {bookingRef} — {firstName} · {tourName} · {departureDate}</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: "Georgia, serif", margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: brand.forest, padding: "0" }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 40px" }}>
            <Text style={{ color: "#ffffff99", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>New Booking Alert</Text>
            <Text style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "4px 0 0" }}>Summit Balkans Admin</Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", border: `2px solid ${brand.divider}` }}>
          <Section style={{ padding: "32px 40px 0" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 4px" }}>Ref</Text>
            <Heading style={{ color: brand.ink, fontSize: "28px", fontWeight: "700", letterSpacing: "-0.02em", margin: "0 0 24px", fontFamily: "monospace" }}>{bookingRef}</Heading>
          </Section>

          <Section style={{ padding: "0 40px 24px" }}>
            {[
              ["Tour", tourName],
              ["Departure", `${departureDate} → ${returnDate}`],
              ["Guide assigned", guide],
              ["Adults", String(adults)],
              ["Children", String(children)],
              ["Total booking", `€${totalPrice.toLocaleString()}`],
              ["Payment type", paymentLabel],
              ["Amount due now", `€${amountDue.toLocaleString()} — AWAITING BANK TRANSFER`],
            ].map(([k, v], i, arr) => (
              <Row key={k} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : "none" }}>
                <Column style={{ width: "150px", padding: "10px 0" }}>
                  <Text style={{ color: `${brand.ink}66`, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{k}</Text>
                </Column>
                <Column style={{ padding: "10px 0" }}>
                  <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "600", margin: 0 }}>{v}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: brand.divider, margin: "0 40px" }} />

          <Section style={{ padding: "24px 40px" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>Traveller Details</Text>
            {[
              ["Name", firstName],
              ["Email", email],
              ["Phone", phone || "—"],
              ["Dietary", dietary || "None"],
              ["Fitness", fitness || "—"],
              ["Emergency contact", emergencyName ? `${emergencyName} · ${emergencyPhone}` : "—"],
              ["Add-ons", addOns.length ? addOns.join(", ") : "None"],
            ].map(([k, v]) => (
              <Row key={k}>
                <Column style={{ width: "150px", padding: "6px 0" }}>
                  <Text style={{ color: `${brand.ink}66`, fontSize: "12px", fontFamily: "monospace", margin: 0 }}>{k}</Text>
                </Column>
                <Column style={{ padding: "6px 0" }}>
                  <Text style={{ color: brand.ink, fontSize: "14px", margin: 0 }}>{v}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={{ backgroundColor: brand.bone, padding: "20px 40px", borderTop: `2px solid ${brand.divider}` }}>
            <Text style={{ color: `${brand.ink}77`, fontSize: "12px", fontFamily: "monospace", margin: 0 }}>
              Confirm this booking in the admin panel once you verify the bank transfer has been received.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminBookingAlert;
