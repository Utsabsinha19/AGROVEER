'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  Wrench,
  Truck,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { useLanguageStore } from '@/store/languageStore';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const { items, getTotal, getFormattedWhatsAppOrderText } = useCartStore();
  const { currentLanguage, detectedRegion } = useLanguageStore();

  const WHATSAPP_PHONE = '917352210000'; // +91 80049 22476

  const openWhatsApp = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    openWhatsApp(customMessage);
    setCustomMessage('');
  };

  // Automated Quick Action Flows
  const handleCartInquiry = () => {
    const text = getFormattedWhatsAppOrderText();
    if (text) {
      openWhatsApp(text);
    } else {
      openWhatsApp(`Hello Arveer Impex Sales Desk, I am interested in dealership pricing and bulk quotations for Agroveer machinery and Sawking cutting systems.`);
    }
  };

  const handleSparesInquiry = () => {
    const text = `⚙️ *OEM Spare Parts Compatibility Inquiry*\n` +
      `Hello Arveer Impex Technical Support Desk,\n` +
      `I am looking for replacement parts for my machine:\n` +
      `• Parent Machine Model: [e.g. 170F Engine / 2" Water Pump / 85cc Auger]\n` +
      `• Part Description: [e.g. Recoil Starter / Impeller / Mechanical Seal / Piston Kit]\n` +
      `Please verify exact part number fitment and share availability for immediate dispatch.`;
    openWhatsApp(text);
  };

  const handleCatalogInquiry = () => {
    const text = `📑 *Request: Official B2B Master Price List & Catalog PDF*\n` +
      `Hello, please send the complete 2026 Arveer Impex Commercial Catalog featuring Agroveer engines, pumps, augers, cordless bag closers, and Sawking German chainsaw chains to this WhatsApp number.`;
    openWhatsApp(text);
  };

  const handleFreightInquiry = () => {
    const text = `🚚 *Freight Transport & Docket Tracking*\n` +
      `Hello Arveer Impex Logistics Desk,\n` +
      `I am requesting a dispatch status update on our commercial machinery consignment.\n` +
      `• PO Reference / Invoice No: [Enter Ref]\n` +
      `• Destination Warehouse / City: [Enter Destination]`;
    openWhatsApp(text);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 font-sans">
      {/* WhatsApp Trigger Button with Live Indicator */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 sm:gap-3 p-2.5 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-elevated transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
          aria-label="Chat with Arveer Impex Sales Desk on WhatsApp"
        >
          {/* Animated WhatsApp Pulse Badge */}
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current text-white relative z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/90 leading-tight">
              Arveer Impex WhatsApp
            </p>
            <p className="text-xs font-semibold text-white">
              Instant Quotation & Spares Desk
            </p>
          </div>

          <span className="w-2.5 h-2.5 rounded-full bg-[#A6C96A] animate-pulse ml-1 hidden sm:inline-block" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] max-w-[380px] rounded-3xl bg-[#141A17] border border-[rgba(166,201,106,0.2)] shadow-2xl overflow-hidden flex flex-col text-[#F7F5F0] animate-in fade-in slide-in-from-bottom-5 duration-300">

          {/* Header in Deep Forest Slate (#102C22) */}
          <div className="p-4 sm:p-5 bg-[#102C22] border-b border-[rgba(166,201,106,0.15)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center border border-white/20 shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="w-2.5 h-2.5 rounded-full bg-[#A6C96A] absolute bottom-0 right-0 border-2 border-[#102C22]" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-sm text-[#F7F5F0]">
                  Arveer Impex Sales Desk
                </h3>
                <p className="text-[11px] text-[#A6C96A] flex items-center gap-1">
                  <span>Agroveer™ & Sawking™ Support</span>
                  <span className="text-white/40">•</span>
                  <span>Online</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[460px] overflow-y-auto">
            {/* Introductory Bubble */}
            <div className="p-3.5 rounded-2xl bg-[#1A2420] border border-[rgba(166,201,106,0.15)] text-xs text-[#F7F5F0]/90 leading-relaxed shadow-sm">
              <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-bold text-[#A6C96A] tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Automated Quotation & Technical Routing</span>
              </div>
              <p>
                Welcome to <strong>Arveer Impex</strong>. Tap a direct action below or send a custom message to connect directly with our equipment dispatchers.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#A6C96A] block">
                Direct WhatsApp Actions:
              </span>

              {/* Action 1: Cart / Machinery Inquiry */}
              <button
                onClick={handleCartInquiry}
                className="w-full p-3 rounded-2xl bg-[#1A2420] hover:bg-[#202E29] border border-[rgba(166,201,106,0.15)] hover:border-[#A6C96A]/40 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F7F5F0] group-hover:text-[#A6C96A] transition-colors">
                      {items.length > 0 ? `Send Active Order (${items.length} items)` : 'Request Machinery Quotation'}
                    </h4>
                    <p className="text-[10px] text-[#F7F5F0]/60">
                      {items.length > 0 ? `Total: ${formatCurrency(getTotal())} (incl. 5% GST)` : 'Get wholesale pricing on 170F engines & pumps'}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#A6C96A] opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Action 2: Spares Compatibility */}
              <button
                onClick={handleSparesInquiry}
                className="w-full p-3 rounded-2xl bg-[#1A2420] hover:bg-[#202E29] border border-[rgba(166,201,106,0.15)] hover:border-[#A6C96A]/40 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#D64527]/20 text-[#D64527] flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F7F5F0] group-hover:text-[#A6C96A] transition-colors">
                      Verify Spare Part Fitment
                    </h4>
                    <p className="text-[10px] text-[#F7F5F0]/60">
                      Identify compatible impellers, seals & recoil assemblies
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#A6C96A] opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Action 3: Catalog PDF */}
              <button
                onClick={handleCatalogInquiry}
                className="w-full p-3 rounded-2xl bg-[#1A2420] hover:bg-[#202E29] border border-[rgba(166,201,106,0.15)] hover:border-[#A6C96A]/40 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F7F5F0] group-hover:text-[#A6C96A] transition-colors">
                      Download 2026 Master Price List
                    </h4>
                    <p className="text-[10px] text-[#F7F5F0]/60">
                      Receive comprehensive wholesale catalog PDF
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#A6C96A] opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Action 4: Freight Tracking */}
              <button
                onClick={handleFreightInquiry}
                className="w-full p-3 rounded-2xl bg-[#1A2420] hover:bg-[#202E29] border border-[rgba(166,201,106,0.15)] hover:border-[#A6C96A]/40 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#24583D]/40 text-[#A6C96A] flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F7F5F0] group-hover:text-[#A6C96A] transition-colors">
                      Freight Transport Tracking
                    </h4>
                    <p className="text-[10px] text-[#F7F5F0]/60">
                      Inquire about commercial truck booking & consignment status
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#A6C96A] opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleSendCustom} className="pt-2">
              <label className="text-[10px] uppercase font-bold text-[#A6C96A] block mb-1">
                Type Direct Query:
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask about 170F engine pulley, pump head..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#102C22] border border-[rgba(166,201,106,0.2)] text-xs text-[#F7F5F0] placeholder-[#F7F5F0]/40 focus:outline-none focus:border-[#25D366]"
                />
                <button
                  type="submit"
                  disabled={!customMessage.trim()}
                  className="absolute right-1.5 p-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#F7F5F0]/50 pt-1 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A6C96A]" />
              <span>Official WhatsApp Business Verified • +91 80049 22476</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
