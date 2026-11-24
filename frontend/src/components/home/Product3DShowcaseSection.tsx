'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Check,
  Wrench,
  MessageCircle,
  Layers,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS } from '@/data/products';
import { formatCurrency } from '@/lib/utils';

interface ShowcaseItem {
  id: string;
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
  specs: { label: string; value: string }[];
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
    modelCode: 'AG-ENG-170F-P',
    image: '/images/products/agroveer-170f-petrol-engine-pulley.jpg',
    specBadge: '212cc OHV • Dual Pulley',
    brand: 'Agroveer',
    category: 'Farm Machinery & Engines',
    tagline: 'High-torque 212cc OHV utility engine with fitted dual-groove power transmission pulley for pumps, weeders & threshers',
    priceExGst: 7202,
    priceGst: 8499,
    gstRate: 0.18,
    specs: [
      { label: 'Displacement', value: '212cc (Single Cylinder 4-Stroke)' },
      { label: 'Max Power', value: '7.5 HP @ 3600 RPM' },
      { label: 'Drive Shaft', value: 'Keyed Horizontal Shaft + Pulley' },
      { label: 'Fuel Tank', value: '3.6 L with Thread-Lock Cap' }
    ],
    hotspots: [
      {
        id: 'hotspot-recoil',
        title: 'Super Easy Starter Mechanism',
        highlight: '30% Reduced Pull Resistance',
        description: 'Smooth starting prevents kickback and snapped pull cords during cold morning farm operations.'
      },
      {
        id: 'hotspot-frame',
        title: 'Cast Iron Cylinder Sleeve',
        highlight: 'Heavy-Duty Thermal Sleeve',
        description: 'Durable bore lining resists thermal wear and compression loss under continuous farm duty.'
      },
      {
        id: 'hotspot-pulley',
        title: 'Factory-Fitted Drive Pulley',
        highlight: 'Dual-Groove V-Belt Fitment',
        description: 'CNC balanced pulley provides immediate belt-drive coupling for water pumps, power weeders, and mixers.'
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
    name: 'Agroveer™ EA-85 85CC Earth Auger Powerhead',
    shortName: 'EA-85 Earth Auger',
    modelCode: 'AG-EA-85',
    image: '/images/products/agroveer-85cc-earth-auger-poster.jpg',
    specBadge: '85cc 2T • 9000 RPM',
    brand: 'Agroveer',
    category: 'Earth Augers & Boring',
    tagline: 'High-torque 85cc 2-stroke post hole digger with Super Easy Starter and vibration-damped handles',
    priceExGst: 9999,
    priceGst: 10499,
    gstRate: 0.05,
    specs: [
      { label: 'Displacement', value: '85cc High Power 2-Stroke' },
      { label: 'Max Speed', value: '9000 RPM' },
      { label: 'Fuel Mix Ratio', value: '25:1 (Petrol : 2T Oil)' },
      { label: 'Hole Depth', value: 'Up to 800mm Depth' }
    ],
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
        id: 'hotspot-gearbox',
        title: 'Heavy-Duty Planetary Gearbox',
        highlight: 'Heat-Treated Steel Gears',
        description: 'Gear reduction steps down engine RPM to a controllable 170-200 RPM for maximum operator control.'
      }
    ]
  },
  {
    id: 'water-pump-wp20',
    productId: 'agroveer-2inch-water-pump-170f',
    name: 'Agroveer™ 2" High-Pressure Agriculture Water Pump',
    shortName: '2" Centrifugal Pump',
    modelCode: 'AG-WP-20',
    image: '/images/products/agroveer-2inch-water-pump-170f.jpg',
    specBadge: '35,000 L/hr • 28m Head',
    brand: 'Agroveer',
    category: 'Agriculture Water Pumps',
    tagline: 'High-head portable irrigation pump with 25mm double-handle roll cage and aluminium couplers',
    priceExGst: 11428,
    priceGst: 11999,
    gstRate: 0.05,
    specs: [
      { label: 'Port Size', value: '2 Inch (50 mm) Diameter' },
      { label: 'Max Total Head', value: '25 – 28 Metres' },
      { label: 'Max Suction Lift', value: '6 – 7 Metres' },
      { label: 'Engine', value: 'Agroveer 170F 7.5 HP Petrol' }
    ],
    hotspots: [
      {
        id: 'hotspot-discharge-2in',
        title: '2" (50mm) High-Pressure Volute',
        highlight: '35,000 L/hr Volume Discharge',
        description: 'High pressure displacement chamber designed for flood irrigation and orchard sprinkler boosting.'
      },
      {
        id: 'hotspot-joints-alu',
        title: 'Cast Aluminium Pipe Couplers',
        highlight: 'Corrosion-Proof Quick Flanges',
        description: 'Complete heavy aluminum coupling set with high-seal rubber gaskets and steel strainer in the box.'
      },
      {
        id: 'hotspot-pump-frame',
        title: '25mm Double-Handle Carry Frame',
        highlight: 'Two-Person Carry Tubular Frame',
        description: 'Rigid 25mm tubular roll cage with vibration damping feet protects engine during rough field transport.'
      },
      {
        id: 'hotspot-head-lift',
        title: '28m Max Head Capacity',
        highlight: 'High Terrace Reach',
        description: 'Pumps water over steep canal banks, elevated garden terraces, and long pipeline distances.'
      }
    ]
  },
  {
    id: 'cordless-bag-closer',
    productId: 'agroveer-cordless-bag-closer',
    name: 'Agroveer™ Cordless Single-Thread Bag Closer',
    shortName: 'Cordless Bag Closer',
    modelCode: 'AV-BC36V-LION',
    image: '/images/products/open-source-cordless-bag-closer.jpg',
    specBadge: 'Dual 36V Li-ion • 1800 RPM',
    brand: 'Agroveer',
    category: 'Packaging & Bag Closers',
    tagline: 'Portable cordless bag closer with dual 36V lithium-ion batteries for grain and fertilizer sack stitching',
    priceExGst: 8570,
    priceGst: 8999,
    gstRate: 0.05,
    specs: [
      { label: 'Battery System', value: 'Dual 36V Rechargeable Lithium' },
      { label: 'Sewing Speed', value: '1800 – 2000 Stitches / Min' },
      { label: 'Stitch Type', value: 'Single Thread Chain Stitch' },
      { label: 'Suitable Materials', value: 'PP Woven, Jute, Paper, Cotton' }
    ],
    hotspots: [
      {
        id: 'hotspot-dual-battery',
        title: 'Dual 36V Lithium Battery Packs',
        highlight: '3,000+ Bags per Charge',
        description: 'Cordless freedom allows godown staff to stitch grain and fertilizer sacks anywhere without electric cords.'
      },
      {
        id: 'hotspot-cutter-auto',
        title: 'Automatic Thread Cutter',
        highlight: 'Instant Blade Trimming',
        description: 'Integral guide blade cuts thread instantly after finishing each sack, doubling bagging speed.'
      },
      {
        id: 'hotspot-insulated-handle',
        title: 'Insulated Safety Grip',
        highlight: 'Shockproof Ergonomic Body',
        description: 'High-strength nylon body minimizes operator arm strain over long packing shifts in mills and godowns.'
      },
      {
        id: 'hotspot-chain-stitch',
        title: 'Single-Thread Chain Stitch',
        highlight: 'Tamper-Evident Strong Seam',
        description: 'Tight single-thread stitch holds heavy loads while remaining easy to unravel when opening bags.'
      }
    ]
  }
];

