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
  MessageCircle
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

  const whatsappInquiryUrl = `https://wa.me/918004922476?text=${encodeURIComponent(
    `Hello Arveer Impex Sales Desk,\nI am inquiring about / placing an order for:\n• Model: ${product.name}\n• Category: ${product.category}\n• Price: ${formatCurrency(product.price)} (incl. 5% GST)\nPlease provide dispatch schedule and wholesale dealer quotation.`
  )}`;

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F7F5F0] hover:bg-[#F0ECE1] border border-[rgba(166,201,106,0.18)] transition-all duration-300 hover:shadow-card hover:border-[#24583D]/50 flex flex-col justify-between">
      <div>
        {/* Product Image Window with Warm Field Sand Backdrop */}
        <div className="relative w-full h-56 sm:h-72 overflow-hidden bg-white/70 flex items-center justify-center border-b border-[rgba(166,201,106,0.15)]">
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

          {/* Brand Tags with Exact Palette Hex Codes */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
            {/* Sawking Gold Badge or Agroveer Power Tag */}
            {isSawking && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm bg-[#D4AF37]/15 text-[#9E7D17] border border-[#D4AF37]/40 backdrop-blur-md">
                Sawking™ German Quality
              </span>
            )}
            {isAgroveer && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm bg-[#D64527]/15 text-[#D64527] border border-[#D64527]/40 backdrop-blur-md">
                Agroveer™ Kisan Ki Pasand
              </span>
            )}

            {product.badges.slice(0, 1).map((badge, bIdx) => (
              <span
                key={bIdx}
                className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-[rgba(166,201,106,0.25)] text-[10px] uppercase tracking-wider font-semibold text-[#24583D] shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Quick Action Buttons (Wishlist & Quick View) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                isWishlisted
                  ? 'bg-[#24583D] text-[#F7F5F0] border border-[#24583D] shadow-sm'
                  : 'bg-white/90 text-[#141A17] hover:text-[#24583D] hover:bg-white border border-[rgba(166,201,106,0.2)]'
              }`}
              title={isWishlisted ? 'Remove from saved' : 'Save model'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {onQuickView && (
              <button
                onClick={handleQuickViewClick}
                className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#141A17] hover:text-[#24583D] border border-[rgba(166,201,106,0.2)] backdrop-blur-sm transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100"
                title="Quick preview"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 sm:p-6">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <span className="text-[11px] font-mono text-[#24583D] font-bold uppercase tracking-wider truncate">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-[#141A17] text-xs">{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`} className="block group/link">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#141A17] group-hover/link:text-[#24583D] transition-colors leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Model Code */}
          <p className="text-[11px] font-mono text-[#4F5D54] mt-1 line-clamp-1">
            {product.scientificName}
          </p>

          {/* Short Tagline */}
          <p className="text-xs text-[#4F5D54] mt-2 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Specs Highlights */}
          <div className="mt-4 pt-3 border-t border-[rgba(166,201,106,0.18)] grid grid-cols-2 gap-2 text-[11px]">
            {product.specs.slice(0, 2).map((spec, sIdx) => (
              <div key={sIdx} className="bg-white/80 p-1.5 rounded-lg border border-[rgba(166,201,106,0.15)]">
                <span className="text-[#78877D] block truncate">{spec.label}</span>
                <span className="font-semibold text-[#141A17] block truncate">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Call-to-Action Footer */}
      <div className="p-4 sm:p-6 pt-0">
        <div className="pt-3 border-t border-[rgba(166,201,106,0.18)] flex items-baseline justify-between mb-3 sm:mb-4">
          <div>
            <span className="text-[10px] text-[#78877D] block">{t('exGst') || 'List (Ex. GST)'}: ₹{product.exGstPrice || Math.round(product.price / 1.05)}</span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#141A17]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#78877D] line-through font-mono">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#24583D] font-semibold block">{t('gstIncluded') || '+5% GST Included'}</span>
          </div>

          <span className="text-[11px] text-[#24583D] font-medium bg-[#24583D]/10 px-2.5 py-1 rounded-full border border-[#24583D]/20">
            {t('inStock') || 'In Stock'}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2">
          {/* Primary CTA: Harvest Botanical Green (#24583D) with text #FFFFFF / #F7F5F0 */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border shadow-sm ${
              added
                ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A]'
                : 'bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] hover:text-[#FFFFFF] border-[#24583D] hover:border-[#A6C96A]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t('addedToQuote') || 'Added to Order'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#A6C96A]" />
                <span>{t('addToQuote') || 'Add to Order'}</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Action: WhatsApp Green (#25D366) */}
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors shadow-sm"
            title="Inquire directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </a>

          <Link
            href={`/products/${product.id}`}
            className="p-3 rounded-xl bg-white hover:bg-[#F7F5F0] text-[#141A17] hover:text-[#24583D] border border-[rgba(166,201,106,0.25)] transition-colors"
            title="View Specifications & Video"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
