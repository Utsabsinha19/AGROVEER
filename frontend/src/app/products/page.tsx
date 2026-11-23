'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowUpDown, 
  Check, 
  X, 
  Sparkles 
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { productService } from '@/lib/productService';
import { ProductCategory, Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { QuickViewModal } from '@/components/products/QuickViewModal';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Farm Machinery & Engines',
  'Agriculture Water Pumps',
  'Earth Augers & Boring',
  'Packaging & Bag Closers',
  'Cutting Tools & Consumables',
  'Power Equipment Spares'
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    setCatalogProducts(productService.getAllCatalogProducts());
    const handleUpdate = () => {
      setCatalogProducts(productService.getAllCatalogProducts());
    };
    window.addEventListener('agrove_products_updated', handleUpdate);
    return () => window.removeEventListener('agrove_products_updated', handleUpdate);
  }, []);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesInStock = !onlyInStock || item.inStock;

      return matchesSearch && matchesCategory && matchesInStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [catalogProducts, searchQuery, selectedCategory, sortBy, onlyInStock]);

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F5F0] text-[#141A17] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Hero Header */}
        <div className="mb-12 border-b border-sand-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/40 border border-sand-border text-botanical text-xs uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Commercial Equipment & Machinery Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal mb-3">
            Heavy-Duty Agricultural Machinery
          </h1>
          <p className="text-charcoal-muted text-sm sm:text-base max-w-2xl font-sans">
            Explore our complete line of earth augers, centrifugal water pumps, 170F utility engines, cordless bag closers, and German-grade Sawking cutting systems.
          </p>
        </div>

        {/* Search, Filter & Sort Bar on Warm Sand */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-sand/35 p-4 rounded-2xl border border-sand-border mb-8 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search machinery, engines, augers, spares, or models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-offwhite border border-sand-border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:border-botanical"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* In-Stock Toggle */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                onlyInStock
                  ? 'bg-botanical text-offwhite border-botanical font-semibold shadow-sm'
                  : 'bg-offwhite text-charcoal border-sand-border hover:border-sand-dark'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${onlyInStock ? 'bg-offwhite border-offwhite text-botanical' : 'border-sand-dark'}`}>
                {onlyInStock && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>In-Stock Ready for Dispatch</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-offwhite border border-sand-border rounded-xl px-3 py-1.5 text-xs text-charcoal">
              <ArrowUpDown className="w-3.5 h-3.5 text-botanical" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort formulations by"
                className="bg-transparent text-charcoal focus:outline-none cursor-pointer pr-2"
              >
                <option value="featured">Sort: Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills on Warm Sand */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all duration-300 border ${
                  isActive
                    ? 'bg-botanical text-offwhite border-botanical font-semibold shadow-botanical'
                    : 'bg-sand/35 text-charcoal border-sand-border hover:bg-sand/60 hover:text-charcoal'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-charcoal-muted mb-6">
          <span>Showing {filteredProducts.length} verified machinery & equipment items</span>
          {(searchQuery || selectedCategory !== 'All' || onlyInStock) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlyInStock(false);
              }}
              className="text-botanical hover:underline flex items-center gap-1 font-semibold"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-sand/30 border border-sand-border">
            <p className="font-serif text-xl text-charcoal font-bold mb-2">No matching machinery found</p>
            <p className="text-xs text-charcoal-muted mb-6">Try clearing your search query or choosing another category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlyInStock(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-botanical text-offwhite font-semibold text-xs tracking-wider uppercase hover:bg-botanical-hover transition-colors shadow-sm"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </div>
  );
}
