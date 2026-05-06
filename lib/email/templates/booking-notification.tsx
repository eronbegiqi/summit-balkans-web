import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Row, Column, Section, Text, Link,
} from '@react-email/components';

const brand = {
  bone: '#F5F2EC',
  ink: '#0E1310',
  terra: '#2e8a57',
  forest: '#3B4A2E',
  gold: '#E8B254',
  divider: '#C9CFC8',
};

export interface BookingNotificationProps {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  tourName: string;
  departureDate: string;
  returnDate: string;
  numAdults: number;
  numChildren: number;
  totalEur: number;
  paymentType: 'DEPOSIT' | 'FULL';
  depositAmountEur?: number;
  paymentStatus: string;
  adminBookingUrl: string;
}

export function BookingNotification({
  bookingRef,
  customerName,
  customerEmail,
  customerPhone,
  tourName,
  departureDate,
  returnDate,
  numAdults,
  numChildren,
  totalEur,
  paymentType,
  depositAmountEur,
  paymentStatus,
  adminBookingUrl,
}: BookingNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New booking {bookingRef} — {customerName} · {tourName}</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: 'Georgia, serif', margin: 0, padding: 0 }}>

        <Section style={{ backgroundColor: brand.forest, padding: '0' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 40px' }}>
            <Text style={{ color: '#fff', fontSize: '13px', fontFamily: 'monospace', letterSpacing: '0.1em', margin: 0 }}>
              SUMMIT BALKANS · ADMIN ALERT
            </Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: brand.bone }}>
          <Section style={{ padding: '40px 40px 24px' }}>
            <Heading style={{ color: brand.ink, fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              New Booking Received
            </Heading>
            <Text style={{ color: `${brand.ink}88`, fontSize: '15px', margin: 0 }}>
              Reference: <strong style={{ color: brand.ink, fontFamily: 'monospace' }}>{bookingRef}</strong>
            </Text>
          </Section>

          <Section style={{ padding: '0 40px 24px' }}>
            <Text style={{ color: brand.terra, fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Customer
            </Text>
            <div style={{ backgroundColor: '#fff', border: `2px solid ${brand.divider}`, borderRadius: '10px', overflow: 'hidden' }}>
              {[
                ['Name', customerName],
                ['Email', customerEmail],
                ...(customerPhone ? [['Phone', customerPhone]] : []),
              ].map(([label, value], i, arr) => (
                <Row key={label} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : 'none' }}>
                  <Column style={{ padding: '12px 20px', width: '120px' }}>
                    <Text style={{ color: `${brand.ink}66`, fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', margin: 0 }}>{label}</Text>
                  </Column>
                  <Column style={{ padding: '12px 20px' }}>
                    <Text style={{ color: brand.ink, fontSize: '14px', fontWeight: '600', margin: 0 }}>{value}</Text>
                  </Column>
                </Row>
              ))}
            </div>
          </Section>

          <Section style={{ padding: '0 40px 24px' }}>
            <Text style={{ color: brand.terra, fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Booking Details
            </Text>
            <div style={{ backgroundColor: '#fff', border: `2px solid ${brand.divider}`, borderRadius: '10px', overflow: 'hidden' }}>
              {[
                ['Tour', tourName],
                ['Departure', departureDate],
                ['Return', returnDate],
                ['Travellers', `${numAdults} adult${numAdults !== 1 ? 's' : ''}${numChildren > 0 ? ` + ${numChildren} child${numChildren !== 1 ? 'ren' : ''}` : ''}`],
                ['Total', `€${totalEur.toLocaleString()}`],
                ['Payment Type', paymentType === 'DEPOSIT' ? `Deposit (€${depositAmountEur?.toLocaleString()})` : 'Full payment'],
                ['Payment Status', paymentStatus],
              ].map(([label, value], i, arr) => (
                <Row key={label} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : 'none' }}>
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

          <Section style={{ padding: '0 40px 40px' }}>
            <Link
              href={adminBookingUrl}
              style={{ backgroundColor: brand.terra, color: '#fff', padding: '13px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}
            >
              View in Admin Panel →
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

export default BookingNotification;
