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
        'Same-day freight dispatch across all key agricultural transport hubs',
        'Clear GST-compliant billing with full dealer input tax credit'
      ],
      badge: 'Guaranteed Spares'
    }
  ];

  return (
    <section id="story" className="py-16 sm:py-24 bg-[#FFFFFF] text-[#252B27] border-b border-[#E2E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#245B37] font-sans text-xs tracking-[0.25em] uppercase font-bold block mb-2">
            THREE ENGINEERING PILLARS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#252B27] leading-tight mb-3">
            Why Indian Farmers & Dealers Trust Arveer Impex
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5550]">
            Combining direct container import efficiency, European CE safety conformity, and an exhaustive domestic spare parts ecosystem.
          </p>
        </div>

        {/* Pillars Tab Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isActive = activePillar === idx;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(idx)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EAEFE6] border-[#245B37] shadow-soft ring-1 ring-[#245B37]'
                    : 'bg-[#F5F7F1] border-[#E2E6DF] hover:bg-[#EAEFE6]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-[#245B37] text-white' : 'bg-white text-[#245B37] border border-[#E2E6DF]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6FAF45] block">Pillar 0{idx + 1}</span>
                    <h3 className="font-serif text-sm font-bold text-[#252B27] leading-tight">{pillar.title}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Card */}
        <div className="bg-[#F5F7F1] rounded-3xl p-6 sm:p-10 border border-[#E2E6DF] shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Box */}
            <div className="lg:col-span-5">
              <div className="relative w-full h-64 sm:h-80 rounded-2xl bg-white border border-[#E2E6DF] overflow-hidden p-6 flex items-center justify-center shadow-xs">
                <Image
                  src={pillars[activePillar].image}
                  alt={pillars[activePillar].title}
                  fill
                  className="object-contain p-4"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EAEFE6] text-[#245B37] border border-[#245B37]/30">
                  {pillars[activePillar].badge}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#245B37] uppercase tracking-wider block mb-1">
                  {pillars[activePillar].subtitle}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] leading-tight mb-3">
                  {pillars[activePillar].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E5550] leading-relaxed mb-5">
                  {pillars[activePillar].description}
                </p>

                {/* Bullet Highlights */}
                <div className="space-y-2 mb-6">
                  {pillars[activePillar].highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-[#252B27]">
                      <CheckCircle className="w-4 h-4 text-[#245B37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E6DF] flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="px-5 py-2.5 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Explore Machinery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/spares"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#EAEFE6] text-[#245B37] border border-[#E2E6DF] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Browse Spare Parts</span>
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
