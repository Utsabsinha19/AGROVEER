'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck,
  MessageCircle,
  Building2,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { formatCurrency } from '@/lib/utils';

export const CartDrawer = () => {
  const { t } = useLanguageStore();
  const { 
    items, 
    isCartOpen, 
    setCartOpen, 
    removeItem, 
    updateQuantity, 
    promoCode, 
    discountAmount, 
    promoError, 
    applyPromoCode, 
    removePromoCode, 
    getBaseExGstSubtotal,
    getGstAmount,
    getWholesaleTierInfo,
    getWholesaleDiscountAmount,
    getShippingCost, 
    getTotal,
    getFormattedWhatsAppOrderText
  } = useCartStore();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const baseExGst = getBaseExGstSubtotal();
  const tierInfo = getWholesaleTierInfo();
  const wholesaleDiscount = getWholesaleDiscountAmount();
  const gstAmount = getGstAmount();
  const shipping = getShippingCost();
  const total = getTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const success = applyPromoCode(inputCode);
    if (success) setInputCode('');
  };

  const whatsappOrderUrl = `https://wa.me/918004922476?text=${encodeURIComponent(getFormattedWhatsAppOrderText())}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen max-w-md bg-forest-900 border-l border-white/10 shadow-2xl flex flex-col text-sand">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-forest-950/80">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-botanical/60 border border-leaf/30 text-leaf">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="font-serif text-base sm:text-xl font-bold text-offwhite">
                  {t('cartTitle') || 'Equipment & Spares Order'}
                </h2>
                <p className="text-[11px] sm:text-xs text-sand/60">
                  {t('cartSubtitle') || 'Arveer Impex • Agroveer™ & Sawking™ Catalog'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1.5 sm:p-2 rounded-lg text-sand/60 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wholesale Volume Tier Banner */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-forest-950/90 border-b border-white/5 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 font-semibold text-leaf">
                <Percent className="w-3.5 h-3.5" />
                <span>{tierInfo.tierName}</span>
              </span>
              {tierInfo.qualifies && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-leaf/20 text-leaf border border-leaf/30 font-bold">
                  Active Tier
                </span>
              )}
            </div>

            {tierInfo.nextTierRemaining > 0 ? (
              <p className="text-[11px] text-sand/80">
                Add <strong className="text-offwhite">{tierInfo.nextTierRemaining} more unit(s)</strong> to unlock higher wholesale discount tier!
              </p>
            ) : (
              <p className="text-[11px] text-leaf/90">
                Maximum commercial wholesale discount unlocked for this order batch!
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-sand/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white">Your Order Schedule is Empty</h3>
                  <p className="text-xs text-sand/60 mt-1 max-w-xs">
                    Explore our heavy-duty machinery or search verified OEM replacement parts in the Spares Finder.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <Link
                    href="/products"
                    onClick={() => setCartOpen(false)}
                    className="w-full py-3 rounded-xl bg-botanical hover:bg-botanical-hover text-offwhite text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Browse Machinery Catalog
                  </Link>
                  <Link
                    href="/spares"
                    onClick={() => setCartOpen(false)}
                    className="w-full py-3 rounded-xl bg-forest-950 hover:bg-forest-800 border border-sand/30 text-sand text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Open Spares Compatibility Finder
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => {
                const exGstPrice = item.product.exGstPrice || Math.round(item.product.price / 1.05);
                return (
                  <div 
                    key={item.product.id + (item.selectedOption || '')}
                    className="p-4 rounded-2xl bg-forest-950/50 border border-white/5 flex gap-4 items-center"
                  >
                    <div className="relative w-16 h-16 rounded-xl bg-forest-900 border border-white/10 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-leaf">
                          {item.product.sku || 'OEM-MODEL'}
                        </span>
                        <span className="text-[10px] text-sand/60 truncate">
                          {item.product.category}
                        </span>
                      </div>

                      <h4 className="font-serif text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                        {item.product.name}
                      </h4>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-mono font-semibold text-sand">
                          ₹{exGstPrice}
                        </span>
                        <span className="text-[10px] text-sand/60">ex. GST</span>
                        <span className="text-xs font-bold text-leaf ml-auto">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-forest-900 border border-white/10 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-white/10 rounded text-sand/70 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono px-2 font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/10 rounded text-sand/70 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 text-sand/40 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Financial Matrix & Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-white/10 bg-forest-950/80 space-y-3 sm:space-y-4">
              
              {/* Promo / Dealer Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sand/40" />
                  <input
                    type="text"
                    placeholder="Enter Dealer Code (e.g. DEALER5)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-forest-900 border border-white/10 text-xs text-white placeholder-sand/40 focus:outline-none focus:border-leaf"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-xs font-bold text-sand transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-red-400">{promoError}</p>
              )}
              {promoCode && (
                <div className="flex items-center justify-between text-xs text-leaf">
                  <span>Applied: {promoCode}</span>
                  <button onClick={removePromoCode} className="underline text-[10px]">Remove</button>
                </div>
              )}

              {/* Financial Breakdown Table */}
              <div className="space-y-1.5 text-xs text-sand/80 pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span>{t('cartSubtotal') || 'Base Value (Excl. GST)'}</span>
                  <span className="font-mono">₹{baseExGst.toLocaleString('en-IN')}</span>
                </div>

                {wholesaleDiscount > 0 && (
                  <div className="flex justify-between text-leaf">
                    <span>Wholesale Bulk Discount</span>
                    <span className="font-mono">-₹{wholesaleDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-leaf">
                    <span>Promo Discount</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t('cartGst') || 'Applicable GST (+5%)'}</span>
                  <span className="font-mono">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t('cartShipping') || 'Freight Logistics'}</span>
                  <span className="font-mono">
                    {shipping === 0 ? <span className="text-leaf font-bold">FREE FREIGHT</span> : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-serif font-bold text-offwhite pt-2 border-t border-white/10">
                  <span>{t('cartTotal') || 'Total Payable (Incl. GST)'}</span>
                  <span className="text-leaf">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* 1-Click WhatsApp B2B Dispatcher */}
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-botanical hover:bg-botanical-hover text-offwhite font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border border-leaf/40 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-leaf" />
                  <span>{t('orderWhatsApp') || 'Dispatch PO via WhatsApp'}</span>
                </a>

                {/* Secure Gateway Checkout */}
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 border border-sand/30 text-sand hover:text-offwhite font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t('cartCheckout') || 'Proceed to Proforma & Gateway'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-sand/60 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-leaf" />
                <span>Authorized Distribution by Arveer Impex • GST Invoicing</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
