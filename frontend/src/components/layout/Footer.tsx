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
  Cog, 
  Award,
  Phone,
  MapPin,
  MessageCircle,
  Truck,
  FileText
} from 'lucide-react';
import { LegalModal, LegalDocType } from './LegalModal';
import { useLanguageStore } from '@/store/languageStore';

export const Footer = () => {
  const { t, openCatalogModal } = useLanguageStore();
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
      <footer className="bg-[#1C472B] text-white border-t border-[#245B37] relative overflow-hidden">
        
        {/* Top Trust Pillars Banner */}
        <div className="border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8 bg-[#163822]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#6FAF45] shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">OEM Spares Guaranteed</h4>
                <p className="text-[11px] text-white/70">Over 500+ genuine spares in central stock</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#6FAF45] shrink-0">
                <Cog className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Super Easy Starter</h4>
                <p className="text-[11px] text-white/70">30-40% reduced pull resistance on engines</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#6FAF45] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Pan-India Freight</h4>
                <p className="text-[11px] text-white/70">Fast transport tracking across all districts</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#6FAF45] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">GST Invoicing & ITC</h4>
                <p className="text-[11px] text-white/70">5% & 18% official B2B commercial billing</p>
              </div>
            </div>

          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Brand Information */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-white/20 p-1 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Agroveer & Sawking Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold text-white tracking-tight leading-none mb-1">
                    <span>AGROVEER</span> <span className="text-[#6FAF45]">&</span> <span>SAWKING</span>
                  </span>
                  <span className="text-[10px] tracking-wider uppercase text-white/70 font-semibold leading-none">
                    Arveer Impex Distribution
                  </span>
                </div>
              </Link>

              <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                Direct container importer & master distributor for heavy-duty agricultural machinery, high-head irrigation pumps, 170F utility engines, and Sawking™ German-grade cutting tools.
              </p>

              <div className="space-y-2 pt-2 text-xs text-white/90">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#6FAF45] shrink-0 mt-0.5" />
                  <span>Central Distribution Hub: Bhiwandi Logistics Corridor, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#6FAF45] shrink-0" />
                  <span>Helpline & WhatsApp: +91 73522 10000</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#6FAF45] shrink-0" />
                  <span>Dealer Inquiries: sales@arveerimpex.com</span>
                </div>
              </div>
            </div>

            {/* Quick Machinery Links */}
            <div>
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
                Machinery
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li>
                  <Link href="/products?category=Farm+Machinery+%26+Engines" className="hover:text-white transition-colors">
                    170F 7.5 HP Petrol Engines
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Agriculture+Water+Pumps" className="hover:text-white transition-colors">
                    Agriculture Water Pumps (2" & 3")
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Earth+Augers+%26+Boring" className="hover:text-white transition-colors">
                    Earth Augers (85cc & 110cc)
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Cutting+Tools+%26+Consumables" className="hover:text-white transition-colors">
                    Sawking™ Chainsaw Chains
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Packaging+%26+Bag+Closers" className="hover:text-white transition-colors">
                    Cordless Bag Closers (36V)
                  </Link>
                </li>
                <li>
                  <Link href="/spares" className="hover:text-white transition-colors font-semibold text-[#6FAF45]">
                    OEM Spare Parts Finder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Dealer & Buyer Services */}
            <div>
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
                Dealership
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Apply for Dealership
                  </Link>
                </li>
                <li>
                  <button onClick={openCatalogModal} className="hover:text-white transition-colors text-left cursor-pointer">
                    Download Wholesale Catalog
                  </button>
                </li>
                <li>
                  <Link href="/account" className="hover:text-white transition-colors">
                    Buyer & Dealer Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-white transition-colors">
                    Warranty & GST FAQ
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/917352210000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors text-[#25D366] font-semibold"
                  >
                    WhatsApp Support Desk
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter & Dealer Updates */}
            <div>
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4">
                Dealer Bulletin
              </h4>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                Receive new container arrival notices, seasonal machinery discounts, and spare parts updates.
              </p>
              
              {subscribed ? (
                <div className="p-3 rounded-xl bg-white/10 border border-[#6FAF45] text-xs text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6FAF45]" />
                  <span>Subscribed to Dealer Bulletin!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email or WhatsApp"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#6FAF45]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-[#245B37] hover:bg-[#1E4A2E] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
            <p>
              © {new Date().getFullYear()} Arveer Impex. All rights reserved. Agroveer™ & Sawking™ are registered trade distribution marks.
            </p>

            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => setLegalModalType('privacy')} className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <button onClick={() => setLegalModalType('terms')} className="hover:text-white transition-colors cursor-pointer">
                Terms of Trade
              </button>
              <button onClick={() => setLegalModalType('msds')} className="hover:text-white transition-colors cursor-pointer">
                Mechanical Safety & CE
              </button>
              <button onClick={() => setLegalModalType('security')} className="hover:text-white transition-colors cursor-pointer">
                Data Security
              </button>
            </div>
          </div>

        </div>

      </footer>

      {/* Legal Modal */}
      {legalModalType && (
        <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
      )}
    </>
  );
};
