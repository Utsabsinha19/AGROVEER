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

  const whatsappOrderUrl = `https://wa.me/917352210000?text=${encodeURIComponent(getFormattedWhatsAppOrderText())}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen max-w-md bg-white border-l border-[#E2E6DF] shadow-2xl flex flex-col text-[#252B27]">

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E2E6DF] flex items-center justify-between bg-[#F5F7F1]">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 rounded-xl bg-[#EAEFE6] text-[#245B37] border border-[#245B37]/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#252B27]">
                  Equipment & Spares Order
                </h2>
                <p className="text-[11px] text-[#767E78]">
                  Agroveer™ & Sawking™ Commercial Order
                </p>
              </div>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1.5 rounded-lg text-[#767E78] hover:text-[#252B27] hover:bg-white transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wholesale Volume Tier Banner */}
          <div className="px-4 sm:px-5 py-2.5 bg-[#EAEFE6] border-b border-[#E2E6DF] text-xs">
            <div className="flex items-center justify-between mb-0.5">
              <span className="flex items-center gap-1.5 font-bold text-[#245B37]">
                <Percent className="w-3.5 h-3.5 text-[#E99A32]" />
                <span>{tierInfo.tierName}</span>
              </span>
              {tierInfo.qualifies && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#245B37] border border-[#245B37]/30 font-bold">
                  Active Tier
                </span>
              )}
            </div>

            {tierInfo.nextTierRemaining > 0 ? (
              <p className="text-[11px] text-[#4E5550]">
                Add <strong className="text-[#252B27]">{tierInfo.nextTierRemaining} more unit(s)</strong> to unlock higher wholesale discount!
              </p>
            ) : (
              <p className="text-[11px] text-[#245B37] font-semibold">
                Maximum commercial wholesale discount unlocked for this order batch!
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F7F1] flex items-center justify-center text-[#767E78]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#252B27]">Your Order is Empty</h3>
                  <p className="text-xs text-[#767E78] mt-1 max-w-xs">
                    Explore heavy-duty agricultural equipment or find guaranteed compatible OEM replacement parts.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-xs pt-2">
                  <Link
                    href="/products"
                    onClick={() => setCartOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-white text-xs font-bold uppercase tracking-wider transition-colors text-center"
                  >
                    Browse Machinery
                  </Link>
                  <Link
                    href="/spares"
                    onClick={() => setCartOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-[#F5F7F1] hover:bg-[#EAEFE6] border border-[#E2E6DF] text-[#252B27] text-xs font-bold uppercase tracking-wider transition-colors text-center"
                  >
                    Open Spares Finder
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => {
                const exGstPrice = item.product.exGstPrice || Math.round(item.product.price / 1.05);
                return (
                  <div
                    key={item.product.id + (item.selectedOption || '')}
                    className="p-3.5 rounded-2xl bg-[#F5F7F1] border border-[#E2E6DF] flex gap-3.5 items-center"
                  >
                    <div className="relative w-16 h-16 rounded-xl bg-white border border-[#E2E6DF] overflow-hidden shrink-0 p-1">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-[#245B37] border border-[#E2E6DF]">
                          {item.product.sku || 'OEM'}
                        </span>
                        <span className="text-[10px] text-[#767E78] truncate">
                          {item.product.category}
                        </span>
                      </div>

                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#252B27] truncate mt-0.5">
                        {item.product.name}
                      </h4>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-mono font-semibold text-[#4E5550]">
                          ₹{exGstPrice}
                        </span>
                        <span className="text-[10px] text-[#767E78]">ex. GST</span>
                        <span className="text-xs font-bold text-[#245B37] ml-auto">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E2E6DF]">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 bg-white border border-[#E2E6DF] rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#F5F7F1] rounded text-[#767E78] hover:text-[#252B27] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono px-2 font-bold text-[#252B27]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#F5F7F1] rounded text-[#767E78] hover:text-[#252B27] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 text-[#767E78] hover:text-red-600 transition-colors cursor-pointer"
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
            <div className="p-4 sm:p-5 border-t border-[#E2E6DF] bg-[#F5F7F1] space-y-3">

              {/* Promo / Dealer Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#767E78]" />
                  <input
                    type="text"
                    placeholder="Dealer code (e.g. DEALER5)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E2E6DF] text-xs text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-red-600">{promoError}</p>
              )}

              {promoCode && (
                <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-xs text-green-800 flex items-center justify-between">
                  <span>Code <strong>{promoCode}</strong> applied (-{formatCurrency(discountAmount)})</span>
                  <button onClick={removePromoCode} className="text-red-600 font-bold ml-2">Remove</button>
                </div>
              )}

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-[#4E5550] pt-1">
                <div className="flex justify-between">
                  <span>List Subtotal (Excl. GST):</span>
                  <span className="font-mono text-[#252B27]">₹{baseExGst.toLocaleString('en-IN')}</span>
                </div>

                {wholesaleDiscount > 0 && (
                  <div className="flex justify-between text-[#245B37] font-semibold">
                    <span>Wholesale Volume Discount:</span>
                    <span className="font-mono">-₹{wholesaleDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST (Statutory 5% & 18%):</span>
                  <span className="font-mono text-[#252B27]">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Freight / Transport Dispatch:</span>
                  <span className="font-mono text-[#245B37] font-semibold">
                    {shipping === 0 ? 'FREE Freight' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-bold text-[#252B27] pt-2 border-t border-[#E2E6DF]">
                  <span>Total Payable:</span>
                  <span className="font-serif text-[#245B37] text-lg sm:text-xl">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Direct & Checkout */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 text-center"
                >
                  <span>Proceed to Commercial Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Order to WhatsApp Desk</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
