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
  Layers,
  Sparkles,
  Percent,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<'specs' | 'spares' | 'video'>('specs');
  const [addedSpares, setAddedSpares] = useState<Record<string, boolean>>({});

  if (!product) {
    return (
      <div className="pt-36 pb-24 text-center text-charcoal min-h-screen bg-offwhite">
        <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-charcoal-muted mb-6">The requested equipment model could not be located in the catalog.</p>
        <Link href="/products" className="px-6 py-3 rounded-xl bg-botanical text-offwhite font-semibold text-xs uppercase tracking-wider">
          Return to Machinery Catalog
        </Link>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  // Find compatible spare parts for this machine
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

  const whatsappInquiryUrl = `https://wa.me/918004922476?text=${encodeURIComponent(
    `Hello Arveer Impex Sales Desk,\n\nI want to order / inquire about this model:\n• Model: ${product.name}\n• Category: ${product.category}\n• Quantity: ${quantity} unit(s)\n• Unit Price: ${formatCurrency(product.price)} (incl. 5% GST)\n• Total Value: ${formatCurrency(product.price * quantity)}\n\nPlease confirm dispatch logistics and wholesale dealer discount for this volume.`
  )}`;

  return (
    <div className="pt-28 pb-24 bg-offwhite text-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-charcoal-muted mb-8">
          <Link href="/products" className="hover:text-botanical transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Machinery Catalog</span>
          </Link>
          <span>/</span>
          <span className="text-charcoal-muted/60">{product.category}</span>
          <span>/</span>
          <span className="text-charcoal font-semibold truncate">{product.name}</span>
        </div>

        {/* Top Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16">
          
          {/* Media Column (Image + Factory Video Option) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-sand-border shadow-card h-[400px] sm:h-[480px] p-6 flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-sand text-botanical text-xs font-bold border border-sand-border">
                  Arveer Impex Distribution
                </span>
                {product.videoUrl && (
                  <span className="px-3 py-1 rounded-full bg-botanical text-offwhite text-xs font-semibold flex items-center gap-1">
                    <Video className="w-3 h-3 text-leaf" />
                    <span>Factory Video</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sand/35 border border-sand-border flex items-center justify-between text-xs text-charcoal-muted">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-botanical" />
                <span>Heavy-duty freight crating & insurance included</span>
              </span>
              <span className="text-botanical font-semibold">In Stock: {product.inventoryCount} units</span>
            </div>
          </div>

          {/* Product Dossier & Buying Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Tagline */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-botanical font-bold">
                  {product.category}
                </span>
                <span className="text-charcoal-muted/40">•</span>
                <span className="text-xs text-charcoal-muted font-mono">Lot: AV-2026-IND</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                {product.name}
              </h1>

              <p className="text-xs font-mono text-botanical mt-1">
                {product.scientificName}
              </p>
            </div>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 py-2 border-y border-sand-border text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-charcoal">{product.rating}</span>
                <span className="text-charcoal-muted">({product.reviewCount} dealer reviews)</span>
              </div>
              <span className="text-sand-border">|</span>
              <span className="text-botanical font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
                <span>Verified Stock Ready for Dispatch</span>
              </span>
            </div>

            {/* Pricing & GST Breakdown */}
            <div className="p-4 rounded-2xl bg-sand/40 border border-sand-border space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-charcoal-muted">List Price (Excl. GST): </span>
                  <span className="text-sm font-mono font-bold text-charcoal">₹{exGstPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-charcoal">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-[10px] text-botanical block font-semibold">+5% GST Included</span>
                </div>
              </div>

              {/* Wholesale Tier Notice */}
              <div className="pt-2 border-t border-sand-border/60 flex items-center justify-between text-xs text-charcoal-muted">
                <span className="flex items-center gap-1 text-botanical font-medium">
                  <Percent className="w-3.5 h-3.5" />
                  <span>Wholesale Volume Discount: 5% off for 5+ units | 10% off for 10+ units</span>
                </span>
              </div>
            </div>

            {/* Key Fitment Notice: Pre-Sales Bottleneck Elimination */}
            <div className="p-3.5 rounded-xl bg-white border border-sand-border flex items-start gap-3 text-xs text-charcoal">
              <Wrench className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <strong className="block text-botanical">Standardized OEM Fitment Specifications:</strong>
                <span className="text-charcoal-muted text-[11px] leading-tight block mt-0.5">
                  Universal mounting bolt patterns, precision machined shafts, and matching replacement parts guaranteed in stock across India.
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector & Add to Order */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <div className="flex items-center bg-white border border-sand-border rounded-2xl p-1 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-charcoal-muted hover:text-charcoal hover:bg-sand/40 rounded-xl transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-mono font-bold text-sm text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-charcoal-muted hover:text-charcoal hover:bg-sand/40 rounded-xl transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-8 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border shadow-sm w-full ${
                  added
                    ? 'bg-leaf text-forest border-leaf'
                    : 'bg-botanical hover:bg-botanical-hover text-offwhite border-leaf/40 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added ({formatCurrency(product.price * quantity)})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order ({formatCurrency(product.price * quantity)})</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-2xl border transition-colors ${
                  isWishlisted
                    ? 'bg-botanical border-botanical text-offwhite shadow-sm'
                    : 'bg-sand/35 border-sand-border text-charcoal hover:text-botanical hover:bg-sand/60'
                }`}
                title="Save product"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <div className="pt-1">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire / Order via WhatsApp</span>
              </a>
            </div>

          </div>
        </div>

        {/* Tabbed In-Depth Information */}
        <div className="rounded-3xl bg-sand/30 border border-sand-border p-6 sm:p-10 mb-20 shadow-card">
          <div className="flex border-b border-sand-border gap-6 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                activeTab === 'specs' ? 'text-botanical font-bold' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Technical Specifications & Specs
              {activeTab === 'specs' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-botanical" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('spares')}
              className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'spares' ? 'text-botanical font-bold' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Compatible Spares & Attachments ({compatibleSparesList.length})</span>
              {activeTab === 'spares' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-botanical" />
              )}
            </button>

            {product.videoUrl && (
              <button
                onClick={() => setActiveTab('video')}
                className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'video' ? 'text-botanical font-bold' : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Factory Video & Demonstration</span>
                {activeTab === 'video' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-botanical" />
                )}
              </button>
            )}
          </div>

          {/* Tab 1: Technical Specifications */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-charcoal">Engineering Overview</h4>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  {product.detailedDescription}
                </p>

                <div className="space-y-2 pt-2">
                  <strong className="text-xs uppercase tracking-wider text-charcoal block">Key Build Advantages:</strong>
                  {product.keyBenefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs text-charcoal">
                      <CheckCircle2 className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-charcoal">Component Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {product.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-xl bg-white border border-sand-border">
                      <span className="text-[11px] text-charcoal-muted block">{spec.label}</span>
                      <span className="font-semibold text-charcoal block mt-0.5">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-xl bg-sand border border-sand-border">
                  <span className="text-[11px] uppercase font-bold text-botanical block mb-2">
                    Commercial Power & Output Ratings
                  </span>
                  <div className="divide-y divide-sand-border/80">
                    {product.composition.map((item, cIdx) => (
                      <div key={cIdx} className="py-2 flex items-center justify-between text-xs">
                        <span className="text-charcoal-muted">{item.name}</span>
                        <span className="font-mono font-bold text-charcoal">{item.percentage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Compatible Spare Parts & Attachments (Cross-Sell Engine) */}
          {activeTab === 'spares' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-border">
                <div>
                  <h4 className="font-serif text-lg font-bold text-charcoal">
                    Guaranteed Compatible Spare Parts & Attachments
                  </h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    100% precision fit for {product.name}. Add accessories or replacement spares directly to this order.
                  </p>
                </div>
                <Link
                  href="/spares"
                  className="text-xs font-bold text-botanical hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Full Spares Finder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {compatibleSparesList.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-sand-border">
                  <p className="text-xs text-charcoal-muted">All primary spares are cataloged in the centralized Spares Finder.</p>
                  <Link href="/spares" className="mt-3 inline-block px-4 py-2 rounded-xl bg-botanical text-offwhite text-xs font-bold uppercase">
                    Browse All Spares
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {compatibleSparesList.map((spare) => {
                    const isAdded = addedSpares[spare.id];
                    return (
                      <div
                        key={spare.id}
                        className="p-4 rounded-2xl bg-white border border-sand-border hover:border-sand-dark flex flex-col justify-between shadow-sm transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sand text-charcoal-muted">
                              {spare.sku}
                            </span>
                            <span className="text-[10px] text-botanical font-medium">
                              {spare.category}
                            </span>
                          </div>

                          <h5 className="font-serif font-bold text-xs sm:text-sm text-charcoal leading-snug">
                            {spare.name}
                          </h5>

                          <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
                            {spare.fitsDescription}
                          </p>

                          <div className="mt-3 pt-2 border-t border-sand-border/60 flex items-baseline justify-between text-xs">
                            <span className="text-charcoal-muted">Ex. GST: ₹{spare.priceExGst}</span>
                            <span className="font-serif font-bold text-botanical text-sm">
                              {formatCurrency(spare.priceGst)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-2 border-t border-sand-border flex gap-2">
                          <button
                            onClick={() => handleAddSpare(spare)}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              isAdded
                                ? 'bg-leaf text-forest'
                                : 'bg-botanical hover:bg-botanical-hover text-offwhite'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Order</span>
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

          {/* Tab 3: Factory Video & Demonstration */}
          {activeTab === 'video' && product.videoUrl && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <h4 className="font-serif text-lg font-bold text-charcoal">
                  Official Factory Walkaround & Quality Inspection
                </h4>
                <p className="text-xs text-charcoal-muted mt-1">
                  Authentic unboxing and build inspection footage from the Arveer Impex equipment receiving facility.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden bg-black border border-sand-border max-w-3xl mx-auto shadow-elevated">
                <video
                  controls
                  playsInline
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                  poster={product.image}
                >
                  <source src={product.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

        </div>

        {/* Related Machinery */}
        <div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal mb-8">
            Complementary Commercial Equipment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

