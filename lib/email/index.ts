import { Resend } from 'resend';
import { render } from '@react-email/render';

export { BookingNotification } from './templates/booking-notification';
export { InquiryNotification } from './templates/inquiry-notification';
export { PaymentReceipt } from './templates/payment-receipt';
export { GearRentalConfirmation } from './templates/gear-rental-confirmation';

// Re-export customer-facing templates from the emails/ root folder
export { BookingConfirmation } from '@/emails/BookingConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'info@summitbalkans.com';
const ADMIN_EMAIL = 'info@summitbalkans.com';

type SendOptions = {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
};

async function send({ to, subject, react, replyTo }: SendOptions) {
  const html = await render(react);
  return resend.emails.send({
    from: `Summit Balkans <${FROM}>`,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}

// ─── Convenience senders ─────────────────────────────────────────────────────

export async function sendBookingNotificationToAdmin(
  props: React.ComponentProps<typeof import('./templates/booking-notification').BookingNotification>
) {
  const { BookingNotification } = await import('./templates/booking-notification');
  return send({
    to: ADMIN_EMAIL,
    subject: `New Booking: ${props.bookingRef} — ${props.tourName}`,
    react: BookingNotification(props) as React.ReactElement,
  });
}

export async function sendBookingConfirmationToCustomer(
  props: React.ComponentProps<typeof import('@/emails/BookingConfirmation').BookingConfirmation>
) {
  const { BookingConfirmation } = await import('@/emails/BookingConfirmation');
  return send({
    to: props.bookingRef, // caller passes customer email explicitly
    subject: `You're confirmed — ${props.tourName} · Ref ${props.bookingRef}`,
    react: BookingConfirmation(props) as React.ReactElement,
  });
}

export async function sendInquiryNotificationToAdmin(
  props: React.ComponentProps<typeof import('./templates/inquiry-notification').InquiryNotification>
) {
  const { InquiryNotification } = await import('./templates/inquiry-notification');
  return send({
    to: ADMIN_EMAIL,
    subject: `New Enquiry #${props.inquiryId} — ${props.name}`,
    react: InquiryNotification(props) as React.ReactElement,
    replyTo: props.email,
  });
}

export async function sendPaymentReceipt(
  customerEmail: string,
  props: React.ComponentProps<typeof import('./templates/payment-receipt').PaymentReceipt>
) {
  const { PaymentReceipt } = await import('./templates/payment-receipt');
  return send({
    to: customerEmail,
    subject: `Payment Receipt — ${props.bookingRef} · €${props.amountEur.toLocaleString()} received`,
    react: PaymentReceipt(props) as React.ReactElement,
  });
}

export async function sendGearRentalConfirmation(
  customerEmail: string,
  props: React.ComponentProps<typeof import('./templates/gear-rental-confirmation').GearRentalConfirmation>
) {
  const { GearRentalConfirmation } = await import('./templates/gear-rental-confirmation');
  return send({
    to: customerEmail,
    subject: `Gear Reserved — ${props.bookingRef} · ${props.items.length} item${props.items.length !== 1 ? 's' : ''}`,
    react: GearRentalConfirmation(props) as React.ReactElement,
  });
}
