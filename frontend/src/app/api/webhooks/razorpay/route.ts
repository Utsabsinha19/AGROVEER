import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      try {
        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            status: 'PAID_FULL_CONFIRMED',
            paymentStatus: 'PAID_IN_FULL',
            razorpayPaymentId: payment.id,
          },
        });
      } catch (err) {
        console.warn('Webhook DB update skipped:', err);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Razorpay webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}

