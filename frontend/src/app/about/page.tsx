'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Wrench, 
  Cog, 
  ShieldCheck, 
  Truck, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Zap,
  PhoneCall,
  PackageCheck
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-offwhite text-charcoal min-h-screen">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-3xl">
          <span className="text-botanical font-mono text-xs tracking-[0.25em] uppercase font-bold block mb-3">
            ARVEER IMPEX • CORPORATE PROFILE & HERITAGE
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-charcoal leading-tight mb-6">
            Empowering Indian Agriculture with Heavy-Duty Precision.
          </h1>
          <p className="text-charcoal-muted text-base sm:text-lg font-sans leading-relaxed">
            Arveer Impex is the authorized national importer and distributor for <strong>Agroveer™</strong> (&ldquo;Kisan Ki Pasand&rdquo;) and <strong>Sawking™</strong> (&ldquo;German Quality&rdquo;). We bridge the gap between world-class agricultural engineering and the daily operational realities of Indian farmers, loggers, and commercial dealerships.
          </p>
        </div>
      </div>

      {/* Flagship Brand Portfolio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Agroveer Card */}
          <div className="p-8 rounded-3xl bg-sand/35 border border-sand-border space-y-5 shadow-card hover:border-botanical/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-agroveer-vermilion/15 flex items-center justify-center border border-agroveer-vermilion/30">
              <Cog className="w-6 h-6 text-agroveer-vermilion" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-agroveer-vermilion font-bold font-mono">Machinery Flagship</span>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">Agroveer™</h3>
              <p className="text-xs text-charcoal-muted italic">Kisan Ki Pasand</p>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Purpose-built agricultural equipment including 85cc and 110cc Earth Augers, 2&quot; and 3&quot; high-pressure centrifugal water pumps, 170F 7.5 HP utility engines with fitted pulleys, and India&apos;s first cordless bag closer machine.
            </p>
            <ul className="text-xs space-y-2 text-charcoal font-medium pt-2 border-t border-sand-border">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>Super Easy Starter with 35% reduced pull</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>25mm double-handle tubular steel roll cages</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>Pure petrol 4-stroke & high-torque 2-stroke powerheads</span>
              </li>
            </ul>
          </div>

          {/* Sawking Card */}
          <div className="p-8 rounded-3xl bg-sand/35 border border-sand-border space-y-5 shadow-card hover:border-sawking-gold/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sawking-gold/15 flex items-center justify-center border border-sawking-gold/30">
              <Zap className="w-6 h-6 text-sawking-gold" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-sawking-gold font-bold font-mono">Cutting Consumables</span>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">Sawking™</h3>
              <p className="text-xs text-charcoal-muted italic">German Quality</p>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              High-performance timber cutting and brush clearing systems. Features Super Gold Titanium-Nitride (TiN) coated chains, Super Silver full-chisel chains, specialized 10° RMX log ripping chains, and 100% German copolymer trimmer lines.
            </p>
            <ul className="text-xs space-y-2 text-charcoal font-medium pt-2 border-t border-sand-border">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>100% virgin German polyamide copolymer raw material</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>TiN Gold coating extends edge life 3x in hard timber</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>10° RMX bevel prevents binding during log milling</span>
              </li>
            </ul>
          </div>

          {/* Arveer Spares Card */}
          <div className="p-8 rounded-3xl bg-sand/35 border border-sand-border space-y-5 shadow-card hover:border-botanical/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-botanical/15 flex items-center justify-center border border-botanical/30">
              <Wrench className="w-6 h-6 text-botanical" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-botanical font-bold font-mono">Zero Downtime Guarantee</span>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">Arveer Spares</h3>
              <p className="text-xs text-charcoal-muted italic">Spares Available Everywhere</p>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Exhaustive central inventory of over 500+ genuine replacement components: carburetors, recoil starters, impellers, water seals, 70mm piston ring sets, 28mm/9T tilling heads, and auger extension rods ready for immediate dispatch.
            </p>
            <ul className="text-xs space-y-2 text-charcoal font-medium pt-2 border-t border-sand-border">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>Visual Compatibility Engine eliminates misfits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>Transparent 5% GST itemized invoice accounting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>Pan-India express road & rail freight network</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Three Operational Commitments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="p-10 rounded-3xl bg-sand/25 border border-sand-border">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-wider text-botanical font-bold font-mono">THE ARVEER DIFFERENCE</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal mt-1">
              Built on Field Realities, Not Paper Spreadsheets
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
              For decades, agricultural machinery distribution in India was hindered by unorganized PDF price lists, phone bottlenecks, and returned orders due to mismatched parts. Here is how we transformed the industry:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-botanical/15 flex items-center justify-center text-botanical font-mono font-bold text-sm">
                01
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal">Visual Compatibility Engine</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Dealers and mechanics never have to guess whether an impeller has a keyed or threaded shaft, or whether an auger bit fits an 85cc or 110cc gearbox. Every parent machine links directly to its compatible parts.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-botanical/15 flex items-center justify-center text-botanical font-mono font-bold text-sm">
                02
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal">1-Click WhatsApp B2B Dispatch</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Dealers can build multi-line commercial orders, automatically compute 5% GST and volume wholesale discounts, and dispatch formatted orders with product codes straight to our sales coordination desk.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-botanical/15 flex items-center justify-center text-botanical font-mono font-bold text-sm">
                03
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal">Uncompromising Quality Testing</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Every engine batch is endurance-tested for startability and thermal management. Our trimmer lines are manufactured strictly from 100% German polyamide polymer to prevent welding inside trimmer heads.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA to Spares & Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#102C22] text-[#F7F5F0] border border-forest-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-leaf/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2.5 max-w-xl relative z-10">
            <span className="text-xs uppercase tracking-widest text-leaf font-mono font-bold">READY TO PARTNER</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F5F0] leading-tight">
              Explore Our Live Commercial Catalog & Spares Engine
            </h3>
            <p className="text-xs sm:text-sm text-sand/85 leading-relaxed">
              Browse 14 flagship models, test spare part fitments, or speak directly with our commercial agronomy team on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link
              href="/spares"
              className="px-5 py-3 rounded-2xl bg-botanical hover:bg-botanical-hover text-offwhite text-xs font-bold transition-all flex items-center gap-2 shadow-sm border border-leaf/30"
            >
              <Wrench className="w-4 h-4 text-leaf" />
              <span>Open Spares Engine</span>
            </Link>

            <Link
              href="/products"
              className="px-5 py-3 rounded-2xl bg-forest-950/90 hover:bg-forest-950 border border-white/20 hover:border-white/40 text-offwhite text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 text-leaf" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
