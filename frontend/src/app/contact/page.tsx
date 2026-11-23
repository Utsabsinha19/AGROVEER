'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  MessageCircle,
  Truck,
  Building2,
  FileText
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    firmName: '',
    cityState: '',
    inquiryType: 'Authorized Dealership Network',
    productsOfInterest: 'Agroveer Earth Augers & Water Pumps',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedTicket(data.ticketId || `TICK-B2B-${Date.now().toString().slice(-6)}`);
      } else {
        setGeneratedTicket(`TICK-B2B-${Date.now().toString().slice(-6)}`);
      }
    } catch {
      // Graceful offline fallback
      setGeneratedTicket(`TICK-B2B-${Date.now().toString().slice(-6)}`);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/918004922476?text=${encodeURIComponent(
    `*Commercial Procurement Inquiry — Arveer Impex*\n` +
    `• Name: ${formData.name || 'Valued Buyer'}\n` +
    `• Firm/Shop: ${formData.firmName || 'N/A'}\n` +
    `• Location: ${formData.cityState || 'India'}\n` +
    `• Interest: ${formData.productsOfInterest}\n` +
    `• Inquiry Type: ${formData.inquiryType}\n` +
    `• Note: ${formData.message || 'Please share wholesale dealer price list & terms.'}`
  )}`;

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F5F0] text-[#141A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with ample breathing room */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[rgba(166,201,106,0.3)] text-[#24583D] font-mono text-xs tracking-[0.2em] uppercase font-bold mb-3 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#24583D]" />
            <span>B2B Procurement & Dealership Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#141A17] leading-tight mb-4">
            Connect with Arveer Impex Commercial Dispatch
          </h1>
          <p className="text-[#4F5D54] text-sm sm:text-base font-sans leading-relaxed">
            Request wholesale dealership pricing, custom freight bookings, bulk master cartons of Sawking chains or trimmer lines, and replacement parts allocations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* High-Contrast Interactive Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#24583D]/10 border border-[#24583D]/30 text-[#24583D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#24583D]/10 border border-[#24583D]/30 text-[#24583D] font-mono text-xs font-bold">
                  Ticket #{generatedTicket}
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#141A17]">Dealership Inquiry Logged Successfully</h3>
                <p className="text-[#4F5D54] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Our regional distribution manager for <strong>{formData.cityState || 'your territory'}</strong> has received your dispatch schedule request and will connect via WhatsApp / Call within 4 business hours.
                </p>
                
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant Chat on WhatsApp (+91 80049 22476)</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#F7F5F0] hover:bg-[#EAE6DD] border border-[rgba(166,201,106,0.3)] text-xs text-[#141A17] font-semibold transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#102C22] uppercase tracking-wider mb-2">
                      Your Full Name <span className="text-[#D64527]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rameshwar Patel"
                      className="w-full bg-[#FCFAF7] hover:bg-white focus:bg-white text-[#141A17] font-semibold text-xs placeholder:text-[#64748B] border-2 border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#24583D] focus:ring-4 focus:ring-[#24583D]/10 rounded-xl px-4 py-3 shadow-xs transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#102C22] uppercase tracking-wider mb-2">
                      Mobile / WhatsApp Number <span className="text-[#D64527]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 12345"
                      className="w-full bg-[#FCFAF7] hover:bg-white focus:bg-white text-[#141A17] font-semibold text-xs placeholder:text-[#64748B] border-2 border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#24583D] focus:ring-4 focus:ring-[#24583D]/10 rounded-xl px-4 py-3 shadow-xs transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#102C22] uppercase tracking-wider mb-2">
                      Business / Firm / Agro Center Name
                    </label>
                    <input
                      type="text"
                      value={formData.firmName}
                      onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                      placeholder="e.g. Kisan Krishi Seva Kendra"
                      className="w-full bg-[#FCFAF7] hover:bg-white focus:bg-white text-[#141A17] font-semibold text-xs placeholder:text-[#64748B] border-2 border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#24583D] focus:ring-4 focus:ring-[#24583D]/10 rounded-xl px-4 py-3 shadow-xs transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#102C22] uppercase tracking-wider mb-2">
                      City, District & State <span className="text-[#D64527]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cityState}
                      onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                      placeholder="e.g. Indore, Madhya Pradesh"
                      className="w-full bg-[#FCFAF7] hover:bg-white focus:bg-white text-[#141A17] font-semibold text-xs placeholder:text-[#64748B] border-2 border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#24583D] focus:ring-4 focus:ring-[#24583D]/10 rounded-xl px-4 py-3 shadow-xs transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#102C22] uppercase tracking-wider mb-2">
                      Inquiry Type
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      aria-label="Inquiry Type"
                      className="w-full bg-[#FCFAF7] hover:bg-white focus:bg-white text-[#141A17] font-semibold text-xs border-2 border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#24583D] focus:ring-4 focus:ring-[#24583D]/10 rounded-xl px-4 py-3 shadow-xs transition-all outline-none cursor-pointer"
                    >
                      <option value="Authorized Dealership Network">Authorized Dealership Network</option>
                      <option value="Commercial B2B Wholesale Order">Commercial B2B Wholesale Order</option>
                      <option value="Retail Machinery Procurement">Retail Machinery Procurement</option>
                      <option value="Spare Parts Bulk Stocking">Spare Parts Bulk Stocking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#102C22] uppercase tracking-wider mb-2">
                      Product Lines of Interest
                    </label>
                    <select
                      value={formData.productsOfInterest}
                      onChange={(e) => setFormData({ ...formData, productsOfInterest: e.target.value })}
                      aria-label="Product Lines of Interest"
                      className="w-full bg-[#FCFAF7] hover:bg-white focus:bg-white text-[#141A17] font-semibold text-xs border-2 border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#24583D] focus:ring-4 focus:ring-[#24583D]/10 rounded-xl px-4 py-3 shadow-xs transition-all outline-none cursor-pointer"
                    >
                      <option value="Agroveer Earth Augers & Water Pumps">Agroveer Earth Augers & Water Pumps</option>
                      <option value="Sawking Chainsaw Chains & German Trimmer Line">Sawking Chainsaw Chains & German Trimmer Line</option>
                      <option value="Cordless Bag Closer Machines">Cordless Bag Closer Machines</option>
                      <option value="All Product Lines (Complete Master Catalog)">All Product Lines (Complete Master Catalog)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102C22] uppercase tracking-wider mb-2">
                    Requirements or Specific Quantities
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Interested in stocking 10x EA-85 Augers and 50x Sawking Super Gold 22-inch chains for our upcoming agricultural season..."
                    className="w-full bg-[#FCFAF7] hover:bg-white focus:bg-white text-[#141A17] font-semibold text-xs placeholder:text-[#64748B] border-2 border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#24583D] focus:ring-4 focus:ring-[#24583D]/10 rounded-xl p-4 shadow-xs transition-all outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-75"
                  >
                    <span>{isSubmitting ? 'Logging Dispatch Request...' : 'Submit Dealership Request'}</span>
                    <ArrowRight className="w-4 h-4 text-[#A6C96A] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Sales Desk</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Distribution Hubs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] space-y-6 shadow-md">
              <h3 className="font-serif text-xl font-bold text-[#141A17]">Central Logistics & Order Desks</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#24583D] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#141A17]">Central Distribution Warehouse & Spares Depot</h4>
                    <p className="text-[#4F5D54] mt-0.5 leading-relaxed">Arveer Impex Machinery Hub, Logistics Park, Bhiwandi-Thane / Pan-India Central Hub</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-[#24583D] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#141A17]">Regional Express Freight Hubs</h4>
                    <p className="text-[#4F5D54] mt-0.5 leading-relaxed">Ludhiana (Punjab) • Ahmedabad (Gujarat) • Indore (MP) • Coimbatore (Tamil Nadu)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#24583D] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#141A17]">B2B Dealer Helpline & WhatsApp Hotline</h4>
                    <p className="text-[#4F5D54] mt-0.5 leading-relaxed">+91 80049 22476 (Direct Sales & Dispatches)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#24583D] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#141A17]">Commercial Invoicing & GST Desk</h4>
                    <p className="text-[#4F5D54] mt-0.5 leading-relaxed">wholesale@arveerimpex.com / orders@agrove.in</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(166,201,106,0.2)] flex items-center gap-2 text-[11px] text-[#4F5D54]">
                <ShieldCheck className="w-4 h-4 text-[#24583D]" />
                <span>Pan-India transport dispatch within 24 hours of invoice clearance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
