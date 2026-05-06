import {
  Body, Container, Head, Heading, Html,
  Preview, Row, Column, Section, Text, Link,
} from '@react-email/components';

const brand = {
  bone: '#F5F2EC',
  ink: '#0E1310',
  terra: '#2e8a57',
  forest: '#3B4A2E',
  divider: '#C9CFC8',
};

const typeLabels: Record<string, string> = {
  CONTACT: 'Contact Form',
  PRIVATE_TRIP: 'Private Trip Request',
  TRIP_ALERT: 'Trip Alert Signup',
  GEAR_RENTAL: 'Gear Rental Enquiry',
  PRESS: 'Press Enquiry',
};

export interface InquiryNotificationProps {
  inquiryId: number;
  type: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  groupSize?: number;
  preferredDatesStart?: string;
  preferredDatesEnd?: string;
  countriesOfInterest?: string[];
  budgetEur?: number;
  sourcePage?: string;
  adminInquiryUrl: string;
}

export function InquiryNotification({
  inquiryId,
  type,
  name,
  email,
  phone,
  subject,
  message,
  groupSize,
  preferredDatesStart,
  preferredDatesEnd,
  countriesOfInterest,
  budgetEur,
  sourcePage,
  adminInquiryUrl,
}: InquiryNotificationProps) {
  const typeLabel = typeLabels[type] ?? type;

  const details: Array<[string, string]> = [
    ['From', name],
    ['Email', email],
    ...(phone ? [['Phone', phone] as [string, string]] : []),
    ...(subject ? [['Subject', subject] as [string, string]] : []),
    ...(groupSize ? [['Group Size', String(groupSize)] as [string, string]] : []),
    ...(preferredDatesStart ? [['Preferred Dates', `${preferredDatesStart}${preferredDatesEnd ? ` → ${preferredDatesEnd}` : ''}`] as [string, string]] : []),
    ...(countriesOfInterest?.length ? [['Countries', countriesOfInterest.join(', ')] as [string, string]] : []),
    ...(budgetEur ? [['Budget', `€${budgetEur.toLocaleString()}`] as [string, string]] : []),
    ...(sourcePage ? [['Source Page', sourcePage] as [string, string]] : []),
  ];

  return (
    <Html>
      <Head />
      <Preview>New {typeLabel} from {name}</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: 'Georgia, serif', margin: 0, padding: 0 }}>

        <Section style={{ backgroundColor: brand.forest, padding: '0' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 40px' }}>
            <Text style={{ color: '#fff', fontSize: '13px', fontFamily: 'monospace', letterSpacing: '0.1em', margin: 0 }}>
              SUMMIT BALKANS · ENQUIRY ALERT
            </Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: brand.bone }}>
          <Section style={{ padding: '40px 40px 24px' }}>
            <Text style={{ color: brand.terra, fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              {typeLabel}
            </Text>
            <Heading style={{ color: brand.ink, fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 4px' }}>
              New Enquiry #{inquiryId}
            </Heading>
          </Section>

          <Section style={{ padding: '0 40px 24px' }}>
            <div style={{ backgroundColor: '#fff', border: `2px solid ${brand.divider}`, borderRadius: '10px', overflow: 'hidden' }}>
              {details.map(([label, value], i) => (
                <Row key={label} style={{ borderBottom: i < details.length - 1 ? `1px solid ${brand.divider}` : 'none' }}>
                  <Column style={{ padding: '12px 20px', width: '140px' }}>
                    <Text style={{ color: `${brand.ink}66`, fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', margin: 0 }}>{label}</Text>
                  </Column>
                  <Column style={{ padding: '12px 20px' }}>
                    <Text style={{ color: brand.ink, fontSize: '14px', fontWeight: '600', margin: 0 }}>{value}</Text>
                  </Column>
                </Row>
              ))}
            </div>
          </Section>

          {message && (
            <Section style={{ padding: '0 40px 24px' }}>
              <Text style={{ color: brand.terra, fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                Message
              </Text>
              <div style={{ backgroundColor: '#fff', border: `2px solid ${brand.divider}`, borderRadius: '10px', padding: '20px' }}>
                <Text style={{ color: brand.ink, fontSize: '14px', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap' }}>{message}</Text>
              </div>
            </Section>
          )}

          <Section style={{ padding: '0 40px 40px' }}>
            <Link
              href={adminInquiryUrl}
              style={{ backgroundColor: brand.terra, color: '#fff', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}
            >
              View & Reply in Admin →
            </Link>
          </Section>

          <Section style={{ backgroundColor: brand.ink, padding: '20px 40px' }}>
            <Text style={{ color: '#ffffff44', fontSize: '11px', fontFamily: 'monospace', margin: 0 }}>
              Summit Balkans Admin · This is an automated notification
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InquiryNotification;
