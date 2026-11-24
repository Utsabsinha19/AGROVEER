'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  FileText,
  MessageCircle,
  Heart,
  User,
  LogOut,
  MapPin,
  Search,
  Package,
  Wrench,
  Building2,
  Phone,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { useAuth } from '@/context/AuthContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { PRODUCTS } from '@/data/products';
import { formatCurrency } from '@/lib/utils';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { items, toggleCart, wishlistIds } = useCartStore();
  const { openCatalogModal, detectedRegion, liveLocationInfo, openLocationModal, t } = useLanguageStore();
  const { profile, openAuthModal, logout } = useAuth();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Quick search autocomplete results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.scientificName && p.scientificName.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery]);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  // Machinery Category Bar Links
  const categoryLinks = [
    { label: 'All Machinery', href: '/products' },
    { label: 'Power Engines (170F)', href: '/products?category=Farm+Machinery+%26+Engines' },
    { label: 'Water Pumps', href: '/products?category=Agriculture+Water+Pumps' },
    { label: 'Earth Augers', href: '/products?category=Earth+Augers+%26+Boring' },
    { label: 'Brush Cutters & Weeders', href: '/products?search=brush+cutter' },
    { label: 'Sawking™ Chains', href: '/products?category=Cutting+Tools+%26+Consumables' },
    { label: 'Bag Closers', href: '/products?category=Packaging+%26+Bag+Closers' },
    { label: 'Spare Parts Finder', href: '/spares' },
    { label: 'Dealership', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-white select-none">
      
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR (Forest Green #245B37) */}
      <div className="w-full bg-[#245B37] text-[#F5F7F1] text-[11px] font-sans py-1.5 px-3 sm:px-6 lg:px-8 border-b border-[#1C472B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Tagline / Certified Distribution */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#6FAF45] animate-pulse shrink-0" />
            <span className="font-medium truncate text-white/95">
              Arveer Impex — Importer & Nationwide Distributor of <strong className="text-[#E99A32]">Agroveer™</strong> & <strong className="text-white">Sawking™</strong>
            </span>
          </div>

          {/* Desktop Utility Items */}
          <div className="hidden md:flex items-center gap-4 shrink-0 text-white/90">
            {/* Real-time Location / GPS Chip */}
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-medium transition-colors cursor-pointer"
              title="Click to detect real-time GPS location or choose agricultural state"
            >
              <MapPin className="w-3 h-3 text-[#6FAF45] shrink-0" />
              <span className="max-w-[130px] truncate">
                {liveLocationInfo?.city ? `${liveLocationInfo.city}, ` : ''}{detectedRegion?.state || 'Select State'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6FAF45] shrink-0" />
            </button>

            {/* Regional Language Selector */}
            <div className="shrink-0">
              <LanguageSelector compact />
            </div>

            {/* WhatsApp Sales & Support Hotline */}
            <a
              href="https://wa.me/917352210000?text=Hello%20Arveer%20Impex%20Sales%20Desk%2C%20I%20am%20inquiring%20about%20machinery%20pricing%20and%20dealership."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-[#6FAF45] transition-colors font-medium whitespace-nowrap pl-3 border-l border-white/20"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span className="hidden lg:inline">Helpline:</span>
              <span className="font-bold">+91 73522 10000</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER BAR (Surface: Pure White #FFFFFF) */}
      <div className="w-full bg-white border-b border-[#E2E6DF]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0" title="Agroveer & Sawking — Arveer Impex Home">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#F5F7F1] flex items-center justify-center border border-[#E2E6DF] shadow-sm group-hover:scale-105 transition-transform shrink-0 p-1">
              <Image
                src="/logo.png"
                alt="Agroveer & Sawking Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-[#252B27] group-hover:text-[#245B37] transition-colors leading-none mb-1">
                <span className="text-[#245B37]">AGROVEER</span>{' '}
                <span className="font-sans text-xs font-normal text-[#6FAF45]">&</span>{' '}
                <span className="text-[#D4AF37]">SAWKING</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#4E5550] font-sans font-semibold leading-none truncate">
                Agricultural Power Equipment
              </span>
            </div>
          </Link>

          {/* Center: Search Bar with Autocomplete (Balwaan/Agriwow style) */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search farm machinery, water pumps, 170F engine, earth auger, spares..."
                className="w-full pl-11 pr-24 py-2.5 bg-[#F5F7F1] hover:bg-white focus:bg-white border-2 border-[#E2E6DF] focus:border-[#245B37] rounded-full text-xs sm:text-sm text-[#252B27] placeholder-[#767E78] transition-all shadow-inner focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#767E78] absolute left-4 pointer-events-none" />
              
              <button
                type="submit"
                className="absolute right-1 px-4 py-1.5 rounded-full bg-[#245B37] hover:bg-[#1C472B] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Live Autocomplete Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E2E6DF] overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="p-2 border-b border-[#E2E6DF] bg-[#F5F7F1] flex items-center justify-between text-[11px] text-[#4E5550] font-medium">
                  <span>Matching Machinery & Spares</span>
                  <span className="text-[#245B37] font-semibold">{searchResults.length} results</span>
                </div>
                <div className="divide-y divide-[#E2E6DF]">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setSearchFocused(false)}
                      className="p-3 flex items-center gap-3 hover:bg-[#F5F7F1] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#F5F7F1] border border-[#E2E6DF] relative shrink-0 overflow-hidden p-1">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#252B27] group-hover:text-[#245B37] truncate">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-[#767E78] truncate">{product.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#245B37]">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="block text-[9px] text-[#767E78]">+GST incl.</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/products?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchFocused(false)}
                  className="block p-2.5 text-center text-xs font-bold text-[#245B37] bg-[#F5F7F1] hover:bg-[#EAEFE6] transition-colors border-t border-[#E2E6DF]"
                >
                  View all results for &ldquo;{searchQuery}&rdquo; &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Right Action Suite (Wishlist, Account, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Wholesale Catalog PDF Download */}
            <button
              onClick={openCatalogModal}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F7F1] hover:bg-[#EAEFE6] border border-[#E2E6DF] text-[#245B37] text-xs font-semibold transition-colors cursor-pointer"
              title="Download Product Catalog & Dealer Price Sheet"
            >
              <FileText className="w-3.5 h-3.5 text-[#245B37]" />
              <span>B2B Catalog</span>
            </button>

            {/* Saved Machinery / Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl bg-[#F5F7F1] hover:bg-[#EAEFE6] border border-[#E2E6DF] text-[#252B27] hover:text-[#245B37] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Saved Machinery & Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistIds.length > 0 ? 'text-[#D64527] fill-[#D64527]' : 'text-[#4E5550]'}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D64527] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* User Account / Sign In */}
            {profile ? (
              <Link
                href="/account"
                className="hidden sm:flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#F5F7F1] hover:bg-[#EAEFE6] border border-[#E2E6DF] text-[#252B27] transition-colors shrink-0 cursor-pointer"
                title={`${profile.fullName} • Buyer Account & Warranties`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#245B37] text-white flex items-center justify-center text-xs font-bold">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#252B27] leading-none">
                    {profile.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-[#6FAF45] font-semibold leading-none mt-0.5">
                    {profile.role === 'DEALER' ? 'Dealer' : 'Buyer'}
                  </span>
                </div>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5F7F1] hover:bg-[#EAEFE6] border border-[#E2E6DF] text-[#252B27] hover:text-[#245B37] text-xs font-semibold transition-colors cursor-pointer"
                title="Buyer & Dealer Sign In"
              >
                <User className="w-4 h-4 text-[#245B37]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Shopping Cart Button (Vibrant & High Converting) */}
            <button
              onClick={toggleCart}
              className="relative px-3.5 py-2 rounded-xl bg-[#245B37] hover:bg-[#1C472B] text-white shadow-sm transition-all active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
              aria-label="Shopping Cart"
              title="View Cart & Quote"
            >
              <ShoppingBag className="w-4 h-4 text-[#6FAF45]" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {itemCount > 0 && (
                <span className="bg-[#E99A32] text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#F5F7F1] text-[#252B27] hover:text-[#245B37] border border-[#E2E6DF] md:hidden transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#245B37]" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar Row (Visible on small screens) */}
        <div className="md:hidden px-3 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search machinery, pump, auger..."
              className="w-full pl-9 pr-16 py-2 bg-[#F5F7F1] border border-[#E2E6DF] rounded-xl text-xs text-[#252B27] placeholder-[#767E78] focus:outline-none focus:border-[#245B37]"
            />
            <Search className="w-3.5 h-3.5 text-[#767E78] absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-1 rounded-lg bg-[#245B37] text-white text-[10px] font-bold uppercase"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 3. CATEGORY SUB-HEADER BAR (Horizontal Scrolling on Mobile) */}
      <div className="w-full bg-[#FFFFFF] border-b border-[#E2E6DF] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 h-10 sm:h-11 whitespace-nowrap">
          {categoryLinks.map((item, idx) => {
            const isActive = pathname === item.href || (item.href !== '/products' && pathname.includes(item.href));
            return (
              <Link
                key={idx}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-[#245B37] bg-[#EAEFE6] font-bold'
                    : 'text-[#4E5550] hover:text-[#245B37] hover:bg-[#F5F7F1]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-white border-b border-[#E2E6DF] px-4 py-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex flex-col space-y-3">
            
            {/* User Profile / Sign In */}
            {profile ? (
              <div className="p-3 rounded-xl bg-[#F5F7F1] border border-[#E2E6DF] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#245B37] text-white flex items-center justify-center font-bold text-sm">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#252B27] block">{profile.fullName}</span>
                    <span className="text-[10px] text-[#6FAF45] font-semibold block">{profile.role || 'Commercial Buyer'}</span>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg bg-white border border-[#E2E6DF] text-[#767E78] hover:text-[#D64527]"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal('signin'); }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#245B37] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-4 h-4 text-[#6FAF45]" />
                <span>Buyer & Dealer Sign In</span>
              </button>
            )}

            {/* Mobile Location Selector */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openLocationModal();
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#F5F7F1] border border-[#E2E6DF] text-xs font-semibold flex items-center justify-between text-[#252B27]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-[#245B37] shrink-0" />
                <span className="truncate">Delivery State: <strong>{liveLocationInfo?.city ? `${liveLocationInfo.city}, ` : ''}{detectedRegion?.state || 'Choose State'}</strong></span>
              </div>
              <span className="text-[10px] font-bold text-[#245B37] bg-white px-2 py-0.5 rounded border border-[#E2E6DF]">Change</span>
            </button>

            {/* Language Selector */}
            <div className="py-2 border-b border-[#E2E6DF] flex items-center justify-between">
              <span className="text-xs text-[#4E5550] font-medium">Select Language:</span>
              <LanguageSelector compact />
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {categoryLinks.map((cat, i) => (
                <Link
                  key={i}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-[#252B27] hover:bg-[#F5F7F1] flex items-center justify-between"
                >
                  <span>{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#767E78]" />
                </Link>
              ))}

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-[#252B27] hover:bg-[#F5F7F1] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#245B37]" />
                  <span>Admin Portal</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#767E78]" />
              </Link>
            </div>

            {/* Mobile Contact & WhatsApp */}
            <div className="pt-2 border-t border-[#E2E6DF] flex flex-col gap-2">
              <a
                href="https://wa.me/917352210000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Helpline (+91 73522 10000)</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
