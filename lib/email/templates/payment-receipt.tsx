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

export interface PaymentReceiptProps {
  bookingRef: string;
  firstName: string;
  tourName: string;
  paymentType: 'DEPOSIT' | 'FULL' | 'FINAL';
  amountEur: number;
  totalEur: number;
  remainingEur: number;
  paymentMethod: string;
  paymentDate: string;
  transactionRef?: string;
}

export function PaymentReceipt({
  bookingRef,
  firstName,
  tourName,
  paymentType,
  amountEur,
  totalEur,
  remainingEur,
  paymentMethod,
  paymentDate,
  transactionRef,
}: PaymentReceiptProps) {
  const isFullyPaid = remainingEur <= 0;
  const typeLabel = paymentType === 'DEPOSIT' ? 'Deposit' : paymentType === 'FINAL' ? 'Final Payment' : 'Full Payment';

  return (
    <Html>
      <Head />
      <Preview>Payment receipt — {bookingRef} · {typeLabel} of €{amountEur.toLocaleString()} received</Preview>
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
              Payment Receipt
            </Text>
            <Heading style={{ color: brand.ink, fontSize: '32px', fontWeight: '700', letterSpacing: '-0.025em', margin: '0 0 8px' }}>
              Payment confirmed, {firstName}.
            </Heading>
            <Text style={{ color: `${brand.ink}88`, fontSize: '15px', lineHeight: '1.6', margin: '0 0 32px' }}>
              We&apos;ve received your {typeLabel.toLowerCase()} for <strong>{tourName}</strong>.
            </Text>
          </Section>

          {/* Payment summary */}
          <Section style={{ padding: '0 40px 32px' }}>
            <div style={{ backgroundColor: brand.ink, borderRadius: '12px', padding: '24px 28px' }}>
              <Text style={{ color: brand.gold, fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                {typeLabel} Received
              </Text>
              <Text style={{ color: '#fff', fontSize: '36px', fontFamily: 'monospace', fontWeight: '700', margin: '0 0 4px' }}>
                €{amountEur.toLocaleString()}
              </Text>
              <Text style={{ color: '#ffffff66', fontSize: '13px', fontFamily: 'monospace', margin: 0 }}>
                {paymentDate} · {paymentMethod}
              </Text>
            </div>
          </Section>

          {/* Breakdown */}
          <Section style={{ padding: '0 40px 8px' }}>
            <div style={{ backgroundColor: '#fff', border: `2px solid ${brand.divider}`, borderRadius: '10px', overflow: 'hidden' }}>
              {[
                ['Booking Ref', bookingRef],
                ...(transactionRef ? [['Transaction Ref', transactionRef]] : []),
                ['Tour', tourName],
                ['Trip Total', `€${totalEur.toLocaleString()}`],
                ['Amount Paid (this payment)', `€${amountEur.toLocaleString()}`],
                ['Remaining Balance', isFullyPaid ? 'Paid in full ✓' : `€${remainingEur.toLocaleString()}`],
              ].map(([label, value], i, arr) => (
                <Row key={label} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${brand.divider}` : 'none' }}>
                  <Column style={{ padding: '13px 20px', width: '160px' }}>
                    <Text style={{ color: `${brand.ink}66`, fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', margin: 0 }}>{label}</Text>
                  </Column>
                  <Column style={{ padding: '13px 20px' }}>
                    <Text style={{ color: isFullyPaid && label === 'Remaining Balance' ? brand.terra : brand.ink, fontSize: '14px', fontWeight: '600', margin: 0 }}>
                      {value}
                    </Text>
                  </Column>
                </Row>
              ))}
            </div>
          </Section>

          {!isFullyPaid && (
            <Section style={{ padding: '24px 40px 0' }}>
              <div style={{ backgroundColor: `${brand.gold}22`, border: `1.5px solid ${brand.gold}`, borderRadius: '10px', padding: '16px 20px' }}>
                <Text style={{ color: brand.forest, fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  <strong>Final payment reminder:</strong> Your remaining balance of €{remainingEur.toLocaleString()} is due 30 days before departure. We&apos;ll send a reminder when it&apos;s due.
                </Text>
              </div>
            </Section>
          )}

          <Hr style={{ borderColor: brand.divider, margin: '32px 40px 0' }} />

          <Section style={{ padding: '24px 40px 40px' }}>
            <Text style={{ color: `${brand.ink}77`, fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
              Questions about your payment? Email us at{' '}
              <a href="mailto:info@summitbalkans.com" style={{ color: brand.terra }}>
                info@summitbalkans.com
              </a>
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

export default PaymentReceipt;
