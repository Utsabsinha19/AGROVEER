'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  ShieldCheck, 
  Wrench, 
  Globe2, 
  Cog, 
  Award,
  Phone,
  MapPin,
  MessageCircle,
  Truck
} from 'lucide-react';
import { LegalModal, LegalDocType } from './LegalModal';
import { useLanguageStore } from '@/store/languageStore';

export const Footer = () => {
  const { t } = useLanguageStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <>
      <footer className="bg-forest-950 text-sand border-t border-white/10 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-leaf/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-botanical/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Value Banner */}
        <div className="border-b border-white/10 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-botanical/30 border border-leaf/30 flex items-center justify-center text-leaf flex-shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-offwhite">{t('footerOemSpares') || 'OEM Spares Guaranteed'}</h4>
                <p className="text-xs text-sand/60">{t('footerOemSparesDesc') || 'Over 500+ genuine parts in central stock'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-botanical/30 border border-leaf/30 flex items-center justify-center text-leaf flex-shrink-0">
                <Cog className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-offwhite">{t('footerEasyStarter') || 'Super Easy Starter'}</h4>
                <p className="text-xs text-sand/60">{t('footerEasyStarterDesc') || '30-40% reduced pull effort on engines'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-botanical/30 border border-leaf/30 flex items-center justify-center text-leaf flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-offwhite">{t('footerInsuredFreight') || 'Pan-India Freight'}</h4>
                <p className="text-xs text-sand/60">{t('footerInsuredFreightDesc') || 'Free commercial transport above ₹15,000'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-botanical/30 border border-leaf/30 flex items-center justify-center text-leaf flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-offwhite">{t('footerWarranty') || '1-Year Commercial Warranty'}</h4>
                <p className="text-xs text-sand/60">{t('footerWarrantyDesc') || 'Full factory warranty against defects'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            
            {/* Brand Info */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-3.5 group">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-forest-900 flex items-center justify-center border border-leaf/40 shadow-sm group-hover:scale-105 transition-transform p-1 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Agroveer & Sawking — Arveer Impex"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold tracking-tight text-offwhite group-hover:text-sand transition-colors">
                    AGROVEER <span className="font-sans text-sm font-normal text-leaf tracking-widest">&</span> SAWKING
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-sand/80 font-sans font-semibold">
                    Arveer Impex Distribution
                  </span>
                </div>
              </Link>

              <p className="text-xs sm:text-sm text-sand/80 max-w-sm leading-relaxed">
                {t('footerTagline') || 'Authorized Importer and Master Distributor of Agroveer™ Agriculture Machinery and Sawking™ German Cutting Systems.'}
              </p>

              <div className="space-y-2 text-xs text-sand/70">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-leaf shrink-0" />
                  <span>Central Distribution Warehouse: Machinery Yard, GIDC / Pan-India Hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-leaf shrink-0" />
                  <span>Wholesale Sales Desk: +91 80049 22476</span>
                </div>
              </div>
            </div>

            {/* Column 1: Machinery & Equipment */}
            <div>
              <h3 className="font-serif text-sm font-bold text-offwhite mb-4 tracking-wide">
                Agroveer™ Machinery
              </h3>
              <ul className="space-y-2 text-xs text-sand/70">
                <li>
                  <Link href="/products/agroveer-170f-engine-pulley" className="hover:text-leaf transition-colors">
                    170F 7.5 HP Engine with Pulley
                  </Link>
                </li>
                <li>
                  <Link href="/products/agroveer-2inch-water-pump-170f" className="hover:text-leaf transition-colors">
                    2" High-Pressure Water Pump
                  </Link>
                </li>
                <li>
                  <Link href="/products/agroveer-3inch-water-pump-170f" className="hover:text-leaf transition-colors">
                    3" High-Flow Water Pump
                  </Link>
                </li>
                <li>
                  <Link href="/products/agroveer-85cc-earth-auger-ea85" className="hover:text-leaf transition-colors">
                    EA-85 85CC Earth Auger
                  </Link>
                </li>
                <li>
                  <Link href="/products/agroveer-110cc-4stroke-earth-auger" className="hover:text-leaf transition-colors">
                    110CC 4-Stroke Earth Auger
                  </Link>
                </li>
                <li>
                  <Link href="/products/agroveer-cordless-bag-closer" className="hover:text-leaf transition-colors">
                    Cordless Bag Closer Machine
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Consumables & Spares */}
            <div>
              <h3 className="font-serif text-sm font-bold text-offwhite mb-4 tracking-wide">
                Sawking™ & Spares
              </h3>
              <ul className="space-y-2 text-xs text-sand/70">
                <li>
                  <Link href="/spares" className="text-leaf font-bold hover:underline flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    <span>Visual Spares Finder</span>
                  </Link>
                </li>
                <li>
                  <Link href="/products/sawking-super-gold-chainsaw-chain" className="hover:text-leaf transition-colors">
                    Super Gold TiN Chainsaw Chain
                  </Link>
                </li>
                <li>
                  <Link href="/products/sawking-super-silver-chainsaw-chain" className="hover:text-leaf transition-colors">
                    Super Silver Full-Chisel Chain
                  </Link>
                </li>
                <li>
                  <Link href="/products/sawking-german-trimmer-line-square" className="hover:text-leaf transition-colors">
                    German 3.0mm Square Trimmer Line
                  </Link>
                </li>
                <li>
                  <Link href="/products/sawking-metal-core-trimmer-line" className="hover:text-leaf transition-colors">
                    Metal-Core Trimmer Line
                  </Link>
                </li>
                <li>
                  <Link href="/products/agroveer-170f-recoil-starter-assembly" className="hover:text-leaf transition-colors">
                    7.5 HP Recoil Starter Assemblies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Dealer Circular & Newsletter */}
            <div>
              <h3 className="font-serif text-sm font-bold text-offwhite mb-4 tracking-wide">
                Dealer Circular & Prices
              </h3>
              <p className="text-xs text-sand/70 mb-4 leading-relaxed">
                Receive updated container arrival dates, master crate wholesale pricing, and seasonal demand circulars.
              </p>

              {subscribed ? (
                <div className="p-3 bg-botanical/30 border border-leaf/30 rounded-xl text-leaf text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Subscribed to Arveer Impex Dealer Circular.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-sand/40" />
                    <input
                      type="email"
                      required
                      placeholder="Enter dealer email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-forest-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-sand/40 focus:outline-none focus:border-leaf"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-botanical hover:bg-botanical-hover text-offwhite border border-leaf/40 hover:border-leaf font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Subscribe for Price Lists</span>
                    <ArrowRight className="w-3.5 h-3.5 text-leaf" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Credits & Legal Links */}
          <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand/50">
            <p>© {new Date().getFullYear()} Arveer Impex. {t('footerRights') || 'All Rights Reserved.'} • {t('footerGstVerified') || 'GST Registered Commercial Entity'}</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                onClick={() => setLegalModalType('terms')}
                className="hover:text-sand transition-colors underline-offset-4 hover:underline"
              >
                {t('footerTerms') || 'Terms of Supply'}
              </button>
              <button
                onClick={() => setLegalModalType('privacy')}
                className="hover:text-sand transition-colors underline-offset-4 hover:underline"
              >
                {t('footerPrivacy') || 'Privacy Policy'}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modal for Legal & Terms */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </>
  );
};
