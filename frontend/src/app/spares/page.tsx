import React from 'react';
import { SparesFinderSection } from '@/components/products/SparesFinderSection';

export const metadata = {
  title: 'Visual Spare Parts Compatibility Engine | Arveer Impex — Agroveer & Sawking',
  description: 'Instant spare parts compatibility finder for Agroveer 170F engines, 2" & 3" water pumps, 85cc earth augers, cordless bag closers, and Sawking cutting systems.',
};

export default function SparesPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#141A17] pt-28 sm:pt-36 pb-20">
      <SparesFinderSection />
    </div>
  );
}
