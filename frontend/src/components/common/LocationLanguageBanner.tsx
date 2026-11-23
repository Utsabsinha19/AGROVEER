'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  X, 
  Check, 
  Navigation, 
  Loader2, 
  Sparkles,
  Compass,
  Globe2
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { SUPPORTED_LANGUAGES } from '@/lib/translations';

export const LocationLanguageBanner: React.FC = () => {
  const { 
    currentLanguage, 
    detectedRegion, 
    liveLocationInfo,
    gpsStatus, 
    hasBannerDismissed, 
    setLanguage, 
    dismissBanner,
    detectLocation,
    requestLiveLocation,
    openLocationModal
  } = useLanguageStore();

  const [isLocallyDismissed, setIsLocallyDismissed] = useState(false);
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dismissed previously in session or local storage
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('agrove_banner_dismissed') || localStorage.getItem('agrove_banner_dismissed');
      if (dismissed === 'true') {
        setIsLocallyDismissed(true);
      }
    }
    // Run network IP location detection on mount
    detectLocation();
  }, [detectLocation]);

  const handleDismiss = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLocallyDismissed(true);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('agrove_banner_dismissed', 'true');
        localStorage.setItem('agrove_banner_dismissed', 'true');
      } catch {}
    }
    dismissBanner();
  }, [dismissBanner]);

  if (!mounted || isLocallyDismissed || hasBannerDismissed || !detectedRegion) return null;

  // Don't show if user already granted GPS and current language already matches
  if (gpsStatus === 'granted' && currentLanguage === detectedRegion.suggestedLang && !gpsNotification) {
    return null;
  }

  const targetLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === detectedRegion.suggestedLang) || SUPPORTED_LANGUAGES[0];

  const handleTriggerGPS = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await requestLiveLocation(true);
    if (result.success && result.region) {
      const lang = SUPPORTED_LANGUAGES.find((l) => l.code === result.region?.suggestedLang);
      setGpsNotification(`📍 Location verified: ${result.region.city ? `${result.region.city}, ` : ''}${result.region.state}! Language switched to ${lang?.nativeName || 'regional'}.`);
      setTimeout(() => {
        setGpsNotification(null);
        handleDismiss();
      }, 2500);
    } else {
      setGpsNotification(result.error || 'Could not acquire GPS. You can select your state manually.');
      setTimeout(() => setGpsNotification(null), 3500);
    }
  };

  const handleSwitchLanguage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLanguage(detectedRegion.suggestedLang);
    handleDismiss();
  };

  return (
    <aside 
      role="region"
      aria-label="Location and language recommendation"
      className="fixed bottom-24 sm:bottom-20 left-3 sm:left-6 z-[60] max-w-lg w-[calc(100vw-24px)] sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans pointer-events-auto"
    >
      <div className="rounded-2xl bg-[#0E221B]/95 backdrop-blur-2xl border border-[#A6C96A]/60 p-4 sm:p-5 text-[#F7F5F0] shadow-2xl relative overflow-hidden ring-1 ring-[#A6C96A]/40">
        
        {/* Subtle accent light */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#A6C96A]/15 rounded-full blur-2xl pointer-events-none" />

        {/* High-Contrast, Guaranteed-Clickable Exit 'X' Button in Top-Right */}
        <button
          type="button"
          onClick={handleDismiss}
          onTouchEnd={handleDismiss}
          className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-white/10 hover:bg-white/25 active:bg-white/40 text-white transition-all cursor-pointer shadow-md flex items-center justify-center min-w-[36px] min-h-[36px] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#A6C96A]"
          aria-label="Close notification"
          title="Close notification"
        >
          <X className="w-4 h-4 text-white stroke-[2.5]" />
        </button>

        <div className="flex items-start gap-3 relative z-10 pr-10">
          {/* Animated Location / Compass Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#24583D] border border-[#A6C96A]/60 text-[#A6C96A] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            {gpsStatus === 'requesting' ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#A6C96A]" />
            ) : liveLocationInfo?.isRealGPS ? (
              <Navigation className="w-5 h-5 text-[#A6C96A]" />
            ) : (
              <MapPin className="w-5 h-5 text-[#A6C96A]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Location Subtitle */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A6C96A] font-mono flex items-center gap-1">
                {liveLocationInfo?.isRealGPS ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#A6C96A] animate-pulse" />
                    <span>Real-Time GPS Active</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3 h-3 text-[#A6C96A]" />
                    <span>Agro-Location Detected</span>
                  </>
                )}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-[11px] text-[#F7F5F0] font-semibold truncate">
                {liveLocationInfo?.city ? `${liveLocationInfo.city}, ` : ''}{detectedRegion.state}
              </span>
            </div>

            {gpsNotification ? (
              <div className="p-2.5 rounded-xl bg-[#24583D]/90 border border-[#A6C96A]/70 text-xs text-[#F7F5F0] flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-[#A6C96A] shrink-0" />
                <span className="font-medium">{gpsNotification}</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#E9E1CC]/95 leading-snug">
                  Visiting from <strong>{liveLocationInfo?.city ? `${liveLocationInfo.city}, ` : ''}{detectedRegion.state}</strong> ({detectedRegion.cropFocus})? Allow real-time location to automatically tailor machinery catalog and switch to <strong>{targetLangMeta.nativeName} ({targetLangMeta.name})</strong>.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-3.5">
                  {/* Real-time GPS Trigger */}
                  <button
                    type="button"
                    onClick={handleTriggerGPS}
                    disabled={gpsStatus === 'requesting'}
                    className="px-3.5 py-1.5 rounded-xl bg-[#A6C96A] hover:bg-[#8eb852] active:bg-[#7ba342] text-[#102C22] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Allow real-time device location to automatically detect your local agricultural district"
                  >
                    {gpsStatus === 'requesting' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#102C22]" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5 text-[#102C22]" />
                        <span>Allow Real-Time GPS</span>
                      </>
                    )}
                  </button>

                  {/* Switch to detected language button */}
                  {currentLanguage !== detectedRegion.suggestedLang && (
                    <button
                      type="button"
                      onClick={handleSwitchLanguage}
                      className="px-3 py-1.5 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] border border-[#A6C96A]/60 hover:border-[#A6C96A] text-xs font-semibold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>{targetLangMeta.flag} {targetLangMeta.nativeName}</span>
                      <Check className="w-3.5 h-3.5 text-[#A6C96A]" />
                    </button>
                  )}

                  {/* Open State Selector Modal */}
                  <button
                    type="button"
                    onClick={() => {
                      openLocationModal();
                      handleDismiss();
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#14261F] hover:bg-[#1A332A] text-[#A6C96A] border border-[rgba(166,201,106,0.45)] text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Globe2 className="w-3 h-3 text-[#A6C96A]" />
                    <span>Change State</span>
                  </button>

                  {/* Keep English / Dismiss Text Button */}
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-xs text-[#E9E1CC]/80 hover:text-white underline-offset-4 hover:underline transition-colors px-1.5 py-1 cursor-pointer"
                  >
                    Keep English
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
