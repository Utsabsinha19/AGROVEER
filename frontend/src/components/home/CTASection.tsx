'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, MessageCircle, Phone, FileText } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#F5F7F1] text-[#252B27] relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-2xl sm:rounded-3xl bg-[#245B37] text-white p-6 xs:p-8 sm:p-12 lg:p-16 text-center flex flex-col items-center shadow-card relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#6FAF45] text-xs uppercase tracking-widest font-bold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pan-India Dealership & Commercial Supply</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl leading-tight mb-4">
            Partner with Arveer Impex for Direct Wholesale Machinery Distribution
          </h2>

          <p className="max-w-2xl text-white/90 text-xs sm:text-base font-sans leading-relaxed mb-8">
            Whether you are an agricultural equipment dealer, tractor implement retailer, or estate contractor, access factory-direct pricing, 100% guaranteed spare parts, and fast pan-India transport dispatch.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#E99A32] hover:bg-[#D68923] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Machinery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-[#245B37] hover:bg-[#F5F7F1] font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply for Dealership</span>
            </Link>

            <a
              href="https://wa.me/917352210000?text=Hello%20Arveer%20Impex%20Sales%20Desk%2C%20I%20am%20inquiring%20about%20dealership%20terms%20and%20commercial%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp +91 73522 10000</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
            <span>✓ Central Warehouse: Bhiwandi, Maharashtra</span>
            <span>✓ Verified GST Invoicing with 5% & 18% ITC</span>
            <span>✓ Dedicated WhatsApp Support Desk</span>
          </div>

        </div>
      </div>
    </section>
  );
};
