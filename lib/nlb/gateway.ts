// NLB Bank Kosova payment gateway — to be implemented when merchant credentials are available.
// Required env vars: NLB_MERCHANT_ID, NLB_TERMINAL_ID, NLB_SECRET_KEY, NLB_GATEWAY_URL

export type NLBPaymentSession = {
  redirectUrl: string;
  sessionId: string;
};

export async function createPaymentSession(
  _amountEur: number,
  _orderId: string,
  _returnUrl: string
): Promise<NLBPaymentSession> {
  throw new Error('NLB gateway not yet configured. Add merchant credentials to .env.local.');
}
