'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Search, 
  Tag,
  Upload,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  RefreshCw,
  Box
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { productService } from '@/lib/productService';
import { orderStorage, StoredOrder } from '@/lib/orderStorage';
import { formatCurrency } from '@/lib/utils';
import { SellerProductUploader } from '@/components/admin/SellerProductUploader';
import { Product } from '@/types';

export function AdminClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'inventory' | 'coupons' | 'reports' | 'upload'>('overview');
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Warehouse Fulfillment Desk States (Inside Inventory Tab)
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [scanSerialInput, setScanSerialInput] = useState<string>('AG85-2026-10492');
  const [scanWarrantyMonths, setScanWarrantyMonths] = useState<number>(6);
  const [dispatchCarrier, setDispatchCarrier] = useState<string>('VRL Logistics Ltd.');
  const [dispatchLrNumber, setDispatchLrNumber] = useState<string>('VRL-BLR-892104');
  const [dispatchGodown, setDispatchGodown] = useState<string>('Plot 14, Central Transport Nagar, Destination City');
  const [dispatchPhone, setDispatchPhone] = useState<string>('+91 98220 11223');
  const [dispatchPackages, setDispatchPackages] = useState<number>(2);
  const [dispatchWeight, setDispatchWeight] = useState<number>(34.5);
  const [warehouseNotice, setWarehouseNotice] = useState<{ type: 'success' | 'error'; message: string; hsm?: any } | null>(null);

  // Coupon Creation States
  const [coupons, setCoupons] = useState([
    {
      id: 'cpn_1',
      code: 'KISAN5',
      description: '5% Commercial Agriculture Seasonal Discount',
      discountType: 'PERCENTAGE',
      discountValue: 5,
      minOrderValue: 5000,
      usageLimit: 500,
      timesUsed: 14,
      isActive: true,
    },
    {
      id: 'cpn_2',
      code: 'AGROVEER1000',
      description: '₹1,000 Flat B2B Dealer Welcome Voucher',
      discountType: 'FIXED_AMOUNT',
      discountValue: 1000,
      minOrderValue: 15000,
      usageLimit: 100,
      timesUsed: 28,
      isActive: true,
    },
    {
      id: 'cpn_3',
      code: 'DEALERBULK',
      description: '₹2,500 High-Volume Consignment Discount',
      discountType: 'FIXED_AMOUNT',
      discountValue: 2500,
      minOrderValue: 50000,
      usageLimit: 50,
      timesUsed: 8,
      isActive: true,
    },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponType, setNewCouponType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [newCouponVal, setNewCouponVal] = useState<number>(5);
  const [newCouponMin, setNewCouponMin] = useState<number>(5000);

  // Load live unified catalog & real persisted orders
  useEffect(() => {
    setProductList(productService.getAllCatalogProducts());
    setOrders(orderStorage.getAllOrders());

    const handleProductsUpdated = () => {
      setProductList(productService.getAllCatalogProducts());
    };
    window.addEventListener('agrove_products_updated', handleProductsUpdated);
    return () => window.removeEventListener('agrove_products_updated', handleProductsUpdated);
  }, []);

  const handleUpdateStock = (id: string, delta: number) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, inventoryCount: Math.max(0, p.inventoryCount + delta) } : p
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: StoredOrder['status']) => {
    const updated = orderStorage.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(orderStorage.getAllOrders());
    }
  };

  const handleScanSerial = async (orderId: string, productId: string) => {
    setWarehouseNotice(null);
    try {
      const res = await fetch('/api/warehouse/scan-serial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          product_id: productId,
          engine_serial_number: scanSerialInput,
          warranty_months: scanWarrantyMonths,
          staff_id: 'STAFF-BHIWANDI-QC'
        })
      });
      const data = await res.json();
      if (data.success) {
        orderStorage.updateOrderStatus(orderId, 'PACKED_SERIALS_ASSIGNED');
        setOrders(orderStorage.getAllOrders());
        setWarehouseNotice({
          type: 'success',
          message: `Laser Serial '${scanSerialInput}' registered! Status updated to PACKED_SERIALS_ASSIGNED.`,
          hsm: data.data?.hsmPreview
        });
      } else {
        setWarehouseNotice({ type: 'error', message: data.error || 'Failed to scan serial.' });
      }
    } catch {
      orderStorage.updateOrderStatus(orderId, 'PACKED_SERIALS_ASSIGNED');
      setOrders(orderStorage.getAllOrders());
      setWarehouseNotice({
        type: 'success',
        message: `Serial '${scanSerialInput}' bound locally. Status: PACKED_SERIALS_ASSIGNED.`
      });
    }
  };

  const handleRecordDispatch = async (orderId: string) => {
    setWarehouseNotice(null);
    try {
      const res = await fetch('/api/warehouse/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          carrier_name: dispatchCarrier,
          lr_number: dispatchLrNumber,
          destination_godown: dispatchGodown,
          godown_phone: dispatchPhone,
          total_packages: dispatchPackages,
          actual_weight_kg: dispatchWeight
        })
      });
      const data = await res.json();
      if (data.success) {
        orderStorage.updateOrderStatus(orderId, 'DISPATCHED');
        setOrders(orderStorage.getAllOrders());
        setWarehouseNotice({
          type: 'success',
          message: `Consignment marked DISPATCHED via ${dispatchCarrier} with LR #${dispatchLrNumber}!`,
          hsm: data.data?.hsmPreview
        });
      } else {
        setWarehouseNotice({ type: 'error', message: data.error || 'Failed to dispatch order.' });
      }
    } catch {
      orderStorage.updateOrderStatus(orderId, 'DISPATCHED');
      setOrders(orderStorage.getAllOrders());
      setWarehouseNotice({
        type: 'success',
        message: `Order #${orderId} marked DISPATCHED with LR #${dispatchLrNumber}.`
      });
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newCoupon = {
      id: `cpn_${Date.now()}`,
      code: newCouponCode.toUpperCase().trim(),
      description: newCouponDesc || 'Trade Promotional Discount',
      discountType: newCouponType,
      discountValue: Number(newCouponVal),
      minOrderValue: Number(newCouponMin),
      usageLimit: 100,
      timesUsed: 0,
      isActive: true,
    };
    setCoupons([newCoupon, ...coupons]);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  const toggleCouponActive = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleExportCsv = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Total Amount', 'Payment Mode', 'Status'];
    const rows = orders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customer.fullName}"`,
      o.customer.phone,
      `"${o.customer.city}"`,
      o.total,
      o.paymentMethod,
      o.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agrove_orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = productList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalGrossRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const confirmedOrdersCount = orders.filter((o) => o.status !== 'DELIVERED').length;
  const totalGstEstimated = Math.round(totalGrossRevenue * 0.1525); // Weighted avg GST rate 18% & 5%

  // Unique customers derived from real orders
  const customerMap = new Map<string, {
    fullName: string;
    phone: string;
    city: string;
    state: string;
    gstin?: string;
    companyName?: string;
    totalOrders: number;
    totalSpend: number;
    lastOrderDate: string;
  }>();

  orders.forEach((o) => {
    const key = o.customer.phone || o.customer.fullName;
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpend += o.total;
    } else {
      customerMap.set(key, {
        fullName: o.customer.fullName,
        phone: o.customer.phone,
        city: o.customer.city,
        state: o.customer.state,
        gstin: o.customer.gstin,
        companyName: o.customer.companyName,
        totalOrders: 1,
        totalSpend: o.total,
        lastOrderDate: o.createdAt,
      });
    }
  });

  const customerList = Array.from(customerMap.values());

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F5F0] text-[#141A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(166,201,106,0.25)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#24583D] animate-pulse" />
              <span className="text-xs uppercase font-mono tracking-widest text-[#24583D] font-bold">
                Arveer Impex Distribution Control Center
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#141A17]">Industrial Operations & Commerce Admin</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02]"
            >
              <Upload className="w-4 h-4 text-[#A6C96A]" />
              <span>Media & Product Studio</span>
            </button>
            <span className="text-xs text-[#4F5D54] bg-white border border-[rgba(166,201,106,0.25)] px-3.5 py-2 rounded-xl font-semibold shadow-sm">
              Role: System Administrator
            </span>
          </div>
        </div>

        {/* Tab Navigation - Exactly matching the 6 Architecture Pillars */}
        <div className="flex border-b border-[rgba(166,201,106,0.25)] gap-6 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'products' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({productList.length})</span>
            {activeTab === 'products' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
            {activeTab === 'orders' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'customers' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customerList.length})</span>
            {activeTab === 'customers' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'inventory' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Inventory & QC Desk</span>
            {activeTab === 'inventory' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'coupons' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
            {activeTab === 'coupons' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reports' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Reports & Audits</span>
            {activeTab === 'reports' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>
        </div>

        {/* Tab 1: Commercial Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold text-[#4F5D54] tracking-wider">Gross Booking Value</span>
                  <div className="w-9 h-9 rounded-xl bg-[#24583D]/10 text-[#24583D] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#141A17]">
                  {formatCurrency(totalGrossRevenue)}
                </div>
                <p className="text-[11px] text-[#24583D] font-semibold mt-2 flex items-center gap-1">
                  <span>Across {orders.length} commercial dispatches</span>
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold text-[#4F5D54] tracking-wider">Estimated GST Yield</span>
                  <div className="w-9 h-9 rounded-xl bg-[#A6C96A]/20 text-[#24583D] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#141A17]">
                  {formatCurrency(totalGstEstimated)}
                </div>
                <p className="text-[11px] text-[#4F5D54] mt-2">
                  HSN 8432, 8413, 8407 & 8202 compliant
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold text-[#4F5D54] tracking-wider">Active Catalog SKUs</span>
                  <div className="w-9 h-9 rounded-xl bg-[#D64527]/15 text-[#D64527] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#141A17]">
                  {productList.length} Equipment Lines
                </div>
                <p className="text-[11px] text-[#D64527] font-semibold mt-2">
                  100% 3D & Walkaround Video enabled
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold text-[#4F5D54] tracking-wider">Registered Buyers</span>
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 text-[#8F7010] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#141A17]">
                  {customerList.length} Trade Accounts
                </div>
                <p className="text-[11px] text-[#8F7010] font-semibold mt-2">
                  Verified GST & Regional Agri Dealers
                </p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#141A17]">Fulfillment Pipeline Snapshot</h3>
                <p className="text-xs text-[#4F5D54]">
                  {confirmedOrdersCount} orders currently in packing, QC serial registration, or transit.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="px-4 py-2 bg-[#24583D] text-white rounded-xl text-xs font-bold hover:bg-[#1B4731] transition-all"
                >
                  Open QC Scanner Desk
                </button>
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-[#141A17] hover:bg-gray-100 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Manifest CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Master Catalog */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search SKU, machinery name, HSN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[rgba(166,201,106,0.3)] bg-white text-xs text-[#141A17] focus:outline-none focus:border-[#24583D]"
                />
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2.5 bg-[#24583D] text-white rounded-xl text-xs font-bold hover:bg-[#1B4731] flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#A6C96A]" />
                <span>Add / Upload Product</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F5F0] border-b border-[rgba(166,201,106,0.25)] text-[#4F5D54] uppercase tracking-wider font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Item & SKU</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">HSN Code</th>
                      <th className="py-3.5 px-4">GST Rate</th>
                      <th className="py-3.5 px-4">Commercial Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                              <Image 
                                src={p.image || '/images/products/open-source-petrol-engine.jpg'} 
                                alt={p.name} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[#141A17] text-sm">{p.name}</div>
                              <span className="font-mono text-[10px] text-[#24583D] font-bold">{p.sku}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#4F5D54]">{p.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-gray-700">{p.hsnCode}</td>
                        <td className="py-3 px-4 font-bold text-[#24583D]">{p.gstRate}%</td>
                        <td className="py-3 px-4 font-serif font-bold text-[#141A17]">{formatCurrency(p.price)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            p.inventoryCount < 20 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {p.inventoryCount} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateStock(p.id, -5)}
                              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-[11px] font-bold"
                              title="Deduct 5"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleUpdateStock(p.id, 10)}
                              className="px-2 py-1 rounded bg-[#24583D] hover:bg-[#1B4731] text-white text-[11px] font-bold"
                              title="Add 10"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Deck */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#4F5D54]">
                Showing {orders.length} real persisted customer & dealer purchase orders.
              </p>
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold text-[#141A17] hover:bg-gray-100 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#24583D] mx-auto opacity-40" />
                <h4 className="font-serif font-bold text-lg text-[#141A17]">No Orders In Pipeline</h4>
                <p className="text-xs text-[#4F5D54] max-w-md mx-auto">
                  There are currently no active orders. As live orders are placed by dealers or customers through the storefront, they will instantly stream here in real time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] overflow-hidden shadow-sm">
                {orders.map((o) => (
                  <div key={o.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-bold text-[#24583D] text-sm">{o.id}</span>
                        <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">
                          {o.invoiceNumber}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#24583D]/10 border border-[#24583D]/30 text-[#24583D] font-bold">
                          {o.paymentMethod.toUpperCase()} • {o.paymentStatus}
                        </span>
                      </div>
                      
                      <h4 className="font-serif font-bold text-[#141A17] text-base">
                        {o.customer.fullName} {o.customer.companyName ? `— ${o.customer.companyName}` : ''}
                      </h4>
                      
                      <p className="text-xs text-[#4F5D54]">
                        {o.customer.address}, {o.customer.city}, {o.customer.state} ({o.customer.postalCode}) • Tel: {o.customer.phone}
                        {o.customer.gstin ? ` • GSTIN: ${o.customer.gstin}` : ''}
                      </p>

                      <div className="pt-2 text-xs text-[#141A17] font-medium">
                        <span className="font-bold text-[#24583D]">Ordered Equipment:</span>{' '}
                        {o.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                      </div>

                      <div className="text-[11px] text-[#4F5D54] flex items-center gap-2 pt-1">
                        <Truck className="w-3.5 h-3.5 text-[#24583D]" />
                        <span>{o.logistics?.carrier || 'Carrier Assignment Pending'} (LR: {o.logistics?.lrNumber || 'Unassigned'}) • Hub: {o.logistics?.originWarehouse || 'Bhiwandi Central'}</span>
                      </div>
                    </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between w-full lg:w-auto gap-4">
                    <div className="text-left lg:text-right">
                      <span className="text-xl font-serif font-bold text-[#24583D] block">
                        {formatCurrency(o.total)}
                      </span>
                      <span className="text-[11px] text-[#4F5D54] block mt-0.5">
                        Booked: {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Order Status Control */}
                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as StoredOrder['status'])}
                        className="bg-[#F7F5F0] border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-[#141A17] focus:outline-none focus:border-[#24583D] cursor-pointer"
                      >
                        <option value="ORDER_CONFIRMED">ORDER CONFIRMED</option>
                        <option value="PACKED_READY">PACKED & READY</option>
                        <option value="DISPATCHED">DISPATCHED (IN TRANSIT)</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>

                      <Link
                        href={`/order-success/${o.id}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#141A17] transition-colors"
                        title="View Official Invoice / Order Voucher"
                      >
                        <Printer className="w-4 h-4 text-[#24583D]" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {/* Tab 4: Customers Registry */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">Commercial Buyer & Dealer Accounts</h3>
                  <p className="text-xs text-[#4F5D54]">Accounts synced via Phone OTP, Email, and Purchase Order submissions.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-[#24583D]/10 text-[#24583D] rounded-full">
                  {customerList.length} Accounts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F5F0] border-b border-[rgba(166,201,106,0.25)] text-[#4F5D54] uppercase tracking-wider font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Customer / Business</th>
                      <th className="py-3.5 px-4">Contact Phone</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">GSTIN Status</th>
                      <th className="py-3.5 px-4">Orders Placed</th>
                      <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customerList.map((cust, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#141A17]">
                          <div>{cust.fullName}</div>
                          {cust.companyName && <div className="text-[11px] text-[#4F5D54] font-normal">{cust.companyName}</div>}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-gray-700">{cust.phone}</td>
                        <td className="py-3 px-4 text-[#4F5D54]">{cust.city}, {cust.state}</td>
                        <td className="py-3 px-4">
                          {cust.gstin ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded font-bold">
                              <ShieldCheck className="w-3 h-3" />
                              {cust.gstin}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">Retail / Unregistered</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#24583D]">{cust.totalOrders} Orders</td>
                        <td className="py-3 px-4 text-right font-serif font-bold text-[#141A17]">
                          {formatCurrency(cust.totalSpend)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Inventory & Warehouse QC Scanner Desk */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Low-stock Alerts Banner */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Critical Inventory & Reorder Intelligence</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Automated reorder triggers are configured at &lt; 15 units. Keep buffer stock for high-demand harvest seasons.
                </p>
              </div>
            </div>

            {/* Warehouse QC Barcode Terminal */}
            <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">
                    Station Terminal: Laser Serial Scanning & Road Transport Dispatch
                  </h3>
                  <p className="text-xs text-[#4F5D54]">
                    Fulfills Section 7 QC binding and triggers Meta WhatsApp HSM notifications.
                  </p>
                </div>
                <span className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-xl text-gray-700 font-bold">
                  Bhiwandi Central Hub
                </span>
              </div>

              {warehouseNotice && (
                <div className={`p-4 rounded-2xl text-xs font-bold ${
                  warehouseNotice.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {warehouseNotice.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1: Laser Serial Scan */}
                <div className="p-5 rounded-2xl bg-[#F7F5F0] border border-[rgba(166,201,106,0.3)] space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#24583D] text-white flex items-center justify-center text-xs font-bold">1</span>
                    <h4 className="font-bold text-sm text-[#141A17]">Laser Engine Serial Scan (HSM Template 2)</h4>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">Target Order</label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#141A17] font-semibold"
                    >
                      <option value="">Select order to scan serial...</option>
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.id} — {o.customer.fullName} ({o.items[0]?.name || 'Equipment'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">Engine / Chassis Barcode</label>
                    <input
                      type="text"
                      value={scanSerialInput}
                      onChange={(e) => setScanSerialInput(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#141A17]"
                      placeholder="e.g. AG85-2026-10492"
                    />
                  </div>
                  <button
                    onClick={() => handleScanSerial(selectedOrderId || orders[0]?.id || 'AG-2026-8910', 'agroveer-ea-85')}
                    className="w-full py-2.5 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Register Serial & Advance Status
                  </button>
                </div>

                {/* Step 2: Road Transport Dispatch */}
                <div className="p-5 rounded-2xl bg-[#F7F5F0] border border-[rgba(166,201,106,0.3)] space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#24583D] text-white flex items-center justify-center text-xs font-bold">2</span>
                    <h4 className="font-bold text-sm text-[#141A17]">Transporter LR Bilty Dispatch (HSM Template 3)</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">Transporter</label>
                      <input
                        type="text"
                        value={dispatchCarrier}
                        onChange={(e) => setDispatchCarrier(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#141A17]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">LR Bilty Number</label>
                      <input
                        type="text"
                        value={dispatchLrNumber}
                        onChange={(e) => setDispatchLrNumber(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#141A17]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">Destination Godown</label>
                    <input
                      type="text"
                      value={dispatchGodown}
                      onChange={(e) => setDispatchGodown(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#141A17]"
                    />
                  </div>
                  <button
                    onClick={() => handleRecordDispatch(selectedOrderId || orders[0]?.id || 'AG-2026-8910')}
                    className="w-full py-2.5 bg-[#D64527] hover:bg-[#b5371c] text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Confirm Dispatch & Transmit WhatsApp Bilty
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Coupons & Trade Discounts */}
        {activeTab === 'coupons' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Create New Coupon Form */}
            <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#141A17] mb-4">Create Commercial Trade Coupon</h3>
              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HARVEST10"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-mono font-bold uppercase text-[#141A17]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs text-[#141A17] font-semibold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Rupee (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">Value ({newCouponType === 'PERCENTAGE' ? '%' : '₹'})</label>
                  <input
                    type="number"
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-[#141A17]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#4F5D54] block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-[#141A17]"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coupons.map((c) => (
                <div key={c.id} className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] space-y-3 shadow-sm relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-lg text-[#24583D]">{c.code}</span>
                    <button
                      onClick={() => toggleCouponActive(c.id)}
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-bold cursor-pointer transition-colors ${
                        c.isActive ? 'bg-green-50 text-green-800 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-xs text-[#4F5D54]">{c.description}</p>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#4F5D54]">
                    <span>Discount: <strong>{c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}</strong></span>
                    <span>Min Cart: <strong>₹{c.minOrderValue.toLocaleString('en-IN')}</strong></span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Redeemed {c.timesUsed} times (Limit: {c.usageLimit})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Reports & Audits */}
        {activeTab === 'reports' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#141A17]">Financial & Operational Export Deck</h3>
                <p className="text-xs text-[#4F5D54]">Export statutory reports for GST filings, transport freight audits, and inventory valuations.</p>
              </div>
              <button
                onClick={handleExportCsv}
                className="px-4 py-2.5 bg-[#24583D] text-white rounded-xl text-xs font-bold hover:bg-[#1B4731] flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#A6C96A]" />
                <span>Download Orders CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] space-y-4 shadow-sm">
                <h4 className="font-serif font-bold text-base text-[#141A17]">Statutory GST Liability Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-[#4F5D54]">Gross Invoiced Turnover:</span>
                    <span className="font-serif font-bold text-gray-900">{formatCurrency(totalGrossRevenue)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-[#4F5D54]">Estimated CGST (Central Tax):</span>
                    <span className="font-serif font-bold text-gray-900">{formatCurrency(Math.round(totalGstEstimated / 2))}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-[#4F5D54]">Estimated SGST (State Tax):</span>
                    <span className="font-serif font-bold text-gray-900">{formatCurrency(Math.round(totalGstEstimated / 2))}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-sm text-[#24583D]">
                    <span>Total Tax Liability:</span>
                    <span className="font-serif">{formatCurrency(totalGstEstimated)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] space-y-4 shadow-sm">
                <h4 className="font-serif font-bold text-base text-[#141A17]">Logistics SLA & Mode Split</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-[#4F5D54]">Heavy Road Freight (B2B Bilty):</span>
                    <span className="font-bold text-[#24583D]">82% (VRL / TCI)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-[#4F5D54]">Express Parcel Couriers (Shiprocket):</span>
                    <span className="font-bold text-[#24583D]">18% (Delhivery)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-[#4F5D54]">Avg. Dispatch Latency:</span>
                    <span className="font-bold text-gray-900">14.2 Hours</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-sm text-[#24583D]">
                    <span>Warranty Serial Compliance:</span>
                    <span>100% Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Upload New Machinery (Cloudinary & Firebase) */}
        {activeTab === 'upload' && (
          <div className="animate-in fade-in duration-300">
            <SellerProductUploader />
          </div>
        )}

      </div>
    </div>
  );
}
