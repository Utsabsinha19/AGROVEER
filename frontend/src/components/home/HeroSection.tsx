'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowRight, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';
import { SceneFallback } from '../3d/SceneFallback';
import { useLanguageStore } from '@/store/languageStore';

const HeroScene = dynamic(
  () => import('../3d/HeroScene').then((mod) => mod.HeroScene),
  { ssr: false, loading: () => <SceneFallback text="Rendering 3D Agricultural Landscape..." /> }
);

export const HeroSection = () => {
  const { t } = useLanguageStore();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-forest text-offwhite pt-10 sm:pt-14 pb-16">
      {/* 3D WebGL Background Scene */}
      <HeroScene />

      {/* Atmospheric Vignette strictly in Deep Forest Green (#102C22) */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />

      {/* Hero Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full text-center flex flex-col items-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-950/80 border border-sand/30 backdrop-blur-md mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <Sparkles className="w-3.5 h-3.5 text-leaf animate-pulse" />
          <span className="text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase text-sand font-semibold">
            {t('heroEyebrow')}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight max-w-5xl leading-[1.1] sm:leading-[1.08] mb-5 sm:mb-6 drop-shadow-md break-words">
          <span className="text-offwhite">
            {t('heroTitlePart1')}
          </span>{' '}
          <span className="italic font-serif text-sand font-normal">
            {t('heroTitlePart2')}
          </span>
        </h1>

        {/* Supporting Editorial Text in Warm Sand */}
        <p className="max-w-2xl text-sm sm:text-lg md:text-xl text-sand/90 font-sans font-normal leading-relaxed mb-8 sm:mb-12 px-2 sm:px-0">
          {t('heroSubtitle')}
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
          <Link
            href="/products"
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-botanical hover:bg-botanical-hover text-offwhite font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 border border-leaf/40 hover:border-leaf shadow-botanical hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 sm:gap-3 group"
          >
            <span>{t('heroExploreBtn')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-leaf" />
          </Link>

          <Link
            href="/about"
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-forest-950/60 hover:bg-forest-950 border border-sand/40 hover:border-sand text-sand hover:text-offwhite font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
          >
            <span>{t('heroStoryBtn')}</span>
          </Link>
        </div>

        {/* Live Metrics */}
        <div className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 max-w-3xl w-full">
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-forest-950/70 backdrop-blur-md border border-sand/20 text-left">
            <span className="block text-xl sm:text-3xl font-serif font-bold text-offwhite">+34%</span>
            <span className="text-[10px] sm:text-xs text-sand/80 font-medium mt-0.5 block">{t('heroYieldGain')}</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-forest-950/70 backdrop-blur-md border border-sand/20 text-left">
            <span className="block text-xl sm:text-3xl font-serif font-bold text-sand">-45%</span>
            <span className="text-[10px] sm:text-xs text-sand/80 font-medium mt-0.5 block">{t('heroWaterSave')}</span>
          </div>

          <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-forest-950/70 backdrop-blur-md border border-sand/20 text-left">
            <span className="block text-xl sm:text-3xl font-serif font-bold text-leaf">100%</span>
            <span className="text-[10px] sm:text-xs text-sand/80 font-medium mt-0.5 block">{t('heroOrganicCert')}</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <Link 
          href="/#story" 
          className="mt-12 flex flex-col items-center gap-2 text-sand/70 hover:text-offwhite text-[11px] tracking-widest uppercase transition-colors cursor-pointer group"
        >
          <span>Scroll to Explore Biological Science</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-leaf group-hover:translate-y-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
