'use client';

import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Lock } from 'lucide-react';

export type LegalDocType = 'terms' | 'msds' | 'privacy' | 'security' | null;

interface LegalModalProps {
  type: LegalDocType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    terms: {
      title: 'Commercial Machinery Supply Terms & Conditions',
      tagline: 'Enterprise Equipment Distribution, Warranty & Dispatch Standards',
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-sand/80 leading-relaxed">
          <p>
            <strong>1. Scope of Equipment Supply:</strong> AGROVÉ and Arveer Impex supply commercial agricultural machinery, powerheads, 170F utility engines, centrifugal water pumps, cordless bag closers, Sawking cutting consumables, and OEM-verified replacement spare parts.
          </p>
          <p>
            <strong>2. OEM Fitment & Quality Guarantee:</strong> All machines and spare parts leave our assembly and testing facilities fully calibrated and pre-inspected. Spare parts (carburetors, recoil starters, impellers, clutch bowls) are guaranteed to match standard OEM fitment tolerances.
          </p>
          <p>
            <strong>3. Safe Machinery Operation:</strong> Equipment must be operated in accordance with supplied user manuals. 2-stroke engines require proper 2T oil-to-petrol pre-mix ratios (25:1), and air filters must be kept clean to preserve cylinder life.
          </p>
          <p>
            <strong>4. Commercial Invoicing & GST:</strong> Invoices are settled in Indian Rupees (INR ₹) with statutory 5% GST and full Input Tax Credit (ITC) eligibility for registered businesses, machinery dealers, and contractors.
          </p>
        </div>
      ),
    },
    msds: {
      title: 'Technical Specifications & Mechanical Safety Standards',
      tagline: 'CE Machinery Directives, Material Integrity & Operator Guidelines',
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-sand/80 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-forest-950 border border-leaf/30 text-leaf flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span><strong>Safety Rating: Industrial Grade.</strong> Heavy-duty aluminum casting, heat-treated alloy gearing, and safety kill switches.</span>
          </div>
          <p>
            <strong>Materials & Build:</strong> Engines feature cast iron cylinder liners and forged crankshafts. Sawking trimmer lines are extruded from 100% virgin high-viscosity German copolymer polyamide resin with high thermal melt points.
          </p>
          <p>
            <strong>Operator Personal Protection:</strong> Eye protection, sturdy work boots, heavy gloves, and ear defenders are mandatory during operation of high-RPM earth augers, water pumps, and brush cutters.
          </p>
          <p>
            <strong>Transport & Fuel Safety:</strong> Drain fuel tanks prior to long-distance freight transit. Store machinery and trimmer line spools in dry environments away from direct thermal sources.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Commercial Dealer & Customer Privacy Policy',
      tagline: 'Commitment to Buyer Confidentiality and Secure Order Processing',
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-sand/80 leading-relaxed">
          <p>
            <strong>Dealership Data Protection:</strong> All dealership contact details, GST numbers, order volumes, and dispatch addresses are maintained strictly confidentially for order fulfillment and billing.
          </p>
          <p>
            <strong>Zero Third-Party Marketing:</strong> We never sell, lease, or share your company contact details or purchase histories to third-party marketing companies.
          </p>
          <p>
            <strong>Secure Communications:</strong> Direct WhatsApp support and order coordination channels are encrypted end-to-end.
          </p>
        </div>
      ),
    },
    security: {
      title: 'Commercial Payment & Serial Verification Protocol',
      tagline: 'Enterprise Transaction Protection & Authenticated Invoicing',
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-sand/80 leading-relaxed">
          <p>
            <strong>Payment Security:</strong> Payment workflows are handled through certified PCI-DSS Level 1 compliant gateway architecture (Razorpay Smart Gateway) with tokenized settlement and zero card number retention on AGROVÉ servers.
          </p>
          <p>
            <strong>Serial & Dispatch Verification:</strong> Each machinery shipment is recorded with its engine serial number and transport LR tracking number to ensure warranty validation and prevent counterfeit spares.
          </p>
        </div>
      ),
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-forest-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-sand">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-forest-950/70 text-sand/60 hover:text-white hover:bg-forest-950 border border-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-botanical/60 border border-leaf/30 text-leaf">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-leaf-light font-bold">
            AGROVÉ Official Documentation
          </span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
          {content?.title}
        </h3>
        <p className="text-xs text-sand-gold font-sans mb-6">
          {content?.tagline}
        </p>

        <div className="border-t border-white/10 pt-4 mb-6">
          {content?.body}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
          <span className="flex items-center gap-1.5 text-sand/60">
            <Lock className="w-3.5 h-3.5 text-leaf" />
            <span>Compliant with Indian & International Agricultural Standards</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-leaf hover:bg-leaf-light text-forest-950 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
