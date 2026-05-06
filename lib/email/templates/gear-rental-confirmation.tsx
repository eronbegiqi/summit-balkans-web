import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Row, Column, Section, Text,
} from '@react-email/components';

const brand = {
  bone: '#F5F2EC',
  ink: '#0E1310',
  terra: '#2e8a57',
  forest: '#3B4A2E',
  gold: '#E8B254',
  divider: '#C9CFC8',
};

export interface GearRentalItem {
  name: string;
  unitCode: string;
  size?: string;
  dailyRateEur: number;
  totalDays: number;
  totalEur: number;
  depositEur?: number;
}

export interface GearRentalConfirmationProps {
  bookingRef: string;
  firstName: string;
  rentalStartDate: string;
  rentalEndDate: string;
  expectedReturnDate: string;
  items: GearRentalItem[];
  gearTotalEur: number;
  depositTotalEur: number;
}

export function GearRentalConfirmation({
  bookingRef,
  firstName,
  rentalStartDate,
  rentalEndDate,
  expectedReturnDate,
  items,
  gearTotalEur,
  depositTotalEur,
}: GearRentalConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Gear rental confirmed — ${bookingRef} · ${items.length} item${items.length !== 1 ? 's' : ''} reserved`}</Preview>
      <Body style={{ backgroundColor: brand.bone, fontFamily: 'Georgia, serif', margin: 0, padding: 0 }}>

        <Section style={{ backgroundColor: brand.terra, padding: '0' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 40px' }}>
            <Text style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' }}>
              Summit Balkans
            </Text>
          </Container>
        </Section>

        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: brand.bone }}>
          <Section style={{ padding: '40px 40px 0' }}>
            <Text style={{ color: brand.terra, fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Gear Rental Confirmed
            </Text>
            <Heading style={{ color: brand.ink, fontSize: '32px', fontWeight: '700', letterSpacing: '-0.025em', margin: '0 0 8px' }}>
              Your gear is reserved, {firstName}.
            </Heading>
            <Text style={{ color: `${brand.ink}88`, fontSize: '15px', lineHeight: '1.6', margin: '0 0 32px' }}>
              The following gear has been set aside for your trip. Please check the dates and unit codes below.
            </Text>
          </Section>

          {/* Rental dates */}
          <Section style={{ padding: '0 40px 24px' }}>
            <div style={{ backgroundColor: brand.ink, borderRadius: '12px', padding: '20px 28px' }}>
              <Row>
                <Column style={{ width: '50%' }}>
                  <Text style={{ color: brand.gold, fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Rental Start</Text>
                  <Text style={{ color: '#fff', fontSize: '16px', fontWeight: '700', fontFamily: 'monospace', margin: 0 }}>{rentalStartDate}</Text>
                </Column>
                <Column style={{ width: '50%' }}>
                  <Text style={{ color: brand.gold, fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Return By</Text>
                  <Text style={{ color: '#fff', fontSize: '16px', fontWeight: '700', fontFamily: 'monospace', margin: 0 }}>{expectedReturnDate}</Text>
                </Column>
              </Row>
            </div>
          </Section>

          {/* Gear list */}
          <Section style={{ padding: '0 40px 24px' }}>
            <Text style={{ color: brand.terra, fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Reserved Items
            </Text>
            <div style={{ backgroundColor: '#fff', border: `2px solid ${brand.divider}`, borderRadius: '10px', overflow: 'hidden' }}>
              {items.map((item, i) => (
                <Row key={item.unitCode} style={{ borderBottom: i < items.length - 1 ? `1px solid ${brand.divider}` : 'none' }}>
                  <Column style={{ padding: '14px 20px' }}>
                    <Text style={{ color: brand.ink, fontSize: '14px', fontWeight: '600', margin: '0 0 2px' }}>{item.name}</Text>
                    <Text style={{ color: `${brand.ink}66`, fontSize: '11px', fontFamily: 'monospace', margin: 0 }}>
                      Unit: {item.unitCode}{item.size ? ` · Size: ${item.size}` : ''}
                    </Text>
                  </Column>
                  <Column style={{ padding: '14px 20px', textAlign: 'right', width: '140px' }}>
                    <Text style={{ color: brand.ink, fontSize: '14px', fontWeight: '700', margin: '0 0 2px' }}>€{item.totalEur.toLocaleString()}</Text>
                    <Text style={{ color: `${brand.ink}66`, fontSize: '11px', fontFamily: 'monospace', margin: 0 }}>
                      {item.totalDays}d × €{item.dailyRateEur}
                    </Text>
                  </Column>
                </Row>
              ))}
            </div>
          </Section>

          {/* Totals */}
          <Section style={{ padding: '0 40px 8px' }}>
            <div style={{ backgroundColor: '#fff', border: `2px solid ${brand.divider}`, borderRadius: '10px', overflow: 'hidden' }}>
              {[
                ['Gear Rental Total', `€${gearTotalEur.toLocaleString()}`],
                ['Refundable Deposit', `€${depositTotalEur.toLocaleString()}`],
              ].map(([label, value], i, arr) => (
                <Row key={label} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : 'none' }}>
                  <Column style={{ padding: '13px 20px' }}>
                    <Text style={{ color: brand.ink, fontSize: '14px', fontWeight: '600', margin: 0 }}>{label}</Text>
                  </Column>
                  <Column style={{ padding: '13px 20px', textAlign: 'right', width: '120px' }}>
                    <Text style={{ color: brand.ink, fontSize: '14px', fontWeight: '700', margin: 0 }}>{value}</Text>
                  </Column>
                </Row>
              ))}
            </div>
          </Section>

          <Section style={{ padding: '20px 40px 0' }}>
            <div style={{ backgroundColor: `${brand.terra}15`, border: `1.5px solid ${brand.terra}`, borderRadius: '10px', padding: '16px 20px' }}>
              <Text style={{ color: brand.forest, fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                <strong>Return policy:</strong> All gear must be returned by {expectedReturnDate}. Late returns incur a daily charge. Damaged items will be assessed at return. Deposits are refunded within 5 business days of return confirmation.
              </Text>
            </div>
          </Section>

          <Hr style={{ borderColor: brand.divider, margin: '32px 40px 0' }} />

          <Section style={{ padding: '24px 40px 40px' }}>
            <Text style={{ color: `${brand.ink}77`, fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
              Questions? Email{' '}
              <a href="mailto:info@summitbalkans.com" style={{ color: brand.terra }}>info@summitbalkans.com</a>
              {' '}or find your booking in your confirmation email (ref: {bookingRef}).
            </Text>
          </Section>

          <Section style={{ backgroundColor: brand.ink, padding: '28px 40px' }}>
            <Text style={{ color: '#ffffff55', fontSize: '12px', fontFamily: 'monospace', margin: 0, lineHeight: '1.6' }}>
              Summit Balkans · Evlia Qelebia, Mitrovica e Veriut 40000, Kosovo · info@summitbalkans.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default GearRentalConfirmation;
