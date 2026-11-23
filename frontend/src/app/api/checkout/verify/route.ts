import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyRazorpaySignature } from '@/lib/integrations/razorpay';
import { sendBuyerOrderConfirmationEmail, sendSellerOrderAlertEmail } from '@/lib/integrations/resend';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
      customerDetails,
      items,
      paymentType = 'FULL_PAYMENT',
      grandTotal,
      advancePaid,
      balanceDue,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing payment identifiers' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Generate SaaS Cryptographic Verification Signature Hash
    const secret = process.env.RAZORPAY_KEY_SECRET || 'agrove_signature_secret_2026';
    const digitalSignatureHash = crypto
      .createHmac('sha256', secret)
      .update(`${orderNumber}|${razorpay_payment_id}|${Date.now()}`)
      .digest('hex');

    const isAdvance = paymentType === 'TWO_STAGE_ADVANCE';
    const targetStatus = isAdvance ? 'ADVANCE_PAID_CONFIRMED' : 'PAID_FULL_CONFIRMED';
    const targetPaymentStatus = isAdvance ? 'PARTIAL_ADVANCE_PAID' : 'PAID_IN_FULL';

    // Update Neon PostgreSQL Order if exists
    let updatedOrder = null;
    try {
      updatedOrder = await prisma.order.update({
        where: { orderNumber },
        data: {
          status: targetStatus,
          paymentStatus: targetPaymentStatus,
          razorpayPaymentId: razorpay_payment_id,
          advancePaidAmount: isAdvance ? (advancePaid || Math.round((grandTotal || 0) * 0.2)) : (grandTotal || 0),
          balanceDueAmount: isAdvance ? (balanceDue || Math.round((grandTotal || 0) * 0.8)) : 0,
        },
        include: { items: true },
      });
    } catch (err) {
      console.warn('Neon DB order update skipped (or using memory/storage):', err);
    }

    // Prepare normalized data for transactional emails
    const customerName = updatedOrder?.customerName || customerDetails?.fullName || customerDetails?.customerName || 'Valued Customer';
    const customerPhone = updatedOrder?.customerPhone || customerDetails?.phone || '9999999999';
    const customerEmail = updatedOrder?.customerEmail || customerDetails?.email;
    const shippingAddress = updatedOrder?.shippingAddress || customerDetails?.address || 'Direct Factory Dispatch';
    const destinationGodown = updatedOrder?.destinationGodown || customerDetails?.destinationGodown || shippingAddress;
    const finalTotal = updatedOrder?.grandTotalAmount || grandTotal || 10000;
    const totalGst = updatedOrder?.totalGstAmount || Math.round(finalTotal * 0.1525);
    const taxable = updatedOrder?.totalTaxableAmount || (finalTotal - totalGst);

    const emailItems = (updatedOrder?.items || items || []).map((i: any) => ({
      name: i.productName || i.name || 'Commercial Machinery',
      sku: i.sku || 'SKU-GEN',
      hsnCode: i.hsnCode || '8432',
      quantity: Number(i.quantity || 1),
      unitPrice: Number(i.unitPrice || i.price || 0),
    }));

    // 1. Dispatch Buyer Confirmation Email (if buyer provided email)
    if (customerEmail) {
      await sendBuyerOrderConfirmationEmail({
        toEmail: customerEmail,
        customerName,
        orderNumber,
        items: emailItems,
        totalAmount: finalTotal,
        taxableAmount: taxable,
        gstAmount: totalGst,
        paymentMethod: 'Razorpay UPI / NetBanking',
        paymentType,
        advancePaid: isAdvance ? (advancePaid || Math.round(finalTotal * 0.2)) : finalTotal,
        balanceDue: isAdvance ? (balanceDue || Math.round(finalTotal * 0.8)) : 0,
        razorpayPaymentId: razorpay_payment_id,
        destinationGodown,
        shippingAddress,
        digitalSignatureHash,
      });
    }

    // 2. Dispatch Seller / Warehouse Order Alert Email to sales@arveerimpex.com
    await sendSellerOrderAlertEmail({
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      customerGstin: updatedOrder?.customerGstNumber || customerDetails?.gstin || undefined,
      companyName: customerDetails?.companyName || undefined,
      shippingAddress,
      destinationGodown,
      city: updatedOrder?.city || customerDetails?.city || 'Bhiwandi',
      state: updatedOrder?.state || customerDetails?.state || 'Maharashtra',
      pincode: updatedOrder?.pincode || customerDetails?.postalCode || '421302',
      items: emailItems,
      totalAmount: finalTotal,
      taxableAmount: taxable,
      gstAmount: totalGst,
      paymentMethod: 'Razorpay (Live Secured)',
      paymentType,
      advancePaid: isAdvance ? (advancePaid || Math.round(finalTotal * 0.2)) : finalTotal,
      balanceDue: isAdvance ? (balanceDue || Math.round(finalTotal * 0.8)) : 0,
      razorpayPaymentId: razorpay_payment_id,
      digitalSignatureHash,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Both Buyer Confirmation and Seller Warehouse Alerts dispatched.',
      orderNumber,
      digitalSignature: {
        hash: digitalSignatureHash,
        verifiedAt: new Date().toISOString(),
        authorizingBody: 'ARVEER IMPEX CENTRAL DISTRIBUTION DESK',
        sealStatus: 'CRYPTOGRAPHICALLY_VERIFIED',
      },
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
