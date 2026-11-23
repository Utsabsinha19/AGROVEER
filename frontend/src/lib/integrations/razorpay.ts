import Razorpay from 'razorpay';
import crypto from 'crypto';

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

export const razorpayInstance = 
  keyId && keySecret && !keyId.includes('YourTestKeyId')
    ? new Razorpay({ key_id: keyId, key_secret: keySecret })
    : null;

export interface CreateOrderParams {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder({ amountInRupees, receipt, notes }: CreateOrderParams) {
  if (!razorpayInstance) {
    // Development fallback mock order if keys are pending
    return {
      id: `order_mock_${Date.now()}`,
      entity: 'order',
      amount: Math.round(amountInRupees * 100),
      currency: 'INR',
      receipt,
      status: 'created',
      notes,
    };
  }

  const options = {
    amount: Math.round(amountInRupees * 100), // amount in paise
    currency: 'INR',
    receipt,
    notes: notes || {},
  };

  return await razorpayInstance.orders.create(options);
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!keySecret) return true; // allow in local dev if secret not configured

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

