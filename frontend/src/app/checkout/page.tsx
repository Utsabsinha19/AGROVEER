'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  QrCode,
  Check,
  MessageCircle,
  FileText,
  Copy,
  Receipt,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { orderStorage, StoredOrder } from '@/lib/orderStorage';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { profile, openAuthModal } = useAuth();
  const {
    items,
    getBaseExGstSubtotal,
    getGstAmount,
    getTaxSplit,
    getWeightAndFreightInfo,
    getCompatibilityAlerts,
    getWholesaleTierInfo,
    getWholesaleDiscountAmount,
    getShippingCost,
    getTotal,
    discountAmount,
    clearCart,
    getFormattedWhatsAppOrderText
  } = useCartStore();

  const baseExGst = getBaseExGstSubtotal();
  const tierInfo = getWholesaleTierInfo();
  const wholesaleDiscount = getWholesaleDiscountAmount();
  const gstAmount = getGstAmount();
  const shipping = getShippingCost();
  const total = getTotal();
  const freightInfo = getWeightAndFreightInfo();
  const compatibilityAlerts = getCompatibilityAlerts();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    gstin: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
    paymentMethod: (total >= 50000 ? 'virtual_account' : 'razorpay') as 'razorpay' | 'virtual_account' | 'two_stage_advance' | 'whatsapp' | 'bank_transfer' | 'cod',
    orderNotes: '',
    termsAgreed: true,
  });

  const taxSplit = getTaxSplit(formData.state);

  // Auto-fill checkout fields if user is authenticated with Neon
  React.useEffect(() => {
    if (profile) {
      const parts = profile.fullName ? profile.fullName.trim().split(' ') : ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || parts[0] || '',
        lastName: prev.lastName || parts.slice(1).join(' ') || '',
        phone: prev.phone || profile.phone || '',
        email: prev.email || profile.email || '',
        companyName: prev.companyName || profile.companyName || '',
        gstin: prev.gstin || profile.gstin || '',
        city: prev.city || profile.city || '',
        state: prev.state || profile.state || prev.state,
      }));
    }
  }, [profile]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Payment Modals
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayTab, setRazorpayTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [razorpaySuccess, setRazorpaySuccess] = useState(false);

  const [showBankModal, setShowBankModal] = useState(false);
  const [bankUtr, setBankUtr] = useState('');
  const [bankCopied, setBankCopied] = useState(false);

  // Virtual Account Escrow Modal (> ₹50,000)
  const [showVanModal, setShowVanModal] = useState(false);
  const [vanCopied, setVanCopied] = useState(false);
  const [generatedVanOrderId, setGeneratedVanOrderId] = useState<string>('');

  if (items.length === 0) {
    return (
      <div className="pt-16 pb-24 text-center text-charcoal bg-offwhite min-h-screen">
        <h1 className="font-serif text-3xl font-bold mb-4">No Items to Checkout</h1>
        <p className="text-charcoal-muted mb-6">Your order schedule is empty. Please select machinery or spares before checking out.</p>
        <Link href="/products" className="px-6 py-3 rounded-xl bg-botanical text-offwhite font-semibold text-xs uppercase tracking-wider">
          Return to Machinery Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Helper to construct and commit actual order
  const createAndCommitOrder = async (
    paymentMethod: StoredOrder['paymentMethod'],
    paymentStatus: StoredOrder['paymentStatus'],
    paymentDetails: StoredOrder['paymentDetails']
  ): Promise<string> => {
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${randomHex}`;
    const invoiceNumber = `INV-2026-${randomHex}`;

    const isAdvance = paymentMethod === 'two_stage_advance';
    const advanceAmountPaid = isAdvance ? Math.round(total * 0.20) : (paymentStatus === 'PAID' ? total : 0);
    const balanceDue = isAdvance ? total - advanceAmountPaid : (paymentStatus === 'PAID' ? 0 : total);

    let resolvedStatus: StoredOrder['status'] = 'PAYMENT_CONFIRMED';
    if (isAdvance) {
      resolvedStatus = 'ADVANCE_PAID_AWAITING_BALANCE';
    } else if (paymentStatus !== 'PAID') {
      resolvedStatus = 'PENDING_PAYMENT';
    }

    const ewayBill = total >= 50000 ? {
      ewayBillNumber: `2410${Math.floor(10000000 + Math.random() * 90000000)}`,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      docUrl: `/invoices/EWB-${orderId}.pdf`
    } : undefined;

    const enrichedPaymentDetails = {
      ...paymentDetails,
      virtualAccount: (paymentMethod === 'virtual_account' || total >= 50000) ? {
        beneficiaryName: `Arveer Impex - Order #${orderId}`,
        virtualAccountNumber: `ARVEER${orderId.replace('-', '')}`,
        virtualIfsc: 'ICIC0000104',
        bankName: 'ICICI Bank Ltd. Escrow Smart Collect'
      } : undefined
    };

    const newOrder: StoredOrder = {
      id: orderId,
      orderNumber: `AG-2026-${randomHex}`,
      invoiceNumber,
      createdAt: new Date().toISOString(),
      orderType: (formData.gstin || formData.companyName) ? 'B2B_WHOLESALE' : 'B2C',
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        email: formData.email,
        companyName: formData.companyName || undefined,
        gstin: formData.gstin || undefined,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'India',
        orderNotes: formData.orderNotes || undefined,
      },
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        model: i.product.scientificName || i.product.sku || 'Commercial Grade',
        quantity: i.quantity,
        unitPrice: i.product.price,
        total: i.product.price * i.quantity,
        image: i.product.image,
        weightKg: i.product.weightGrams ? i.product.weightGrams / 1000 : 1.5,
        selectedOption: i.selectedOption
      })),
      subtotal: baseExGst,
      taxableSubtotal: Math.max(0, baseExGst - wholesaleDiscount),
      cgst: taxSplit.cgst,
      sgst: taxSplit.sgst,
      igst: taxSplit.igst,
      tax: gstAmount,
      shipping: shipping,
      discount: wholesaleDiscount,
      total: total,
      isAdvanceBooking: isAdvance,
      advanceAmountPaid,
      balanceDue,
      paymentMethod,
      paymentStatus,
      paymentDetails: enrichedPaymentDetails,
      status: resolvedStatus,
      ewayBill,
      serials: [],
      logistics: {
        shipmentTier: freightInfo.shipmentTier,
        carrier: freightInfo.shipmentTier === 'EXPRESS_PARCEL' ? 'Delhivery Express Logistics' : 'VRL Logistics Heavy Freight',
        lrNumber: `LR-MH-${randomHex}`,
        originWarehouse: 'Bhiwandi Central Machinery Logistics Hub',
        destinationCity: formData.city || 'India',
        destinationGodownAddress: formData.address,
        destinationGodownPhone: formData.phone,
        totalPackages: Math.max(1, Math.ceil(items.reduce((acc, it) => acc + it.quantity, 0) / 2)),
        actualWeightKg: freightInfo.billedWeightKg,
        estimatedDeliveryDays: taxSplit.isIntraState ? 2 : 4,
      },
    };

    await orderStorage.saveOrder(newOrder);
    clearCart();
    return orderId;
  };

  const handleStartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      setError('Please complete all mandatory contact and shipping fields.');
      return;
    }

    if (!formData.termsAgreed) {
      setError('Please acknowledge that you agree to the commercial dispatch and warranty terms.');
      return;
    }

    if (formData.paymentMethod === 'whatsapp') {
      setLoading(true);
      const orderId = await createAndCommitOrder(
        'whatsapp',
        'PENDING_VERIFICATION',
        { paymentMode: 'WhatsApp B2B Purchase Order' }
      );

      const waText = getFormattedWhatsAppOrderText();
      const encoded = encodeURIComponent(
        `*OFFICIAL PURCHASE ORDER #${orderId}*\n` +
        `${waText}\n\n` +
        `*CONSIGNEE & FREIGHT DESTINATION:*\n` +
        `• Name: ${formData.firstName} ${formData.lastName}\n` +
        `• Firm: ${formData.companyName || 'Retail Consignee'}\n` +
        `• GSTIN: ${formData.gstin || 'Unregistered'}\n` +
        `• Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.postalCode}\n` +
        `• Mobile: ${formData.phone}\n\n` +
        `Please confirm freight dispatch and issue commercial GST invoice.`
      );
      window.open(`https://wa.me/917352210000?text=${encoded}`, '_blank');
      setLoading(false);
      router.push(`/order-success/${orderId}`);
      return;
    }

    if (formData.paymentMethod === 'virtual_account') {
      setLoading(true);
      const orderId = await createAndCommitOrder(
        'virtual_account',
        'PENDING_VERIFICATION',
        { paymentMode: 'ICICI Smart Collect Virtual Escrow Account (VAN)' }
      );
      setGeneratedVanOrderId(orderId);
      setLoading(false);
      setShowVanModal(true);
      return;
    }

    if (formData.paymentMethod === 'bank_transfer') {
      setShowBankModal(true);
      return;
    }

    if (formData.paymentMethod === 'cod') {
      setLoading(true);
      const orderId = await createAndCommitOrder(
        'cod',
        'PENDING_VERIFICATION',
        { paymentMode: 'Pay on Delivery / Transport Godown Collection' }
      );
      setLoading(false);
      router.push(`/order-success/${orderId}`);
      return;
    }

    // Razorpay Online Gateway or Two-Stage 20% Booking Advance
    setShowRazorpayModal(true);
  };

  const handleConfirmRazorpayPayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setRazorpaySuccess(true);
      const txnId = `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const isAdvance = formData.paymentMethod === 'two_stage_advance';
      const orderId = await createAndCommitOrder(
        isAdvance ? 'two_stage_advance' : 'razorpay',
        isAdvance ? 'PARTIALLY_PAID' : 'PAID',
        {
          transactionId: txnId,
          paymentMode: isAdvance ? '20% Advance Booking Deposit (Online)' : razorpayTab.toUpperCase()
        }
      );
      setTimeout(() => {
        router.push(`/order-success/${orderId}`);
      }, 1000);
    }, 1200);
  };

  const handleConfirmBankTransfer = async () => {
    setLoading(true);
    const orderId = await createAndCommitOrder('bank_transfer', 'PENDING_VERIFICATION', {
      utrNumber: bankUtr || `NEFT-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      paymentMode: 'NEFT / RTGS Commercial Transfer'
    });
    setLoading(false);
    setShowBankModal(false);
    router.push(`/order-success/${orderId}`);
  };

  const copyBankDetails = () => {
    const text = `ARVEER IMPEX BANK DETAILS\nBank: HDFC Bank Ltd.\nAccount: Arveer Impex Commercial\nA/C No: 50200084922476\nIFSC: HDFC0000128\nBranch: Fort Commercial Branch, Mumbai\nA/C Type: Current Account\nAmount: ${formatCurrency(total)}`;
    navigator.clipboard.writeText(text);
    setBankCopied(true);
    setTimeout(() => setBankCopied(false), 2500);
  };

  return (
    <div className="pt-12 sm:pt-16 pb-20 bg-offwhite text-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-botanical transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Machinery Catalog</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-charcoal-muted">
            <ShieldCheck className="w-4 h-4 text-leaf" />
            <span>Authorized Arveer Impex Billing & 5% Statutory GST</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
                Proforma Invoice & Dispatch Details
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Provide consignee information for transport billing and warranty registration.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Neon Authenticated Buyer Banner or Sign In Callout */}
            {profile ? (
              <div className="p-4 rounded-2xl bg-[#24583D]/10 border border-[#24583D]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#24583D] text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#141A17] block">
                      Logged In: {profile.fullName}
                    </span>
                    <span className="text-[11px] text-[#24583D] font-mono">
                      Neon Verified Account • {profile.phone || profile.email}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#24583D]/15 text-[#24583D] font-bold border border-[#24583D]/30">
                  Form Auto-Filled
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[rgba(166,201,106,0.35)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-[#141A17] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#24583D]" />
                    <span>Have a Registered Buyer or Dealership Account?</span>
                  </span>
                  <span className="text-[11px] text-[#4F5D54] block mt-0.5">
                    Sign in with your email & password to sync dispatch records & warranty to your account.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="px-3.5 py-2 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#A6C96A]" />
                  <span>Sign In to Account</span>
                </button>
              </div>
            )}

            <form id="checkout-form" onSubmit={handleStartCheckout} className="space-y-6">

              {/* 1. Consignee & Firm Information */}
              <div className="p-6 sm:p-8 rounded-3xl bg-sand/35 border border-sand-border space-y-4 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-botanical text-offwhite text-xs flex items-center justify-center font-bold">1</span>
                  <span>Consignee & Dealership Information</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical"
                      placeholder="e.g. Ramesh"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical"
                      placeholder="e.g. Patel"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Dealership / Firm Name (Optional)</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical"
                      placeholder="e.g. Kisan Agro Machinery Works"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">GSTIN Number (For 5% Tax Credit)</label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical uppercase"
                      placeholder="27AABCS1429B1Z8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical"
                      placeholder="ramesh@agroservice.in"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical"
                      placeholder="+91 98200 12345"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Transport Delivery Address */}
              <div className="p-6 sm:p-8 rounded-3xl bg-sand/35 border border-sand-border space-y-4 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-botanical text-offwhite text-xs flex items-center justify-center font-bold">2</span>
                  <span>Freight Delivery Address</span>
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Street Address / Shop Location *</label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical"
                    placeholder="Plot 12, Krishi Bazar Road, Near APMC Market Yard"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical"
                      placeholder="Rajkot"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical cursor-pointer"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-botanical"
                      placeholder="360001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Freight Transport Notes (e.g. Preferred transport courier or booking office)</label>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-offwhite border border-sand-border rounded-xl px-3.5 py-2 text-xs text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:border-botanical"
                    placeholder="Book through V-Trans or Patel Roadways, collect from depot..."
                  />
                </div>
              </div>

              {/* Hardware Compatibility Validation Rules (Section 2.3 & 4.2) */}
              {compatibilityAlerts.length > 0 && (
                <div className="p-5 rounded-3xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Hardware Fitment Compatibility Verification:</span>
                  </div>
                  {compatibilityAlerts.map((alert, idx) => (
                    <p key={idx} className="text-xs leading-relaxed pl-6">
                      • {alert}
                    </p>
                  ))}
                </div>
              )}

              {/* Two-Tier Logistics & Dispatch Routing Banner (Section 8) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#14261F] text-white border border-[#A6C96A]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#A6C96A]" />
                    <span className="font-serif font-bold text-sm sm:text-base">
                      {freightInfo.shipmentTier === 'EXPRESS_PARCEL' ? 'Tier 1: Express Courier Dispatch' : 'Tier 2: Heavy Freight B2B Road Transport'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A6C96A]/20 text-[#A6C96A] border border-[#A6C96A]/40 font-bold">
                    {freightInfo.billedWeightKg} kg Gross Mass
                  </span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  {freightInfo.routingDescription}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#A6C96A] pt-1">
                  <span>• Central Hub: Bhiwandi Machinery Logistics</span>
                  <span>• Transit: {taxSplit.isIntraState ? '1–2 Days (Maharashtra)' : '3–4 Days Inter-State'}</span>
                  <span>• Transporter Bilty (LR) Provided</span>
                </div>
              </div>

              {/* 3. Settlement & Dispatch Method (Section 5) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-sand/35 border border-sand-border space-y-4 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-botanical text-offwhite text-xs flex items-center justify-center font-bold">3</span>
                  <span>Payment & Dispatch Workflow</span>
                </h2>

                <div className="space-y-3">
                  {/* Virtual Account Escrow (> ₹50,000) - Section 5.2 */}
                  {total >= 50000 && (
                    <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'virtual_account'
                        ? 'bg-offwhite border-botanical shadow-sm ring-1 ring-botanical'
                        : 'bg-sand/20 border-sand-border hover:border-sand-dark'
                      }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="virtual_account"
                          checked={formData.paymentMethod === 'virtual_account'}
                          onChange={handleChange}
                          className="accent-[#24583D]"
                        />
                        <div>
                          <span className="font-semibold text-sm text-charcoal flex items-center gap-2">
                            <span>Virtual Escrow Account (VAN - Smart Collect)</span>
                            <span className="text-[10px] bg-botanical text-white px-2 py-0.5 rounded font-bold">
                              Recommended for Orders &gt; ₹50,000
                            </span>
                          </span>
                          <span className="text-[11px] text-charcoal-muted block">
                            Dedicated ICICI Bank Virtual Account for direct NEFT/RTGS auto-reconciliation without manual slip checking.
                          </span>
                        </div>
                      </div>
                      <Building2 className="w-5 h-5 text-botanical shrink-0" />
                    </label>
                  )}

                  {/* Two-Stage 20% Booking Advance - Section 5.3 */}
                  <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'two_stage_advance'
                      ? 'bg-offwhite border-botanical shadow-sm'
                      : 'bg-sand/20 border-sand-border hover:border-sand-dark'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="two_stage_advance"
                        checked={formData.paymentMethod === 'two_stage_advance'}
                        onChange={handleChange}
                        className="accent-[#24583D]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-charcoal flex items-center gap-2">
                          <span>Pay 20% Advance Booking ({formatCurrency(Math.round(total * 0.20))})</span>
                          <span className="text-[10px] bg-[#D4AF37]/20 text-[#856712] px-2 py-0.5 rounded font-bold border border-[#D4AF37]/40">
                            Regional Freight Policy
                          </span>
                        </span>
                        <span className="text-[11px] text-charcoal-muted block">
                          Pay 20% advance booking now. Remaining 80% ({formatCurrency(total - Math.round(total * 0.20))}) payable against presentation of the transport Lorry Receipt (LR Bilty).
                        </span>
                      </div>
                    </div>
                    <Receipt className="w-5 h-5 text-botanical shrink-0" />
                  </label>

                  {/* Razorpay Sub-50k Instant Gateway */}
                  <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'razorpay'
                      ? 'bg-offwhite border-botanical shadow-sm'
                      : 'bg-sand/20 border-sand-border hover:border-sand-dark'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={handleChange}
                        className="accent-[#24583D]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-charcoal block">Instant Payment Gateway (UPI / Cards / NetBanking)</span>
                        <span className="text-[11px] text-charcoal-muted">Instant online settlement via UPI QR, RuPay, NetBanking across 54 banks</span>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-charcoal-muted shrink-0" />
                  </label>

                  {/* WhatsApp B2B Dispatch */}
                  <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'whatsapp'
                      ? 'bg-offwhite border-botanical shadow-sm'
                      : 'bg-sand/20 border-sand-border hover:border-sand-dark'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={formData.paymentMethod === 'whatsapp'}
                        onChange={handleChange}
                        className="accent-[#24583D]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-charcoal flex items-center gap-2">
                          <span>Dispatch Purchase Order via WhatsApp</span>
                          <span className="text-[10px] bg-leaf/20 text-forest px-2 py-0.5 rounded font-bold border border-leaf/40">
                            Preferred for Dealers
                          </span>
                        </span>
                        <span className="text-[11px] text-charcoal-muted block">Direct order generation with instant WhatsApp sales desk routing</span>
                      </div>
                    </div>
                    <MessageCircle className="w-5 h-5 text-botanical shrink-0" />
                  </label>

                  {/* Bank Wire / RTGS */}
                  <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'bank_transfer'
                      ? 'bg-offwhite border-botanical shadow-sm'
                      : 'bg-sand/20 border-sand-border hover:border-sand-dark'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={formData.paymentMethod === 'bank_transfer'}
                        onChange={handleChange}
                        className="accent-[#24583D]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-charcoal block">Standard Bank RTGS / NEFT Commercial Account</span>
                        <span className="text-[11px] text-charcoal-muted">Arveer Impex corporate bank account coordinates & proforma billing</span>
                      </div>
                    </div>
                    <Building2 className="w-5 h-5 text-charcoal-muted shrink-0" />
                  </label>

                  {/* Cash / Transport Pay on Delivery */}
                  <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'cod'
                      ? 'bg-offwhite border-botanical shadow-sm'
                      : 'bg-sand/20 border-sand-border hover:border-sand-dark'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="accent-[#24583D]"
                      />
                      <div>
                        <span className="font-semibold text-sm text-charcoal block">Transport Pay on Delivery (POD)</span>
                        <span className="text-[11px] text-charcoal-muted">Settle invoice upon physical consignment receipt at local transport depot</span>
                      </div>
                    </div>
                    <Truck className="w-5 h-5 text-charcoal-muted shrink-0" />
                  </label>
                </div>

                <div className="pt-3">
                  <label className="flex items-start gap-2.5 text-xs text-charcoal-muted cursor-pointer">
                    <input
                      type="checkbox"
                      name="termsAgreed"
                      checked={formData.termsAgreed}
                      onChange={handleChange}
                      className="mt-0.5 accent-[#24583D]"
                    />
                    <span>
                      I confirm that the consignee details are accurate for statutory GST commercial invoicing, carrier freight booking, and OEM warranty registration.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-botanical hover:bg-botanical-dark text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-3"
              >
                {loading ? (
                  <span>Processing Order Allocation...</span>
                ) : formData.paymentMethod === 'virtual_account' ? (
                  <>
                    <Building2 className="w-5 h-5 text-white" />
                    <span>Generate Dedicated Escrow Account ({formatCurrency(total)})</span>
                  </>
                ) : formData.paymentMethod === 'two_stage_advance' ? (
                  <>
                    <Receipt className="w-5 h-5 text-white" />
                    <span>Pay 20% Advance Booking ({formatCurrency(Math.round(total * 0.20))})</span>
                  </>
                ) : formData.paymentMethod === 'whatsapp' ? (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>Submit & Forward Purchase Order to WhatsApp</span>
                  </>
                ) : formData.paymentMethod === 'bank_transfer' ? (
                  <>
                    <Building2 className="w-5 h-5" />
                    <span>View Bank RTGS Details & Generate Invoice</span>
                  </>
                ) : formData.paymentMethod === 'cod' ? (
                  <>
                    <Truck className="w-5 h-5" />
                    <span>Book Transport Consignment ({formatCurrency(total)})</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-leaf" />
                    <span>Proceed to Gateway Settlement ({formatCurrency(total)})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary & Commercial Invoice Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-sand/35 border border-sand-border space-y-6 shadow-sm sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-sand-border">
                <h3 className="font-serif text-xl font-bold text-charcoal">Commercial Proforma</h3>
                <span className="text-xs font-mono bg-botanical/15 text-botanical font-bold px-2 py-0.5 rounded">
                  {items.length} Line Item{items.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-sand-border/50 last:border-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-sand-border shrink-0 flex items-center justify-center p-1">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-charcoal truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-charcoal-muted">
                        Qty: {item.quantity} × {formatCurrency(item.product.price)} • HSN {item.product.category.includes('Pumps') ? '8413' : item.product.name.toLowerCase().includes('engine') ? '8407' : item.product.name.toLowerCase().includes('chain') ? '8202' : '8432'}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-charcoal">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 pt-4 border-t border-sand-border text-xs text-charcoal">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Taxable Base Subtotal</span>
                  <span>{formatCurrency(baseExGst)}</span>
                </div>

                {wholesaleDiscount > 0 && (
                  <div className="flex justify-between text-botanical font-semibold">
                    <span>{tierInfo.tierName}</span>
                    <span>-{formatCurrency(wholesaleDiscount)}</span>
                  </div>
                )}

                {/* Section 6.1 Intra-state vs Inter-state Tax Breakdown */}
                {taxSplit.isIntraState ? (
                  <>
                    <div className="flex justify-between text-charcoal-muted">
                      <span>Central GST (CGST - 50% split)</span>
                      <span>{formatCurrency(taxSplit.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-muted">
                      <span>State GST (SGST - Maharashtra)</span>
                      <span>{formatCurrency(taxSplit.sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Integrated GST (IGST - Inter-State Supply)</span>
                    <span>{formatCurrency(taxSplit.igst)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Transport Logistics ({freightInfo.shipmentTier === 'EXPRESS_PARCEL' ? 'Express Courier' : 'Heavy Road Freight'})</span>
                  <span>{shipping === 0 ? <strong className="text-botanical">FREE (Order &gt; ₹15,000)</strong> : formatCurrency(shipping)}</span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-charcoal pt-3 border-t border-sand-border">
                  <span>Total Consignment Value</span>
                  <span className="text-botanical">{formatCurrency(total)}</span>
                </div>

                {formData.paymentMethod === 'two_stage_advance' && (
                  <div className="p-3 rounded-xl bg-sand/60 border border-[#D4AF37]/50 space-y-1.5 mt-2">
                    <div className="flex justify-between text-xs font-bold text-[#856712]">
                      <span>Stage 1: 20% Booking Advance Now</span>
                      <span>{formatCurrency(Math.round(total * 0.20))}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-charcoal-muted">
                      <span>Stage 2: 80% Balance Against LR Bilty</span>
                      <span>{formatCurrency(total - Math.round(total * 0.20))}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 6.3 E-Way Bill Notice if value >= ₹50,000 */}
              {total >= 50000 && (
                <div className="p-3 rounded-2xl bg-[#14261F] text-white border border-[#A6C96A]/40 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#A6C96A]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Statutory E-Way Bill Triggered (&gt; ₹50,000)</span>
                  </div>
                  <p className="text-white/80">Government NIC electronic E-Way Bill will be automatically generated with Part A & B transporter routing upon dispatch.</p>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-white/70 border border-sand-border text-[11px] space-y-1 text-charcoal-muted">
                <div className="flex items-center gap-1.5 font-bold text-charcoal">
                  <Receipt className="w-3.5 h-3.5 text-botanical" />
                  <span>GST Input Tax Credit (ITC) Guaranteed</span>
                </div>
                <p>Tax invoice with verified HSN codes (8432 / 8413 / 8407 / 8202) and registered GSTIN issued by Arveer Impex.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Razorpay Online Gateway Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-sand-border shadow-2xl max-w-md w-full overflow-hidden text-charcoal">

            {/* Razorpay Header */}
            <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#3395FF] flex items-center justify-center font-bold text-xs">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Razorpay Smart Gateway</h3>
                  <p className="text-[10px] text-white/70">Merchant: Arveer Impex (Agroveer & Sawking)</p>
                </div>
              </div>
              <button
                onClick={() => setShowRazorpayModal(false)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="text-center pb-4 border-b border-sand-border">
                <span className="text-xs text-charcoal-muted">Total Amount Due</span>
                <div className="font-serif text-3xl font-bold text-charcoal mt-0.5">
                  {formatCurrency(total)}
                </div>
                <span className="text-[10px] text-botanical font-semibold">Includes 5% Agriculture GST</span>
              </div>

              {/* Razorpay Tabs */}
              <div className="grid grid-cols-3 gap-2 bg-sand/30 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRazorpayTab('upi')}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${razorpayTab === 'upi' ? 'bg-white shadow text-charcoal' : 'text-charcoal-muted'
                    }`}
                >
                  UPI QR
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpayTab('card')}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${razorpayTab === 'card' ? 'bg-white shadow text-charcoal' : 'text-charcoal-muted'
                    }`}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpayTab('netbanking')}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${razorpayTab === 'netbanking' ? 'bg-white shadow text-charcoal' : 'text-charcoal-muted'
                    }`}
                >
                  NetBanking
                </button>
              </div>

              {razorpayTab === 'upi' && (
                <div className="text-center space-y-3 py-2">
                  <div className="w-36 h-36 mx-auto bg-sand/20 border-2 border-dashed border-sand-dark rounded-2xl flex flex-col items-center justify-center p-2">
                    <QrCode className="w-20 h-20 text-[#0C2340]" />
                    <span className="text-[9px] font-mono text-charcoal-muted mt-1">Scan via GPay / PhonePe / Paytm</span>
                  </div>
                  <p className="text-xs text-charcoal-muted">UPI ID: <strong>arveerimpex@razorpay</strong></p>
                </div>
              )}

              {razorpayTab === 'card' && (
                <div className="space-y-3 text-left">
                  <div>
                    <label className="text-[11px] font-semibold text-charcoal block mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892"
                      className="w-full bg-sand/20 border border-sand-border rounded-xl px-3 py-2 text-xs font-mono"
                      defaultValue="4532 8901 2345 6789"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="08/29"
                      className="w-full bg-sand/20 border border-sand-border rounded-xl px-3 py-2 text-xs font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="789"
                      className="w-full bg-sand/20 border border-sand-border rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {razorpayTab === 'netbanking' && (
                <div className="space-y-2 text-left">
                  <label className="text-[11px] font-semibold text-charcoal block">Popular Commercial Banks</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        className="p-2.5 rounded-xl border border-sand-border bg-sand/10 hover:bg-sand/30 font-medium text-left truncate"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmRazorpayPayment}
                disabled={loading || razorpaySuccess}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${razorpaySuccess
                    ? 'bg-green-600 text-white'
                    : 'bg-[#3395FF] hover:bg-[#2080E5] text-white shadow-lg'
                  }`}
              >
                {loading ? (
                  <span>Verifying Payment Handshake...</span>
                ) : razorpaySuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Payment Approved & Invoice Generated!</span>
                  </>
                ) : (
                  <span>Authorize & Pay {formatCurrency(total)}</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-muted pt-1">
                <Lock className="w-3 h-3 text-leaf" />
                <span>256-bit SSL Encrypted • RBI Licensed Payment Aggregator</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Bank RTGS / NEFT Commercial Coordinates Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-sand-border shadow-2xl max-w-lg w-full overflow-hidden text-charcoal">

            <div className="bg-[#102C22] text-[#F7F5F0] p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#24583D] flex items-center justify-center border border-[#A6C96A]/40 font-bold text-sm">
                  <Building2 className="w-4 h-4 text-[#A6C96A]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Official Bank RTGS / NEFT Coordinates</h3>
                  <p className="text-[10px] text-[#F7F5F0]/70">Arveer Impex Commercial Current Account</p>
                </div>
              </div>
              <button
                onClick={() => setShowBankModal(false)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-sand/30 border border-sand-border space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-sand-border/50">
                  <span className="text-charcoal-muted">Beneficiary Name:</span>
                  <strong className="text-charcoal">Arveer Impex Commercial Account</strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-sand-border/50">
                  <span className="text-charcoal-muted">Bank Name:</span>
                  <strong className="text-charcoal">HDFC Bank Ltd.</strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-sand-border/50">
                  <span className="text-charcoal-muted">Current Account No:</span>
                  <strong className="text-charcoal font-mono text-sm">50200084922476</strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-sand-border/50">
                  <span className="text-charcoal-muted">IFSC Code:</span>
                  <strong className="text-charcoal font-mono">HDFC0000128</strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-sand-border/50">
                  <span className="text-charcoal-muted">Branch:</span>
                  <strong className="text-charcoal">Fort Commercial Branch, Mumbai</strong>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-charcoal-muted">Total Payable:</span>
                  <strong className="text-botanical text-sm">{formatCurrency(total)}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={copyBankDetails}
                  className="px-3.5 py-1.5 rounded-xl bg-sand/40 hover:bg-sand border border-sand-border text-xs text-charcoal font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-botanical" />
                  <span>{bankCopied ? 'Bank Details Copied!' : 'Copy Bank Details'}</span>
                </button>
                <span className="text-[11px] text-charcoal-muted">Real-time NEFT / IMPS Accepted</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Bank UTR Reference Number (Optional if paying now)
                </label>
                <input
                  type="text"
                  value={bankUtr}
                  onChange={(e) => setBankUtr(e.target.value)}
                  placeholder="e.g. HDFC2611150098432"
                  className="w-full bg-sand/15 border border-sand-border rounded-xl px-3.5 py-2 text-xs font-mono text-charcoal focus:outline-none focus:border-botanical uppercase"
                />
              </div>

              <button
                type="button"
                onClick={handleConfirmBankTransfer}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-botanical hover:bg-botanical-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Generating Proforma Invoice...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-leaf" />
                    <span>Confirm Order & Generate Official Proforma</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Section 5.2 Virtual Escrow Account (VAN) Modal */}
      {showVanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-sand-border shadow-2xl max-w-lg w-full overflow-hidden text-charcoal">

            <div className="bg-[#102C22] text-white p-6 border-b border-[rgba(166,201,106,0.25)] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#A6C96A] animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6C96A] font-bold">
                    Section 5.2 • Escrow Smart Collect (VAN)
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold">Dedicated B2B Virtual Escrow Account</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowVanModal(false);
                  router.push(`/order-success/${generatedVanOrderId}`);
                }}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-sand/30 border border-sand-border text-xs text-charcoal-muted leading-relaxed">
                This dedicated Virtual Account Number (VAN) is registered exclusively to your consignment order. When you execute an NEFT/RTGS wire from your bank, funds auto-reconcile within 60 seconds and trigger immediate warehouse picking.
              </div>

              <div className="space-y-3 bg-[#FBFBFA] p-5 rounded-2xl border border-sand-border text-xs font-medium">
                <div className="flex justify-between items-center py-1.5 border-b border-sand-border/60">
                  <span className="text-charcoal-muted">Beneficiary Legal Name:</span>
                  <strong className="text-charcoal font-bold">Arveer Impex - Order #{generatedVanOrderId}</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sand-border/60">
                  <span className="text-charcoal-muted">Dedicated Virtual A/C (VAN):</span>
                  <strong className="text-charcoal font-mono text-sm tracking-wider font-bold text-botanical">
                    ARVEER{generatedVanOrderId.replace('-', '')}
                  </strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sand-border/60">
                  <span className="text-charcoal-muted">Virtual IFSC Code:</span>
                  <strong className="text-charcoal font-mono font-bold">ICIC0000104</strong>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sand-border/60">
                  <span className="text-charcoal-muted">Escrow Bank Partner:</span>
                  <strong className="text-charcoal">ICICI Bank Ltd. (Wholesale Smart Collect)</strong>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-charcoal-muted">Total Payable:</span>
                  <strong className="text-botanical font-serif text-base font-bold">{formatCurrency(total)}</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const vanText = `ARVEER IMPEX VIRTUAL ESCROW ACCOUNT\nBeneficiary: Arveer Impex - Order #${generatedVanOrderId}\nVirtual Account: ARVEER${generatedVanOrderId.replace('-', '')}\nIFSC: ICIC0000104\nBank: ICICI Bank Ltd. Smart Collect\nAmount: ${formatCurrency(total)}`;
                    navigator.clipboard.writeText(vanText);
                    setVanCopied(true);
                    setTimeout(() => setVanCopied(false), 2500);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-sand/40 hover:bg-sand border border-sand-border text-xs text-charcoal font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4 text-botanical" />
                  <span>{vanCopied ? 'VAN Coordinates Copied!' : 'Copy VAN Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowVanModal(false);
                    router.push(`/order-success/${generatedVanOrderId}`);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-botanical hover:bg-botanical-dark text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Dispatch Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
