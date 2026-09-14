import { Body, Container, Head, Html, Preview, Section, Text, Button } from "@react-email/components";

const brand = { bone: "#F5F2EC", ink: "#0E1310", terra: "#2e8a57", forest: "#3B4A2E", divider: "#C9CFC8" };

interface BlogDraftReadyProps {
  title: string;
  excerpt: string;
  targetKeyword: string;
  editUrl: string;
}

export function BlogDraftReady({ title, excerpt, targetKeyword, editUrl }: BlogDraftReadyProps) {
  return (
    <Html>
      <Head />
      <Preview>New blog draft ready for review: {title}</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: "Georgia, serif", margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: brand.forest }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 40px" }}>
            <Text style={{ color: "#ffffff99", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Weekly Blog Automation</Text>
            <Text style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: "4px 0 0" }}>New draft ready for review</Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", border: `2px solid ${brand.divider}` }}>
          <Section style={{ padding: "28px 40px" }}>
            <Text style={{ color: `${brand.ink}66`, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>Target keyword</Text>
            <Text style={{ color: brand.terra, fontSize: "14px", fontWeight: "600", margin: "0 0 20px" }}>{targetKeyword}</Text>

            <Text style={{ color: brand.ink, fontSize: "20px", fontWeight: "700", margin: "0 0 10px" }}>{title}</Text>
            <Text style={{ color: brand.ink, fontSize: "15px", lineHeight: "1.7", margin: 0 }}>{excerpt}</Text>
          </Section>

          <Section style={{ padding: "0 40px 32px" }}>
            <Button href={editUrl} style={{ backgroundColor: brand.terra, color: "#fff", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
              Review &amp; publish
            </Button>
          </Section>

          <Section style={{ backgroundColor: brand.bone, padding: "16px 40px", borderTop: `2px solid ${brand.divider}` }}>
            <Text style={{ color: `${brand.ink}77`, fontSize: "12px", fontFamily: "monospace", margin: 0 }}>
              Saved as an unpublished draft — nothing goes live until you publish it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BlogDraftReady;
