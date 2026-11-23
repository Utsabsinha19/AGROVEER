'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Globe2, 
  X, 
  Check, 
  Search, 
  Loader2, 
  Sparkles, 
  Compass, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { AGRICULTURAL_REGIONS, SUPPORTED_LANGUAGES, RegionLocation } from '@/lib/translations';

export const LocationModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    closeLocationModal, 
    detectedRegion, 
    liveLocationInfo, 
    gpsStatus, 
    currentLanguage,
    setLanguage, 
    setRegion, 
    requestLiveLocation 
  } = useLanguageStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isLocationModalOpen) return null;

  const filteredRegions = AGRICULTURAL_REGIONS.filter((reg) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      reg.name.toLowerCase().includes(q) ||
      reg.state.toLowerCase().includes(q) ||
      reg.city?.toLowerCase().includes(q) ||
      reg.cropFocus.toLowerCase().includes(q) ||
      reg.stateAliases?.some((a) => a.toLowerCase().includes(q))
    );
  });

  const handleTriggerGPS = async () => {
    const res = await requestLiveLocation(true);
    if (res.success && res.region) {
      const targetLang = SUPPORTED_LANGUAGES.find((l) => l.code === res.region?.suggestedLang);
      setFeedback(`📍 GPS Location verified: ${res.region.city ? `${res.region.city}, ` : ''}${res.region.state}! Language automatically set to ${targetLang?.nativeName || 'Regional'}.`);
      setTimeout(() => {
        setFeedback(null);
        closeLocationModal();
      }, 2500);
    } else {
      setFeedback(res.error || 'Failed to acquire location. Please check browser permissions.');
    }
  };

  const handleSelectRegion = (reg: RegionLocation) => {
    setRegion(reg.id);
    setLanguage(reg.suggestedLang);
    const targetLang = SUPPORTED_LANGUAGES.find((l) => l.code === reg.suggestedLang);
    setFeedback(`📍 Region switched to ${reg.state}! Switched to ${targetLang?.nativeName}.`);
    setTimeout(() => {
      setFeedback(null);
      closeLocationModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0E221B] border border-[#A6C96A]/40 rounded-3xl text-[#F7F5F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-[#A6C96A]/20"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between relative bg-[#14261F]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#24583D] border border-[#A6C96A]/40 text-[#A6C96A] flex items-center justify-center shadow-inner">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Real-Time Agro-Location & Language</span>
              </h2>
              <p className="text-xs text-white/70">
                Detect your agricultural district for regional language, machinery calibrations & road transport hubs.
              </p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            aria-label="Close location selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Live GPS Action Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#193B2F] to-[#102C22] border border-[#A6C96A]/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#A6C96A]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A6C96A] text-[#102C22] flex items-center justify-center shrink-0 shadow-md">
                  {gpsStatus === 'requesting' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#102C22]" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#A6C96A] font-mono">
                      High-Precision Geolocation
                    </span>
                    {liveLocationInfo?.isRealGPS && (
                      <span className="px-2 py-0.2 rounded-full text-[9px] bg-green-500/20 text-green-300 border border-green-500/40 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Live GPS Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-bold text-white">
                    {liveLocationInfo?.city ? `${liveLocationInfo.city}, ` : ''}{detectedRegion?.state || 'Detect My Live Location'}
                  </h3>
                  <p className="text-xs text-white/70">
                    {liveLocationInfo?.isRealGPS 
                      ? `Lat: ${liveLocationInfo.latitude?.toFixed(4)}, Lon: ${liveLocationInfo.longitude?.toFixed(4)}`
                      : 'Use device GPS to instantly identify your district and switch to local language.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerGPS}
                disabled={gpsStatus === 'requesting'}
                className="px-5 py-3 rounded-xl bg-[#A6C96A] hover:bg-[#8eb852] active:bg-[#7ba342] text-[#102C22] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shrink-0"
              >
                {gpsStatus === 'requesting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#102C22]" />
                    <span>Acquiring GPS...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 text-[#102C22]" />
                    <span>Detect Real-Time GPS</span>
                  </>
                )}
              </button>
            </div>

            {feedback && (
              <div className="mt-3 p-3 rounded-xl bg-[#24583D] border border-[#A6C96A]/60 text-xs text-[#F7F5F0] flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-[#A6C96A] shrink-0" />
                <span>{feedback}</span>
              </div>
            )}
          </div>

          {/* Search Agricultural Regions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A6C96A]" />
                <span>Or Select Indian Agricultural State Manually</span>
              </label>
              <span className="text-[10px] text-white/50">{filteredRegions.length} Agricultural Zones</span>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state, crop (e.g. Rajasthan, Punjab, Maharashtra, Mustard, Wheat)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14261F] border border-white/15 focus:border-[#A6C96A] text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Region Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredRegions.map((reg) => {
                const isSelected = detectedRegion?.id === reg.id;
                const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === reg.suggestedLang);

                return (
                  <button
                    key={reg.id}
                    onClick={() => handleSelectRegion(reg)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer group ${
                      isSelected
                        ? 'bg-[#24583D]/90 border-[#A6C96A] text-white shadow-md'
                        : 'bg-[#14261F]/70 border-white/10 text-white/80 hover:bg-[#1A332A] hover:border-[#A6C96A]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif text-sm font-bold text-white group-hover:text-[#A6C96A] transition-colors">
                            {reg.state}
                          </span>
                          <span className="text-xs">{langMeta?.flag}</span>
                        </div>
                        <span className="text-[11px] text-white/60 block">{reg.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        isSelected 
                          ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A]' 
                          : 'bg-white/10 text-[#A6C96A] border-white/10'
                      }`}>
                        {langMeta?.nativeName || 'English'}
                      </span>
                    </div>

                    <div className="text-[10px] text-[#A6C96A] flex items-center justify-between border-t border-white/10 pt-2 mt-1">
                      <span className="truncate pr-2">{reg.cropFocus}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#A6C96A] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#14261F]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/70 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#A6C96A]" />
            <span>Privacy Guaranteed • Location is processed locally on your device for regional calibration.</span>
          </div>
          <button
            onClick={closeLocationModal}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

