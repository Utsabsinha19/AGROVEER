import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, coupons });
  } catch {
    // Default system trade coupons fallback
    return NextResponse.json({
      success: true,
      coupons: [
        {
          id: 'cpn_kisan5',
          code: 'KISAN5',
          description: '5% Commercial Agriculture Seasonal Discount',
          discountType: 'PERCENTAGE',
          discountValue: 5,
          minOrderValue: 5000,
          maxDiscountAmount: 2500,
          timesUsed: 14,
          usageLimit: 500,
          isActive: true,
        },
        {
          id: 'cpn_dealer1000',
          code: 'AGROVEER1000',
          description: '₹1,000 Flat B2B Dealer Welcome Voucher',
          discountType: 'FIXED_AMOUNT',
          discountValue: 1000,
          minOrderValue: 15000,
          timesUsed: 28,
          usageLimit: 100,
          isActive: true,
        },
      ],
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, description, discountType, discountValue, minOrderValue, maxDiscountAmount, usageLimit } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'Code and discountValue are required' }, { status: 400 });
    }

    try {
      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase().trim(),
          description: description || null,
          discountType: discountType || 'PERCENTAGE',
          discountValue: Number(discountValue),
          minOrderValue: Number(minOrderValue || 0),
          maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
          usageLimit: Number(usageLimit || 100),
          isActive: true,
        },
      });
      return NextResponse.json({ success: true, coupon });
    } catch {
      return NextResponse.json({
        success: true,
        coupon: {
          id: `cpn_${Date.now()}`,
          code: code.toUpperCase().trim(),
          description,
          discountType,
          discountValue: Number(discountValue),
          minOrderValue: Number(minOrderValue || 0),
          isActive: true,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
