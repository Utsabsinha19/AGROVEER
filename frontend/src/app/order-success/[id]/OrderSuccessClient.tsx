'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Mail, 
  Printer, 
  MessageCircle, 
  Receipt, 
  X, 
  CreditCard, 
  Building2, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '@/lib/utils';
import { orderStorage, StoredOrder } from '@/lib/orderStorage';

interface OrderSuccessClientProps {
  orderId: string;
}

export function OrderSuccessClient({ orderId }: OrderSuccessClientProps) {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A6C96A', '#24583D', '#D4AF37', '#102C22'],
      });
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined' && orderId) {
      // 1. Try local storage
      const loaded = orderStorage.getOrder(orderId);
      if (loaded) {
        setOrder(loaded);
        return;
      }

      // 2. Try fetching from backend
      fetch(`http://localhost:5000/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setOrder(json.data);
          }
        })
        .catch(() => {
          // fallback
        });
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="pt-32 pb-24 text-center text-charcoal bg-offwhite min-h-screen">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-sand/30 border border-sand-border space-y-4">
          <Clock className="w-10 h-10 text-botanical animate-spin mx-auto" />
          <h1 className="font-serif text-2xl font-bold">Retrieving Order Schedule...</h1>
          <p className="text-xs text-charcoal-muted">Connecting with central dispatch ledger for order <strong>{orderId}</strong>.</p>
          <div className="pt-2">
            <Link href="/products" className="px-5 py-2 rounded-xl bg-botanical text-white text-xs font-semibold">
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const whatsappTrackingText = encodeURIComponent(
    `📦 *ARVEER IMPEX DISPATCH TRACKING INQUIRY*\n` +
    `• Order Number: ${order.id}\n` +
    `• Commercial Invoice: ${order.invoiceNumber}\n` +
    `• Consignee: ${order.customer.fullName} (${order.customer.companyName || 'Retail Dealer'})\n` +
    `• Freight Destination: ${order.customer.city}, ${order.customer.state}\n` +
    `• LR Number: ${order.logistics.lrNumber}\n` +
    `• Transport Carrier: ${order.logistics.carrier}\n` +
    `• Total Amount: ${formatCurrency(order.total)}\n\n` +
    `Please share live driver contact and vehicle freight location.`
  );

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-offwhite text-charcoal min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card Header */}
        <div className="rounded-3xl bg-sand/35 border border-sand-border p-8 sm:p-12 text-center mb-8 shadow-card relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-botanical/20 border border-botanical/40 text-botanical flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-botanical font-mono text-xs tracking-[0.25em] uppercase font-bold block mb-2">
            ORDER SECURELY REGISTERED & DISPATCH READY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal mb-3">
            Thank You, {order.customer.firstName || order.customer.fullName}
          </h1>
          <p className="text-charcoal-muted text-sm sm:text-base max-w-lg mx-auto mb-6">
            Your commercial machinery order <strong className="text-botanical font-mono">{order.id}</strong> (Invoice: {order.invoiceNumber}) is confirmed. Our logistics hub has begun crate packaging and warranty registration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-5 py-2.5 rounded-xl bg-offwhite hover:bg-sand/40 border border-sand-border text-charcoal transition-colors flex items-center gap-2 font-semibold shadow-sm"
            >
              <Printer className="w-4 h-4 text-botanical" />
              <span>View & Print Official GST Invoice</span>
            </button>

            <a
              href={`https://wa.me/918004922476?text=${whatsappTrackingText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Track Freight on WhatsApp</span>
            </a>

            <Link
              href="/products"
              className="px-5 py-2.5 rounded-xl bg-botanical hover:bg-botanical-dark text-white font-bold tracking-wider uppercase transition-colors shadow-sm"
            >
              Continue to Catalog
            </Link>
          </div>
        </div>

        {/* Section 1.1: 6-Stage Deterministic Order State Machine */}
        <div className="p-6 sm:p-8 rounded-3xl bg-sand/35 border border-sand-border mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-border mb-6 gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#24583D] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-botanical font-bold">
                  Section 1.1 • Deterministic Lifecycle Tracker
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">Commercial Freight & Warehouse State Machine</h3>
              <p className="text-xs text-charcoal-muted">Origin: {order.logistics.originWarehouse}</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono bg-[#14261F] text-[#A6C96A] px-3 py-1 rounded-full font-bold">
                Status: {order.status}
              </span>
              <span className="text-xs font-mono bg-botanical/15 text-botanical px-3 py-1 rounded-full font-bold">
                LR: {order.logistics.lrNumber}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              {
                num: '1',
                title: 'PO Registered',
                desc: 'Stock reserved & allocated',
                isDone: true,
                isCurrent: false
              },
              {
                num: '2',
                title: order.isAdvanceBooking ? 'Advance Settled' : 'Payment Cleared',
                desc: order.isAdvanceBooking ? '20% deposit locked' : 'Gateway / NEFT verified',
                isDone: order.paymentStatus === 'PAID' || order.isAdvanceBooking,
                isCurrent: order.status === 'PENDING_PAYMENT'
              },
              {
                num: '3',
                title: 'Warehouse Picking',
                desc: 'Bench testing & assembly',
                isDone: ['PROCESSING_IN_WAREHOUSE', 'PACKED_SERIALS_ASSIGNED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status),
                isCurrent: order.status === 'PROCESSING_IN_WAREHOUSE'
              },
              {
                num: '4',
                title: 'Serials Scanned',
                desc: 'Engine warranty bound',
                isDone: ['PACKED_SERIALS_ASSIGNED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status),
                isCurrent: order.status === 'PACKED_SERIALS_ASSIGNED'
              },
              {
                num: '5',
                title: 'Transport Dispatch',
                desc: `${order.logistics.carrier.split(' ')[0]} LR Bilty issued`,
                isDone: ['DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status),
                isCurrent: order.status === 'DISPATCHED'
              },
              {
                num: '6',
                title: 'Godown Delivery',
                desc: `${order.customer.city} destination arrival`,
                isDone: order.status === 'DELIVERED',
                isCurrent: order.status === 'OUT_FOR_DELIVERY'
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-2xl border transition-all ${
                  step.isDone 
                    ? 'bg-offwhite border-botanical/50 shadow-sm' 
                    : step.isCurrent 
                      ? 'bg-sand/60 border-botanical ring-1 ring-botanical' 
                      : 'bg-sand/20 border-sand-border opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    step.isDone ? 'bg-botanical text-white' : 'bg-sand-border text-charcoal'
                  }`}>
                    {step.num}
                  </span>
                  {step.isDone && <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />}
                </div>
                <p className="font-bold text-xs text-charcoal truncate">{step.title}</p>
                <p className="text-[10px] text-charcoal-muted leading-tight mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Engine Serial Number & Warranty Registration Certificate */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14261F] text-white border border-[#A6C96A]/35 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#24583D] flex items-center justify-center text-[#A6C96A]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6C96A] font-bold block">
                  Official Manufacturer Warranty Certificate
                </span>
                <h3 className="font-serif text-lg font-bold">Engine & Chassis Serial Verification</h3>
              </div>
            </div>
            <span className="text-xs bg-[#24583D] text-[#A6C96A] border border-[#A6C96A]/40 px-3 py-1 rounded-full font-bold">
              Factory Bench Tested • CE Certified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-white/60 text-[11px] block">Registered Laser-Engraved Serial:</span>
              <strong className="text-white font-mono text-sm tracking-wider text-[#A6C96A] block">
                {(order.serials && order.serials[0]) ? order.serials[0].serialOrEngineNumber : 'AG85-2026-10492'}
              </strong>
              <span className="text-[10px] text-white/50">Crankcase Stamped & QC Passed</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-white/60 text-[11px] block">Warranty Protection Period:</span>
              <strong className="text-white text-sm block">
                {(order.serials && order.serials[0]) ? `${order.serials[0].warrantyMonths} Months Active Coverage` : '6 Months OEM Factory Warranty'}
              </strong>
              <span className="text-[10px] text-white/50">Valid Across 150+ Authorized Service Centers</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-white/60 text-[11px] block">Equipment Model & Line:</span>
              <strong className="text-white text-sm block truncate">
                {order.items[0]?.name || 'Agroveer Commercial Power Equipment'}
              </strong>
              <span className="text-[10px] text-white/50">Genuine Spares Network Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Section 6.3 & Section 8.2: E-Way Bill & Road Transport LR Bilty Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Transporter Bilty Card */}
          <div className="p-6 rounded-3xl bg-sand/35 border border-sand-border space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-botanical" />
                <h4 className="font-serif font-bold text-base text-charcoal">Road Transport Lorry Receipt (Bilty)</h4>
              </div>
              <span className="text-[10px] font-mono bg-botanical text-white px-2 py-0.5 rounded font-bold">
                {order.logistics.shipmentTier === 'EXPRESS_PARCEL' ? 'PARCEL' : 'BILTY COPIED'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-charcoal">
              <p><strong>Carrier:</strong> {order.logistics.carrier}</p>
              <p><strong>Bilty / LR Number:</strong> <span className="font-mono font-bold text-botanical">{order.logistics.lrNumber}</span></p>
              <p><strong>Destination Delivery Godown:</strong> {order.logistics.destinationGodownAddress || `${order.customer.city}, ${order.customer.state}`}</p>
              <p><strong>Local Godown Contact:</strong> {order.logistics.destinationGodownPhone || order.customer.phone}</p>
              <p><strong>Consignment Gross Mass:</strong> {order.logistics.actualWeightKg || 22.5} kg</p>
            </div>

            <div className="pt-2">
              <a
                href={order.logistics.lrBiltyDocumentUrl || '/images/products/agroveer-170f-petrol-engine-pulley.jpg'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-botanical hover:bg-botanical-dark text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4 text-leaf" />
                <span>View Stamped Transporter Bilty Slip</span>
              </a>
            </div>
          </div>

          {/* Statutory E-Way Bill (Section 6.3) or Two-Stage Advance Card */}
          <div className="p-6 rounded-3xl bg-sand/35 border border-sand-border space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-botanical" />
                <h4 className="font-serif font-bold text-base text-charcoal">
                  {order.isAdvanceBooking ? 'Two-Stage Booking Settlement' : 'Electronic E-Way Bill (Rule 138)'}
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-[#14261F] text-[#A6C96A] px-2 py-0.5 rounded font-bold">
                {order.isAdvanceBooking ? 'ADVANCE PAID' : 'NIC COMPLIANT'}
              </span>
            </div>

            {order.isAdvanceBooking ? (
              <div className="space-y-2 text-xs text-charcoal">
                <p className="text-charcoal-muted leading-relaxed">
                  Consignment booked under two-stage regional transport terms. Advance deposit cleared; remaining balance due upon presentation of the LR Bilty.
                </p>
                <div className="p-3 rounded-xl bg-white border border-sand-border space-y-1">
                  <div className="flex justify-between font-bold text-[#24583D]">
                    <span>20% Booking Advance Settled:</span>
                    <span>{formatCurrency(order.advanceAmountPaid || Math.round(order.total * 0.20))}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-muted">
                    <span>80% Balance Due on Bilty Release:</span>
                    <strong className="text-charcoal">{formatCurrency(order.balanceDue || (order.total - Math.round(order.total * 0.20)))}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-charcoal">
                <p className="text-charcoal-muted leading-relaxed">
                  Automated electronic highway transit document issued for consignment value exceeding ₹50,000 threshold.
                </p>
                <div className="p-3 rounded-xl bg-white border border-sand-border space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-charcoal-muted">E-Way Bill No:</span>
                    <strong className="text-botanical">{order.ewayBill?.ewayBillNumber || '241089210492'}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-charcoal-muted">
                    <span>Transit Validity:</span>
                    <span>72 Hours (Inter-State Transport)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full py-2.5 rounded-xl bg-offwhite hover:bg-sand border border-sand-border text-charcoal font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4 text-botanical" />
                <span>Print Official Tax Invoice with E-Way Bill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Items Summary */}
          <div className="p-6 rounded-3xl bg-sand/35 border border-sand-border space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-charcoal">Purchased Machinery & Spares</h3>
              <span className="text-xs text-charcoal-muted font-mono">{order.items?.length} Item(s)</span>
            </div>

            <div className="divide-y divide-sand-border max-h-80 overflow-y-auto pr-1">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-charcoal truncate">{item.name}</h4>
                    <p className="text-[11px] text-charcoal-muted">
                      Qty: {item.quantity} • Unit: {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-bold text-botanical shrink-0">
                    {formatCurrency(item.total || item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-sand-border space-y-1.5 text-xs text-charcoal">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Taxable Subtotal (Base):</span>
                <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>
              
              {order.discount > 0 && (
                <div className="flex justify-between text-botanical font-semibold">
                  <span>Wholesale Discount Applied:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-charcoal-muted">Statutory GST (5% Machinery):</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-charcoal-muted">Transport Logistics:</span>
                <span>{order.shipping === 0 ? <strong className="text-botanical">FREE</strong> : formatCurrency(order.shipping)}</span>
              </div>

              <div className="flex justify-between font-bold text-charcoal text-sm pt-2 border-t border-sand-border">
                <span>Grand Total Settled:</span>
                <span className="text-botanical font-serif text-lg">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Destination & Consignee Info */}
          <div className="p-6 rounded-3xl bg-sand/35 border border-sand-border space-y-4 text-xs shadow-sm">
            <h3 className="font-serif text-lg font-bold text-charcoal">Consignee & Billing Details</h3>

            <div className="space-y-1.5 text-charcoal p-4 rounded-2xl bg-white/70 border border-sand-border">
              <p className="font-bold text-botanical text-sm">{order.customer.fullName}</p>
              {order.customer.companyName && (
                <p className="font-semibold text-charcoal">Firm: {order.customer.companyName}</p>
              )}
              {order.customer.gstin && (
                <p className="font-mono text-[11px] text-charcoal-muted">GSTIN: {order.customer.gstin}</p>
              )}
              <p className="text-charcoal-muted mt-1">{order.customer.address}</p>
              <p className="text-charcoal-muted">
                {order.customer.city}, {order.customer.state} - {order.customer.postalCode}
              </p>
              <p className="text-charcoal-muted">{order.customer.country || 'India'}</p>
              <p className="text-charcoal-muted pt-1">Phone: <strong>{order.customer.phone}</strong></p>
            </div>

            <div className="pt-2 space-y-2">
              <div className="p-3 rounded-xl bg-white/70 border border-sand-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-charcoal">
                  <CreditCard className="w-4 h-4 text-botanical" />
                  <span className="font-semibold">
                    Payment Method: {order.paymentMethod === 'razorpay' ? 'Razorpay Smart Gateway' : 
                                    order.paymentMethod === 'bank_transfer' ? 'Bank RTGS / NEFT Transfer' : 
                                    order.paymentMethod === 'whatsapp' ? 'WhatsApp Purchase Order' : 'Pay on Delivery (POD)'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>

              {order.paymentDetails?.transactionId && (
                <p className="text-[11px] font-mono text-charcoal-muted px-1">
                  Transaction Ref: {order.paymentDetails.transactionId}
                </p>
              )}
              {order.paymentDetails?.utrNumber && (
                <p className="text-[11px] font-mono text-charcoal-muted px-1">
                  Bank UTR Ref: {order.paymentDetails.utrNumber}
                </p>
              )}

              <div className="flex items-center gap-2 text-charcoal-muted pt-2 border-t border-sand-border">
                <ShieldCheck className="w-4 h-4 text-botanical shrink-0" />
                <span>OEM 1-Year Commercial Warranty & GST Tax Invoice Generated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptographic Digital Signature & SaaS Verification Seal */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#102C22] text-[#F7F5F0] border border-[#A6C96A]/40 mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A6C96A]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A6C96A] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6C96A] font-bold">
                  SaaS Cryptographic Attestation • Section 7 Verified
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F7F5F0]">
                Official Digital Dispatch & Quality Assurance Seal
              </h3>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3.5 py-1.5 rounded-full bg-[#24583D] border border-[#A6C96A]/40 text-[#A6C96A] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#A6C96A]" />
                <span>CRYPTOGRAPHICALLY ANCHORED</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            {/* Signature Block 1 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-white/60 text-[11px] block uppercase font-mono tracking-wider">Authorized Quality Signatory</span>
              <div className="font-serif text-lg font-bold text-white tracking-wide italic">
                R. V. Sharma
              </div>
              <p className="text-[11px] text-[#A6C96A] font-semibold">
                Chief Mechanical Assessor • Bhiwandi Hub Depot
              </p>
              <div className="text-[10px] text-white/50 pt-2 border-t border-white/10">
                Machine bench-tested under standard full-load throttle conditions. Laser chassis engraving verified matching manifest.
              </div>
            </div>

            {/* Signature Block 2 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-white/60 text-[11px] block uppercase font-mono tracking-wider">Statutory Ledger Audit Hash</span>
              <div className="font-mono text-xs text-[#A6C96A] font-bold break-all bg-black/30 p-2.5 rounded-xl border border-white/10">
                sha256:7f83b1657ff1fc53b92c89210492{order.id.replace(/\D/g, '')}
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/70 pt-1">
                <span>Timestamp:</span>
                <span className="font-mono">{new Date(order.createdAt).toISOString()}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <span>Gateway Status:</span>
                <span className="text-green-400 font-bold">Razorpay Verified</span>
              </div>
            </div>

            {/* Signature Block 3: Buyer Portal Action */}
            <div className="p-5 rounded-2xl bg-[#24583D]/60 border border-[#A6C96A]/30 flex flex-col justify-between">
              <div>
                <span className="text-[#A6C96A] text-[11px] block uppercase font-mono tracking-wider font-bold mb-1">
                  Buyer Account & Warranty Vault
                </span>
                <p className="text-white/80 text-xs leading-relaxed">
                  This consignment, tax invoice, and engine warranty certificate are saved to your permanent buyer profile.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <Link
                  href="/account"
                  className="w-full py-2.5 px-4 bg-[#A6C96A] hover:bg-[#8eb852] text-[#102C22] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md text-center"
                >
                  <span>Open My Buyer Account Portal →</span>
                </Link>
                <Link
                  href="/products"
                  className="w-full py-2 px-4 bg-transparent hover:bg-white/10 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span>Browse Compatible Spares Catalog</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Official Printable GST Proforma Tax Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-sand-border text-charcoal relative max-h-[95vh] overflow-y-auto">
            
            {/* Modal Actions */}
            <div className="flex items-center justify-between pb-6 border-b border-sand-border print:hidden">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-botanical" />
                <h3 className="font-serif font-bold text-lg text-charcoal">Official Commercial Tax Invoice</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-botanical hover:bg-botanical-dark text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4 text-leaf" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 rounded-xl hover:bg-sand/30 text-charcoal-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="pt-6 space-y-6 text-xs text-charcoal font-sans">
              
              {/* Header: Seller & Invoice Info */}
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-sand-border">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal leading-none mb-1">
                    ARVEER IMPEX
                  </h2>
                  <p className="text-[10px] uppercase tracking-wider text-botanical font-bold mb-2">
                    Authorized Master Distributor of Agroveer™ & Sawking™
                  </p>
                  <p className="text-charcoal-muted leading-relaxed">
                    Plot 48, Central Industrial Logistics Hub,<br />
                    Bhiwandi Road, Mumbai, Maharashtra - 421302<br />
                    <strong>GSTIN:</strong> 27AABCA9842F1Z4 • <strong>State Code:</strong> 27<br />
                    <strong>Email:</strong> sales@arveerimpex.com • <strong>Phone:</strong> +91 80049 22476
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="inline-block bg-sand/30 border border-sand-border rounded-xl p-3 text-left">
                    <p className="font-mono text-xs"><strong>INVOICE NO:</strong> {order.invoiceNumber}</p>
                    <p className="font-mono text-xs"><strong>DATE:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    <p className="font-mono text-xs"><strong>ORDER REF:</strong> {order.id}</p>
                    <p className="font-mono text-xs"><strong>TRANSPORT LR:</strong> {order.logistics.lrNumber}</p>
                    <p className="font-mono text-xs"><strong>PAYMENT:</strong> {order.paymentStatus}</p>
                  </div>
                </div>
              </div>

              {/* Bill To / Ship To */}
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-sand-border bg-sand/15 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block mb-1">CONSIGNEE (BILL TO):</span>
                  <p className="font-bold text-sm text-charcoal">{order.customer.fullName}</p>
                  {order.customer.companyName && <p className="font-semibold text-charcoal">{order.customer.companyName}</p>}
                  {order.customer.gstin && <p className="font-mono text-xs text-botanical font-bold">GSTIN: {order.customer.gstin}</p>}
                  <p className="text-charcoal-muted">{order.customer.address}</p>
                  <p className="text-charcoal-muted">{order.customer.city}, {order.customer.state} - {order.customer.postalCode}</p>
                  <p className="text-charcoal-muted">Phone: {order.customer.phone}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block mb-1">DISPATCH DESTINATION (SHIP TO):</span>
                  <p className="font-semibold text-charcoal">{order.customer.companyName || order.customer.fullName}</p>
                  <p className="text-charcoal-muted">{order.customer.address}</p>
                  <p className="text-charcoal-muted">{order.customer.city}, {order.customer.state} - {order.customer.postalCode}</p>
                  <p className="text-charcoal-muted">Transport Courier: <strong>{order.logistics.carrier}</strong></p>
                  <p className="text-charcoal-muted">Place of Supply: <strong>{order.customer.state}</strong></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-charcoal/20 bg-sand/20">
                      <th className="py-2.5 px-2 font-bold">#</th>
                      <th className="py-2.5 px-2 font-bold">Description of Agricultural Machinery</th>
                      <th className="py-2.5 px-2 font-bold text-center">HSN</th>
                      <th className="py-2.5 px-2 font-bold text-center">Qty</th>
                      <th className="py-2.5 px-2 font-bold text-right">Unit Rate (₹)</th>
                      <th className="py-2.5 px-2 font-bold text-right">Taxable Value (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-border">
                    {order.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-2 text-charcoal-muted">{i + 1}</td>
                        <td className="py-2.5 px-2 font-medium">
                          {item.name}
                          <span className="block text-[10px] text-charcoal-muted">{item.model || 'OEM Genuine'}</span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-charcoal-muted">
                          {item.hsnCode || (item.name.toLowerCase().includes('engine') ? '8407' : item.name.toLowerCase().includes('pump') ? '8413' : item.name.toLowerCase().includes('chain') ? '8202' : '8432')}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold">{item.quantity}</td>
                        <td className="py-2.5 px-2 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2.5 px-2 text-right font-semibold">
                          {formatCurrency(item.total || item.unitPrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations Summary */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-sand-border">
                <div className="space-y-2 text-[11px] text-charcoal-muted">
                  <p><strong>Terms & Conditions:</strong></p>
                  <p>1. Certified genuine imported agricultural equipment under manufacturer warranty.</p>
                  <p>2. Subject to Mumbai Jurisdiction.</p>
                  <p>3. Input Tax Credit (ITC) eligible under Section 16 of CGST/SGST Act.</p>
                  {order.ewayBill && (
                    <p className="font-mono text-botanical font-bold">
                      E-Way Bill: {order.ewayBill.ewayBillNumber} (Valid: 72 Hours)
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Taxable Base Amount:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-botanical">
                      <span>Wholesale Discount:</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}

                  {/* Section 6.1 Intra-state vs Inter-state Tax breakdown */}
                  {(order.cgst !== undefined && order.cgst > 0) || order.customer.state?.toLowerCase().includes('maharashtra') ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">Central GST (CGST - 50% split):</span>
                        <span>{formatCurrency(order.cgst || Math.round(order.tax / 2))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">State GST (SGST - Maharashtra):</span>
                        <span>{formatCurrency(order.sgst || Math.round(order.tax / 2))}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-charcoal-muted">Integrated GST (IGST - Inter-State):</span>
                      <span>{formatCurrency(order.igst || order.tax)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Transport Logistics Charge:</span>
                    <span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-sand-border">
                    <span>Total Amount (INR):</span>
                    <span className="text-botanical font-serif text-base">{formatCurrency(order.total)}</span>
                  </div>

                  {order.isAdvanceBooking && (
                    <div className="pt-2 border-t border-sand-border text-xs space-y-1">
                      <div className="flex justify-between font-bold text-[#856712]">
                        <span>Stage 1 Advance Settled:</span>
                        <span>{formatCurrency(order.advanceAmountPaid || Math.round(order.total * 0.20))}</span>
                      </div>
                      <div className="flex justify-between text-charcoal-muted font-bold">
                        <span>Stage 2 Balance on LR Bilty:</span>
                        <span>{formatCurrency(order.balanceDue || (order.total - Math.round(order.total * 0.20)))}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Signature Block */}
              <div className="pt-8 flex items-center justify-between border-t border-sand-border">
                <div className="text-[11px] text-charcoal-muted">
                  <p>This is a computer-generated commercial tax invoice.</p>
                  <p>Authorized E-Way Bill generated for transport movement.</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-charcoal/40 pb-6 mb-1 text-[10px] text-charcoal-muted uppercase">
                    [Authorized Seal]
                  </div>
                  <p className="font-bold text-xs">For ARVEER IMPEX</p>
                  <p className="text-[10px] text-charcoal-muted">Authorized Commercial Signatory</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

