'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Quote, 
  TrendingUp, 
  CheckCircle2 
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
      subtitle: 'Statutory 5% GST & Full ITC',
      desc: 'Transparent commercial invoices with full input tax credit eligibility, transport LR tracking, and dedicated dealer WhatsApp support.'
    }
  ];

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-offwhite text-charcoal relative overflow-hidden border-t border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-botanical font-sans text-xs tracking-[0.25em] uppercase font-bold block mb-3">
            VERIFIED FIELD PERFORMANCE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal leading-tight mb-4">
            Trusted by Contractors, Orchards & Dealers
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base font-sans">
            Operating daily in high-demand agricultural estates, godowns, farm nurseries, and forestry timber clearing across India.
          </p>
        </div>

        {/* Testimonials Cards Grid on Warm Sand */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="p-8 rounded-3xl bg-sand/35 border border-sand-border hover:border-botanical/40 hover:bg-sand/50 transition-all duration-300 flex flex-col justify-between shadow-card relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1.5 text-xs text-botanical font-semibold bg-botanical/10 px-3 py-1 rounded-full border border-botanical/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{test.yieldGain}</span>
                  </div>
                  <Quote className="w-6 h-6 text-sand-dark" />
                </div>

                <p className="text-sm text-charcoal font-sans leading-relaxed italic mb-8">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-sand-border">
                <div className="w-12 h-12 rounded-full bg-[#102C22] text-[#A6C96A] font-bold text-sm flex items-center justify-center border-2 border-botanical/40 flex-shrink-0 shadow-sm">
                  {test.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal">{test.author}</h4>
                  <p className="text-xs text-botanical font-sans">{test.role}</p>
                  <p className="text-[11px] text-charcoal-muted">{test.farm}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Assurance & Industrial Standards Banner */}
        <div className="rounded-3xl bg-forest p-8 sm:p-12 border border-forest-800 text-offwhite shadow-elevated">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-leaf font-sans text-xs tracking-[0.25em] uppercase font-bold block mb-2">
              INDUSTRIAL MANUFACTURING STANDARDS
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-normal text-offwhite">
              Built for Demanding Agricultural Conditions
            </h3>
            <p className="text-sand/80 text-xs sm:text-sm mt-2">
              All Agroveer power units and Sawking cutting systems undergo rigorous torque, vibration, and continuous thermal testing before delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, cIdx) => (
              <div
                key={cIdx}
                className="p-6 rounded-2xl bg-forest-950/80 border border-white/10 hover:border-leaf/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-botanical/40 text-leaf flex items-center justify-center mb-4 border border-leaf/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-offwhite mb-1">{cert.name}</h4>
                <p className="text-[11px] text-leaf font-semibold uppercase tracking-wider mb-2">{cert.subtitle}</p>
                <p className="text-xs text-sand/75 font-sans leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
