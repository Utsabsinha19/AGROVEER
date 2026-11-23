import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!phone && !email) {
      return NextResponse.json({ error: 'Provide phone or email to fetch account orders' }, { status: 400 });
    }

    try {
      const whereConditions: any[] = [];
      if (phone) whereConditions.push({ customerPhone: phone });
      if (email) whereConditions.push({ customerEmail: email });

      const orders = await prisma.order.findMany({
        where: {
          OR: whereConditions,
        },
        include: {
          items: true,
          warehouseSerials: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, count: orders.length, orders });
    } catch {
      return NextResponse.json({ success: true, count: 0, orders: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

