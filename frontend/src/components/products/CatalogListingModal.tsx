'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Search,
  LayoutGrid,
  List,
  Plus,
  Minus,
  Truck,
  FileText,
  BadgePercent,
  Sparkles,
  Phone,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useLanguageStore } from '@/store/languageStore';
import { useCartStore } from '@/store/cartStore';

export const CatalogListingModal: React.FC = () => {
  const { isCatalogModalOpen, closeCatalogModal } = useLanguageStore();
  const { addItem, items: cartItems } = useCartStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories = useMemo(() => [
    'All',
    'Farm Machinery & Engines',
    'Agriculture Water Pumps',
    'Earth Augers & Boring',
    'Packaging & Bag Closers',
    'Cutting Tools & Consumables',
    'Power Equipment Spares'
  ], []);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        product.name.toLowerCase().includes(q) ||
        (product.scientificName && product.scientificName.toLowerCase().includes(q)) ||
        product.description.toLowerCase().includes(q) ||
        (product.badges && product.badges.some(b => b.toLowerCase().includes(q))) ||
        product.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isCatalogModalOpen) return null;

  const getQty = (productId: string) => quantities[productId] || 1;

  const updateQty = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(99, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product) => {
    const qty = getQty(product.id);
    addItem(product, qty);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShareWhatsApp = () => {
    const text = `📑 *AGROVÉ Commercial 2026 Equipment Catalog & Trade Pricing*\n` +
      `Official B2B dispatch catalog for heavy-duty earth augers, water pumps, 170F utility engines, and Sawking cutting systems.\n\n` +
      `🔥 *Featured Catalog Models:*\n` +
      filteredProducts.slice(0, 8).map((p) => {
        const orig = p.originalPrice ? ` (MSRP: ${formatCurrency(p.originalPrice)})` : '';
        return `• ${p.name} — *${formatCurrency(p.price)}*${orig}`;
      }).join('\n') +
      `\n\nDirect Order & Bulk Dealership Quotation: https://wa.me/918004922476`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSingleProductRFQ = (product: Product) => {
    const qty = getQty(product.id);
    const totalPrice = product.price * qty;
    const msg = `Hello AGROVÉ B2B Sales,\n\n` +
      `I would like to request an official Proforma Invoice & freight quote for:\n` +
      `📦 *Model*: ${product.name}\n` +
      `📊 *Specification*: ${product.scientificName}\n` +
      `🔢 *Quantity*: ${qty} unit(s)\n` +
      `💰 *Quoted Wholesale Rate*: ${formatCurrency(product.price)} / unit (Total: ${formatCurrency(totalPrice)})\n` +
      `📍 Please confirm dispatch timeline and GST invoice details.`;

    const url = `https://wa.me/918004922476?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin + '/products');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6 bg-forest-950/85 backdrop-blur-md animate-in fade-in duration-200 font-sans print:p-0 print:bg-white print:static">
      {/* Background backdrop click to dismiss */}
      <div className="fixed inset-0 print:hidden" onClick={closeCatalogModal} />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-6xl bg-offwhite text-charcoal border border-sand-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* ========================================================================= */}
        {/* PREMIUM B2B HEADER                                                         */}
        {/* ========================================================================= */}
        <div className="bg-forest text-offwhite p-5 sm:p-7 border-b border-forest-800 relative overflow-hidden flex-shrink-0">
          {/* Subtle Ambient Decorative Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-leaf/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left Brand Identity */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-forest-950/80 border border-white/20 p-1 flex-shrink-0 shadow-inner flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="AGROVÉ" 
                  width={60} 
                  height={60} 
                  className="object-contain" 
                  priority
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-leaf font-bold bg-forest-950/80 px-2 py-0.5 rounded-full border border-leaf/30">
                    Official 2026 Trade Edition
                  </span>
                  <span className="text-white/40 hidden sm:inline">•</span>
                  <span className="text-xs text-sand/80 font-medium hidden sm:inline">
                    Arveer Impex Distribution Network
                  </span>
                  <span className="text-white/40 hidden md:inline">•</span>
                  <span className="text-[11px] text-amber-300/90 font-mono hidden md:inline">
                    GST Ready • CE Bench Tested
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-offwhite tracking-tight leading-tight">
                  Commercial Machinery & Cutting Systems Catalog
                </h1>
                
                <p className="text-xs text-sand/70 mt-1 max-w-xl hidden sm:block">
                  High-capacity earth augers, 170F utility engines, portable water pumps, and Sawking™ titanium saw chains & trimmer lines engineered for contractors and agricultural estates.
                </p>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto print:hidden">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handlePrint}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-forest-950/90 hover:bg-forest-900 border border-white/15 text-sand hover:text-offwhite transition-all flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold shadow-sm hover:border-white/30"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-leaf" />
                  <span className="hidden xs:inline">Print / PDF</span>
                  <span className="xs:hidden">PDF</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#128C7E] hover:bg-[#0E7064] text-white transition-all flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold shadow-md"
                  title="Forward Catalog on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Share Catalog</span>
                  <span className="xs:hidden">Share</span>
                </button>
              </div>

              <button
                onClick={closeCatalogModal}
                className="p-1.5 sm:p-2 rounded-xl bg-forest-950/90 hover:bg-forest-900 border border-white/15 text-sand/70 hover:text-white transition-all ml-1"
                aria-label="Close catalog modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Quick Value Props Strip */}
          <div className="mt-4 pt-3.5 border-t border-forest-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] text-sand/80 print:hidden">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-leaf flex-shrink-0" />
              <span><strong>Pan-India Freight</strong> Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-leaf flex-shrink-0" />
              <span><strong>1-Year Commercial</strong> Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgePercent className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span><strong>Bulk Tier</strong> Dealer Rebates</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-leaf flex-shrink-0" />
              <span>Dealer Desk: <strong>+91 80049 22476</strong></span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE CONTROLS BAR: SEARCH, CATEGORIES, VIEW SWITCHER               */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-4 bg-sand/30 border-b border-sand-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 flex-shrink-0 print:hidden">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, HP, displacement (e.g. 85cc, 170F)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-offwhite border border-sand-border focus:border-botanical focus:ring-1 focus:ring-botanical text-xs text-charcoal placeholder:text-charcoal-muted/70 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Toolbar: View Mode & Total Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-charcoal-muted font-medium whitespace-nowrap">
              Showing <strong className="text-botanical font-bold">{filteredProducts.length}</strong> items
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-offwhite p-1 rounded-xl border border-sand-border shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-botanical text-offwhite shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
                title="Trade Showcase Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-botanical text-offwhite shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
                title="Commercial Technical Sheet"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="px-4 py-2.5 bg-sand/20 border-b border-sand-border overflow-x-auto scrollbar-none flex items-center gap-2 flex-shrink-0 print:hidden">
          {categories.map((cat) => {
            const count = cat === 'All' 
              ? PRODUCTS.length 
              : PRODUCTS.filter(p => p.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-botanical text-offwhite border-botanical shadow-sm font-semibold'
                    : 'bg-offwhite text-charcoal/80 border-sand-border hover:bg-sand/60 hover:text-charcoal'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-sand/60 text-charcoal-muted'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MAIN CATALOG CONTENT AREA                                                 */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-offwhite/50">
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl bg-sand/40 border border-sand-border flex items-center justify-center mx-auto mb-3 text-charcoal-muted">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">No Equipment Found</h3>
              <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
                No machinery or spares match &quot;{searchQuery}&quot;. Try adjusting your keywords or clearing the category filter.
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 bg-botanical text-offwhite text-xs font-semibold rounded-xl hover:bg-botanical-hover transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* ===================================================================== */
            /* VIEW 1: PRESTIGE SHOWCASE CARDS (RESPONSIVE 2-COL / 3-COL)             */
            /* ===================================================================== */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const qty = getQty(product.id);
                const originalPrice = product.originalPrice || product.price;
                const discountAmount = Math.max(0, originalPrice - product.price);
                const discountPercent = originalPrice > product.price 
                  ? Math.round((discountAmount / originalPrice) * 100) 
                  : 0;

                return (
                  <div 
                    key={product.id}
                    className="bg-offwhite rounded-2xl border border-sand-border/90 hover:border-botanical/50 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                  >
                    {/* Top Image + Badges Header */}
                    <div className="relative h-52 bg-[#F4F0E6] p-4 flex items-center justify-center overflow-hidden border-b border-sand-border/60">
                      {/* Product Category & OEM Badge */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-forest text-offwhite px-2 py-0.5 rounded-md shadow-xs">
                          {product.category}
                        </span>
                        {product.inStock && (
                          <span className="text-[9px] font-semibold bg-emerald-700/90 text-white px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                            <Check className="w-2.5 h-2.5" /> In Stock ({product.inventoryCount} Units)
                          </span>
                        )}
                      </div>

                      {/* Margin / Savings Pill */}
                      {discountPercent > 0 && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="text-[10px] font-bold bg-amber-500 text-forest-950 px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> {discountPercent}% OFF MSRP
                          </span>
                        </div>
                      )}

                      {/* Product Visual */}
                      <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </div>

                    {/* Product Details Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Scientific Code */}
                        <Link 
                          href={`/products/${product.id}`}
                          onClick={closeCatalogModal}
                          className="font-serif text-base font-bold text-charcoal hover:text-botanical transition-colors line-clamp-2 leading-snug group-hover:underline"
                        >
                          {product.name}
                        </Link>
                        
                        <p className="text-[11px] font-mono text-charcoal-muted mt-1 line-clamp-1">
                          {product.scientificName}
                        </p>

                        {/* Specs & Performance Badges */}
                        <div className="flex flex-wrap gap-1.5 my-3">
                          {product.badges.slice(0, 3).map((badge, idx) => (
                            <span 
                              key={idx}
                              className="text-[10px] bg-sand/40 text-charcoal font-medium px-2 py-0.5 rounded-md border border-sand-border"
                            >
                              {badge}
                            </span>
                          ))}
                          <span className="text-[10px] font-mono bg-offwhite text-botanical font-semibold px-2 py-0.5 rounded-md border border-sand-border">
                            {product.volumeOrWeight}
                          </span>
                        </div>

                        <p className="text-xs text-charcoal-muted/90 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Commercial Pricing & Order Section */}
                      <div className="mt-4 pt-3.5 border-t border-sand-border/80">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span className="text-[10px] text-charcoal-muted font-mono uppercase block">
                              Wholesale Rate (excl. freight)
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-serif font-bold text-botanical">
                                {formatCurrency(product.price)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xs font-mono text-charcoal-muted/70 line-through">
                                  {formatCurrency(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Save {formatCurrency(discountAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Quantity Stepper & Buttons */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-sand-border rounded-xl bg-sand/20 p-0.5">
                            <button
                              onClick={() => updateQty(product.id, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-offwhite text-charcoal hover:text-botanical transition-colors text-xs font-bold"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold text-charcoal">
                              {qty}
                            </span>
                            <button
                              onClick={() => updateQty(product.id, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-offwhite text-charcoal hover:text-botanical transition-colors text-xs font-bold"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Primary Add to Cart Button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                              recentlyAddedId === product.id
                                ? 'bg-emerald-700 text-white'
                                : 'bg-botanical hover:bg-botanical-hover text-offwhite hover:shadow-md'
                            }`}
                          >
                            {recentlyAddedId === product.id ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5 text-leaf" />
                                <span>Add</span>
                              </>
                            )}
                          </button>

                          {/* WhatsApp Dealership RFQ Button */}
                          <button
                            onClick={() => handleSingleProductRFQ(product)}
                            className="p-2 rounded-xl bg-[#128C7E] hover:bg-[#0E7064] text-white transition-all shadow-sm"
                            title="Direct WhatsApp RFQ"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ===================================================================== */
            /* VIEW 2: COMMERCIAL TECHNICAL TRADE SHEET (HIGH DENSITY TABLE)         */
            /* ===================================================================== */
            <div className="bg-offwhite rounded-2xl border border-sand-border overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-forest text-offwhite font-mono uppercase text-[10px] tracking-wider border-b border-forest-800">
                      <th className="py-3.5 px-4 font-semibold">Equipment / Model</th>
                      <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Technical Specification</th>
                      <th className="py-3.5 px-3 font-semibold text-center hidden sm:table-cell">Displacement / Weight</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Wholesale Price (₹)</th>
                      <th className="py-3.5 px-4 font-semibold text-right">MSRP (₹)</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Order Qty</th>
                      <th className="py-3.5 px-4 font-semibold text-center">B2B Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-border/70 text-charcoal">
                    {filteredProducts.map((product, idx) => {
                      const qty = getQty(product.id);
                      const originalPrice = product.originalPrice || product.price;
                      const discountAmount = Math.max(0, originalPrice - product.price);

                      return (
                        <tr 
                          key={product.id}
                          className={`hover:bg-sand/30 transition-colors ${
                            idx % 2 === 0 ? 'bg-offwhite' : 'bg-sand/10'
                          }`}
                        >
                          {/* Col 1: Product Thumbnail & Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl bg-sand/30 border border-sand-border p-1 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <span className="text-[9px] font-mono uppercase font-bold text-botanical block">
                                  {product.category}
                                </span>
                                <Link
                                  href={`/products/${product.id}`}
                                  onClick={closeCatalogModal}
                                  className="font-bold text-charcoal hover:text-botanical hover:underline transition-colors block leading-tight line-clamp-1"
                                >
                                  {product.name}
                                </Link>
                                <span className="text-[10px] text-charcoal-muted line-clamp-1">
                                  {product.badges.join(' • ')}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Technical Spec */}
                          <td className="py-3 px-4 hidden md:table-cell max-w-sm">
                            <p className="text-[11px] text-charcoal-muted leading-relaxed line-clamp-2">
                              {product.scientificName}
                            </p>
                          </td>

                          {/* Col 3: Weight / Volume */}
                          <td className="py-3 px-3 text-center hidden sm:table-cell whitespace-nowrap">
                            <span className="font-mono text-[11px] bg-sand/40 px-2 py-0.5 rounded border border-sand-border text-charcoal">
                              {product.volumeOrWeight}
                            </span>
                          </td>

                          {/* Col 4: Wholesale Price */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <span className="font-serif font-bold text-sm text-botanical block">
                              {formatCurrency(product.price)}
                            </span>
                            <span className="text-[9px] text-emerald-700 font-medium block">
                              Save {formatCurrency(discountAmount)}
                            </span>
                          </td>

                          {/* Col 5: MSRP */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {product.originalPrice && product.originalPrice > product.price ? (
                              <span className="font-mono text-xs text-charcoal-muted line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            ) : (
                              <span className="text-charcoal-muted/50 font-mono text-xs">-</span>
                            )}
                          </td>

                          {/* Col 6: Order Qty Stepper */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center border border-sand-border rounded-lg bg-offwhite p-0.5">
                              <button
                                onClick={() => updateQty(product.id, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-sand/40 text-charcoal text-xs font-bold"
                              >
                                -
                              </button>
                              <span className="w-7 text-center font-mono font-bold text-xs">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateQty(product.id, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-sand/40 text-charcoal text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Col 7: Actions */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                  recentlyAddedId === product.id
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-botanical hover:bg-botanical-hover text-offwhite'
                                }`}
                              >
                                {recentlyAddedId === product.id ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                                <span>Add</span>
                              </button>

                              <button
                                onClick={() => handleSingleProductRFQ(product)}
                                className="p-1.5 rounded-lg bg-[#128C7E] hover:bg-[#0E7064] text-white transition-all"
                                title="WhatsApp RFQ"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* FOOTER SUMMARY & FLOATING B2B TRADE ACTIONS                                */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-sand/35 border-t border-sand-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs flex-shrink-0 print:border-none print:bg-white">
          {/* Trust Assurances */}
          <div className="flex flex-wrap items-center gap-4 text-charcoal-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-botanical flex-shrink-0" />
              <span><strong>100% Genuine OEM Standards</strong> • Factory Bench Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-botanical flex-shrink-0" />
              <span>Commercial Tax Invoice with <strong>GSTIN Input Credit</strong></span>
            </div>
          </div>

          {/* Quick Links & WhatsApp Dealer Desk */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end print:hidden">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl border border-sand-border bg-offwhite hover:bg-sand/40 text-charcoal text-xs font-semibold transition-colors"
            >
              {copiedLink ? '✓ Copied URL' : 'Copy Catalog Link'}
            </button>

            <Link
              href="/cart"
              onClick={closeCatalogModal}
              className="px-4 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-offwhite border border-white/20 text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-leaf" />
              <span>Review Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
            </Link>

            <a
              href="https://wa.me/918004922476?text=Hi%20AGROV%C3%89%20Team%2C%20I%20am%20interested%20in%20becoming%20an%20authorized%20dealer%20%2F%20bulk%20equipment%20buyer.%20Please%20share%20dealership%20terms."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-botanical hover:bg-botanical-hover text-offwhite text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Dealership Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
