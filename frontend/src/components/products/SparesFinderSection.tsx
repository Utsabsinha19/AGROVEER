'use client';

import React, { useState, useMemo, useDeferredValue, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Wrench, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  MessageCircle, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { PARENT_MACHINES, COMPATIBLE_SPARES } from '@/data/sparesCompatibility';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

// Fallback-resilient image component using verified studio photography
function SafeSpareImage({ 
  src, 
  alt, 
  className = '', 
  category = '' 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  category?: string;
}) {
  const getOpenSourceFallback = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('auger') || c.includes('boring') || c.includes('bit') || c.includes('ea-85') || c.includes('110cc')) {
      return '/images/products/open-source-earth-auger.jpg';
    }
    if (c.includes('pump') || c.includes('water')) {
      return '/images/products/open-source-water-pump.jpg';
    }
    if (c.includes('brush') || c.includes('tiller') || c.includes('trimmer') || c.includes('cutter')) {
      return '/images/products/open-source-brush-cutter-tiller.jpg';
    }
    if (c.includes('chain') || c.includes('sawking') || c.includes('cutting')) {
      return '/images/products/open-source-chainsaw-chain.jpg';
    }
    if (c.includes('bag') || c.includes('closer') || c.includes('pack')) {
      return '/images/products/open-source-cordless-bag-closer.jpg';
    }
    return '/images/products/open-source-petrol-engine.jpg';
  };

  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [retriedFallback, setRetriedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasFailed(false);
    setRetriedFallback(false);
  }, [src]);

  if (hasFailed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F1EFE9] rounded-xl text-center p-2 select-none border border-[rgba(166,201,106,0.15)]">
        <div className="w-7 h-7 rounded-full bg-[#24583D]/10 flex items-center justify-center mb-1">
          <Wrench className="w-4 h-4 text-[#24583D]" />
        </div>
        <span className="text-[9px] font-bold text-[#102C22] uppercase tracking-tight">OEM Certified</span>
        <span className="text-[8px] text-[#4F5D54] tracking-tight font-medium">Genuine Fitment</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white/50 rounded-xl">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F0] via-[#EAE6DC] to-[#F7F5F0] animate-pulse rounded-lg flex items-center justify-center">
          <Wrench className="w-4 h-4 text-[#78877D]/30" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!retriedFallback) {
            const fallback = getOpenSourceFallback(category || alt);
            if (currentSrc !== fallback) {
              setRetriedFallback(true);
              setCurrentSrc(fallback);
              return;
            }
          }
          setHasFailed(true);
        }}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
}

