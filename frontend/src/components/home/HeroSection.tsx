'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  FileText, 
  MessageCircle, 
  CheckCircle2, 
  Star,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { formatCurrency } from '@/lib/utils';

export const HeroSection = () => {
  const { openCatalogModal } = useLanguageStore();

  const trustPillars = [
    {
      icon: Truck,
      title: 'Pan-India Transport',
      desc: 'Fast freight delivery to all agricultural districts & towns'
    },
    {
      icon: Wrench,
      title: '100% Genuine Spares',
      desc: 'Full parts network: carburetors, recoils, impellers in stock'
    },
    {
      icon: FileText,
      title: 'GST Tax Billing',
      desc: 'Official commercial invoices with 5% & 18% Input Tax Credit'
    },
    {
      icon: ShieldCheck,
      title: 'Direct Container Import',
      desc: 'Factory-direct pricing for farmers, contractors & dealers'
    }
  ];

  const categoryCards = [
    {
      title: 'Power Engines',
      model: '170F 7.5 HP OHV',
      image: '/images/products/agroveer-170f-petrol-engine-pulley.jpg',
      href: '/products?category=Farm+Machinery+%26+Engines',
      badge: 'Bestseller'
    },
    {
      title: 'Water Pumps',
      model: '1.5", 2" & 3" Pumps',
      image: '/images/products/agroveer-2inch-water-pump-170f.jpg',
      href: '/products?category=Agriculture+Water+Pumps',
      badge: 'High Head'
    },
    {
      title: 'Earth Augers',
      model: '85cc & 110cc Diggers',
      image: '/images/products/agroveer-85cc-earth-auger-poster.jpg',
      href: '/products?category=Earth+Augers+%26+Boring',
      badge: 'CE Certified'
    },
    {
      title: 'Sawking™ Chains',
      model: 'Full Chisel & Ripping',
      image: '/images/products/sawking-super-gold-chainsaw-chain.jpg',
      href: '/products?category=Cutting+Tools+%26+Consumables',
      badge: 'German Quality'
    },
    {
      title: 'Bag Closers',
      model: 'Cordless Portable',
      image: '/images/products/open-source-cordless-bag-closer.jpg',
      href: '/products?category=Packaging+%26+Bag+Closers',
      badge: 'Heavy Duty'
    },
    {
      title: 'Spare Parts Finder',
      model: '500+ OEM Spares',
      image: '/images/products/agroveer-170f-recoil-starter-assembly.jpg',
      href: '/spares',
      badge: 'Zero Downtime'
    }
  ];

  return (
    <section className="relative w-full bg-[#F5F7F1] text-[#252B27] pt-3 sm:pt-6 pb-10 sm:pb-16 border-b border-[#E2E6DF]">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Hero Machinery Showcase Banner */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#245B37] via-[#1E4A2E] to-[#142C1D] text-white p-4 xs:p-6 sm:p-10 lg:p-14 shadow-card mb-6 sm:mb-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-3 sm:mb-6">
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#6FAF45]" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white/95">
                  Arveer Impex • Official Importer & Distributor
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.18] sm:leading-[1.15] mb-3 sm:mb-4">
                Heavy-Duty Farm Machinery & Guaranteed Genuine Spares
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-base lg:text-lg text-[#F5F7F1]/90 font-sans leading-relaxed mb-5 sm:mb-8 max-w-2xl">
                Powering Indian farms, orchards, and contractors with high-torque 170F petrol engines, high-pressure water pumps, CE-certified earth augers, and German-spec Sawking™ cutting chains.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6 sm:mb-8">
                <Link
                  href="/products"
                  className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#E99A32] hover:bg-[#D68923] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Machinery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={openCatalogModal}
                  className="px-6 sm:px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#6FAF45]" />
                  <span>Download Price Catalog</span>
                </button>

                <a
                  href="https://wa.me/917352210000?text=Hello%20Arveer%20Impex%2C%20I%20am%20interested%20in%20becoming%20a%20dealer%20or%20ordering%20machinery."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  title="Direct WhatsApp Chat"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">WhatsApp Order</span>
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 pt-2 border-t border-white/15 w-full">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6FAF45]" />
                  <span>GST Billing (5% & 18%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6FAF45]" />
                  <span>Over 500+ Spares Stocked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6FAF45]" />
                  <span>Same-Day Warehouse Dispatch</span>
                </div>
              </div>

            </div>

            {/* Right Showcase Card Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl text-[#252B27] border border-white/20 relative">
                
                {/* Floating Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0F7F2] text-[#245B37] border border-[#245B37]/30">
                    Flagship Machinery
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.9 / 5.0 (184+ Reviews)</span>
                  </div>
                </div>

                {/* Machine Image */}
                <div className="relative w-full h-52 sm:h-60 rounded-xl bg-[#F9FAF8] border border-[#E2E6DF] overflow-hidden flex items-center justify-center mb-4 p-4">
                  <Image
                    src="/images/products/agroveer-170f-petrol-engine-pulley.jpg"
                    alt="Agroveer 170F 7.5 HP Petrol Engine with Pulley"
                    fill
                    className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                    priority
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    Model: 170F 212cc
                  </span>
                </div>

                {/* Machine Info */}
                <h3 className="font-serif text-lg font-bold text-[#252B27] leading-snug mb-1">
                  Agroveer™ 170F 7.5 HP Engine with Pulley
                </h3>
                <p className="text-xs text-[#4E5550] mb-3 line-clamp-2">
                  Heavy-duty OHV 4-stroke utility engine with factory-fitted dual-groove pulley for weeders, pumps & farm equipment.
                </p>

                {/* Price & CTA */}
                <div className="pt-3 border-t border-[#E2E6DF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#767E78] block">List Price (Incl. GST)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-[#245B37]">
                        ₹8,499
                      </span>
                      <span className="text-xs text-[#767E78] line-through font-mono">
                        ₹10,500
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/products/agroveer-170f-engine-pulley"
                    className="px-4 py-2.5 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>View Specs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* 2. VALUE PROPOSITIONS & TRUST PILLARS BAR (Balwaan style) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[#E2E6DF] hover:border-[#245B37] transition-all shadow-soft flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAEFE6] text-[#245B37] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#252B27] leading-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-[#4E5550] mt-0.5 leading-snug">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. VISUAL CATEGORY TILES (Balwaan Krishi & Agriwow Category Matrix) */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#245B37]">
                Machinery Segments
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27]">
                Shop by Agricultural Category
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold text-[#245B37] hover:underline flex items-center gap-1"
            >
              <span>View All Machinery</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categoryCards.map((cat, cIdx) => (
              <Link
                key={cIdx}
                href={cat.href}
                className="group p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E6DF] hover:border-[#245B37] hover:shadow-card transition-all flex flex-col items-center text-center cursor-pointer"
              >
                {/* Category Image Box */}
                <div className="relative w-full h-28 sm:h-32 rounded-xl bg-[#F9FAF8] border border-[#E2E6DF]/60 overflow-hidden mb-3 p-2 flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-white/95 text-[#245B37] border border-[#E2E6DF] shadow-xs">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xs sm:text-sm font-bold text-[#252B27] group-hover:text-[#245B37] transition-colors leading-tight">
                  {cat.title}
                </h3>
                <span className="text-[10px] text-[#767E78] mt-0.5 truncate max-w-full">
                  {cat.model}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
