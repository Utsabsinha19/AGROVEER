'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Package, 
  Plus, 
  Minus,
  ExternalLink
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS } from '@/data/products';
import { productService } from '@/lib/productService';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

export function WishlistClient() {
  const { wishlistIds, toggleWishlist, addItem, setCartOpen } = useCartStore();
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setAllProducts(productService.getAllCatalogProducts());
  }, []);

  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));
  const recommendedProducts = allProducts.filter((p) => !wishlistIds.includes(p.id)).slice(0, 4);

  const getQty = (id: string) => quantities[id] || 1;

  const handleUpdateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = getQty(product.id);
    addItem(product, qty);
    setAddedNotice((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedNotice((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((p) => {
      addItem(p, getQty(p.id));
    });
    setCartOpen(true);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F5F0] text-[#141A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wishlist Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-[rgba(166,201,106,0.25)] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D64527] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#24583D] font-bold">
                Commercial Equipment Shortlist
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141A17]">
              Saved Machinery & Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#4F5D54] mt-1">
              Review saved equipment specifications, check active factory stock, and move directly to cart for road transport dispatch.
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddAllToCart}
                className="px-5 py-2.5 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4 text-[#A6C96A]" />
                <span>Move All to Cart ({wishlistProducts.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Grid */}
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {wishlistProducts.map((product) => {
              const qty = getQty(product.id);
              const isAdded = addedNotice[product.id];

              return (
                <div
                  key={product.id}
                  className="rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors z-10"
                    title="Remove from saved shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    {/* Image Canvas */}
                    <div className="relative w-full h-48 rounded-2xl bg-[#F7F5F0] overflow-hidden mb-4 p-2">
                      <Image
                        src={product.image || '/images/products/open-source-petrol-engine.jpg'}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/images/products/open-source-petrol-engine.jpg';
                        }}
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-[#102C22]/80 text-[#A6C96A] font-bold">
                        {product.sku}
                      </span>
                    </div>

                    {/* Category & Title */}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#24583D] font-bold block mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#141A17] line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#4F5D54] line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    {/* Specs Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono font-semibold">
                        HSN: {product.hsnCode}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#24583D]/10 text-[#24583D] font-bold">
                        GST: {product.gstRate}%
                      </span>
                      <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold">
                        In Stock ({product.inventoryCount || 50} units)
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Add to Cart Section */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="font-serif text-xl font-bold text-[#102C22]">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-[11px] text-[#4F5D54] block">
                          List Price (Incl. {product.gstRate}% GST)
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#24583D]">
                        MOQ: 1 Unit
                      </span>
                    </div>

                    {/* Interactive Quantity Stepper & Add to Cart */}
                    <div className="flex flex-wrap xs:flex-nowrap items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                        <button
                          onClick={() => handleUpdateQty(product.id, -1)}
                          className="px-2.5 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#141A17] min-w-[24px] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(product.id, 1)}
                          className="px-2.5 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                          isAdded
                            ? 'bg-green-700 text-white'
                            : 'bg-[#24583D] hover:bg-[#1B4731] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 text-[#A6C96A]" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Link to 3D Inspect */}
                    <div className="mt-3 text-center">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-[11px] font-semibold text-[#24583D] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Inspect 3D Geometry & Spares Fitment</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-[rgba(166,201,106,0.25)] shadow-sm mb-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#D64527] flex items-center justify-center mx-auto mb-2">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#141A17]">Your Wishlist is Empty</h2>
            <p className="text-xs sm:text-sm text-[#4F5D54] max-w-md mx-auto">
              Save earth augers, high-flow water pumps, 170F utility engines, and Sawking cutting chains to review specifications or plan seasonal farm inventory.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Explore Machinery Catalog →
              </Link>
            </div>
          </div>
        )}

        {/* Recommended Equipment Section with 1-Click Add to Cart */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(166,201,106,0.25)]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#24583D] font-bold block mb-1">
                Fast-Moving Commercial Inventory
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141A17]">
                Recommended Commercial Machinery
              </h3>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#24583D] hover:underline flex items-center gap-1"
            >
              <span>View All 16 Models</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((p) => {
              const inWishlist = wishlistIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-white border border-[rgba(166,201,106,0.25)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-36 rounded-xl bg-[#F7F5F0] overflow-hidden mb-3 p-2">
                      <Image
                        src={p.image || '/images/products/open-source-petrol-engine.jpg'}
                        alt={p.name}
                        fill
                        className="object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.src = '/images/products/open-source-petrol-engine.jpg';
                        }}
                      />
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                          inWishlist ? 'bg-red-50 text-red-600' : 'bg-white/80 text-gray-500 hover:text-red-500'
                        }`}
                        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#24583D] font-bold block mb-0.5">
                      {p.category}
                    </span>
                    <h4 className="font-serif font-bold text-[#141A17] text-sm line-clamp-1 mb-1">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-[#4F5D54] line-clamp-1 mb-2">
                      {p.volumeOrWeight}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-serif font-bold text-[#102C22] text-sm block">
                        {formatCurrency(p.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        addItem(p, 1);
                        setCartOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#24583D] hover:bg-[#1B4731] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3 text-[#A6C96A]" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

