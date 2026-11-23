'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Check,
  Wrench,
  MessageCircle,
  Layers,
  RotateCw,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
  Compass,
  Cpu
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS } from '@/data/products';
import { formatCurrency } from '@/lib/utils';
import { SceneFallback } from '../3d/SceneFallback';
import { InspectableMachineType } from '../3d/MachineryInspectionScene';

const ProductShowcaseScene = dynamic(
  () => import('../3d/ProductShowcaseScene').then((mod) => mod.ProductShowcaseScene),
  { ssr: false, loading: () => <SceneFallback text="Loading 3D Machinery Inspection Station..." /> }
);

interface ShowcaseItem {
  id: InspectableMachineType;
  productId: string;
  name: string;
  shortName: string;
  modelCode: string;
  image: string;
  specBadge: string;
  brand: 'Agroveer' | 'Sawking';
  category: string;
  tagline: string;
  priceExGst: number;
  priceGst: number;
  gstRate: number;
  hotspots: {
    id: string;
    title: string;
    highlight: string;
    description: string;
  }[];
}

const SHOWCASE_MACHINES: ShowcaseItem[] = [
  {
    id: 'engine-170f',
    productId: 'agroveer-170f-engine-pulley',
    name: 'Agroveer™ 170F 7.5 HP Engine with Pulley',
    shortName: '170F 7.5 HP Engine',
    modelCode: 'AV-170F-PLY',
    image: '/images/products/agroveer-170f-petrol-engine-pulley.jpg',
    specBadge: '212cc OHV • Dual Pulley',
    brand: 'Agroveer',
    category: 'Farm Machinery & Engines',
    tagline: 'High-torque 212cc OHV utility engine with fitted dual-groove power transmission pulley',
    priceExGst: 8094,
    priceGst: 8499,
    gstRate: 0.05,
    hotspots: [
      {
        id: 'hotspot-recoil',
        title: 'Super Easy Starter Mechanism',
        highlight: '30% Thicker Recoil Spring',
        description: 'Smooth, reduced-effort starting prevents wrist kickback and cord snapping during cold winter starts.'
      },
      {
        id: 'hotspot-frame',
        title: '25mm Double-Handle Steel Frame',
        highlight: 'Heavy-Gauge Tube Protection',
        description: 'Full perimeter tubular roll cage absorbs field vibrations and protects fuel tank from transport damage.'
      },
      {
        id: 'hotspot-pulley',
        title: 'Precision Dual-Groove Drive Pulley',
        highlight: 'Keyed Shaft Fitment',
        description: 'CNC balanced pulley provides immediate belt-drive coupling for water pumps, weeders, and threshers.'
      },
      {
        id: 'hotspot-fuel-cap',
        title: 'Thread-Lock Spill-Proof Cap',
        highlight: 'Viton Gasket Sealing',
        description: 'Deep thread closure eliminates fuel evaporation and leaks across rugged tractor trailer transit.'
      }
    ]
  },
  {
    id: 'earth-auger-ea85',
    productId: 'agroveer-85cc-earth-auger-ea85',
    name: 'Agroveer™ EA-85 85CC Earth Auger',
    shortName: 'EA-85 Earth Auger',
    modelCode: 'AV-EA85-85CC',
    image: '/images/products/agroveer-85cc-earth-auger-poster.jpg',
    specBadge: '85cc 2T • 2.4 kW @ 9000',
    brand: 'Agroveer',
    category: 'Earth Augers & Boring',
    tagline: 'Heavy-duty 2-stroke post hole digger with ergonomic safety handlebars & 800mm spiral drill bit',
    priceExGst: 9999,
    priceGst: 10499,
    gstRate: 0.05,
    hotspots: [
      {
        id: 'hotspot-motor-85cc',
        title: '85cc High-Torque 2-Stroke Motor',
        highlight: '2.4 kW @ 9,000 RPM',
        description: 'Optimized scavenging ports deliver relentless boring torque through hardened dry clay and stony soil.'
      },
      {
        id: 'hotspot-starter-easy',
        title: 'Super Easy Starter Recoil',
        highlight: 'Smooth Effortless Pull',
        description: 'Dual assist springs reduce pulling resistance by 40%, ensuring instant ignition on field lines.'
      },
      {
        id: 'hotspot-handle',
        title: 'Twin-Grip Safety Handlebar',
        highlight: 'Ergonomic Control Console',
        description: 'Vibration-isolated handles with responsive accelerator lever and emergency engine shut-off switch.'
      },
      {
        id: 'hotspot-drill-bit',
        title: '800mm Manganese Steel Spiral Bit',
        highlight: 'Tungsten Pilot Tip',
        description: 'Continuous double-flighted spirals lift soil cleanly without clogging or binding in dense clay.'
      }
    ]
  },
  {
    id: 'water-pump-wp30',
    productId: 'agroveer-3inch-water-pump-170f',
    name: 'Agroveer™ 3" High-Flow Water Pump (W-P30)',
    shortName: '3" High-Flow Pump',
    modelCode: 'AV-WP30-80MM',
    image: '/images/products/agroveer-3inch-water-pump-170f.jpg',
    specBadge: '60,000 L/hr • 30m Head',
    brand: 'Agroveer',
    category: 'Agriculture Water Pumps',
    tagline: '60,000 Litres/hour flood irrigation centrifugal pump powered by 170F 7.5 HP engine',
    priceExGst: 12856,
    priceGst: 13499,
    gstRate: 0.05,
    hotspots: [
      {
        id: 'hotspot-discharge-3in',
        title: '3" (80mm) Flow Volute Chamber',
        highlight: '60,000 L/hr Volumetric Output',
        description: 'High-capacity discharge chamber quickly inundates paddy fields, orchards, and construction sites.'
      },
      {
        id: 'hotspot-joints-alu',
        title: 'Cast Aluminium Pipe Couplers',
        highlight: 'Corrosion-Proof Quick Flanges',
        description: 'Heavy aluminum coupling set with high-seal rubber gaskets withstands continuous canal head pressure.'
      },
      {
        id: 'hotspot-head-lift',
        title: '30m Max Head & 8m Suction',
        highlight: 'Semi-Open Cast Impeller',
        description: 'Balanced impeller maintains high discharge pressure even over elevated canal banks and long distances.'
      },
      {
        id: 'hotspot-pump-frame',
        title: '25mm Double-Handle Carry Frame',
        highlight: 'Two-Man Transport Ergonomics',
        description: 'Rigid protective frame with rubber damping mounts prevents walking and vibration creep during pumping.'
      }
    ]
  },
  {
    id: 'cordless-bag-closer',
    productId: 'agroveer-cordless-bag-closer',
    name: "Agroveer™ Cordless Single-Thread Bag Closer",
    shortName: 'Cordless Bag Closer',
    modelCode: 'AV-BC36V-LION',
    image: '/images/products/agroveer-cordless-bag-closer.jpg',
    specBadge: 'Dual 36V Li-ion • 1800 RPM',
    brand: 'Agroveer',
    category: 'Packaging & Bag Closers',
    tagline: "India's first cordless bag closing machine with dual 36V lithium-ion batteries",
    priceExGst: 8570,
    priceGst: 8999,
    gstRate: 0.05,
    hotspots: [
      {
        id: 'hotspot-dual-battery',
        title: "Dual 36V Lithium Battery Packs",
        highlight: "3,000+ Bags per Charge",
        description: 'Cordless freedom allows warehouse staff to stitch grain, flour, and fertilizer sacks without trailing cables.'
      },
      {
        id: 'hotspot-stitch-speed',
        title: '1,800 RPM High-Speed Stitching',
        highlight: 'Single-Thread Chain Stitch',
        description: 'Tight, jam-free chain stitch secures woven PP, burlap, jute, and multi-ply paper bags effortlessly.'
      },
      {
        id: 'hotspot-oiler',
        title: 'Semi-Automatic Lubrication Pump',
        highlight: 'Push-Button Oil Reservoir',
        description: 'Direct push pump feeds lubricating oil directly to internal needle cams and looper bushings.'
      }
    ]
  },
  {
    id: 'sawking-chain-gold',
    productId: 'sawking-super-gold-chainsaw-chain',
    name: 'Sawking™ Super Gold Titanium Chainsaw Chain',
    shortName: 'Sawking TiN Chain',
    modelCode: 'SK-GLD-FULLCHISEL',
    image: '/images/products/sawking-super-gold-chainsaw-chain.jpg',
    specBadge: 'TiN Gold • Full Chisel',
    brand: 'Sawking',
    category: 'Cutting Tools & Consumables',
    tagline: 'Titanium Nitride coated full-chisel chainsaw chain engineered for logging & timber ripping',
    priceExGst: 1237,
    priceGst: 1299,
    gstRate: 0.05,
    hotspots: [
      {
        id: 'hotspot-tin-coat',
        title: 'Titanium Nitride (TiN) Gold Coating',
        highlight: '3x Longer Sharpness Retention',
        description: 'Micro-thin titanium coating reduces frictional heat and extends cutting life in abrasive hardwoods.'
      },
      {
        id: 'hotspot-full-chisel',
        title: 'Full Chisel Cutter Geometry',
        highlight: 'Aggressive Timber Biting Edge',
        description: 'Square-corner cutters sever wood fibers cleanly with significantly faster cutting speed.'
      },
      {
        id: 'hotspot-ripping-angle',
        title: '10° RMX Ripping Compatibility',
        highlight: 'Precision Log Milling',
        description: 'Maintains straight tracking and prevents binding when ripping logs along the grain in timber mills.'
      }
    ]
  }
];

