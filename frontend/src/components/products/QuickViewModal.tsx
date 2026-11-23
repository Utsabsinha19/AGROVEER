'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Star, 
  ArrowRight, 
  Plus, 
  Minus 
} from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product?.image || '/images/products/agroveer-170f-petrol-engine-pulley.jpg');

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-forest/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-offwhite border border-sand-border rounded-2xl sm:rounded-3xl shadow-elevated z-10 text-charcoal flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl bg-sand/80 text-charcoal hover:text-botanical hover:bg-sand border border-sand-border z-20 transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Product Media Column */}
        <div className="relative w-full md:w-1/2 h-72 md:h-auto min-h-[340px] bg-[#EFE9DC] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-sand-border">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6"
            onError={() => setImgSrc('/images/products/agroveer-170f-petrol-engine-pulley.jpg')}
          />
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[11px] uppercase tracking-widest text-botanical font-bold block mb-1">
              {product.category}
            </span>
            <p className="text-xs text-charcoal-muted font-mono">
              Packaging: {product.volumeOrWeight}
            </p>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-botanical text-xs">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-charcoal font-semibold">{product.rating}</span>
              <span className="text-charcoal-muted">({product.reviewCount} farm reviews)</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              {product.name}
            </h3>

            <p className="text-xs font-mono text-botanical">
              {product.scientificName}
            </p>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-serif font-bold text-botanical">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-charcoal-muted line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-charcoal-muted font-sans leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {product.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-sand/40 border border-sand-border text-[10px] uppercase font-bold tracking-wider text-botanical"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-sand-border space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-sand-border rounded-xl bg-sand/30 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-sand text-charcoal transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-mono font-bold text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-sand text-charcoal transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-xl bg-botanical hover:bg-botanical-hover text-offwhite border border-leaf/40 hover:border-leaf font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-leaf" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({formatCurrency(product.price * quantity)})</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href={`/products/${product.id}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-botanical hover:text-botanical-hover transition-colors py-1"
            >
              <span>View Full Dossier & Agronomic Trials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
