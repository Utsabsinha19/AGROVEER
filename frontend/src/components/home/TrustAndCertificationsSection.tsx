'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Quote, 
  CheckCircle2,
  Sparkles 
} from 'lucide-react';
import { TESTIMONIALS } from '@/data/testimonials';

export const TrustAndCertificationsSection = () => {
  const certifications = [
    {
      name: 'CE Machinery Safety Certified',
      subtitle: 'European Safety & Emissions Directive',
      desc: 'All Agroveer auger powerheads and 170F engines conform to international mechanical safety, vibration damping, and noise control standards.'
    },
    {
      name: '100% German Copolymer',
      subtitle: 'Sawking High-Impact Formulation',
      desc: 'Extruded from wear-resistant German polyamide resin to resist fraying, spool welding, and brittle snaps on stony agricultural terrain.'
    },
    {
      name: 'Guaranteed OEM Spares',
      subtitle: '100% Fitment & Availability',
      desc: 'Over 500+ genuine carburetors, recoil starters, pump seals, and gearheads stocked for immediate same-day transport dispatch.'
    },
    {
      name: 'GST Compliant B2B Billing',
      subtitle: 'Statutory 5% & 18% GST with Full ITC',
      desc: 'Transparent commercial invoices with full input tax credit eligibility, transport LR tracking, and dedicated dealer WhatsApp support.'
    }
  ];

  return (
    <section id="testimonials" className="py-12 sm:py-20 lg:py-24 bg-[#F5F7F1] text-[#252B27] relative border-b border-[#E2E6DF]">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#245B37] font-sans text-xs tracking-[0.25em] uppercase font-bold block mb-2">
            VERIFIED FIELD PERFORMANCE
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#252B27] leading-tight mb-3">
            Trusted by Farmers, Contractors & Machinery Dealers
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5550]">
            Operating daily in high-demand agricultural estates, godowns, nurseries, and forestry timber clearing across India.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-white border border-[#E2E6DF] hover:border-[#245B37] transition-all duration-300 flex flex-col justify-between shadow-soft"
            >
              <div>
                <Quote className="w-8 h-8 text-[#245B37]/30 mb-3" />
                <p className="text-xs sm:text-sm text-[#252B27] leading-relaxed italic mb-4">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E6DF] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#252B27]">{test.author}</h4>
                  <p className="text-[10px] text-[#767E78]">{test.role} • {test.location}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#EAEFE6] text-[#245B37]">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications & Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert, cIdx) => (
            <div
              key={cIdx}
              className="p-5 rounded-2xl bg-white border border-[#E2E6DF] hover:border-[#245B37] transition-all shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EAEFE6] text-[#245B37] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#252B27] mb-1">{cert.name}</h4>
              <span className="text-[10px] font-semibold text-[#6FAF45] block mb-2">{cert.subtitle}</span>
              <p className="text-[11px] text-[#4E5550] leading-snug">{cert.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
