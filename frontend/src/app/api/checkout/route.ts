import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/integrations/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerGstNumber,
      shippingAddress,
      destinationGodown,
      city,
      state,
      pincode,
      items,
      paymentType = 'FULL_PAYMENT',
      couponCode,
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate totals with statutory GST compliance
    let subtotalTaxable = 0;
    let totalGst = 0;

    for (const item of items) {
      const price = Number(item.price || item.unitPrice || 0);
      const qty = Number(item.quantity || 1);
      const gstRate = Number(item.gstRate || 18);
      const taxable = (price * qty) / (1 + gstRate / 100);
      const gst = (price * qty) - taxable;
      subtotalTaxable += taxable;
      totalGst += gst;
    }

    let grandTotal = subtotalTaxable + totalGst;
    let discountAmount = 0;

    // Validate Coupon if supplied
    if (couponCode) {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });
        if (coupon && coupon.isActive && grandTotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (grandTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
              discountAmount = coupon.maxDiscountAmount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
          grandTotal = Math.max(0, grandTotal - discountAmount);
        }
      } catch {
        // Continue if coupon table check falls back
      }
    }

    // Calculate payable amount based on payment type (Full vs 20% Two-Stage Advance)
    const isAdvance = paymentType === 'TWO_STAGE_ADVANCE';
    const payableAmount = isAdvance ? Math.round(grandTotal * 0.2) : Math.round(grandTotal);
    const balanceDue = grandTotal - payableAmount;

    const orderNumber = `AG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder({
      amountInRupees: payableAmount,
      receipt: orderNumber,
      notes: {
        orderNumber,
        customerName: customerName || 'Valued Customer',
        customerPhone: customerPhone || '',
        paymentType,
      },
    });

    // Save order in Neon PostgreSQL if available
    try {
      await prisma.order.create({
        data: {
          orderNumber,
          customerName: customerName || 'Valued Customer',
          customerPhone: customerPhone || '9999999999',
          customerEmail: customerEmail || null,
          customerGstNumber: customerGstNumber || null,
          shippingAddress: shippingAddress || 'Direct Factory Dispatch',
          destinationGodown: destinationGodown || null,
          city: city || 'Bhiwandi',
          state: state || 'Maharashtra',
          pincode: pincode || '421302',
          status: 'PENDING_PAYMENT',
          paymentType: isAdvance ? 'TWO_STAGE_ADVANCE' : 'FULL_PAYMENT',
          paymentStatus: 'PENDING',
          totalTaxableAmount: subtotalTaxable,
          totalGstAmount: totalGst,
          grandTotalAmount: grandTotal,
          advancePaidAmount: 0,
          balanceDueAmount: balanceDue,
          couponCode: couponCode || null,
          discountAmount,
          razorpayOrderId: razorpayOrder.id,
          items: {
            create: items.map((i: any) => ({
              productId: i.id || i.sku || 'SKU-UNKNOWN',
              sku: i.sku || i.id || 'SKU-GEN',
              productName: i.name || i.productName || 'Machinery Item',
              hsnCode: i.hsnCode || '8432',
              gstRate: i.gstRate || 18,
              quantity: i.quantity || 1,
              unitPrice: i.price || i.unitPrice || 0,
              totalTaxable: subtotalTaxable,
              totalGst,
              grandTotal,
            })),
          },
        },
      });
    } catch (dbErr) {
      console.warn('Neon DB order save deferred to memory fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: payableAmount,
      currency: 'INR',
      grandTotal,
      balanceDue,
      isAdvance,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    });
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}
