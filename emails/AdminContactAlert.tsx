import { Body, Container, Head, Html, Preview, Row, Column, Section, Text, Hr } from "@react-email/components";

const brand = { bone: "#F5F2EC", ink: "#0E1310", terra: "#2e8a57", forest: "#3B4A2E", divider: "#C9CFC8" };

const subjectLabels: Record<string, string> = {
  booking: "Tour booking question",
  private: "Private trip enquiry",
  gear: "Gear rental",
  general: "General question",
};

interface AdminContactAlertProps { name: string; email: string; phone?: string; subject: string; message: string; }

export function AdminContactAlert({ name, email, phone, subject, message }: AdminContactAlertProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact: {name} — {subjectLabels[subject] ?? subject}</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: "Georgia, serif", margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: brand.forest }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 40px" }}>
            <Text style={{ color: "#ffffff99", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>New Contact Message</Text>
            <Text style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: "4px 0 0" }}>Summit Balkans Admin</Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", border: `2px solid ${brand.divider}` }}>
          <Section style={{ padding: "28px 40px" }}>
            {[["Name", name], ["Email", email], ["Phone", phone || "—"], ["Subject", subjectLabels[subject] ?? subject]].map(([k, v], i, arr) => (
              <Row key={k} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : "none" }}>
                <Column style={{ width: "120px", padding: "10px 0" }}>
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
            <Text style={{ color: brand.terra, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>Message</Text>
            <Text style={{ color: brand.ink, fontSize: "15px", lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap" }}>{message}</Text>
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

export default AdminContactAlert;
