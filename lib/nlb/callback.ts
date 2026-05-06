// NLB payment callback handler — to be implemented when merchant credentials are available.

export type ProcessPaymentResultOptions = {
  bookingId: number;
  transactionRef: string;
  amountEur: number;
  success: boolean;
};

export async function processPaymentResult(
  _options: ProcessPaymentResultOptions
): Promise<void> {
  throw new Error('NLB gateway not yet configured. Add merchant credentials to .env.local.');
}
