'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/data/testimonials';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FFFFFF] text-[#252B27] relative border-b border-[#E2E6DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <span className="text-[#245B37] font-sans text-xs tracking-[0.25em] uppercase font-bold block mb-2">
            TECHNICAL & COMMERCIAL FAQ
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#252B27] leading-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5550]">
            Transparent answers regarding engine warranties, spare parts compatibility, GST billing, and transport dispatch.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E2E6DF] bg-[#F5F7F1] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#EAEFE6]/60 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-[#252B27]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#245B37] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#4E5550] leading-relaxed border-t border-[#E2E6DF] pt-3 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
