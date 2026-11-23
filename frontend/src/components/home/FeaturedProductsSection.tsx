'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
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
      case 'Farm Machinery & Engines': return t('catMachinery') || 'Farm Machinery & Engines';
      case 'Agriculture Water Pumps': return t('catPumps') || 'Agriculture Water Pumps';
      case 'Earth Augers & Boring': return t('catAugers') || 'Earth Augers & Boring';
      case 'Packaging & Bag Closers': return t('catBagClosers') || 'Packaging & Bag Closers';
      case 'Cutting Tools & Consumables': return t('catCutting') || 'Cutting Tools & Consumables';
      case 'Power Equipment Spares': return t('catSpares') || 'Power Equipment Spares';
      default: return cat;
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-offwhite text-charcoal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Dark Charcoal Typography & Botanical Accents */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-botanical font-sans text-xs tracking-[0.25em] uppercase font-bold block mb-3">
              {t('catalogEyebrow')}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal leading-tight">
              {t('catalogHeading')}
            </h2>
            <p className="text-charcoal-muted text-sm sm:text-base font-sans mt-3">
              {t('catalogSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openCatalogModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sand/40 hover:bg-sand/60 border border-sand-border text-charcoal text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-botanical" />
              <span>{t('downloadCatalog')}</span>
            </button>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-botanical hover:text-botanical-hover transition-colors group"
            >
              <span>{t('viewFullCatalog')} ({PRODUCTS.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Category Pill Filters on Warm Sand */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 border ${
                  isActive
                    ? 'bg-botanical text-offwhite border-botanical font-semibold shadow-botanical'
                    : 'bg-sand/35 text-charcoal border-sand-border hover:bg-sand/60 hover:text-charcoal'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            );
          })}
        </div>

        {/* Editorial Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  );
};
