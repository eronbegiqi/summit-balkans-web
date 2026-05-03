import { Body, Container, Head, Html, Preview, Row, Column, Section, Text, Hr } from "@react-email/components";

const brand = { bone: "#F5F2EC", ink: "#0E1310", terra: "#2e8a57", forest: "#3B4A2E", divider: "#C9CFC8" };

interface AdminPrivateTripAlertProps {
  name: string; email: string; phone?: string; notes?: string;
  destinations: string[]; groupSize: number; experiences: string[];
  dateOption: string; customFrom?: string; customTo?: string;
}

export function AdminPrivateTripAlert({ name, email, phone, notes, destinations, groupSize, experiences, dateOption, customFrom, customTo }: AdminPrivateTripAlertProps) {
  const dateDisplay = customFrom ? `${customFrom}${customTo ? ` → ${customTo}` : ""}` : dateOption;
  return (
    <Html>
      <Head />
      <Preview>{`New private trip enquiry — ${name} · ${groupSize} people · ${destinations.join(", ")}`}</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: "Georgia, serif", margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: brand.forest }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 40px" }}>
            <Text style={{ color: "#ffffff99", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>New Private Trip Enquiry</Text>
            <Text style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: "4px 0 0" }}>Summit Balkans Admin</Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", border: `2px solid ${brand.divider}` }}>
          <Section style={{ padding: "28px 40px" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>Contact</Text>
            {[["Name", name], ["Email", email], ["Phone", phone || "—"]].map(([k, v], i, arr) => (
              <Row key={k} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : "none" }}>
                <Column style={{ width: "120px", padding: "8px 0" }}>
                  <Text style={{ color: `${brand.ink}66`, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{k}</Text>
                </Column>
                <Column style={{ padding: "8px 0" }}>
                  <Text style={{ color: brand.ink, fontSize: "14px", fontWeight: "600", margin: 0 }}>{v}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: brand.divider, margin: "0 40px" }} />

          <Section style={{ padding: "24px 40px" }}>
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>Trip Details</Text>
            {[
              ["Destinations", destinations.join(", ") || "Flexible"],
              ["Group size", `${groupSize} people`],
              ["When", dateDisplay || "Flexible"],
              ["Experience", experiences.length ? experiences.join(", ") : "To discuss"],
              ["Notes", notes || "—"],
            ].map(([k, v]) => (
              <Row key={k}>
                <Column style={{ width: "120px", padding: "6px 0", verticalAlign: "top" }}>
                  <Text style={{ color: `${brand.ink}66`, fontSize: "11px", fontFamily: "monospace", margin: 0 }}>{k}</Text>
                </Column>
                <Column style={{ padding: "6px 0" }}>
                  <Text style={{ color: brand.ink, fontSize: "14px", margin: 0, whiteSpace: "pre-wrap" }}>{v}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={{ backgroundColor: brand.bone, padding: "16px 40px", borderTop: `2px solid ${brand.divider}` }}>
            <Text style={{ color: `${brand.ink}77`, fontSize: "12px", fontFamily: "monospace", margin: 0 }}>
              Saved to Airtable → Submissions · Reply directly to {email}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminPrivateTripAlert;
