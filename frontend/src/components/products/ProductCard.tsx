'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Heart,
  Eye,
  Check,
  Star,
  MessageCircle,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addItem, toggleWishlist, isInWishlist } = useCartStore();
  const { t } = useLanguageStore();
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imgError, setImgError] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const getCategoryFallback = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('auger') || c.includes('boring')) return '/images/products/open-source-earth-auger.jpg';
    if (c.includes('pump') || c.includes('water')) return '/images/products/open-source-water-pump.jpg';
    if (c.includes('brush') || c.includes('tiller') || c.includes('trimmer')) return '/images/products/arveer-28mm-9t-brush-cutter-tiller.jpg';
    if (c.includes('chain') || c.includes('sawking')) return '/images/products/open-source-chainsaw-chain.jpg';
    if (c.includes('bag') || c.includes('pack')) return '/images/products/open-source-cordless-bag-closer.jpg';
    return '/images/products/open-source-petrol-engine.jpg';
  };

  const isSawking = product.name.toLowerCase().includes('sawking') || product.id.includes('sawking');
  const isAgroveer = product.name.toLowerCase().includes('agroveer') || product.id.includes('agroveer');

  // Discount calculation
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const whatsappInquiryUrl = `https://wa.me/917352210000?text=${encodeURIComponent(
    `Hello Arveer Impex Sales Desk,\nI am inquiring about / requesting a quotation for:\n• Machinery Model: ${product.name}\n• SKU/Model Code: ${product.sku || product.id}\n• Category: ${product.category}\n• Price: ${formatCurrency(product.price)} (incl. GST)\nPlease provide dealer discount, availability, and dispatch schedule.`
  )}`;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white hover:border-[#245B37] border border-[#E2E6DF] transition-all duration-300 hover:shadow-card flex flex-col justify-between">
      <div>
        
        {/* Product Image Window (Clean Light Surface #F9FAF8) */}
        <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-[#F9FAF8] flex items-center justify-center border-b border-[#E2E6DF]">
          <Link href={`/products/${product.id}`} className="relative w-full h-full flex items-center justify-center p-4 sm:p-6">
            <Image
              src={imgError ? getCategoryFallback(product.category) : imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-4 sm:p-5 transition-transform duration-500 group-hover:scale-105"
              onError={() => {
                setImgError(true);
                setImgSrc(getCategoryFallback(product.category));
              }}
              priority={product.featured}
            />
          </Link>

          {/* Badges: Brand, Key Spec, Discount */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {discountPercent > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#E99A32] text-white shadow-sm">
                {discountPercent}% OFF
              </span>
            )}

            {isSawking && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF7E6] text-[#9E7D17] border border-[#D4AF37]/40 shadow-xs">
                Sawking™ German Spec
              </span>
            )}
            {isAgroveer && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0F7F2] text-[#245B37] border border-[#245B37]/30 shadow-xs">
                Agroveer™ Kisan Ki Pasand
              </span>
            )}

            {product.badges.slice(0, 1).map((badge, bIdx) => (
              <span
                key={bIdx}
                className="px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] uppercase tracking-wider font-semibold text-[#252B27] border border-[#E2E6DF] shadow-xs"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Top-Right Quick Action Icons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                isWishlisted
                  ? 'bg-[#245B37] text-white border-[#245B37] shadow-sm'
                  : 'bg-white text-[#4E5550] hover:text-[#245B37] border-[#E2E6DF] hover:border-[#245B37]'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-white' : ''}`} />
            </button>

            {onQuickView && (
              <button
                onClick={handleQuickViewClick}
                className="p-2 rounded-xl bg-white text-[#4E5550] hover:text-[#245B37] border border-[#E2E6DF] hover:border-[#245B37] transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Quick preview"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 sm:p-5">
          {/* Category & Model Code */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#245B37] bg-[#EAEFE6] px-2 py-0.5 rounded">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-[#252B27] text-xs">{product.rating}</span>
              <span className="text-[10px] text-[#767E78]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`} className="block group/link">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#252B27] group-hover/link:text-[#245B37] transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Model / Engineering Name */}
          <p className="text-[11px] font-mono text-[#767E78] mt-1 line-clamp-1">
            {product.sku ? `Model: ${product.sku} • ` : ''}{product.scientificName}
          </p>

          {/* Quick Technical Specs Grid */}
          <div className="mt-3 pt-2.5 border-t border-[#E2E6DF] grid grid-cols-2 gap-2 text-[11px]">
            {product.specs.slice(0, 2).map((spec, sIdx) => (
              <div key={sIdx} className="bg-[#F5F7F1] p-1.5 rounded-lg border border-[#E2E6DF]/60">
                <span className="text-[#767E78] block truncate text-[10px]">{spec.label}</span>
                <span className="font-semibold text-[#252B27] block truncate">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Call-to-Action Footer */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-[#E2E6DF] flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#245B37]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#767E78] line-through font-mono">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#4E5550]">
              <span>Ex. GST: ₹{product.exGstPrice || Math.round(product.price / 1.05)}</span>
              <span>•</span>
              <span className="text-[#6FAF45] font-semibold">+GST Included</span>
            </div>
          </div>

          <span className="text-[10px] font-bold text-[#245B37] bg-[#EAEFE6] px-2 py-1 rounded-full border border-[#245B37]/20">
            In Stock
          </span>
        </div>

        {/* Action Buttons: Add to Order / Cart & WhatsApp Enquire */}
        <div className="flex items-center gap-2">
          {/* Primary Action Button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 border shadow-sm cursor-pointer ${
              added
                ? 'bg-[#6FAF45] text-white border-[#6FAF45]'
                : 'bg-[#245B37] hover:bg-[#1C472B] text-white border-[#245B37]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#6FAF45]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Enquiry Action */}
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
            title="Inquire directly on WhatsApp"
            aria-label="WhatsApp Enquiry"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </a>

          {/* Direct Product Link */}
          <Link
            href={`/products/${product.id}`}
            className="p-2.5 rounded-xl bg-[#F5F7F1] hover:bg-[#EAEFE6] text-[#252B27] hover:text-[#245B37] border border-[#E2E6DF] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            title="View Specifications & Spares"
            aria-label="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
