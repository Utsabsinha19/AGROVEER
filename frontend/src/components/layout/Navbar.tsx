'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  Navigation,
  Home,
  Package,
  Eye,
  Wrench,
  Building2,
  Phone,
  ShieldCheck,
  ChevronRight,
  Globe2
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { useAuth } from '@/context/AuthContext';
import { LanguageSelector } from '../common/LanguageSelector';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const { items, toggleCart, wishlistIds } = useCartStore();
  const { openCatalogModal, detectedRegion, liveLocationInfo, openLocationModal, t } = useLanguageStore();
  const { profile, openAuthModal, logout } = useAuth();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Streamlined primary customer navigation links
  const navLinks = [
    { label: t('navProducts') || 'Machinery', href: '/products', icon: Package },
    { label: t('navJourney') || '3D Station', href: '/#showcase', icon: Eye },
    { label: t('navSpares') || 'Spares', href: '/spares', icon: Wrench },
    { label: t('navStory') || 'About', href: '/about', icon: Building2 },
    { label: t('navContact') || 'Dealership', href: '/contact', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg bg-[#102C22] select-none" style={{ backgroundColor: '#102C22' }}>

      {/* Top Utility & Announcement Bar in Deep Forest Slate (#0B1E17) */}
      <div
        className="w-full bg-[#0B1E17] text-[#F7F5F0] text-[10px] sm:text-[11px] font-sans tracking-wider py-1.5 px-3 sm:px-6 lg:px-8 border-b border-[rgba(166,201,106,0.18)]"
        style={{ backgroundColor: '#0B1E17' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Brand & Distributor Tagline */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A6C96A] animate-pulse shrink-0" />
            <span className="text-[#F7F5F0] font-semibold truncate">
              Arveer Impex — Importer & Distributor of Agroveer™ & Sawking™
            </span>
          </div>

          {/* Desktop Utility Group: Location, Language & WhatsApp */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Live Location Chip */}
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#14261F] hover:bg-[#1A332A] border border-[rgba(166,201,106,0.3)] text-[#F7F5F0] hover:text-[#A6C96A] text-[10px] lg:text-[11px] font-medium transition-colors cursor-pointer"
              title="Click to detect real-time GPS location or choose agricultural state"
            >
              <MapPin className="w-3 h-3 text-[#A6C96A] shrink-0" />
              <span className="max-w-[120px] lg:max-w-[150px] truncate">
                {liveLocationInfo?.city ? `${liveLocationInfo.city}, ` : ''}{detectedRegion?.state || 'Detect Location'}
              </span>
              {liveLocationInfo?.isRealGPS ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6C96A] animate-pulse shrink-0" title="Live GPS active" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Estimated location" />
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="shrink-0">
              <LanguageSelector compact />
            </div>

            {/* WhatsApp Direct Sales Link */}
            <a
              href="https://wa.me/917352210000?text=Hello%20Arveer%20Impex%20Team%2C%20I%20am%20inquiring%20about%20dealership%20terms%2C%20machinery%2C%20or%20spare%20parts."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#F7F5F0]/90 hover:text-[#A6C96A] transition-colors font-medium whitespace-nowrap pl-2 border-l border-white/10"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span className="hidden lg:inline">WhatsApp:</span>
              <span>+91 80049 22476</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Full-Width Navigation Bar */}
      <div
        className="w-full bg-[#102C22] border-b border-[rgba(166,201,106,0.2)]"
        style={{ backgroundColor: '#102C22' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">

          {/* Brand Logo & Distributor Line (Clickable Home Link) */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0" title="Agroveer & Sawking — Arveer Impex Home">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-[#14261F] flex items-center justify-center border border-[#A6C96A]/40 shadow-sm group-hover:scale-105 transition-transform shrink-0 p-1">
              <Image
                src="/logo.png"
                alt="Agroveer & Sawking"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-serif text-sm sm:text-base lg:text-lg font-bold tracking-tight text-[#F7F5F0] group-hover:text-[#E9E1CC] transition-colors whitespace-nowrap leading-none mb-0.5 sm:mb-1">
                <span className="text-[#D64527]">AGROVEER</span>{' '}
                <span className="font-sans text-[10px] sm:text-xs font-normal text-[#A6C96A]">&</span>{' '}
                <span className="text-[#D4AF37]">SAWKING</span>
              </span>
              <span className="text-[7.5px] sm:text-[9px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-[#E9E1CC] font-sans font-bold whitespace-nowrap leading-none truncate">
                Arveer Impex Distribution
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Clean, Spacious & Gracefully Responsive) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              // On 1024px-1180px screens, keep the top 4 primary customer links and let Dealership sit in Contact
              const isDealership = idx === 4;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${isDealership ? 'hidden xl:inline-block' : 'inline-block'
                    } ${isActive
                      ? 'text-[#A6C96A] bg-white/10 font-bold border border-[#A6C96A]/40 shadow-sm'
                      : 'text-white/90 hover:text-[#A6C96A] hover:bg-white/10'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Suite - Permanently Visible & Anchored */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto lg:ml-0">

            {/* Mobile / Small Screen Location Trigger */}
            <button
              type="button"
              onClick={openLocationModal}
              className="flex md:hidden items-center justify-center p-2 rounded-lg bg-[#14261F] hover:bg-[#1A332A] border border-[rgba(166,201,106,0.35)] text-white hover:text-[#A6C96A] transition-colors cursor-pointer"
              title="Change state / Detect GPS"
              aria-label="Location"
            >
              <MapPin className="w-4 h-4 text-[#A6C96A]" />
            </button>

            {/* B2B Catalog Download Button (Prominent on XL screens) */}
            <button
              onClick={openCatalogModal}
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#14261F] hover:bg-[#1A332A] border border-[rgba(166,201,106,0.35)] text-white hover:text-[#A6C96A] text-xs font-semibold tracking-wider whitespace-nowrap transition-colors shadow-sm cursor-pointer"
              title="Download Wholesale Machine Catalog & Price List"
            >
              <FileText className="w-3.5 h-3.5 text-[#A6C96A]" />
              <span className="text-[11px] whitespace-nowrap font-medium">{t('navCatalog') || 'B2B Catalog'}</span>
            </button>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg bg-[#14261F] hover:bg-[#1A332A] border border-[rgba(166,201,106,0.35)] text-white hover:text-[#A6C96A] transition-colors shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
              title="Saved Machinery & Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistIds.length > 0 ? 'text-[#D64527] fill-[#D64527]' : 'text-[#A6C96A]'}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D64527] text-white font-bold text-[8px] sm:text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#102C22]">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Buyer Account / Sign In */}
            {profile ? (
              <Link
                href="/account"
                className="hidden sm:flex items-center gap-1.5 p-1.5 pr-2.5 rounded-lg bg-[#14261F] hover:bg-[#1A332A] border border-[rgba(166,201,106,0.35)] text-white hover:text-[#A6C96A] transition-colors shadow-sm shrink-0 cursor-pointer"
                title={`${profile.fullName} • Buyer Account & Orders`}
                aria-label="Account"
              >
                <div className="w-6 h-6 rounded-md bg-[#24583D] text-[#A6C96A] flex items-center justify-center text-xs font-bold font-mono">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] font-semibold text-white/95 truncate max-w-[80px]">
                  {profile.fullName.split(' ')[0]}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6C96A]" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14261F] hover:bg-[#1A332A] border border-[rgba(166,201,106,0.35)] text-white hover:text-[#A6C96A] text-xs font-semibold tracking-wider whitespace-nowrap transition-colors shadow-sm cursor-pointer"
                title="Sign In or Register with Real-Time Neon OTP"
              >
                <User className="w-3.5 h-3.5 text-[#A6C96A]" />
                <span className="text-[11px] whitespace-nowrap font-medium">{t('navSignIn') || 'Sign In'}</span>
              </button>
            )}

            {/* Shopping Cart Trigger - ALWAYS VISIBLE, NEVER CUT OFF */}
            <button
              onClick={toggleCart}
              className="relative px-3 py-1.5 rounded-lg bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] border border-[#A6C96A]/50 shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
              aria-label="Open Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#A6C96A]" />
              <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">{t('navCart') || 'Cart'}</span>
              {itemCount > 0 && (
                <span className="bg-[#A6C96A] text-[#102C22] font-bold text-[10px] px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#F7F5F0] hover:bg-white/10 lg:hidden transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#A6C96A]" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden w-full bg-[#0E221B] border-t border-[rgba(166,201,106,0.2)] px-4 py-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-64px)] overflow-y-auto overscroll-contain"
            style={{ backgroundColor: '#0E221B' }}
          >
            <div className="max-w-7xl mx-auto flex flex-col space-y-2.5">

              {/* Mobile User Profile / Auth Bar */}
              {profile ? (
                <div className="p-3 rounded-2xl bg-[#14261F] border border-[rgba(166,201,106,0.25)] flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#24583D] text-[#A6C96A] flex items-center justify-center font-bold text-sm">
                      {profile.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-white block">{profile.fullName}</span>
                      <span className="text-[10px] text-[#A6C96A] font-mono block">{profile.role || 'Commercial Buyer'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('signin'); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#24583D] hover:bg-[#1B4731] border border-[#A6C96A]/50 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer mb-1"
                >
                  <User className="w-4 h-4 text-[#A6C96A]" />
                  <span>{t('navSignIn') || 'Sign In'} / Register with OTP</span>
                </button>
              )}

              {/* Mobile Real-Time Location Pill & GPS Trigger */}
              <div className="pb-2 border-b border-[rgba(166,201,106,0.15)]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLocationModal();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#14261F] border border-[rgba(166,201,106,0.35)] text-white text-xs font-semibold flex items-center justify-between hover:bg-[#1A332A] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-[#A6C96A] shrink-0" />
                    <span className="truncate">Location: <strong>{liveLocationInfo?.city ? `${liveLocationInfo.city}, ` : ''}{detectedRegion?.state || 'Detect GPS'}</strong></span>
                  </div>
                  <span className="text-[10px] font-mono bg-[#24583D] text-[#A6C96A] px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                    {liveLocationInfo?.isRealGPS ? 'GPS Live' : 'Change'}
                  </span>
                </button>
              </div>

              {/* Mobile Language Selector */}
              <div className="py-2 border-b border-[rgba(166,201,106,0.15)] flex items-center justify-between">
                <span className="text-xs text-[#E9E1CC]/80 font-medium">Regional Language:</span>
                <LanguageSelector compact />
              </div>

              {/* Main Navigation Links List */}
              <div className="py-2 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider text-[#F7F5F0] hover:bg-white/10 transition-colors font-semibold flex items-center justify-between ${pathname === '/' ? 'bg-[#24583D]/60 text-[#A6C96A] font-bold' : ''
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-[#A6C96A]" />
                    <span>{t('navHome') || 'Home'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                </Link>

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider text-[#F7F5F0] hover:bg-white/10 transition-colors font-semibold flex items-center justify-between ${isActive ? 'bg-[#24583D]/60 text-[#A6C96A] font-bold' : ''
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#A6C96A]" />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                    </Link>
                  );
                })}

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider text-[#F7F5F0] hover:bg-white/10 transition-colors font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#A6C96A]" />
                    <span>{t('navAdmin') || 'Admin Portal'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider text-[#F7F5F0] hover:bg-white/10 transition-colors font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-[#A6C96A]" />
                    <span>{t('navWishlist') || 'Saved Machinery & Wishlist'}</span>
                  </div>
                  {wishlistIds.length > 0 && (
                    <span className="bg-[#D64527] text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {wishlistIds.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider text-[#F7F5F0] hover:bg-white/10 transition-colors font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#A6C96A]" />
                    <span>{t('navAccount') || 'Buyer Account & Warranties'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                </Link>
              </div>

              {/* Mobile B2B Action Buttons */}
              <div className="pt-3 border-t border-[rgba(166,201,106,0.15)] flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCatalogModal();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#14261F] border border-[rgba(166,201,106,0.35)] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1A332A] cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#A6C96A]" />
                  <span>Download B2B Catalog</span>
                </button>

                <a
                  href="https://wa.me/917352210000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Sales Desk</span>
                </a>
              </div>

            </div>
          </div>
        )}
      </div>
    </header>
  );
};
