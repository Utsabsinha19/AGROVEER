'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ArrowLeft 
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    promoCode, 
    discountAmount, 
    promoError, 
    applyPromoCode, 
    removePromoCode, 
    getSubtotal, 
    getShippingCost, 
    getTotal 
  } = useCartStore();

  const [inputCode, setInputCode] = useState('');

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const success = applyPromoCode(inputCode);
    if (success) setInputCode('');
  };

  if (items.length === 0) {
    return (
      <div className="pt-28 sm:pt-36 pb-24 bg-offwhite text-charcoal min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 rounded-3xl bg-sand/40 border border-sand-border flex items-center justify-center text-charcoal-muted mx-auto mb-6">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal mb-3">
            Your Cart is Currently Empty
          </h1>
          <p className="text-charcoal-muted text-sm mb-8">
            Explore our heavy-duty earth augers, water pumps, 170F utility engines, and Sawking cutting systems.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-botanical text-offwhite font-bold text-xs uppercase tracking-wider hover:bg-botanical-hover transition-colors shadow-sm"
          >
            <span>Explore Machinery & Equipment</span>
            <ArrowRight className="w-4 h-4 text-leaf" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-offwhite text-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-sand-border">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
            Machinery & Equipment Cart ({items.length})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-charcoal-muted hover:text-red-500 transition-colors"
          >
            Clear Entire Bag
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 rounded-2xl bg-sand/35 border border-sand-border mb-8 max-w-4xl text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-charcoal">
              <Truck className="w-4 h-4 text-botanical" />
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-botanical">{formatCurrency(amountToFreeShipping)}</strong> more to qualify for <strong>Free Commercial Freight</strong>
                </span>
              ) : (
                <span className="text-botanical font-semibold">Congratulations! You unlocked Free Commercial Express Freight.</span>
              )}
            </span>
            <span className="text-charcoal-muted font-mono">{progressToFreeShipping}%</span>
          </div>
          <div className="w-full h-2 bg-sand-border rounded-full overflow-hidden">
            <div
              className="h-full bg-botanical rounded-full transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Items Table on Warm Sand */}
          <div className="lg:col-span-8 divide-y divide-sand-border bg-sand/30 rounded-3xl border border-sand-border p-6 shadow-sm">
            {items.map((item) => (
              <div key={item.product.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#EFE9DC] border border-sand-border flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-botanical tracking-wider">
                      {item.product.category}
                    </span>
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-serif text-base sm:text-lg font-bold text-charcoal hover:text-botanical transition-colors block"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-charcoal-muted mt-0.5">{item.product.volumeOrWeight}</p>
                    <p className="text-xs text-botanical font-semibold mt-1">
                      {formatCurrency(item.product.price)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-sand-border rounded-xl bg-offwhite p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-charcoal-muted hover:text-charcoal transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-charcoal">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-charcoal-muted hover:text-charcoal transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total price for this item */}
                  <span className="font-serif text-lg font-bold text-botanical min-w-[100px] text-right">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-charcoal-muted hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="lg:col-span-4 rounded-3xl bg-sand/35 border border-sand-border p-6 sm:p-8 space-y-6 shadow-card">
            <h3 className="font-serif text-xl font-bold text-charcoal">Order Summary</h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (AGROVE10 or WELCOME500)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full bg-offwhite border border-sand-border rounded-xl px-3 py-2 text-xs text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:border-botanical"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-botanical hover:bg-botanical-hover text-offwhite text-xs font-semibold rounded-xl border border-leaf/40 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[11px] text-red-500">{promoError}</p>}
              {promoCode && (
                <div className="flex items-center justify-between text-xs text-botanical bg-botanical/10 px-3 py-1.5 rounded-lg border border-botanical/20">
                  <span className="font-semibold">Applied: {promoCode}</span>
                  <button onClick={removePromoCode} className="text-charcoal-muted hover:text-charcoal text-[10px] underline">
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Financial Breakdown */}
            <div className="space-y-3 text-xs sm:text-sm text-charcoal pt-4 border-t border-sand-border">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Subtotal</span>
                <span className="font-semibold text-charcoal">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-botanical font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Freight Logistics</span>
                <span>{shipping === 0 ? <strong className="text-botanical">FREE</strong> : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold text-charcoal pt-4 border-t border-sand-border">
                <span>Total Due</span>
                <span className="text-botanical font-serif text-xl">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-2xl bg-botanical hover:bg-botanical-hover text-offwhite border border-leaf/40 hover:border-leaf font-bold text-sm tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-leaf group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Direct WhatsApp Share / Order Button */}
              <a
                href={`https://wa.me/918004922476?text=${encodeURIComponent(
                  `🛒 *AGROVÉ / Arveer Impex Equipment Order*\n` +
                  `Hello Agroveer Sales Team,\n` +
                  `I would like to order the following machinery & spares:\n\n` +
                  items.map((i, idx) => `${idx + 1}. ${i.product.name} (${i.product.volumeOrWeight}) × ${i.quantity} = ${formatCurrency(i.product.price * i.quantity)}`).join('\n') +
                  `\n\n*Total Due:* ${formatCurrency(total)}\n` +
                  `Please confirm dispatch schedule and GST commercial invoice.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Share Order to WhatsApp</span>
              </a>

              <Link
                href="/products"
                className="w-full py-3 text-center text-xs text-charcoal-muted hover:text-charcoal flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping Machinery</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
