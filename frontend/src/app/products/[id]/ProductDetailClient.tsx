'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Check,
  Star,
  ArrowLeft,
  Plus,
  Minus,
  Truck,
  Wrench,
  Video,
  FileText,
  Sparkles,
  Percent,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  PackageCheck,
  Calendar,
  X
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { productService } from '@/lib/productService';
import { COMPATIBLE_SPARES } from '@/data/sparesCompatibility';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { ProductCard } from '@/components/products/ProductCard';

interface ProductDetailClientProps {
  productId: string;
}

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const product = productService.findProductById(productId) || PRODUCTS.find((p) => p.id === productId);

  const { addItem, toggleWishlist, isInWishlist } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'spares' | 'warranty' | 'video'>('specs');
  const [addedSpares, setAddedSpares] = useState<Record<string, boolean>>({});
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', city: '', state: '', quantity: 5, notes: '' });
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center text-[#252B27] min-h-screen bg-[#F5F7F1]">
        <h1 className="font-serif text-3xl font-bold mb-3">Equipment Not Found</h1>
        <p className="text-xs text-[#767E78] mb-6">The requested equipment model could not be located in the catalog.</p>
        <Link href="/products" className="px-6 py-3 rounded-xl bg-[#245B37] text-white font-semibold text-xs uppercase tracking-wider">
          Return to Machinery Catalog
        </Link>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const compatibleSparesList = useMemo(() => {
    return COMPATIBLE_SPARES.filter((s) => s.parentMachineIds.includes(product.id));
  }, [product.id]);

  const exGstPrice = product.exGstPrice || Math.round(product.price / 1.05);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddSpare = (spare: typeof COMPATIBLE_SPARES[0]) => {
    const spareProduct = {
      id: spare.id,
      sku: spare.sku,
      brand: spare.brand,
      name: spare.name,
      tagline: spare.fitsDescription,
      category: 'Power Equipment Spares' as any,
      price: spare.priceGst,
      exGstPrice: spare.priceExGst,
      gstRate: spare.gstRate,
      rating: 4.9,
      reviewCount: 28,
      image: spare.image,
      badges: ['OEM Guaranteed', spare.sku],
      inStock: true,
      inventoryCount: 100,
      description: spare.fitsDescription,
      detailedDescription: `Authentic OEM spare part for ${product.name}. Direct dispatch from Arveer Impex central warehouse.`,
      volumeOrWeight: '1 Unit',
      keyBenefits: ['100% Fitment Guarantee', 'Precision tolerance', 'Zero downtime'],
      composition: [{ name: 'Standard', percentage: 'OEM Specification' }],
      specs: [
        { label: 'SKU', value: spare.sku },
        { label: 'Parent Machine', value: product.name }
      ]
    };

    addItem(spareProduct, 1);
    setAddedSpares((prev) => ({ ...prev, [spare.id]: true }));
    setTimeout(() => {
      setAddedSpares((prev) => ({ ...prev, [spare.id]: false }));
    }, 2000);
  };

  const whatsappInquiryUrl = `https://wa.me/917352210000?text=${encodeURIComponent(
    `Hello Arveer Impex Sales Desk,\n\nI want to place an order / request a wholesale quote for:\n• Machinery Model: ${product.name}\n• Model SKU: ${product.sku || product.id}\n• Category: ${product.category}\n• Quantity: ${quantity} unit(s)\n• Total Price: ${formatCurrency(product.price * quantity)} (incl. GST)\n\nPlease provide dealer discount, transport ETA, and payment terms.`
  )}`;

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteModalOpen(false);
      setQuoteSuccess(false);
    }, 2500);
  };

  return (
    <div className="pt-4 sm:pt-6 pb-24 bg-[#F5F7F1] text-[#252B27] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#767E78] mb-6 font-medium">
          <Link href="/products" className="hover:text-[#245B37] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Machinery Catalog</span>
          </Link>
          <span>/</span>
          <span className="text-[#4E5550]">{product.category}</span>
          <span>/</span>
          <span className="text-[#252B27] font-semibold truncate">{product.name}</span>
        </div>

        {/* Top Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">

          {/* Left Media Column */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Primary Machinery Image */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E2E6DF] shadow-soft h-[380px] sm:h-[460px] p-6 flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6 hover:scale-105 transition-transform duration-300"
                priority
              />
              
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] text-xs font-bold border border-[#245B37]/30 shadow-xs">
                  {product.brand === 'Sawking' ? 'Sawking™ German Spec' : 'Agroveer™ Kisan Ki Pasand'}
                </span>
                {product.videoUrl && (
                  <span className="px-3 py-1 rounded-full bg-[#245B37] text-white text-xs font-semibold flex items-center gap-1 shadow-xs">
                    <Video className="w-3 h-3 text-[#6FAF45]" />
                    <span>Video Available</span>
                  </span>
                )}
              </div>
            </div>

            {/* Logistics & Stock Info Banner */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E6DF] flex items-center justify-between text-xs text-[#4E5550] shadow-xs">
              <span className="flex items-center gap-2 font-medium">
                <Truck className="w-4 h-4 text-[#245B37]" />
                <span>Pan-India Transport Freight Dispatch Available</span>
              </span>
              <span className="text-[#245B37] font-bold">In Stock ({product.inventoryCount} units)</span>
            </div>

          </div>

          {/* Right Product Dossier & Commercial Controls */}
          <div className="lg:col-span-6 space-y-5 bg-white rounded-3xl border border-[#E2E6DF] p-6 sm:p-8 shadow-soft">

            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#245B37] bg-[#EAEFE6] px-2.5 py-0.5 rounded">
                  {product.category}
                </span>
                <span className="text-[#767E78] font-mono">
                  SKU: {product.sku || 'AV-IND-2026'}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#252B27] leading-tight">
                {product.name}
              </h1>

              <p className="text-xs font-mono text-[#767E78] mt-1.5">
                {product.scientificName}
              </p>
            </div>

            {/* Rating & In-Stock Status */}
            <div className="flex items-center gap-4 py-2.5 border-y border-[#E2E6DF] text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-[#252B27]">{product.rating}</span>
                <span className="text-[#767E78] font-normal">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-[#E2E6DF]">|</span>
              <span className="text-[#245B37] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6FAF45] animate-pulse" />
                <span>Verified Stock Ready for Same-Day Dispatch</span>
              </span>
            </div>

            {/* Pricing & GST Breakdown Box */}
            <div className="p-4 rounded-2xl bg-[#F5F7F1] border border-[#E2E6DF] space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#767E78] block">List Price (Excl. GST):</span>
                  <span className="text-sm font-mono font-bold text-[#252B27]">₹{exGstPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-[#245B37]">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-[11px] text-[#6FAF45] block font-bold">
                    +{(product.gstRate ? product.gstRate * 100 : 5).toFixed(0)}% GST Included
                  </span>
                </div>
              </div>

              {/* Wholesale Volume Discount Tier */}
              <div className="pt-2 border-t border-[#E2E6DF] flex items-center justify-between text-xs text-[#4E5550]">
                <span className="flex items-center gap-1.5 text-[#245B37] font-semibold">
                  <Percent className="w-3.5 h-3.5 text-[#E99A32]" />
                  <span>Wholesale Discount: Extra 5% for 5+ units • 10% for 10+ units</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#4E5550] leading-relaxed">
              {product.description}
            </p>

            {/* Key Fitment Notice */}
            <div className="p-3.5 rounded-xl bg-[#F9FAF8] border border-[#E2E6DF] flex items-start gap-3 text-xs text-[#252B27]">
              <Wrench className="w-4 h-4 text-[#245B37] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#245B37]">Guaranteed Spare Parts Availability:</strong>
                <span className="text-[#4E5550] text-[11px] leading-tight block mt-0.5">
                  Universal mounting bolt patterns and 100% genuine replacement carburetors, recoils, and seals stocked in Bhiwandi.
                </span>
              </div>
            </div>

            {/* Commercial Order Actions */}
            <div className="space-y-3 pt-2">
              
              {/* Row 1: Quantity Stepper + Add to Cart + Wishlist */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl p-1 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-[#767E78] hover:text-[#252B27] rounded-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 font-mono font-bold text-sm text-[#252B27]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-[#767E78] hover:text-[#252B27] rounded-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm w-full cursor-pointer ${
                    added
                      ? 'bg-[#6FAF45] text-white'
                      : 'bg-[#245B37] hover:bg-[#1C472B] text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart ({formatCurrency(product.price * quantity)})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#6FAF45]" />
                      <span>Add to Cart ({formatCurrency(product.price * quantity)})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#245B37] border-[#245B37] text-white shadow-sm'
                      : 'bg-[#F5F7F1] border-[#E2E6DF] text-[#767E78] hover:text-[#245B37]'
                  }`}
                  title={isWishlisted ? 'Saved' : 'Save for later'}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-white' : ''}`} />
                </button>
              </div>

              {/* Row 2: Request Wholesale Quotation & Direct WhatsApp Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#E99A32] hover:bg-[#D68923] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Request Wholesale Quote</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed In-Depth Information Section */}
        <div className="rounded-3xl bg-white border border-[#E2E6DF] p-6 sm:p-10 mb-16 shadow-soft">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-[#E2E6DF] gap-6 mb-8 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'specs' ? 'text-[#245B37] font-bold' : 'text-[#767E78] hover:text-[#252B27]'
              }`}
            >
              Technical Specifications
              {activeTab === 'specs' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#245B37]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('spares')}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'spares' ? 'text-[#245B37] font-bold' : 'text-[#767E78] hover:text-[#252B27]'
              }`}
            >
              <Wrench className="w-4 h-4 text-[#245B37]" />
              <span>Compatible Spare Parts ({compatibleSparesList.length})</span>
              {activeTab === 'spares' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#245B37]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'warranty' ? 'text-[#245B37] font-bold' : 'text-[#767E78] hover:text-[#252B27]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#245B37]" />
              <span>Warranty & Transport Details</span>
              {activeTab === 'warranty' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#245B37]" />
              )}
            </button>

            {product.videoUrl && (
              <button
                onClick={() => setActiveTab('video')}
                className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'video' ? 'text-[#245B37] font-bold' : 'text-[#767E78] hover:text-[#252B27]'
                }`}
              >
                <Video className="w-4 h-4 text-[#245B37]" />
                <span>Video Demonstration</span>
                {activeTab === 'video' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#245B37]" />
                )}
              </button>
            )}
          </div>

          {/* Tab 1: Technical Specifications */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-200">
              <div className="space-y-4">
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#252B27]">
                  Detailed Engineering Overview
                </h4>
                <p className="text-xs sm:text-sm text-[#4E5550] leading-relaxed">
                  {product.detailedDescription}
                </p>

                <div className="space-y-2 pt-2">
                  <strong className="text-xs uppercase tracking-wider text-[#252B27] block">
                    Key Build Advantages:
                  </strong>
                  {product.keyBenefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs text-[#252B27]">
                      <CheckCircle2 className="w-4 h-4 text-[#245B37] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#252B27]">
                  Component Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {product.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-xl bg-[#F5F7F1] border border-[#E2E6DF]">
                      <span className="text-[10px] text-[#767E78] block">{spec.label}</span>
                      <span className="font-semibold text-[#252B27] block mt-0.5">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-xl bg-[#F5F7F1] border border-[#E2E6DF]">
                  <span className="text-[11px] uppercase font-bold text-[#245B37] block mb-2">
                    Commercial Power & Output Ratings
                  </span>
                  <div className="divide-y divide-[#E2E6DF]">
                    {product.composition.map((item, cIdx) => (
                      <div key={cIdx} className="py-2 flex items-center justify-between text-xs">
                        <span className="text-[#4E5550]">{item.name}</span>
                        <span className="font-mono font-bold text-[#252B27]">{item.percentage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Compatible Spare Parts */}
          {activeTab === 'spares' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E6DF]">
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#252B27]">
                    Guaranteed Compatible Spare Parts & Attachments
                  </h4>
                  <p className="text-xs text-[#4E5550] mt-0.5">
                    Precision fitment guaranteed for {product.name}. Add accessories or replacement spares directly to your order.
                  </p>
                </div>
                <Link
                  href="/spares"
                  className="text-xs font-bold text-[#245B37] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Full Spares Finder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {compatibleSparesList.length === 0 ? (
                <div className="p-8 text-center bg-[#F5F7F1] rounded-2xl border border-[#E2E6DF]">
                  <p className="text-xs text-[#767E78]">Universal consumable — use standard parts catalog.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {compatibleSparesList.map((spare) => {
                    const isAdded = addedSpares[spare.id];
                    return (
                      <div
                        key={spare.id}
                        className="p-4 rounded-2xl bg-[#F5F7F1] border border-[#E2E6DF] hover:border-[#245B37] transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-14 h-14 rounded-xl bg-white border border-[#E2E6DF] p-1 shrink-0 overflow-hidden">
                            <Image
                              src={spare.image}
                              alt={spare.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-[#767E78] block">SKU: {spare.sku}</span>
                            <h5 className="text-xs font-bold text-[#252B27] leading-tight line-clamp-2">
                              {spare.name}
                            </h5>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#E2E6DF] flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-[#245B37]">
                            ₹{spare.priceGst} <span className="text-[9px] text-[#767E78] font-normal">+GST</span>
                          </span>

                          <button
                            onClick={() => handleAddSpare(spare)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isAdded
                                ? 'bg-[#6FAF45] text-white'
                                : 'bg-[#245B37] hover:bg-[#1C472B] text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>Add Spare</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Warranty & Transport Details */}
          {activeTab === 'warranty' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#252B27]">
                Commercial Warranty & Pan-India Logistics
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-[#F5F7F1] border border-[#E2E6DF]">
                  <div className="w-9 h-9 rounded-xl bg-[#EAEFE6] text-[#245B37] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-[#252B27] mb-1">Standard Engine Warranty</h5>
                  <p className="text-[#4E5550] leading-relaxed">
                    6-month manufacturer warranty covering casting, OHV cylinder head defects, and drive shaft alignment. Full spare parts back-up nationwide.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F5F7F1] border border-[#E2E6DF]">
                  <div className="w-9 h-9 rounded-xl bg-[#EAEFE6] text-[#245B37] flex items-center justify-center mb-3">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-[#252B27] mb-1">Pan-India Transport</h5>
                  <p className="text-[#4E5550] leading-relaxed">
                    Dispatched from our Bhiwandi central logistics hub via V-Trans, TCI Freight, or Safechem with complete transport LR number tracking.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F5F7F1] border border-[#E2E6DF]">
                  <div className="w-9 h-9 rounded-xl bg-[#EAEFE6] text-[#245B37] flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-[#252B27] mb-1">GST Tax Invoicing</h5>
                  <p className="text-[#4E5550] leading-relaxed">
                    Clear commercial tax invoices with 5% or 18% GST itemization, allowing agricultural contractors and dealers full input tax credit claim.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Video Demonstration */}
          {activeTab === 'video' && product.videoUrl && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#252B27]">
                Operational Walkaround Video
              </h4>
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-w-3xl mx-auto">
                <video
                  src={product.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

        </div>

        {/* Related Machinery Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] mb-6">
              Complementary Agricultural Machinery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Request Wholesale Quotation Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setQuoteModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-[#E2E6DF]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E6DF] mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#252B27]">Request Wholesale Quote</h3>
                <p className="text-xs text-[#767E78]">{product.name}</p>
              </div>
              <button onClick={() => setQuoteModalOpen(false)} className="p-1 rounded-lg hover:bg-[#F5F7F1]">
                <X className="w-5 h-5 text-[#767E78]" />
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#245B37] mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#252B27]">Quotation Request Received!</h4>
                <p className="text-xs text-[#4E5550]">
                  Our sales desk will contact you with wholesale pricing, dealer tiers, and transport logistics.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#252B27] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs focus:outline-none focus:border-[#245B37]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#252B27] mb-1">Phone Number / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs focus:outline-none focus:border-[#245B37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#252B27] mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.city}
                      onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                      placeholder="e.g. Nagpur"
                      className="w-full px-3 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs focus:outline-none focus:border-[#245B37]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#252B27] mb-1">Estimated Units *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={quoteForm.quantity}
                      onChange={(e) => setQuoteForm({ ...quoteForm, quantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs focus:outline-none focus:border-[#245B37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer mt-2"
                >
                  Submit Quotation Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
