// NLB HMAC-SHA256 signature verification — to be implemented when merchant credentials are available.

export type NLBCallbackParams = Record<string, string>;

export type NLBPaymentResult = {
  success: boolean;
  orderId: string;
  transactionRef: string;
  amountEur: number;
};

export function verifyCallback(_params: NLBCallbackParams): NLBPaymentResult {
  throw new Error('NLB gateway not yet configured. Add merchant credentials to .env.local.');
}
