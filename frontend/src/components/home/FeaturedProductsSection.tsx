'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { ProductCategory, Product } from '@/types';
import { ProductCard } from '../products/ProductCard';
import { QuickViewModal } from '../products/QuickViewModal';
import { useLanguageStore } from '@/store/languageStore';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Farm Machinery & Engines',
  'Agriculture Water Pumps',
  'Earth Augers & Boring',
  'Packaging & Bag Closers',
  'Cutting Tools & Consumables',
  'Power Equipment Spares'
];

export const FeaturedProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { t, openCatalogModal } = useLanguageStore();

  const filteredProducts = selectedCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  const getCategoryLabel = (cat: ProductCategory) => {
    switch (cat) {
      case 'All': return t('catAll') || 'All Equipment';
      case 'Farm Machinery & Engines': return t('catMachinery') || 'Farm Engines (170F)';
      case 'Agriculture Water Pumps': return t('catPumps') || 'Water Pumps (1.5", 2", 3")';
      case 'Earth Augers & Boring': return t('catAugers') || 'Earth Augers (85cc, 110cc)';
      case 'Packaging & Bag Closers': return t('catBagClosers') || 'Cordless Bag Closers';
      case 'Cutting Tools & Consumables': return t('catCutting') || 'Sawking™ Chains';
      case 'Power Equipment Spares': return t('catSpares') || 'Genuine Spares';
      default: return cat;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F5F7F1] text-[#252B27] relative border-b border-[#E2E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] text-xs uppercase tracking-wider font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Commercial Supply</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#252B27] leading-tight">
              Featured Machinery & Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-[#4E5550] mt-2">
              Heavy-duty power equipment engineered for continuous farm duty, orchard clearing, and grain packaging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCatalogModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#EAEFE6] border border-[#E2E6DF] text-[#245B37] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#245B37]" />
              <span>Download B2B Catalog</span>
            </button>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              <span>View All ({PRODUCTS.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Category Pill Filters (Balwaan/Agriwow style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer ${
                  isActive
                    ? 'bg-[#245B37] text-white border-[#245B37] shadow-sm font-bold'
                    : 'bg-white text-[#252B27] hover:bg-[#EAEFE6] border-[#E2E6DF]'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            );
          })}
        </div>

        {/* Clean White Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}

      </div>
    </section>
  );
};
