'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe2, 
  MapPin, 
  Check, 
  ChevronDown, 
  Sparkles,
  Compass
} from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  AGRICULTURAL_REGIONS, 
  SupportedLanguage 
} from '@/lib/translations';
import { useLanguageStore } from '@/store/languageStore';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { 
    currentLanguage, 
    setLanguage, 
    detectedRegion, 
    setRegion 
  } = useLanguageStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-xl transition-all duration-300 ${
          compact
            ? 'px-2.5 py-1.5 text-xs text-white bg-[#193B2F] hover:bg-[#20493A] border border-[rgba(166,201,106,0.3)] shadow-sm'
            : 'px-3 py-1.5 text-xs text-white bg-[#102C22] border border-[#A6C96A]/30 hover:border-[#A6C96A] shadow-sm'
        }`}
        style={{ backgroundColor: compact ? '#193B2F' : '#102C22' }}
        title="Select Language / Agro Region"
      >
        <span className="text-sm">{currentMeta.flag}</span>
        <span className="font-semibold">{currentMeta.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 text-[#A6C96A] ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-96 max-w-sm rounded-2xl bg-[#102C22] border border-[rgba(166,201,106,0.35)] shadow-2xl z-50 text-[#F7F5F0] p-4 animate-in fade-in slide-in-from-top-3 duration-200"
          style={{ backgroundColor: '#102C22' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-leaf" />
              <span className="font-serif font-bold text-sm text-offwhite">Language & Regional Agro Hub</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-leaf bg-botanical/30 px-2 py-0.5 rounded border border-leaf/30">
              Location-Aware
            </span>
          </div>

          {/* Real-time GPS Detection Button */}
          <div className="mb-3.5">
            <button
              onClick={async () => {
                const res = await useLanguageStore.getState().requestLiveLocation(true);
                if (res.success) {
                  setIsOpen(false);
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#24583D] hover:bg-[#1B4731] border border-[#A6C96A]/50 text-white text-xs font-bold flex items-center justify-between transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#A6C96A] animate-spin-slow" />
                <span>Auto-Detect via Real-Time GPS</span>
              </div>
              <span className="text-[10px] font-mono bg-black/20 text-[#A6C96A] px-1.5 py-0.5 rounded">
                1-Click
              </span>
            </button>
          </div>

          {/* Quick Agricultural Region Switcher (Location wise changing) */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sand/80 mb-2">
              <MapPin className="w-3.5 h-3.5 text-leaf" />
              <span>Location-Wise Agricultural Hubs:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {AGRICULTURAL_REGIONS.map((reg) => {
                const isSelected = detectedRegion?.id === reg.id;
                return (
                  <button
                    key={reg.id}
                    onClick={() => {
                      setRegion(reg.id);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-xl text-left transition-all text-[11px] border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-botanical/60 border-leaf text-offwhite font-semibold'
                        : 'bg-forest-900/60 border-white/10 text-sand/75 hover:bg-forest-900 hover:text-offwhite'
                    }`}
                  >
                    <span className="font-medium truncate">{reg.name}</span>
                    <span className="text-[9px] text-leaf truncate mt-0.5">{reg.cropFocus}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selection List */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] font-sans uppercase tracking-wider text-sand/60 block mb-2 font-bold">
              Available Languages ({SUPPORTED_LANGUAGES.length})
            </span>
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                      isActive
                        ? 'bg-botanical text-offwhite font-bold border border-leaf/40'
                        : 'hover:bg-white/5 text-sand/85 hover:text-offwhite'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div className="text-left">
                        <span className="font-semibold block">{lang.nativeName} ({lang.name})</span>
                        <span className="text-[10px] text-sand/50 block truncate max-w-[200px]">{lang.region}</span>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-leaf flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

