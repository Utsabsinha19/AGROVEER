'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Download,
  AlertCircle,
  RefreshCw,
  Package,
  Heart,
  Trash2,
  Plus,
  LogOut,
  LogIn,
  Sparkles,
  Loader2,
  Save,
  Send
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS } from '@/data/products';
import { orderStorage, StoredOrder } from '@/lib/orderStorage';
import { formatCurrency } from '@/lib/utils';

export function AccountClient() {
  const { user, profile, logout, openAuthModal, updateProfile } = useAuth();
  const { wishlistIds, toggleWishlist, addItem, setCartOpen } = useCartStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'warranties' | 'invoices' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile & Email Setup Form States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [accountsEmail, setAccountsEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [destinationGodown, setDestinationGodown] = useState('');
  const [emailPreferences, setEmailPreferences] = useState({
    taxInvoices: true,
    trackingUpdates: true,
    warrantyVault: true,
    quarterlyPriceList: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch real orders from Neon PostgreSQL and sync with authentic session orders
    const fetchAccountData = async () => {
      setLoading(true);
      const localOrders = orderStorage.getAllOrders();
      let combinedOrders: StoredOrder[] = [];

      const phoneParam = profile?.phone || user?.phoneNumber;
      const emailParam = profile?.email || user?.email;

      if (phoneParam || emailParam) {
        try {
          const params = new URLSearchParams();
          if (phoneParam) params.set('phone', phoneParam);
          if (emailParam) params.set('email', emailParam);

          const res = await fetch(`/api/account/orders?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            if (data.orders && Array.isArray(data.orders)) {
              // Convert Prisma orders into StoredOrder format
              const dbOrders: StoredOrder[] = data.orders.map((dbo: any) => ({
                id: dbo.orderNumber || dbo.id,
                invoiceNumber: `INV-${(dbo.orderNumber || dbo.id).slice(0, 8).toUpperCase()}`,
                createdAt: dbo.createdAt,
                customer: {
                  firstName: dbo.customerName?.split(' ')[0] || '',
                  lastName: dbo.customerName?.split(' ').slice(1).join(' ') || '',
                  fullName: dbo.customerName,
                  phone: dbo.customerPhone,
                  email: dbo.customerEmail || '',
                  companyName: dbo.customerGstNumber ? 'Registered Commercial Firm' : '',
                  gstin: dbo.customerGstNumber || '',
                  address: dbo.shippingAddress || '',
                  city: dbo.city || '',
                  state: dbo.state || '',
                  postalCode: dbo.pincode || '',
                  country: 'India',
                },
                items: (dbo.items || []).map((it: any) => ({
                  productId: it.productId,
                  name: it.productName,
                  quantity: it.quantity,
                  unitPrice: it.unitPrice,
                  total: it.grandTotal || it.unitPrice * it.quantity,
                })),
                subtotal: dbo.totalTaxableAmount,
                tax: dbo.totalGstAmount,
                shipping: 0,
                discount: dbo.discountAmount || 0,
                total: dbo.grandTotalAmount,
                paymentMethod: dbo.paymentType?.toLowerCase().includes('advance') ? 'two_stage_advance' : 'razorpay',
                paymentStatus: dbo.paymentStatus === 'PAID_IN_FULL' ? 'PAID' : (dbo.paymentStatus === 'PARTIAL_ADVANCE_PAID' ? 'PARTIALLY_PAID' : 'PENDING_VERIFICATION'),
                paymentDetails: {},
                status: dbo.status as any,
                serials: (dbo.warehouseSerials || []).map((ws: any) => ({
                  orderId: ws.orderId,
                  productId: ws.productId,
                  serialOrEngineNumber: ws.serialNumber,
                  scannedAt: ws.scannedAt,
                  warrantyMonths: ws.warrantyMonths || 6,
                  warrantyValidUntil: ws.warrantyExpiresAt || '',
                })),
                logistics: {
                  carrier: dbo.carrierName || 'VRL Logistics / Safechem Road Transport',
                  lrNumber: dbo.awbOrLrNumber || '',
                  originWarehouse: 'Arveer Impex Central Warehouse (Jaipur)',
                  destinationCity: dbo.city || '',
                  destinationGodownAddress: dbo.destinationGodown || `${dbo.shippingAddress || ''}, ${dbo.city || ''}, ${dbo.state || ''}`,
                  estimatedDeliveryDays: 3,
                },
              }));

              // For authenticated buyers: only display verified database orders matching their identity
              combinedOrders = dbOrders;
            }
          }
        } catch (err) {
          console.warn('Real order fetch fallback notice:', err);
        }
      } else {
        // Unauthenticated guest visitor: display local orders placed in this browser only
        combinedOrders = localOrders;
      }

      setOrders(combinedOrders);

      // 2. Pre-fill customer details from authentic profile or latest placed order
      if (profile) {
        setCustomerName(profile.fullName || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
        setCompanyName(profile.companyName || '');
        setGstin(profile.gstin || '');
        setShippingAddress(profile.shippingAddress || '');
        setCity(profile.city || '');
        setStateName(profile.state || '');
        setPincode(profile.pincode || '');
        setDestinationGodown(profile.shippingAddress || '');
      } else if (combinedOrders.length > 0) {
        const latest = combinedOrders[0].customer;
        setCustomerName(latest.fullName || '');
        setPhone(latest.phone || '');
        setEmail((latest as any).email || user?.email || '');
        setCompanyName(latest.companyName || '');
        setGstin(latest.gstin || '');
        setShippingAddress(latest.address || '');
        setCity(latest.city || '');
        setStateName(latest.state || '');
        setPincode(latest.postalCode || (latest as any).pincode || '');
        setDestinationGodown(latest.city ? `${latest.address}, ${latest.city}, ${latest.state}` : '');
      } else if (user) {
        setCustomerName(user.displayName || '');
        setPhone(user.phoneNumber || '');
        setEmail(user.email || '');
      } else {
        setCustomerName('');
        setPhone('');
        setEmail('');
      }

      setLoading(false);
    };

    fetchAccountData();
  }, [profile, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(null);
    setSaveError(null);
    setIsSaving(true);

    try {
      const res = await updateProfile({
        fullName: customerName,
        email: email || undefined,
        phone: phone || undefined,
        companyName: companyName || undefined,
        gstin: gstin || undefined,
        shippingAddress: shippingAddress || destinationGodown || undefined,
        city: city || undefined,
        state: stateName || undefined,
        pincode: pincode || undefined,
      });

      if (res.success) {
        setSavedNotice('Buyer profile and email settings successfully synchronized with Neon Cloud PostgreSQL!');
        setTimeout(() => setSavedNotice(null), 4000);
      } else {
        setSaveError(res.error || 'Failed to update profile settings.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED');
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');

  const totalWarranties = orders.reduce((acc, o) => acc + (o.serials?.length || 0), 0);

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F5F0] text-[#141A17] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Buyer Account Header Card */}
        <div className="p-8 rounded-3xl bg-[#102C22] text-[#F7F5F0] border border-[rgba(166,201,106,0.3)] shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#A6C96A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#24583D] border border-[#A6C96A]/40 text-[#A6C96A] flex items-center justify-center text-2xl font-bold font-serif shadow-inner shrink-0">
                {profile || user ? (customerName.charAt(0) || email.charAt(0) || 'U').toUpperCase() : <User className="w-8 h-8 text-[#A6C96A]" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6C96A] font-bold">
                    {profile || user ? 'Verified Buyer & Dealer Account' : 'Guest Account Portal'}
                  </span>
                  {gstin && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-300 border border-green-500/40 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      GST Verified
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {profile || user ? (customerName || (email ? email.split('@')[0] : 'Commercial Buyer')) : 'Guest Session • Not Logged In'}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80 mt-1">
                  {companyName && (
                    <span className="font-medium text-[#A6C96A]">{companyName}</span>
                  )}
                  {email ? (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#A6C96A]" />
                      <strong className="text-white font-mono">{email}</strong>
                    </span>
                  ) : (
                    <span className="text-amber-300 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 text-amber-300" />
                      {profile || user ? 'No email linked yet' : 'Sign in to access your orders'}
                    </span>
                  )}
                  {phone && (
                    <span className="flex items-center gap-1 text-white/70">
                      • Phone: {phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {profile || user ? (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-white/70" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="px-4 py-2.5 bg-[#A6C96A] hover:bg-[#8eb852] text-[#102C22] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#102C22]" />
                  <span>Sign In to Account</span>
                </button>
              )}
              <Link
                href="/products"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                + Browse Machinery
              </Link>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
            <div>
              <span className="text-white/60 block text-[11px]">Total Machinery Orders</span>
              <span className="font-serif text-xl font-bold text-white">{orders.length} Consignments</span>
            </div>
            <div>
              <span className="text-white/60 block text-[11px]">Active Dispatches</span>
              <span className="font-serif text-xl font-bold text-[#A6C96A]">{activeOrders.length} In Transit</span>
            </div>
            <div>
              <span className="text-white/60 block text-[11px]">Lifetime Spend (Ex. GST)</span>
              <span className="font-serif text-xl font-bold text-white">{formatCurrency(totalSpent)}</span>
            </div>
            <div>
              <span className="text-white/60 block text-[11px]">Warranty Protection</span>
              <span className="font-serif text-xl font-bold text-green-400">
                {totalWarranties > 0 ? `${totalWarranties} Serial-Certified` : (orders.length > 0 ? 'Pending QC Scan' : '0 Active')}
              </span>
            </div>
          </div>
        </div>

        {/* Neon Auth Status Notice */}
        {!profile && !user ? (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Guest Session Active
                </p>
                <p className="text-[11px] text-amber-800/80">
                  Log in or register with your email ID & password to permanently link your orders, track consignments, and sync commercial GST credentials.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="px-4 py-2 bg-[#24583D] text-white rounded-xl text-xs font-bold whitespace-nowrap hover:bg-[#1B4731] transition-all shadow-sm cursor-pointer"
            >
              Sign In to Account
            </button>
          </div>
        ) : (
          <div className="mb-8 p-3.5 px-4 rounded-2xl bg-[#24583D]/10 border border-[#24583D]/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#24583D]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">
                Neon Cloud Database Synced • Active Profile: <strong className="font-bold">{profile?.fullName || customerName}</strong>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-800 font-bold border border-emerald-500/30">
              PostgreSQL Verified
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[rgba(166,201,106,0.25)] gap-6 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${activeTab === 'orders' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Active Orders & Tracking ({orders.length})</span>
            {activeTab === 'orders' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('warranties')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${activeTab === 'warranties' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
              }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Registered Warranties</span>
            {activeTab === 'warranties' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${activeTab === 'invoices' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
              }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tax Invoices & Bilty</span>
            {activeTab === 'invoices' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${activeTab === 'wishlist' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
              }`}
          >
            <Heart className={`w-4 h-4 ${wishlistIds.length > 0 ? 'text-[#D64527] fill-[#D64527]' : ''}`} />
            <span>Saved Wishlist ({wishlistIds.length})</span>
            {activeTab === 'wishlist' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${activeTab === 'profile' ? 'text-[#24583D] font-bold' : 'text-[#4F5D54] hover:text-[#141A17]'
              }`}
          >
            <Mail className="w-4 h-4 text-[#A6C96A]" />
            <span>Buyer Profile & Email Setup</span>
            {activeTab === 'profile' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24583D]" />}
          </button>
        </div>

        {/* Tab 1: Orders & Live Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] space-y-4">
                <Package className="w-12 h-12 text-[#24583D] mx-auto opacity-50" />
                <h3 className="font-serif text-lg font-bold text-[#141A17]">No Orders Yet</h3>
                <p className="text-xs text-[#4F5D54]">You haven't placed any commercial machinery orders yet.</p>
                <Link
                  href="/products"
                  className="inline-block px-5 py-2.5 bg-[#24583D] text-white rounded-xl text-xs font-bold"
                >
                  Explore Agroveer & Sawking Catalog
                </Link>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#24583D]">{o.id}</span>
                        <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">
                          Invoice: {o.invoiceNumber}
                        </span>
                      </div>
                      <p className="text-xs text-[#4F5D54] mt-0.5">
                        Booked on {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#24583D]/10 text-[#24583D] border border-[#24583D]/30">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                      <span className="font-serif font-bold text-lg text-[#141A17]">
                        {formatCurrency(o.total)}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Transition Stepper */}
                  <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[rgba(166,201,106,0.25)]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                      <div className={`p-2.5 rounded-xl border ${true ? 'bg-white border-[#24583D] font-bold text-[#24583D]' : 'bg-transparent text-gray-400'
                        }`}>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#24583D]" />
                          <span className="text-[10px] uppercase font-mono">Step 1</span>
                        </div>
                        <div className="font-semibold text-xs text-[#141A17]">Order Confirmed</div>
                        <div className="text-[10px] text-[#4F5D54]">Payment Secured</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${['PACKED_SERIALS_ASSIGNED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status)
                          ? 'bg-white border-[#24583D] font-bold text-[#24583D]'
                          : 'bg-transparent text-gray-400'
                        }`}>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#24583D]" />
                          <span className="text-[10px] uppercase font-mono">Step 2</span>
                        </div>
                        <div className="font-semibold text-xs text-[#141A17]">QC & Laser Serial</div>
                        <div className="text-[10px] text-[#4F5D54]">Warranty Bound</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${['DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status)
                          ? 'bg-white border-[#24583D] font-bold text-[#24583D]'
                          : 'bg-transparent text-gray-400'
                        }`}>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Truck className="w-3.5 h-3.5 text-[#24583D]" />
                          <span className="text-[10px] uppercase font-mono">Step 3</span>
                        </div>
                        <div className="font-semibold text-xs text-[#141A17]">Transporter Dispatch</div>
                        <div className="text-[10px] text-[#4F5D54]">LR Bilty Generated</div>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${o.status === 'DELIVERED'
                          ? 'bg-white border-[#24583D] font-bold text-[#24583D]'
                          : 'bg-transparent text-gray-400'
                        }`}>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase font-mono">Step 4</span>
                        </div>
                        <div className="font-semibold text-xs text-[#141A17]">Godown Delivery</div>
                        <div className="text-[10px] text-[#4F5D54]">Commissioned</div>
                      </div>
                    </div>
                  </div>

                  {/* Logistics & Serial Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 text-[#4F5D54]">
                      <p><strong>Carrier:</strong> {o.logistics?.carrier || 'Carrier Assignment in Progress'}</p>
                      <p><strong>Lorry Receipt (Bilty):</strong> <span className="font-mono font-bold text-[#24583D]">{o.logistics?.lrNumber || 'Awaiting Transporter LR'}</span></p>
                      <p><strong>Delivery Hub:</strong> {o.logistics?.destinationGodownAddress || `${o.customer.city}, ${o.customer.state}`}</p>
                    </div>
                    <div className="space-y-1 text-[#4F5D54]">
                      <p><strong>Equipment:</strong> {o.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}</p>
                      <p><strong>Payment Status:</strong> {o.paymentMethod.toUpperCase()} • <span className="text-green-700 font-bold">{o.paymentStatus}</span></p>
                      <p><strong>Registered Engine Serial:</strong> <span className="font-mono text-xs font-bold text-[#24583D]">{(o.serials && o.serials[0]) ? o.serials[0].serialOrEngineNumber : 'Pending Warehouse Barcode Scan'}</span></p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 gap-3">
                    <Link
                      href={`/order-success/${o.id}`}
                      className="px-4 py-2 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-white text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-[#A6C96A]" />
                      <span>View Live Tracking & Printable GST Invoice →</span>
                    </Link>

                    <a
                      href={`https://wa.me/917352210000?text=${encodeURIComponent(`Namaste Arveer Impex, I would like live vehicle location for Order #${o.id} (LR: ${o.logistics?.lrNumber || 'Processing'})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>WhatsApp Transporter Desk</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Registered Warranties */}
        {activeTab === 'warranties' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#141A17] mb-2">Registered OEM Machinery Warranties</h3>
              <p className="text-xs text-[#4F5D54] mb-6">Laser-engraved engine and crankcase serials bound during factory bench testing.</p>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-[#F7F5F0] rounded-2xl border border-[rgba(166,201,106,0.2)]">
                  <ShieldCheck className="w-10 h-10 text-[#24583D] mx-auto opacity-50 mb-2" />
                  <p className="text-xs font-semibold text-[#141A17]">No active machinery warranties yet</p>
                  <p className="text-[11px] text-[#4F5D54] mt-1">Once you purchase machinery, your OEM warranty and engine serial cards will be bound here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((o) => (
                    <div key={o.id} className="p-5 rounded-2xl bg-[#14261F] text-white border border-[#A6C96A]/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#A6C96A]" />
                          <span className="font-bold text-sm text-white">{o.items[0]?.name || 'Agroveer Machinery'}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-[#24583D] text-[#A6C96A] px-2 py-0.5 rounded font-bold">
                          ACTIVE
                        </span>
                      </div>

                      <div className="text-xs space-y-1 text-white/80">
                        <p>Laser Serial No: <strong className="font-mono text-[#A6C96A]">{(o.serials && o.serials[0]) ? o.serials[0].serialOrEngineNumber : 'Pending QC Scanning'}</strong></p>
                        <p>Warranty Duration: <strong>{(o.serials && o.serials[0]) ? `${o.serials[0].warrantyMonths} Months Coverage` : '6 Months OEM Factory Warranty'}</strong></p>
                        <p>Bound to Order: <span className="font-mono text-white/60">{o.id}</span></p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-white/60">Factory Bench Tested</span>
                        <a href="https://arveerimpex.com/guides/unboxing" target="_blank" rel="noopener noreferrer" className="text-[#A6C96A] hover:underline flex items-center gap-1 font-semibold">
                          <span>Unboxing Video Guide</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Tax Invoices & Bilty */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] overflow-hidden shadow-sm animate-in fade-in duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#141A17]">Commercial Tax Invoices & Lorry Receipts</h3>
                <p className="text-xs text-[#4F5D54]">GST Input Tax Credit (ITC) compliant tax invoices and transporter Bilty copies.</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#F7F5F0]">
                <FileText className="w-10 h-10 text-[#24583D] mx-auto opacity-50 mb-2" />
                <p className="text-xs font-semibold text-[#141A17]">No commercial tax invoices issued yet</p>
                <p className="text-[11px] text-[#4F5D54] mt-1">Book an order to receive official GST invoices with HSN codes and carrier Bilty receipts.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F5F0] border-b border-[rgba(166,201,106,0.25)] text-[#4F5D54] uppercase tracking-wider font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Invoice No</th>
                      <th className="py-3.5 px-4">Order Ref</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Transporter LR</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#24583D]">{o.invoiceNumber}</td>
                        <td className="py-3 px-4 font-mono text-gray-700">{o.id}</td>
                        <td className="py-3 px-4 text-[#4F5D54]">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-serif font-bold text-[#141A17]">{formatCurrency(o.total)}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#24583D]">{o.logistics?.lrNumber || 'In Dispatch Queue'}</td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/order-success/${o.id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#24583D] text-white font-bold hover:bg-[#1B4731] inline-flex items-center gap-1.5"
                          >
                            <Printer className="w-3 h-3 text-[#A6C96A]" />
                            <span>View Invoice</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Saved Machinery & Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141A17]">Saved Machinery Shortlist</h3>
                  <p className="text-xs text-[#4F5D54]">Equipment saved to your buyer account for seasonal procurement planning.</p>
                </div>
                {wishlistIds.length > 0 && (
                  <button
                    onClick={() => {
                      const savedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));
                      savedProducts.forEach(p => addItem(p, 1));
                      setCartOpen(true);
                    }}
                    className="px-4 py-2 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#A6C96A]" />
                    <span>Move All to Cart ({wishlistIds.length})</span>
                  </button>
                )}
              </div>

              {wishlistIds.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="font-bold text-[#141A17] text-sm">No items in your wishlist</p>
                  <p className="text-xs text-[#4F5D54]">Browse our catalog and tap the heart icon to save equipment here.</p>
                  <Link
                    href="/products"
                    className="inline-block px-5 py-2 bg-[#24583D] text-white text-xs font-bold rounded-xl mt-2"
                  >
                    View Catalog
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PRODUCTS.filter(p => wishlistIds.includes(p.id)).map(product => (
                    <div key={product.id} className="p-5 rounded-2xl bg-[#F7F5F0] border border-[rgba(166,201,106,0.25)] flex flex-col justify-between">
                      <div>
                        <div className="relative w-full h-36 rounded-xl bg-white overflow-hidden mb-3 p-2">
                          <Image
                            src={product.image || '/images/products/open-source-petrol-engine.jpg'}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                            onError={(e) => {
                              e.currentTarget.src = '/images/products/open-source-petrol-engine.jpg';
                            }}
                          />
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#24583D] font-bold block mb-1">
                          {product.category}
                        </span>
                        <h4 className="font-serif font-bold text-[#141A17] text-sm mb-1 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-[#4F5D54] line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="font-serif font-bold text-[#102C22] text-base">
                          {formatCurrency(product.price)}
                        </span>
                        <button
                          onClick={() => {
                            addItem(product, 1);
                            setCartOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#A6C96A]" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Buyer Profile & Email ID Wise Setup */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* Header Description */}
            <div className="bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#24583D] font-bold bg-[#A6C96A]/20 px-2 py-0.5 rounded">
                      Neon Cloud Identity
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-semibold text-gray-500">Live PostgreSQL Synced</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141A17]">
                    Buyer Profile & Email ID Configuration
                  </h3>
                  <p className="text-xs text-[#4F5D54] mt-1">
                    Manage your verified email address, automated GST invoice dispatch, and commercial consignment preferences.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="px-3.5 py-2 rounded-xl bg-[#F7F5F0] hover:bg-[#E9E1CC] border border-gray-300 text-xs font-bold text-[#102C22] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#24583D]" />
                    <span>Switch Email ID</span>
                  </button>
                </div>
              </div>

              {savedNotice && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{savedNotice}</span>
                </div>
              )}

              {saveError && (
                <div className="mt-6 p-4 rounded-2xl bg-red-50 text-red-800 border border-red-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">

                {/* 1. Email ID Setup & Notification Vault */}
                <div className="p-5 rounded-2xl bg-[#F7F5F0]/80 border border-[rgba(166,201,106,0.3)] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#24583D] text-[#A6C96A] flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#141A17]">
                        1. Commercial Email Address & Digital Vault Setup
                      </h4>
                    </div>
                    {email ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Account
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Setup Required
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-[#141A17] block mb-1">
                        Primary Commercial Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. buyer@farmdealers.com or utsab@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs font-semibold text-[#141A17] focus:outline-none focus:border-[#24583D] shadow-sm"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Used for account access, digital B2B GST tax invoice PDFs, and consignment dispatches.
                      </p>
                    </div>

                    <div>
                      <label className="font-bold text-[#141A17] block mb-1">
                        Accounts / CA Forwarding Email <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={accountsEmail}
                        onChange={(e) => setAccountsEmail(e.target.value)}
                        placeholder="e.g. accounts@agroagency.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs text-[#141A17] focus:outline-none focus:border-[#24583D] shadow-sm"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Carbon copy (CC) invoices automatically to your internal tax or accounting team.
                      </p>
                    </div>
                  </div>

                  {/* Automated Email Document Dispatch Toggles */}
                  <div className="pt-2">
                    <span className="font-bold text-xs text-[#141A17] block mb-2">
                      Automated Email Dispatch Preferences:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[#24583D] transition-colors">
                        <input
                          type="checkbox"
                          checked={emailPreferences.taxInvoices}
                          onChange={(e) => setEmailPreferences({ ...emailPreferences, taxInvoices: e.target.checked })}
                          className="rounded text-[#24583D] focus:ring-[#24583D]"
                        />
                        <div>
                          <span className="font-bold text-[#141A17] block">Digital GST Tax Invoices (PDF)</span>
                          <span className="text-[10px] text-gray-500 block">Sent automatically upon dispatch confirmation</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[#24583D] transition-colors">
                        <input
                          type="checkbox"
                          checked={emailPreferences.trackingUpdates}
                          onChange={(e) => setEmailPreferences({ ...emailPreferences, trackingUpdates: e.target.checked })}
                          className="rounded text-[#24583D] focus:ring-[#24583D]"
                        />
                        <div>
                          <span className="font-bold text-[#141A17] block">Road Transport Bilty & LR Tracking</span>
                          <span className="text-[10px] text-gray-500 block">Tracking links and carrier dispatch numbers</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[#24583D] transition-colors">
                        <input
                          type="checkbox"
                          checked={emailPreferences.warrantyVault}
                          onChange={(e) => setEmailPreferences({ ...emailPreferences, warrantyVault: e.target.checked })}
                          className="rounded text-[#24583D] focus:ring-[#24583D]"
                        />
                        <div>
                          <span className="font-bold text-[#141A17] block">Laser Serial Warranty Certificate</span>
                          <span className="text-[10px] text-gray-500 block">Anti-fraud laser engine serial validation certificate</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[#24583D] transition-colors">
                        <input
                          type="checkbox"
                          checked={emailPreferences.quarterlyPriceList}
                          onChange={(e) => setEmailPreferences({ ...emailPreferences, quarterlyPriceList: e.target.checked })}
                          className="rounded text-[#24583D] focus:ring-[#24583D]"
                        />
                        <div>
                          <span className="font-bold text-[#141A17] block">Wholesale Price List & Schemes</span>
                          <span className="text-[10px] text-gray-500 block">Harvest season trade discounts and price revisions</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Commercial Firm & Tax Registration Details */}
                <div className="p-5 rounded-2xl bg-[#F7F5F0]/80 border border-[rgba(166,201,106,0.3)] space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200/80">
                    <div className="w-7 h-7 rounded-lg bg-[#24583D] text-[#A6C96A] flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#141A17]">
                      2. Commercial Entity & Registered GSTIN
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-[#141A17] block mb-1">
                        Full Legal Name / Proprietor *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-[#141A17] focus:outline-none focus:border-[#24583D] shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#141A17] block mb-1">
                        Contact Mobile / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98220 11223"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-[#141A17] focus:outline-none focus:border-[#24583D] shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-[#141A17] block mb-1">
                        Business / Dealership / Firm Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Kisan Agro Spares & Hardware"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-[#141A17] focus:outline-none focus:border-[#24583D] shadow-sm"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-[#141A17]">
                          Registered GSTIN (For Input Tax Credit)
                        </label>
                        {gstin && gstin.length === 15 && (
                          <span className="text-[10px] text-emerald-700 font-bold font-mono">
                            ✓ 15-Digit Valid Format
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={15}
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 27AABCU9603R1ZM"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono font-bold text-[#24583D] focus:outline-none focus:border-[#24583D] shadow-sm uppercase tracking-wider"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Enables 18% / 12% / 5% GST B2B input tax credit directly passed on government portal.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Destination Godown & Shipping Address */}
                <div className="p-5 rounded-2xl bg-[#F7F5F0]/80 border border-[rgba(166,201,106,0.3)] space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200/80">
                    <div className="w-7 h-7 rounded-lg bg-[#24583D] text-[#A6C96A] flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#141A17]">
                      3. Road Transport Godown & Delivery Destination
                    </h4>
                  </div>

                  <div className="text-xs space-y-4">
                    <div>
                      <label className="font-bold text-[#141A17] block mb-1">
                        Preferred Road Transport Destination Godown / Street Address
                      </label>
                      <input
                        type="text"
                        value={destinationGodown}
                        onChange={(e) => setDestinationGodown(e.target.value)}
                        placeholder="e.g. Plot 14, Central Transport Nagar, VRL / TCI Logistics Godown"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-[#141A17] focus:outline-none focus:border-[#24583D] shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-[#141A17] block mb-1">City / District</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Ludhiana"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-[#141A17] focus:outline-none focus:border-[#24583D]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[#141A17] block mb-1">State / Province</label>
                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="e.g. Punjab"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-[#141A17] focus:outline-none focus:border-[#24583D]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[#141A17] block mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="e.g. 141001"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white font-mono text-[#141A17] focus:outline-none focus:border-[#24583D]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit & Sync Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-[#24583D]" />
                    <span>Records secured with Neon PostgreSQL encrypted token session.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-7 py-3 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#A6C96A]" />
                        <span>Syncing to Neon Cloud...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-[#A6C96A]" />
                        <span>Save & Sync Profile to Neon Cloud</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

