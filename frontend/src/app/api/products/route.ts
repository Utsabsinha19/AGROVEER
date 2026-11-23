import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { COMPATIBLE_SPARES, PARENT_MACHINES } from '@/data/sparesCompatibility';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const type = searchParams.get('type'); // 'machinery' | 'spares' | 'all'

    try {
      const where: any = {};
      if (category && category !== 'All') {
        where.category = { contains: category, mode: 'insensitive' };
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } }
        ];
      }

      const products = await prisma.product.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      if (products && products.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'neon_postgresql',
          count: products.length,
          products
        });
      }
    } catch (dbError) {
      console.warn('Neon DB query failed, falling back to local static catalog:', dbError);
    }

    // Fallback to verified local spares and machinery catalog
    let fallbackItems: any[] = [];
    if (type === 'machinery') {
      fallbackItems = PARENT_MACHINES;
    } else {
      fallbackItems = COMPATIBLE_SPARES;
    }

    if (category && category !== 'All') {
      fallbackItems = fallbackItems.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const s = search.toLowerCase();
      fallbackItems = fallbackItems.filter(p => 
        p.name.toLowerCase().includes(s) || 
        (p.sku && p.sku.toLowerCase().includes(s)) ||
        (p.category && p.category.toLowerCase().includes(s))
      );
    }

    return NextResponse.json({
      success: true,
      source: 'static_verified_catalog',
      count: fallbackItems.length,
      products: fallbackItems
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