export const SparesFinderSection = () => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(PARENT_MACHINES[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedSpares, setAddedSpares] = useState<Record<string, boolean>>({});
  const [visibleLimit, setVisibleLimit] = useState<number>(18);

  // Debounced/deferred search query to keep the UI thread responsive at 60 FPS
  const deferredSearch = useDeferredValue(searchQuery);

  const { addItem } = useCartStore();

  // Reset pagination limit on filter changes
  useEffect(() => {
    setVisibleLimit(18);
  }, [selectedMachineId, selectedCategory, deferredSearch]);

  const activeMachine = useMemo(() => {
    return PARENT_MACHINES.find((m) => m.id === selectedMachineId) || PARENT_MACHINES[0];
  }, [selectedMachineId]);

  const machineSpares = useMemo(() => {
    return COMPATIBLE_SPARES.filter((spare) => spare.parentMachineIds.includes(activeMachine.id));
  }, [activeMachine.id]);

  const filteredSpares = useMemo(() => {
    // When user enters a search query, search globally across all verified spares so any SKU/code is found instantly
    const basePool = deferredSearch.trim() 
      ? COMPATIBLE_SPARES 
      : machineSpares;

    const q = deferredSearch.toLowerCase().trim();
    return basePool.filter((spare) => {
      const matchCat =
        selectedCategory === 'All' ||
        spare.category === selectedCategory ||
        spare.masterCategory === selectedCategory;

      const matchQuery =
        !q ||
        spare.name.toLowerCase().includes(q) ||
        spare.sku.toLowerCase().includes(q) ||
        spare.fitsDescription.toLowerCase().includes(q) ||
        spare.category.toLowerCase().includes(q) ||
        (spare.masterCategory && spare.masterCategory.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });
  }, [activeMachine.id, machineSpares, selectedCategory, deferredSearch]);

  const displayedSpares = useMemo(() => {
    return filteredSpares.slice(0, visibleLimit);
  }, [filteredSpares, visibleLimit]);

  const categories = useMemo(() => {
    // If active machine is "all-machines", list the 5 master equipment product lines
    if (activeMachine.id === 'all-machines') {
      const masterCats = Array.from(
        new Set(COMPATIBLE_SPARES.map((s) => s.masterCategory || s.category))
      ).filter(Boolean);
      return ['All', ...masterCats];
    }

    // Otherwise list the functional sub-system categories for the selected machine
    const subCats = Array.from(
      new Set(machineSpares.map((s) => s.category))
    ).filter(Boolean);
    return ['All', ...subCats];
  }, [activeMachine.id, machineSpares]);

  const handleAddSpareToCart = (spare: typeof COMPATIBLE_SPARES[0]) => {
    const cartProduct: Product = {
      id: spare.id,
      sku: spare.sku,
      brand: spare.brand,
      name: spare.name,
      tagline: spare.fitsDescription,
      category: 'Power Equipment Spares',
      price: spare.priceGst,
      exGstPrice: spare.priceExGst,
      gstRate: spare.gstRate,
      rating: 4.9,
      reviewCount: 42,
      image: spare.image,
      badges: ['OEM Guaranteed', spare.sku, spare.leadTime],
      inStock: spare.inStock,
      inventoryCount: 150,
      description: spare.fitsDescription,
      detailedDescription: `Authentic factory replacement spare part for ${activeMachine.name}. Precision manufactured to OEM tolerances for guaranteed fit and zero downtime.`,
      volumeOrWeight: '1 Unit',
      keyBenefits: [
        'Guaranteed fitment for ' + activeMachine.name,
        'Prevents equipment downtime and operational failures',
        'Direct dispatch from Arveer Impex central warehouse'
      ],
      composition: [
        { name: 'Fitment Standard', percentage: 'OEM Specification' },
        { name: 'Part Number', percentage: spare.sku }
      ],
      specs: [
        { label: 'SKU / Part No.', value: spare.sku },
        { label: 'Applicable Machine', value: activeMachine.name },
        { label: 'Base Price (Excl. GST)', value: `₹${spare.priceExGst}` },
        { label: 'GST Rate', value: `${(spare.gstRate * 100).toFixed(0)}%` }
      ]
    };

    addItem(cartProduct, 1);
    setAddedSpares((prev) => ({ ...prev, [spare.id]: true }));
    setTimeout(() => {
      setAddedSpares((prev) => ({ ...prev, [spare.id]: false }));
    }, 2000);
  };

  const getWhatsAppSpareUrl = (spare: typeof COMPATIBLE_SPARES[0]) => {
    const text = `Hello Arveer Impex Sales Desk,\n\nI need a quote/dispatch confirmation for this authentic spare part:\n• Machine: ${activeMachine.name}\n• Spare Name: ${spare.name}\n• SKU: ${spare.sku}\n• Price: ₹${spare.priceGst} (incl. 5% GST)\n\nPlease confirm availability and freight dispatch to my dealership.`;
    return `https://wa.me/918004922476?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="spares-finder" className="py-20 sm:py-28 bg-[#F7F5F0] text-[#141A17] relative overflow-hidden border-t border-[rgba(166,201,106,0.18)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[rgba(166,201,106,0.25)] text-[#24583D] text-xs uppercase tracking-widest font-bold mb-3 shadow-sm">
            <Wrench className="w-3.5 h-3.5" />
            <span>Visual Spare Parts Compatibility Engine</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#141A17] leading-tight mb-4">
            Zero Guesswork. <span className="italic text-[#24583D] font-normal">Guaranteed Fitment.</span>
          </h2>
          <p className="text-[#4F5D54] text-sm sm:text-base font-sans leading-relaxed">
            Eliminate returned orders and phone delays. Select your parent machine model below to instantly view 100% compatible OEM carburetors, impellers, recoil starters, and consumables with part numbers and transparent GST pricing.
          </p>
        </div>

        {/* Step 1: Select Parent Machine */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#141A17] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#24583D] text-[#F7F5F0] text-[11px] flex items-center justify-center font-mono">1</span>
              <span>Select Your Parent Machine:</span>
            </h3>
            <span className="text-xs text-[#78877D] hidden sm:inline">
              Showing {PARENT_MACHINES.length} Commercial Models
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {PARENT_MACHINES.map((machine) => {
              const isSelected = machine.id === selectedMachineId;
              const isSawking = machine.brand === 'Sawking';
              const isMaster = machine.id === 'all-machines';
              return (
                <button
                  key={machine.id}
                  onClick={() => {
                    setSelectedMachineId(machine.id);
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-white border-[#24583D] shadow-card ring-2 ring-[#24583D]/20'
                      : 'bg-white/60 hover:bg-white border-[rgba(166,201,106,0.18)] hover:border-[#24583D]/40'
                  }`}
                >
                  <div className="relative w-full h-24 mb-3 rounded-xl overflow-hidden bg-[#F7F5F0] flex items-center justify-center p-2 border border-[rgba(166,201,106,0.1)]">
                    <SafeSpareImage
                      src={machine.image}
                      alt={machine.name}
                      category={machine.category}
                      className="object-contain p-1 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 left-1.5 z-10">
                      {/* Agroveer Power Tag, Sawking Gold Badge, or All Master Tag */}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-md ${
                        isMaster
                          ? 'bg-[#102C22] text-[#A6C96A] border border-[#A6C96A]/40'
                          : isSawking
                          ? 'bg-white/95 text-[#8F7010] border border-[#D4AF37]/50'
                          : 'bg-white/95 text-[#D64527] border border-[#D64527]/50'
                      }`}>
                        {isMaster ? 'Master Catalog' : machine.brand}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#141A17] leading-snug line-clamp-2">
                      {machine.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(166,201,106,0.15)]">
                      <span className="text-[10px] text-[#78877D] font-medium">
                        {machine.sparesCount} Verified Spares
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#24583D] shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Active Machine Fitment Dossier */}
        <div className="mb-10 bg-white border border-[rgba(166,201,106,0.22)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#F7F5F0] border border-[rgba(166,201,106,0.15)] p-2 shrink-0">
                <SafeSpareImage
                  src={activeMachine.image}
                  alt={activeMachine.name}
                  category={activeMachine.category}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#24583D] tracking-wider">
                  Active Fitment Model
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#141A17] leading-snug">
                  {activeMachine.name}
                </h3>
                <p className="text-xs text-[#4F5D54] mt-1 font-mono">
                  {activeMachine.specsSummary}
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-[rgba(166,201,106,0.18)] pt-4 lg:pt-0 lg:pl-6">
              <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[rgba(166,201,106,0.15)]">
                <span className="text-[10px] uppercase font-bold text-[#78877D] block">Output Shaft / Coupling</span>
                <span className="text-xs font-semibold text-[#141A17] mt-0.5 block">{activeMachine.shaftType}</span>
              </div>
              <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[rgba(166,201,106,0.15)]">
                <span className="text-[10px] uppercase font-bold text-[#78877D] block">Fuel / Power Unit</span>
                <span className="text-xs font-semibold text-[#141A17] mt-0.5 block">{activeMachine.fuelType}</span>
              </div>
              <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[rgba(166,201,106,0.15)] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#A6C96A] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#24583D] block">100% Fit Guarantee</span>
                  <span className="text-[11px] text-[#4F5D54] leading-tight block">Arveer Impex OEM Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Compatible Spares Catalog with Sub-System Tabs & Search */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Category Tabs with Dynamic Item Counts */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? (activeMachine.id === 'all-machines' ? COMPATIBLE_SPARES.length : machineSpares.length)
                    : (activeMachine.id === 'all-machines'
                        ? COMPATIBLE_SPARES.filter(
                            (s) => s.masterCategory === cat || s.category === cat
                          ).length
                        : machineSpares.filter((s) => s.category === cat).length);

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-[#24583D] text-[#F7F5F0] border-[#24583D] shadow-sm'
                        : 'bg-white text-[#141A17] border-[rgba(166,201,106,0.22)] hover:bg-[#F0ECE1]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        selectedCategory === cat
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-[#4F5D54]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78877D]" />
              <input
                type="text"
                placeholder="Search part name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-full bg-white border border-[rgba(166,201,106,0.22)] text-xs text-[#141A17] placeholder-[#78877D]/60 focus:outline-none focus:border-[#24583D]"
              />
            </div>
          </div>

          {/* Spares Grid */}
          {filteredSpares.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[rgba(166,201,106,0.18)] p-6">
              <AlertCircle className="w-8 h-8 text-[#78877D] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#141A17]">No spare parts found matching &quot;{searchQuery}&quot;</p>
              <p className="text-xs text-[#78877D] mt-1">Try searching for generic terms like &quot;carburetor&quot;, &quot;recoil&quot;, or &quot;impeller&quot;.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayedSpares.map((spare) => {
                  const isAdded = addedSpares[spare.id];
                  return (
                    <div
                      key={spare.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-[rgba(166,201,106,0.22)] hover:border-[#24583D]/60 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                    >
                      <div>
                        {/* Authentic Reference Image Box with Demand & Stock Badges */}
                        <div className="relative w-full h-44 mb-3.5 rounded-xl bg-[#F7F5F0] border border-[rgba(166,201,106,0.2)] overflow-hidden flex items-center justify-center p-2 group-hover:border-[#24583D]/40 transition-colors">
                          <SafeSpareImage 
                            src={spare.image} 
                            alt={spare.name} 
                            className="object-contain max-h-full max-w-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                            category={spare.category}
                          />

                          {/* Top Badges Overlay */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                            {spare.demand && (
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 ${
                                spare.demand === 'HIGH' 
                                  ? 'bg-rose-600 text-white' 
                                  : spare.demand === 'MEDIUM'
                                  ? 'bg-amber-600 text-white'
                                  : spare.demand === 'NEW LAUNCH'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#102C22] text-[#A6C96A] border border-[#A6C96A]/30'
                              }`}>
                                {spare.demand === 'HIGH' && '🔥 '}
                                {spare.demand === 'NEW LAUNCH' && '✨ '}
                                {spare.demand} DEMAND
                              </span>
                            )}
                          </div>

                          {spare.stockStatus && spare.stockStatus !== 'IN_STOCK' && (
                            <div className="absolute top-2 right-2 z-10 pointer-events-none">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white shadow-sm flex items-center gap-1">
                                ⚠️ {spare.stockStatus}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Code / SKU & Diagram Position */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#102C22]/5 text-[#102C22] border border-[rgba(166,201,106,0.3)]">
                            CODE: {spare.sku}
                          </span>
                          {spare.diagramPosition && (
                            <span className="text-[10px] font-sans font-medium text-[#24583D] truncate max-w-[55%] text-right" title={spare.diagramPosition}>
                              {spare.diagramPosition}
                            </span>
                          )}
                        </div>

                        {/* Item Name */}
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#141A17] leading-snug group-hover:text-[#24583D] transition-colors line-clamp-2">
                          {spare.name}
                        </h4>

                        {/* Compatibility note */}
                        <p className="text-xs text-[#4F5D54] mt-1.5 leading-relaxed line-clamp-2">
                          {spare.fitsDescription}
                        </p>

                        {/* Price Matrix */}
                        <div className="mt-3.5 pt-3 border-t border-[rgba(166,201,106,0.18)] flex items-baseline justify-between bg-[#F7F5F0]/60 -mx-4 sm:-mx-5 px-4 sm:px-5 pb-1">
                          <div>
                            <span className="text-[11px] text-[#78877D] block">List Price (Excl. GST):</span>
                            <span className="text-sm font-mono font-bold text-[#141A17]">₹{spare.priceExGst}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-[#78877D] block">
                              Incl. {Math.round((spare.gstRate || (spare.priceGst > spare.priceExGst * 1.1 ? 0.18 : 0.05)) * 100)}% GST:
                            </span>
                            <span className="text-sm font-serif font-bold text-[#24583D]">
                              {formatCurrency(spare.priceGst)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-5 pt-3 border-t border-[rgba(166,201,106,0.15)] flex items-center gap-2">
                        {/* Primary CTA: Harvest Botanical Green (#24583D) */}
                        <button
                          onClick={() => handleAddSpareToCart(spare)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                            isAdded
                              ? 'bg-[#A6C96A] text-[#102C22]'
                              : 'bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] hover:text-[#FFFFFF]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Quote</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Quote</span>
                            </>
                          )}
                        </button>

                        {/* WhatsApp Direct Action: WhatsApp Green (#25D366) */}
                        <a
                          href={getWhatsAppSpareUrl(spare)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors shadow-sm"
                          title="Inquire directly on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* High-Performance Progressive Loading Controls */}
              {filteredSpares.length > displayedSpares.length && (
                <div className="mt-10 flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl border border-[rgba(166,201,106,0.22)] shadow-sm">
                  <div className="w-full max-w-md flex flex-col items-center gap-1.5">
                    <div className="flex justify-between w-full text-xs font-semibold text-[#4F5D54]">
                      <span>Showing {displayedSpares.length} of {filteredSpares.length} verified parts</span>
                      <span className="font-mono text-[#24583D]">
                        {Math.round((displayedSpares.length / filteredSpares.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F1EFE9] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#24583D] transition-all duration-300 rounded-full"
                        style={{ width: `${(displayedSpares.length / filteredSpares.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setVisibleLimit((prev) => prev + 18)}
                      className="px-6 py-2.5 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Show Next 18 Spares (+18)</span>
                    </button>
                    <button
                      onClick={() => setVisibleLimit(filteredSpares.length)}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F7F5F0] text-[#24583D] border border-[rgba(166,201,106,0.3)] text-xs font-bold transition-colors"
                    >
                      Show All ({filteredSpares.length})
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Dealer Notice */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.22)] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#24583D] shrink-0" />
            <p className="text-xs text-[#141A17] leading-relaxed">
              <strong>Need bulk master crates of spare parts?</strong> We support wholesale dealers with custom GST invoices, freight coordination across India, and consignment packing.
            </p>
          </div>
          <a
            href="https://wa.me/918004922476?text=Hello%20Arveer%20Impex%20Team%2C%20I%20am%20a%20dealer%20looking%20for%20bulk%20spare%20parts%20price%20lists%20and%20dealership%20terms."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>WhatsApp Wholesale Desk</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
