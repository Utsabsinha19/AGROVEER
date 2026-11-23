'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Wrench, 
  Cog, 
  ShieldCheck, 
  CheckCircle,
  Truck,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';

export const BrandStorySection = () => {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: 'heavy-machinery',
      title: 'Heavy Agricultural Engineering',
      subtitle: 'Agroveer™ — Kisan Ki Pasand',
      tagline: 'High-torque OHV engines, high-pressure centrifugal pumps, and heavy earth augers built for Indian soil.',
      description: 'Indian farming conditions demand uncompromising machinery. From hardened clay boring with our 85cc and 110cc Earth Augers to continuous 60,000 L/hr flood irrigation using our 170F 7.5 HP pumps, Agroveer delivers reinforced steel frames, thickened recoil springs, and continuous operational durability.',
      icon: Cog,
      image: '/images/products/agroveer-170f-petrol-engine-pulley.jpg',
      highlights: [
        'Super Easy Starter mechanism reduces pull effort by 30-40%',
        '25mm double-handle structural tubular frames absorb severe vibrations',
        'Standardized 170F OHV engines deliver high torque with optimized fuel consumption'
      ],
      badge: 'Agroveer Machinery'
    },
    {
      id: 'precision-consumables',
      title: 'Precision Cutting Systems',
      subtitle: 'Sawking™ — German Quality',
      tagline: 'Full chisel chainsaw chains and 100% German-material wear-resistant trimmer lines.',
      description: 'Cutting speed and edge longevity dictate forestry and clearing profitability. Sawking chains feature square-corner full-chisel cutters with optional Titanium Nitride (TiN) gold coating and specialized 10° RMX ripping profiles for timber log milling, alongside metal-core and square German copolymer trimmer lines.',
      icon: Zap,
      image: '/images/products/sawking-super-gold-chainsaw-chain.jpg',
      highlights: [
        '100% German copolymer formulation ensures maximum trimmer line wear resistance',
        'Titanium Nitride PVD coating extends chainsaw cutting life by up to 300%',
        'Specialized 10° RMX cutter angle prevents binding during lengthwise timber milling'
      ],
      badge: 'Sawking Consumables'
    },
    {
      id: 'spares-network',
      title: 'Spares Available Everywhere',
      subtitle: 'Arveer Impex™ — Zero Downtime Guarantee',
      tagline: 'Over 500+ genuine OEM replacement parts in stock for immediate dispatch nationwide.',
      description: 'A farm machine is only as dependable as its replacement parts. Arveer Impex maintains an exhaustive central inventory of carburetors, recoil starters, impellers, piston-cylinder kits, mechanical seals, and 28mm/9T tilling heads—guaranteeing rapid freight delivery so no equipment sits idle.',
      icon: Wrench,
      image: '/images/products/agroveer-170f-recoil-starter-assembly.jpg',
      highlights: [
        'Visual Spares Compatibility Engine eliminates returned orders and incorrect sizing',
        'Wholesale B2B master crates packaged for rural agricultural dealership networks',
        'Transparent 5% GST invoicing with itemized part SKU tracking'
      ],
      badge: 'Arveer Spares Guarantee'
    }
  ];

  return (
    <section id="story" className="py-20 sm:py-32 bg-offwhite text-charcoal relative overflow-hidden border-t border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <span className="text-botanical font-sans text-xs tracking-[0.25em] uppercase font-bold block mb-3">
            ARVEER IMPEX • CORPORATE HERITAGE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight mb-6">
            <span className="text-charcoal">Built for Tough Work.</span>{' '}
            <span className="italic font-serif text-botanical font-normal">
              Trusted by Farmers.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-charcoal-muted font-sans leading-relaxed">
            As the authorized importer and distributor for <strong>Agroveer</strong> (&ldquo;Kisan Ki Pasand&rdquo;) and <strong>Sawking</strong> (&ldquo;German Quality&rdquo;), Arveer Impex supplies heavy-duty agricultural machinery, cutting consumables, and genuine spare parts across India.
          </p>
        </div>

        {/* 3 Pillar Interactive Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Pillar Navigation Cards */}
          <div className="lg:col-span-5 space-y-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activePillar === idx;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillar(idx)}
                  className={`w-full p-5 sm:p-6 rounded-3xl text-left transition-all duration-300 border flex flex-col justify-between ${
                    isActive
                      ? 'bg-sand border-botanical shadow-card ring-2 ring-botanical/20'
                      : 'bg-white hover:bg-sand/30 border-sand-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-botanical border border-sand-border">
                      {pillar.badge}
                    </span>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-botanical' : 'text-charcoal-muted'}`} />
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                    {pillar.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Pillar Deep-Dive Dossier */}
          <div className="lg:col-span-7 bg-sand/35 rounded-3xl p-6 sm:p-10 border border-sand-border shadow-card flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
              <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-white border border-sand-border p-4 flex items-center justify-center">
                <Image
                  src={pillars[activePillar].image}
                  alt={pillars[activePillar].title}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-botanical block mb-1">
                  {pillars[activePillar].subtitle}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-3">
                  {pillars[activePillar].title}
                </h4>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  {pillars[activePillar].description}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-sand-border">
              <span className="text-[10px] uppercase font-bold text-charcoal tracking-wider block">
                Engineering Highlights & Proven Advantages:
              </span>
              {pillars[activePillar].highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-charcoal">
                  <CheckCircle className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-sand-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                <ShieldCheck className="w-4 h-4 text-leaf" />
                <span>Authorized Arveer Impex Network</span>
              </div>

              <Link
                href="/products"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-botanical hover:bg-botanical-hover text-offwhite text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore Catalog Models</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
