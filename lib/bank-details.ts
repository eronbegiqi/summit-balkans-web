/**
 * Bank transfer details shown to customers at checkout and in confirmation emails.
 * Update these values to match your actual account — they are customer-facing.
 */
export const BANK = {
  accountHolder: "Mergi Memoviq – Summit Balkans",
  bank: "Raiffeisen Bank Kosovo J.S.C., Pristina",
  iban: "XK05 1503 0010 0683 2866",
  bic: "RBKOXKPRXXX",
  currency: "EUR",
  /** Reference format shown to customers. {ref} is replaced with the booking reference. */
  referenceTemplate: (ref: string) => `SB-BOOKING ${ref}`,
};

export const DEPOSIT_PERCENT = 20; // % of total
