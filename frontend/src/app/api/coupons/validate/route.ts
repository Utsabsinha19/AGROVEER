import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please provide a coupon code' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    let coupon = null;

    try {
      const found = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });
      if (found && found.isActive) {
        coupon = found;
      }
    } catch {
      // Fallback in-memory coupons
      if (cleanCode === 'KISAN5') {
        coupon = {
          code: 'KISAN5',
          discountType: 'PERCENTAGE',
          discountValue: 5,
          minOrderValue: 5000,
          maxDiscountAmount: 2500,
        };
      } else if (cleanCode === 'AGROVEER1000') {
        coupon = {
          code: 'AGROVEER1000',
          discountType: 'FIXED_AMOUNT',
          discountValue: 1000,
          minOrderValue: 15000,
          maxDiscountAmount: null,
        };
      }
    }

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired trade coupon code' }, { status: 404 });
    }

    if (cartTotal < coupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        message: `Order must be at least ₹${coupon.minOrderValue.toLocaleString('en-IN')} to apply this trade coupon.`,
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      newTotal: Math.max(0, cartTotal - discountAmount),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
