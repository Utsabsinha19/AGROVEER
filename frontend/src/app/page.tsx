import { HeroSection } from '@/components/home/HeroSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { Product3DShowcaseSection } from '@/components/home/Product3DShowcaseSection';
import { SparesFinderSection } from '@/components/products/SparesFinderSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { TrustAndCertificationsSection } from '@/components/home/TrustAndCertificationsSection';
import { FAQSection } from '@/components/home/FAQSection';
import { CTASection } from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Cinematic 3D Agricultural Landscape Hero */}
      <HeroSection />

      {/* 2. Arveer Impex Brand Heritage & 3 Engineering Pillars */}
      <BrandStorySection />

      {/* 3. Interactive 3D Machinery Inspection Station (360° Orbit & Hotspot Pins) */}
      <Product3DShowcaseSection />

      {/* 4. Visual Spare Parts Compatibility Engine (Zero Guesswork Guarantee) */}
      <SparesFinderSection />

      {/* 5. Flagship Machinery & Consumables Catalog */}
      <FeaturedProductsSection />

      {/* 6. Dealership Proof, Field Testimonials & Certifications */}
      <TrustAndCertificationsSection />

      {/* 7. Commercial Technical & GST FAQ */}
      <FAQSection />

      {/* 8. B2B Dealership & Order Dispatch CTA */}
      <CTASection />
    </div>
  );
}
