import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendDispatchNoticeEmail } from '@/lib/integrations/resend';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { order_id, awb, courier_name, current_status } = payload;

    if (order_id) {
      const isDelivered = current_status?.toLowerCase().includes('delivered');
      const isDispatched = current_status?.toLowerCase().includes('in transit') || current_status?.toLowerCase().includes('out for delivery');

      try {
        const order = await prisma.order.findFirst({
          where: {
            OR: [
              { id: order_id },
              { orderNumber: order_id }
            ]
          }
        });

        if (order) {
          const updated = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: isDelivered ? 'DELIVERED' : (isDispatched ? 'DISPATCHED' : order.status),
              shiprocketAwbCode: awb || order.shiprocketAwbCode,
              carrierName: courier_name || order.carrierName,
              dispatchedAt: isDispatched && !order.dispatchedAt ? new Date() : order.dispatchedAt,
            }
          });

          // If freshly dispatched, send email
          if (isDispatched && updated.customerEmail && awb) {
            await sendDispatchNoticeEmail({
              toEmail: updated.customerEmail,
              customerName: updated.customerName,
              orderNumber: updated.orderNumber,
              carrierName: courier_name || 'Express Parcel Logistics',
              trackingCode: awb,
              trackingUrl: `https://shiprocket.co/tracking/${awb}`,
            });
          }
        }
      } catch (err) {
        console.warn('Shiprocket webhook DB sync skipped:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Shiprocket webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}