export const Product3DShowcaseSection = () => {
  const [selectedMachineIndex, setSelectedMachineIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const { addItem } = useCartStore();
  const currentMachine = SHOWCASE_MACHINES[selectedMachineIndex];

  const matchedProduct = PRODUCTS.find((p) => p.id === currentMachine.productId) || PRODUCTS[0];

  // Keyboard navigation for power-users and smooth client presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        setSelectedMachineIndex((prev) => (prev > 0 ? prev - 1 : SHOWCASE_MACHINES.length - 1));
        setActiveHotspotId(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedMachineIndex((prev) => (prev < SHOWCASE_MACHINES.length - 1 ? prev + 1 : 0));
        setActiveHotspotId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddToCart = () => {
    addItem(matchedProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isSawking = currentMachine.brand === 'Sawking';

  const whatsappInquiryUrl = `https://wa.me/917352210000?text=${encodeURIComponent(
    `Hello Arveer Impex Sales Desk,\n\nI am inspecting the 3D Machinery Showcase:\n• Brand: ${currentMachine.brand}\n• Machine: ${currentMachine.name}\n• Category: ${currentMachine.category}\n• Price: ₹${currentMachine.priceGst} (incl. 5% GST)\n\nPlease share wholesale dealer terms, freight timeline, and spare parts catalog.`
  )}`;

  return (
    <section id="showcase" className="py-20 sm:py-32 bg-[#102C22] text-[#F7F5F0] relative overflow-hidden">
      {/* Subtle Atmospheric Grid Lines in Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(166, 201, 106, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14261F] border border-[rgba(166,201,106,0.3)] text-[#A6C96A] text-xs uppercase tracking-widest font-mono font-bold mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#A6C96A]" />
            <span>Interactive 3D Machinery Inspection Station</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F7F5F0] leading-tight mb-4">
            Industrial Engineering. <span className="italic text-[#E9E1CC] font-normal">Inspected in 360°.</span>
          </h2>
          <p className="text-[#F7F5F0]/80 text-sm sm:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Experience the heavy-duty build quality of Agroveer machinery and Sawking cutting systems. Select any unit below to load real-time kinetics, rotate in 360 degrees, and inspect proprietary engineering callouts.
          </p>
        </div>

        {/* Fleet Control Deck Header Bar */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(166,201,106,0.18)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#24583D]/50 border border-[#A6C96A]/40 flex items-center justify-center text-[#A6C96A]">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6C96A] font-bold block">
                Select Machinery Model • 5 Heavy-Duty Units Available
              </span>
            </div>
          </div>

          {/* Quick Prev / Next Model Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] font-mono text-[#E9E1CC]/75 mr-1">
              Unit <strong className="text-[#A6C96A]">0{selectedMachineIndex + 1}</strong> of 05
            </span>
            <button
              onClick={() => {
                setSelectedMachineIndex((prev) => (prev > 0 ? prev - 1 : SHOWCASE_MACHINES.length - 1));
                setActiveHotspotId(null);
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-[#14261F] hover:bg-[#1B362C] border border-[rgba(166,201,106,0.3)] text-white hover:text-[#A6C96A] transition-all"
              title="Previous Model (Arrow Left)"
              aria-label="Previous Machinery Model"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedMachineIndex((prev) => (prev < SHOWCASE_MACHINES.length - 1 ? prev + 1 : 0));
                setActiveHotspotId(null);
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-[#14261F] hover:bg-[#1B362C] border border-[rgba(166,201,106,0.3)] text-white hover:text-[#A6C96A] transition-all"
              title="Next Model (Arrow Right)"
              aria-label="Next Machinery Model"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-Bay Interactive Machinery Fleet Command Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 mb-8 sm:mb-10">
          {SHOWCASE_MACHINES.map((machine, index) => {
            const isSelected = selectedMachineIndex === index;
            const isSawkingBrand = machine.brand === 'Sawking';
            return (
              <button
                key={machine.id}
                onClick={() => {
                  setSelectedMachineIndex(index);
                  setActiveHotspotId(null);
                }}
                className={`group relative text-left p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-300 flex flex-col justify-between border overflow-hidden ${isSelected
                    ? 'bg-gradient-to-b from-[#1C3E30] to-[#0F261D] border-[#A6C96A] ring-2 ring-[#A6C96A]/35 shadow-[0_12px_32px_-6px_rgba(166,201,106,0.32)] scale-[1.01] sm:scale-[1.02] z-10'
                    : 'bg-[#121B17]/90 hover:bg-[#162720] border-[rgba(166,201,106,0.18)] hover:border-[#A6C96A]/50 hover:shadow-card'
                  }`}
              >
                {/* Active Neon Accent Indicator at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-[#A6C96A] via-[#BEE37E] to-[#A6C96A]' : 'bg-transparent group-hover:bg-[#A6C96A]/30'
                  }`} />

                {/* Card Top: Brand Badge & Status */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider ${isSawkingBrand
                      ? 'bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40'
                      : 'bg-[#D64527]/20 text-[#FF6B4A] border border-[#D64527]/40'
                    }`}>
                    {machine.brand}
                  </span>

                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono font-bold text-[#A6C96A] bg-[#24583D]/80 px-1.5 py-0.5 rounded border border-[#A6C96A]/50 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A6C96A] animate-pulse" />
                      LIVE 3D
                    </span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] font-mono text-[#F7F5F0]/40 group-hover:text-[#A6C96A] transition-colors">
                      [0{index + 1}]
                    </span>
                  )}
                </div>

                {/* Card Center: Machine Thumbnail Preview */}
                <div className="relative w-full h-16 sm:h-20 mb-2 rounded-lg sm:rounded-xl bg-[#091410] border border-[rgba(166,201,106,0.14)] flex items-center justify-center p-1.5 overflow-hidden group-hover:border-[#A6C96A]/40 transition-all">
                  <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#091410]/70 pointer-events-none" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={machine.image}
                    alt={machine.shortName}
                    className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/open-source-petrol-engine.jpg';
                    }}
                  />
                  {isSelected && (
                    <div className="absolute bottom-1 right-1 bg-[#102C22]/95 backdrop-blur-sm px-1 sm:px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-mono text-[#A6C96A] border border-[#A6C96A]/40 font-bold">
                      INSPECTING
                    </div>
                  )}
                </div>

                {/* Card Bottom: Short Name & Spec Chip */}
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-[#E9E1CC] leading-snug line-clamp-1 mb-0.5 sm:mb-1">
                    {machine.shortName}
                  </h4>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                    <span className="text-[#A6C96A] font-mono truncate font-medium">
                      {machine.specBadge}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D Showcase & Engineering Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: 3D WebGL Canvas */}
          <div className="lg:col-span-7">
            <ProductShowcaseScene
              machineType={currentMachine.id}
              activeHotspot={activeHotspotId}
              onSelectHotspot={(id) => setActiveHotspotId(id)}
            />
          </div>

          {/* Right Column: Engineering Dossier & Purchasing Box */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">

            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* Brand Tag with Exact Color Tokens */}
                {isSawking ? (
                  <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-md">
                    Sawking™ German Quality
                  </span>
                ) : (
                  <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#D64527]/15 text-[#D64527] border border-[#D64527]/40 backdrop-blur-md">
                    Agroveer™ Kisan Ki Pasand
                  </span>
                )}
                <span className="text-white/20">•</span>
                <span className="text-xs text-[#E9E1CC]/70">{currentMachine.category}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#F7F5F0] leading-tight">
                {currentMachine.name}
              </h3>

              <p className="text-xs text-[#F7F5F0]/80 font-sans leading-relaxed">
                {currentMachine.tagline}
              </p>
            </div>

            {/* Clickable Engineering Hotspot Callouts */}
            <div className="space-y-2.5 bg-[#141A17] p-4 sm:p-5 rounded-2xl border border-[rgba(166,201,106,0.15)] shadow-card">
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#A6C96A] block mb-1">
                Proprietary Engineering Hotspots (Click to Inspect)
              </span>

              <div className="grid grid-cols-1 gap-2">
                {currentMachine.hotspots.map((hotspot) => {
                  const isActive = (activeHotspotId === hotspot.id) || (!activeHotspotId && hotspot.id === currentMachine.hotspots[0].id);
                  return (
                    <button
                      key={hotspot.id}
                      onClick={() => setActiveHotspotId(hotspot.id)}
                      className={`p-3 rounded-xl text-left transition-all duration-200 border ${isActive
                          ? 'bg-[#24583D]/50 border-[#A6C96A] ring-1 ring-[#A6C96A]/40'
                          : 'bg-[#102C22]/60 border-[rgba(166,201,106,0.12)] hover:border-[rgba(166,201,106,0.3)]'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F7F5F0]">
                          {hotspot.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A6C96A]/20 text-[#A6C96A] border border-[#A6C96A]/30 font-semibold">
                          {hotspot.highlight}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#F7F5F0]/80 mt-1 leading-snug">
                        {hotspot.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing & GST Matrix */}
            <div className="p-4 rounded-2xl bg-[#141A17] border border-[rgba(166,201,106,0.18)]">
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="text-[11px] text-[#F7F5F0]/70">List Price (Excl. GST): </span>
                  <span className="text-xs font-mono font-bold text-[#E9E1CC]">₹{currentMachine.priceExGst}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F5F0]">
                    {formatCurrency(currentMachine.priceGst)}
                  </span>
                  <span className="text-[10px] text-[#A6C96A] block font-medium">+5% GST Included</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[rgba(166,201,106,0.15)] text-[11px] text-[#F7F5F0]/80">
                <ShieldCheck className="w-4 h-4 text-[#A6C96A] shrink-0" />
                <span>Full Spare Parts & Warranty Supported by Arveer Impex</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {/* Primary CTA: Harvest Botanical Green (#24583D) */}
              <button
                onClick={handleAddToCart}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border shadow-lg ${added
                    ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A]'
                    : 'bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] hover:text-[#FFFFFF] border-[#24583D] hover:border-[#A6C96A] hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Quote</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#A6C96A]" />
                    <span>Add to Quote</span>
                  </>
                )}
              </button>

              {/* WhatsApp Direct Action: WhatsApp Green (#25D366) */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Quote</span>
              </a>

              <Link
                href={`/products/${currentMachine.productId}`}
                className="w-full sm:w-auto p-3.5 rounded-2xl bg-[#141A17] hover:bg-[#1A2420] border border-[rgba(166,201,106,0.2)] text-[#F7F5F0] transition-colors flex items-center justify-center"
                title="View Full Specifications & Factory Media"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Link to Spares Finder */}
            <div className="pt-2 text-center sm:text-left">
              <Link
                href="/spares"
                className="text-xs text-[#F7F5F0]/80 hover:text-[#A6C96A] font-medium inline-flex items-center gap-1.5 transition-colors underline-offset-4 hover:underline"
              >
                <Wrench className="w-3.5 h-3.5 text-[#A6C96A]" />
                <span>Need replacement parts? Open Visual Spares Compatibility Engine</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
