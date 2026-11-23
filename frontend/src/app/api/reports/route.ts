import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PRODUCTS } from '@/data/products';

export async function GET() {
  try {
    let orders: any[] = [];
    try {
      orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      orders = [];
    }

    const totalOrders = orders.length;
    const totalGrossRevenue = orders.reduce((sum, o) => sum + (o.grandTotalAmount || 0), 0);
    const totalGstCollected = orders.reduce((sum, o) => sum + (o.totalGstAmount || 0), 0);
    const totalAdvancePaid = orders.reduce((sum, o) => sum + (o.advancePaidAmount || 0), 0);
    const pendingDispatches = orders.filter((o) => o.status === 'PACKED_SERIALS_ASSIGNED' || o.status === 'PAID_FULL_CONFIRMED').length;
    const completedDeliveries = orders.filter((o) => o.status === 'DELIVERED').length;

    // Inventory status
    const lowStockAlerts = PRODUCTS.filter((p) => (p.inventoryCount || 0) < 15).map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      currentStock: p.inventoryCount || 0,
      reorderLevel: 15,
      hsnCode: p.hsnCode,
    }));

    const reportData = {
      timestamp: new Date().toISOString(),
      financialSummary: {
        totalOrders,
        totalGrossRevenue,
        totalGstCollected,
        totalAdvancePaid,
        averageOrderValue: totalOrders > 0 ? Math.round(totalGrossRevenue / totalOrders) : 0,
      },
      logisticsSummary: {
        pendingDispatches,
        completedDeliveries,
        activeTransporters: ['VRL Logistics Ltd.', 'TCI Freight', 'Delhivery Express', 'Safechem Logistics'],
      },
      inventorySummary: {
        totalCatalogSkus: PRODUCTS.length,
        criticalLowStockCount: lowStockAlerts.length,
        lowStockItems: lowStockAlerts,
      },
    };

    return NextResponse.json({ success: true, report: reportData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

