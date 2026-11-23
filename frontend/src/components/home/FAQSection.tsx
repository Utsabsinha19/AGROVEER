'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { FAQS } from '@/data/testimonials';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-offwhite text-charcoal relative border-t border-sand-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-botanical font-sans text-xs tracking-[0.25em] uppercase font-bold block mb-3">
            TECHNICAL & AGRONOMIC FAQ
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base font-sans">
            Clear, transparent answers regarding application rates, organic compliance, formulation shelf-life, and field deployment.
          </p>
        </div>

        {/* FAQ Accordion on Warm Sand */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-sand-border bg-sand/35 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-sand/55 transition-colors"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-charcoal">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-botanical flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-charcoal-muted font-sans leading-relaxed border-t border-sand-border pt-4 animate-in fade-in duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Have more questions banner */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-sand/40 border border-sand-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-left">
            <h4 className="font-serif font-bold text-lg text-charcoal">Need bulk machinery dispatch or custom spare parts sourcing?</h4>
            <p className="text-xs text-charcoal-muted mt-1">Connect with Arveer Impex engineering & dealership desk for container bookings and OEM spare allocations.</p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-botanical hover:bg-botanical-hover border border-leaf/40 hover:border-leaf text-offwhite font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            <span>Consult Dealership Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