export const Product3DShowcaseSection = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState(0);
  const [added, setAdded] = useState(false);

  const { addItem } = useCartStore();
  const currentMachine = SHOWCASE_MACHINES[activeItemIndex];

  const handleAddToCart = () => {
    const catalogProduct = PRODUCTS.find((p) => p.id === currentMachine.productId);
    if (catalogProduct) {
      addItem(catalogProduct, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/917352210000?text=${encodeURIComponent(
    `Hello Arveer Impex Sales Desk,\nI am inquiring about the technical specifications and dealer quote for:\n• Model: ${currentMachine.name}\n• SKU: ${currentMachine.modelCode}\n• Price: ${formatCurrency(currentMachine.priceGst)} (incl. GST)\nPlease provide availability and dispatch schedule.`
  )}`;

  return (
    <section id="showcase" className="py-16 sm:py-24 bg-[#FFFFFF] text-[#252B27] border-b border-[#E2E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] text-xs uppercase tracking-wider font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Machinery Specification & Cutaway</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#252B27] leading-tight mb-3">
            Inspect Agricultural Power Equipment
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5550]">
            Explore engineering specs, reinforced build components, and field-tested features across our flagship models.
          </p>
        </div>

        {/* Machine Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {SHOWCASE_MACHINES.map((machine, idx) => (
            <button
              key={machine.id}
              onClick={() => {
                setActiveItemIndex(idx);
                setSelectedHotspot(0);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                activeItemIndex === idx
                  ? 'bg-[#245B37] text-white border-[#245B37] shadow-sm'
                  : 'bg-[#F5F7F1] text-[#252B27] hover:bg-[#EAEFE6] border-[#E2E6DF]'
              }`}
            >
              <span>{machine.shortName}</span>
              <span className="ml-2 text-[10px] opacity-80 font-mono">({machine.modelCode})</span>
            </button>
          ))}
        </div>

        {/* Main Inspection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F5F7F1] rounded-3xl p-6 sm:p-10 border border-[#E2E6DF]">
          
          {/* Left Column: Product Photo & Hotspots */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* High-Res Product Image Container */}
            <div className="relative w-full h-72 sm:h-96 rounded-2xl bg-white border border-[#E2E6DF] p-6 flex items-center justify-center shadow-soft overflow-hidden group">
              <Image
                src={currentMachine.image}
                alt={currentMachine.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
              
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#EAEFE6] text-[#245B37] border border-[#245B37]/30 shadow-xs">
                {currentMachine.specBadge}
              </span>
            </div>

            {/* Feature Hotspots Pill Selector */}
            <div className="w-full mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#767E78] block mb-2 text-center sm:text-left">
                Click Feature Hotspot to Inspect:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentMachine.hotspots.map((h, hIdx) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHotspot(hIdx)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedHotspot === hIdx
                        ? 'bg-[#245B37] text-white border-[#245B37] shadow-sm font-bold'
                        : 'bg-white text-[#252B27] hover:bg-[#EAEFE6] border-[#E2E6DF]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedHotspot === hIdx ? '#6FAF45' : '#245B37' }} />
                      <span className="truncate">{h.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Specification & Hotspot Detail */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">
            
            {/* Machine Title & Tagline */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#245B37] bg-[#EAEFE6] px-2.5 py-0.5 rounded">
                  {currentMachine.category}
                </span>
                <span className="text-xs font-mono text-[#767E78]">
                  SKU: {currentMachine.modelCode}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] mb-2 leading-tight">
                {currentMachine.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5550] leading-relaxed">
                {currentMachine.tagline}
              </p>
            </div>

            {/* Selected Hotspot Callout Box */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#245B37]/30 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#245B37]" />
                <h4 className="text-sm font-bold text-[#252B27]">
                  {currentMachine.hotspots[selectedHotspot].title}
                </h4>
              </div>
              <span className="text-xs font-semibold text-[#6FAF45] block mb-1">
                ★ {currentMachine.hotspots[selectedHotspot].highlight}
              </span>
              <p className="text-xs text-[#4E5550] leading-relaxed">
                {currentMachine.hotspots[selectedHotspot].description}
              </p>
            </div>

            {/* Technical Specifications Table */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#252B27] mb-3">
                Key Technical Parameters
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {currentMachine.specs.map((s, sIdx) => (
                  <div key={sIdx} className="bg-[#F5F7F1] p-2 rounded-lg">
                    <span className="text-[#767E78] block text-[10px]">{s.label}</span>
                    <span className="font-bold text-[#252B27] block truncate">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing & Commercial Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#767E78] block">Commercial Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#245B37]">
                    {formatCurrency(currentMachine.priceGst)}
                  </span>
                  <span className="text-xs text-[#4E5550]">
                    (Ex. GST: ₹{currentMachine.priceExGst})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    added
                      ? 'bg-[#6FAF45] text-white'
                      : 'bg-[#245B37] hover:bg-[#1C472B] text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#6FAF45]" />
                      <span>Add to Order</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  title="WhatsApp Quotation"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enquire</span>
                </a>

                <Link
                  href={`/products/${currentMachine.productId}`}
                  className="p-3 rounded-xl bg-white hover:bg-[#EAEFE6] text-[#252B27] border border-[#E2E6DF] transition-colors flex items-center justify-center cursor-pointer"
                  title="Full Product Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
