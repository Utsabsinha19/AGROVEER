'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  ArrowUpDown, 
  Check, 
  X, 
  Sparkles,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Tag
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

const BRANDS = ['All', 'Agroveer', 'Sawking'];

const OPERATING_TYPES = [
  { id: 'all', label: 'All Operating Types' },
  { id: '4stroke', label: '4-Stroke OHV Petrol' },
  { id: '2stroke', label: '2-Stroke Petrol' },
  { id: 'battery', label: 'Cordless / Battery Electric' },
  { id: 'consumable', label: 'Cutting Tools & Spares' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-8k', label: 'Under ₹8,000', min: 0, max: 7999 },
  { id: '8k-12k', label: '₹8,000 – ₹12,000', min: 8000, max: 12000 },
  { id: '12k-15k', label: '₹12,000 – ₹15,000', min: 12001, max: 15000 },
  { id: 'above-15k', label: 'Above ₹15,000', min: 15001, max: 999999 },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedOperatingType, setSelectedOperatingType] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialCategory, initialSearch]);

  useEffect(() => {
    setCatalogProducts(productService.getAllCatalogProducts());
    const handleUpdate = () => {
      setCatalogProducts(productService.getAllCatalogProducts());
    };
    window.addEventListener('agrove_products_updated', handleUpdate);
    return () => window.removeEventListener('agrove_products_updated', handleUpdate);
  }, []);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((item) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q) ||
        (item.scientificName && item.scientificName.toLowerCase().includes(q)) ||
        (item.sku && item.sku.toLowerCase().includes(q))
      );

      // 2. Category
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      // 3. Brand
      const matchesBrand = selectedBrand === 'All' || (
        selectedBrand === 'Sawking'
          ? (item.brand === 'Sawking' || item.name.toLowerCase().includes('sawking') || item.id.includes('sawking'))
          : (item.brand === 'Agroveer' || (!item.name.toLowerCase().includes('sawking') && !item.id.includes('sawking')))
      );

      // 4. Operating Type
      let matchesOperating = true;
      const combinedInfo = (item.name + ' ' + (item.scientificName || '') + ' ' + (item.detailedDescription || '') + ' ' + (item.description || '')).toLowerCase();
      if (selectedOperatingType === '4stroke') {
        matchesOperating = combinedInfo.includes('4-stroke') || combinedInfo.includes('4 stroke') || combinedInfo.includes('170f') || combinedInfo.includes('ohv');
      } else if (selectedOperatingType === '2stroke') {
        matchesOperating = combinedInfo.includes('2-stroke') || combinedInfo.includes('2 stroke') || combinedInfo.includes('85cc') || combinedInfo.includes('2t');
      } else if (selectedOperatingType === 'battery') {
        matchesOperating = combinedInfo.includes('cordless') || combinedInfo.includes('battery') || combinedInfo.includes('36v');
      } else if (selectedOperatingType === 'consumable') {
        matchesOperating = item.category === 'Cutting Tools & Consumables' || item.category === 'Power Equipment Spares';
      }

      // 5. Price Range
      let matchesPrice = true;
      if (selectedPriceRange !== 'all') {
        const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
        if (range && range.min !== undefined && range.max !== undefined) {
          matchesPrice = item.price >= range.min && item.price <= range.max;
        }
      }

      // 6. In-Stock
      const matchesInStock = !onlyInStock || item.inStock;

      return matchesSearch && matchesCategory && matchesBrand && matchesOperating && matchesPrice && matchesInStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [catalogProducts, searchQuery, selectedCategory, selectedBrand, selectedOperatingType, selectedPriceRange, sortBy, onlyInStock]);

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedBrand !== 'All',
    selectedOperatingType !== 'all',
    selectedPriceRange !== 'all',
    onlyInStock,
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedOperatingType('all');
    setSelectedPriceRange('all');
    setOnlyInStock(false);
  };

  return (
    <div className="pt-2 sm:pt-4 pb-20 bg-[#F5F7F1] text-[#252B27] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title Bar */}
        <div className="mb-6 pt-4 border-b border-[#E2E6DF] pb-5">
          <div className="flex items-center gap-2 text-xs text-[#767E78] mb-2 font-medium">
            <Link href="/" className="hover:text-[#245B37]">Home</Link>
            <span>/</span>
            <span className="text-[#245B37] font-semibold">Machinery Catalog</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#252B27] font-semibold">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#252B27] tracking-tight">
                {selectedCategory === 'All' ? 'Agricultural Machinery & Equipment' : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-[#4E5550] mt-1">
                Commercial engines, water pumps, earth augers, bag closers, and genuine replacement spares.
              </p>
            </div>

            {/* Quick Action Buttons on Right */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://wa.me/917352210000?text=Hello%20Arveer%20Impex%2C%20I%20am%20looking%20for%20machinery%20quotations%20and%20dealer%20pricing."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                WhatsApp Dealer Desk
              </a>
            </div>
          </div>
        </div>

        {/* Top Control Bar: Search Input, In-Stock Toggle, Sort Dropdown & Mobile Filter Button */}
        <div className="bg-white rounded-2xl border border-[#E2E6DF] p-3 sm:p-4 mb-6 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[#767E78] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model (170F, 85cc, WP-20, bag closer, chain)..."
              className="w-full bg-[#F5F7F1] border border-[#E2E6DF] focus:border-[#245B37] rounded-xl pl-10 pr-8 py-2 text-xs sm:text-sm text-[#252B27] placeholder-[#767E78] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#767E78] hover:text-[#252B27]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Actions & Sorting */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F7F1] border border-[#E2E6DF] text-xs font-bold text-[#252B27]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#245B37]" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {/* In-Stock Toggle */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                onlyInStock
                  ? 'bg-[#245B37] text-white border-[#245B37] shadow-xs'
                  : 'bg-[#F5F7F1] text-[#252B27] border-[#E2E6DF] hover:border-[#245B37]'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${onlyInStock ? 'bg-white border-white text-[#245B37]' : 'border-[#767E78]'}`}>
                {onlyInStock && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>In-Stock Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl px-3 py-2 text-xs text-[#252B27]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#245B37] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort machinery by"
                className="bg-transparent text-[#252B27] font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured">Sort: Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>

        </div>

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-white border border-[#E2E6DF] text-xs">
            <span className="font-bold text-[#4E5550]">Active Filters:</span>
            
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] font-semibold">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] font-semibold">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand('All')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedOperatingType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] font-semibold">
                Type: {OPERATING_TYPES.find(t => t.id === selectedOperatingType)?.label}
                <button onClick={() => setSelectedOperatingType('all')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedPriceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] font-semibold">
                Price: {PRICE_RANGES.find(p => p.id === selectedPriceRange)?.label}
                <button onClick={() => setSelectedPriceRange('all')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] font-semibold">
                In-Stock Only
                <button onClick={() => setOnlyInStock(false)} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAEFE6] text-[#245B37] font-semibold">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="ml-auto text-[#245B37] hover:underline font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Main Layout: Left Sidebar + Right Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Sidebar Filters (Desktop & Collapsible Mobile) */}
          <aside className={`md:col-span-4 lg:col-span-3 space-y-5 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
            
            <div className="bg-white rounded-2xl border border-[#E2E6DF] p-5 shadow-soft space-y-6">
              
              {/* Filter Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E6DF]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#245B37]" />
                  <h3 className="font-serif text-sm font-bold text-[#252B27] uppercase tracking-wider">
                    Filters
                  </h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="text-[11px] text-[#245B37] hover:underline font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#252B27] mb-2.5 flex items-center gap-1.5">
                  <span>Product Category</span>
                </h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-[#EAEFE6] text-[#245B37] font-bold'
                          : 'text-[#4E5550] hover:bg-[#F5F7F1] hover:text-[#252B27]'
                      }`}
                    >
                      <span className="truncate">{cat === 'All' ? 'All Categories' : cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-[#245B37] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Brand Filter */}
              <div className="pt-4 border-t border-[#E2E6DF]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#252B27] mb-2.5">
                  Brand / Division
                </h4>
                <div className="space-y-1">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedBrand === brand
                          ? 'bg-[#EAEFE6] text-[#245B37] font-bold'
                          : 'text-[#4E5550] hover:bg-[#F5F7F1] hover:text-[#252B27]'
                      }`}
                    >
                      <span>{brand === 'All' ? 'All Brands' : `${brand}™`}</span>
                      {selectedBrand === brand && <Check className="w-3.5 h-3.5 text-[#245B37] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Operating Type Filter */}
              <div className="pt-4 border-t border-[#E2E6DF]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#252B27] mb-2.5">
                  Operating / Engine Type
                </h4>
                <div className="space-y-1">
                  {OPERATING_TYPES.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setSelectedOperatingType(op.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedOperatingType === op.id
                          ? 'bg-[#EAEFE6] text-[#245B37] font-bold'
                          : 'text-[#4E5550] hover:bg-[#F5F7F1] hover:text-[#252B27]'
                      }`}
                    >
                      <span className="truncate">{op.label}</span>
                      {selectedOperatingType === op.id && <Check className="w-3.5 h-3.5 text-[#245B37] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Price Range Filter */}
              <div className="pt-4 border-t border-[#E2E6DF]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#252B27] mb-2.5">
                  Price Range
                </h4>
                <div className="space-y-1">
                  {PRICE_RANGES.map((price) => (
                    <button
                      key={price.id}
                      onClick={() => setSelectedPriceRange(price.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedPriceRange === price.id
                          ? 'bg-[#EAEFE6] text-[#245B37] font-bold'
                          : 'text-[#4E5550] hover:bg-[#F5F7F1] hover:text-[#252B27]'
                      }`}
                    >
                      <span>{price.label}</span>
                      {selectedPriceRange === price.id && <Check className="w-3.5 h-3.5 text-[#245B37] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Assistance Banner in Sidebar */}
            <div className="p-4 rounded-2xl bg-[#EAEFE6] border border-[#245B37]/20 text-xs">
              <span className="font-bold text-[#245B37] block mb-1">Need Dealer Bulk Pricing?</span>
              <p className="text-[#4E5550] mb-3 leading-snug">
                Contact our Bhiwandi central sales desk for container / pallet quantity discounts.
              </p>
              <a
                href="https://wa.me/917352210000?text=Hello%20Arveer%20Impex%2C%20I%20am%20requesting%20bulk%20container%2Fpallet%20dealer%20pricing."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#245B37] font-bold hover:underline flex items-center gap-1"
              >
                <span>WhatsApp: +91 73522 10000 &rarr;</span>
              </a>
            </div>

          </aside>

          {/* Right Column: Products Results Grid */}
          <main className="md:col-span-8 lg:col-span-9">
            
            {/* Results Count Header */}
            <div className="flex items-center justify-between text-xs text-[#767E78] mb-4">
              <span className="font-semibold text-[#252B27]">
                Showing {filteredProducts.length} Equipment Models
              </span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-white border border-[#E2E6DF] p-8">
                <p className="font-serif text-lg font-bold text-[#252B27] mb-2">
                  No machinery matches your selected filters
                </p>
                <p className="text-xs text-[#767E78] mb-6 max-w-sm mx-auto">
                  Try clearing some filter criteria, broadening your price range, or clearing the search text.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Show All Machinery ({PRODUCTS.length})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-24 text-center text-xs text-[#767E78] bg-[#F5F7F1] min-h-screen">
        Loading Agricultural Machinery Catalog...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
