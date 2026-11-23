'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-24 sm:py-32 bg-offwhite text-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-forest border border-forest-800 p-8 sm:p-16 lg:p-20 text-center flex flex-col items-center shadow-elevated relative overflow-hidden text-offwhite">
          {/* Subtle logo background watermark */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 opacity-10 pointer-events-none">
            <Image
              src="/logo.png"
              alt="AGROVÉ watermark"
              fill
              className="object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-950 border border-leaf/40 text-leaf text-xs uppercase tracking-widest font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Commercial Grower Program</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-offwhite max-w-3xl leading-tight mb-6">
            Ready to Cultivate the Future of Your Harvest?
          </h2>

          <p className="max-w-xl text-sand/85 text-sm sm:text-base font-sans leading-relaxed mb-10">
            Join hundreds of commercial orchards, biodynamic vineyards, and grain cooperatives advancing with AGROVÉ biological science.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-botanical hover:bg-botanical-hover text-offwhite border border-leaf/40 hover:border-leaf font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
            >
              <span>Explore All Formulations</span>
              <ArrowRight className="w-4 h-4 text-leaf" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/20 text-offwhite hover:text-leaf font-semibold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Request Agronomic Consultation</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
